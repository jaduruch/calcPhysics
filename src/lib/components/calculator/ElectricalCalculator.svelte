<script lang="ts">
  import { electricalDefinitions, electricalDisplaySymbol, resistorNetworkDefinition, capacitorNetworkDefinition, inductorNetworkDefinition, rlAcDefinition, type ElectricalDefinition } from '#lib/content/electricity.ts';
  import { solveElectrical, electricalPhysics, inDomain, type ElectricalModelId, type ElectricalPhysics } from '#lib/physics/electricity.ts';
  import { unitGroups, getUnit, type QuantityKind } from '#lib/physics/units.ts';
  import { parseQuantityInUnit, changeQuantityUnit } from '#lib/calculators/quantities.ts';
  import { electricalEquations, electricalSymbol, electricalQuantity } from '#lib/calculators/electrical-equations.ts';
  import { electricalCurves } from '#lib/visualization/electrical.ts';
  import { electricalUi as text } from '#lib/i18n/runtime.ts';
  import CalculatorShell from './CalculatorShell.svelte';
  import QuantityField from './QuantityField.svelte';
  import CalculatorTools from './CalculatorTools.svelte';
  import EquationBlock from './EquationBlock.svelte';
  import ToggleSwitch from '../ui/ToggleSwitch.svelte';
  import VoltageDividerDiagram from './VoltageDividerDiagram.svelte';
  import ComponentNetworkDiagram from './ComponentNetworkDiagram.svelte';
  import OhmsLawDiagram from './OhmsLawDiagram.svelte';
  import GeneratorDiagram from './GeneratorDiagram.svelte';
  import ElectricalPhasor from './ElectricalPhasor.svelte';
  import RcCircuitDiagram from './RcCircuitDiagram.svelte';
  import RcTransientDiagram from './RcTransientDiagram.svelte';
  import StarDeltaDiagram from './StarDeltaDiagram.svelte';
  import FilterCircuitDiagram from './FilterCircuitDiagram.svelte';
  import FilterResponseDiagrams from './FilterResponseDiagrams.svelte';
  import ResonatorCircuitDiagram from './ResonatorCircuitDiagram.svelte';
  import ResonatorResponseDiagrams from './ResonatorResponseDiagrams.svelte';
  import MotionChart from './MotionChart.svelte';
  import UnitSelect from '../ui/UnitSelect.svelte';
  let { modelId }: { modelId: ElectricalModelId } = $props();
  const isDivider = $derived(modelId === 'voltage-divider');
  const isResistorNetwork = $derived(modelId === 'resistance-series');
  const isCapacitorNetwork = $derived(modelId === 'capacitance-series');
  const isInductorNetwork = $derived(modelId === 'inductance-series');
  const isRcAc = $derived(modelId === 'rc-series-ac');
  const isRlAc = $derived(modelId === 'rl-series-ac');
  const isRcTransient = $derived(modelId === 'rc-charge');
  const isRlTransient = $derived(modelId === 'rl-charge');
  const isStarDelta = $derived(modelId === 'delta-star');
  const isFilter = $derived(['rc-high-pass','rc-low-pass','rl-high-pass','rl-low-pass'].includes(modelId));
  const isResonator = $derived(modelId === 'series-rlc' || modelId === 'parallel-rlc');
  const isNetwork = $derived(isResistorNetwork || isCapacitorNetwork || isInductorNetwork);
  const networkKind = $derived(isCapacitorNetwork ? 'capacitance' : isInductorNetwork ? 'inductance' : 'resistance');
  const networkPrefix = $derived(isCapacitorNetwork ? 'C' : isInductorNetwork ? 'L' : 'R');
  let componentCount = $state(2);
  let parallel = $state(false);
  let loaded = $state(false);
  let discharging = $state(false);
  let starToDelta = $state(false);
  const calculationId = $derived(isDivider && loaded ? 'loaded-divider' : isResistorNetwork && parallel ? 'resistance-parallel' : isCapacitorNetwork && parallel ? 'capacitance-parallel' : isInductorNetwork && parallel ? 'inductance-parallel' : isRcAc && parallel ? 'rc-parallel-ac' : isRlAc && parallel ? 'rl-parallel-ac' : isRcTransient && discharging ? 'rc-discharge' : isRlTransient && discharging ? 'rl-discharge' : isStarDelta && starToDelta ? 'star-delta' : modelId);
  const definition = $derived(isResistorNetwork ? resistorNetworkDefinition(parallel ? 'resistance-parallel' : 'resistance-series', componentCount) : isCapacitorNetwork ? capacitorNetworkDefinition(parallel ? 'capacitance-parallel' : 'capacitance-series', componentCount) : isInductorNetwork ? inductorNetworkDefinition(parallel ? 'inductance-parallel' : 'inductance-series', componentCount) : isRlAc ? rlAcDefinition(parallel?'rl-parallel-ac':'rl-series-ac') : electricalDefinitions.find(model => model.id === calculationId)!);
  let raw = $state<Record<string, string>>({});
  let activeQuantity = $state<string | null>(null);
  let selectedUnits = $state<Record<string, string>>({});
  const unit = (id: string, kind: QuantityKind) => selectedUnits[id] ?? unitGroups[kind].si;
  const parsed = $derived(Object.fromEntries(definition.inputs.map(field => [field.id, parseQuantityInUnit(raw[field.id] ?? '', field.kind, unit(field.id, field.kind))])));
  const physics = $derived(electricalPhysics[calculationId] as ElectricalPhysics);
  const invalid = $derived(definition.inputs.filter(field => {
    const value = parsed[field.id];
    return value.status === 'invalid' || (value.status === 'valid' && !inDomain(value.value, isNetwork ? 'positive' : physics.inputs[field.id]));
  }).map(field => field.id));
  const result = $derived(invalid.length ? { status: 'invalid' as const, fields: invalid } : solveElectrical(calculationId, Object.fromEntries(Object.entries(parsed).flatMap(([id, value]) => value.status === 'valid' ? [[id, value.value]] : []))));
  const resultOutputs = $derived(result.status === 'success'
    ? (result.steps ? result.steps.flatMap(step => definition.outputs.filter(output => output.id === step.target && result.outputs[output.id] !== undefined)) : definition.outputs)
    : []);
  const equations = $derived(electricalEquations({ ...definition, outputs: resultOutputs }, result, selectedUnits));
  const conversions = $derived(result.status === 'success' ? definition.inputs.flatMap(field => {
    const si = unitGroups[field.kind].si;
    const from = unit(field.id, field.kind);
    if (from === si) return [];
    const value = parseQuantityInUnit(raw[field.id] ?? '', field.kind, from);
    return value.status === 'valid' ? [`${electricalSymbol(field.id)} = ${electricalQuantity(value.value / getUnit(field.kind, from).factor, from, false)} \\approx ${electricalQuantity(value.value, si, false)}`] : [];
  }) : []);
  const curves = $derived(electricalCurves(definition, result));
  const enteredValues = $derived(Object.fromEntries(Object.entries(parsed).flatMap(([id, value]) => value.status === 'valid' ? [[id, value.value]] : [])));
  const starDeltaIndex = (id: string) => ({ a: 0, b: 1, c: 2 })[id as 'a' | 'b' | 'c'];
  const inputSymbol = (id: string) => {
    if (!isStarDelta || starDeltaIndex(id) === undefined) return electricalDisplaySymbol(id);
    return starToDelta ? ['R₁', 'R₂', 'R₃'][starDeltaIndex(id)] : ['R₁₂', 'R₂₃', 'R₃₁'][starDeltaIndex(id)];
  };
  const inputName = (field: ElectricalDefinition['inputs'][number]) => {
    if (!isStarDelta || starDeltaIndex(field.id) === undefined) return field.name;
    return `${starToDelta ? 'star' : 'delta'} resistance ${inputSymbol(field.id)}`;
  };
  function setValue(id: string, value: string) {
    raw[id] = value;
    if (isNetwork && definition.inputs.every(field => {
      const parsedValue = parseQuantityInUnit(raw[field.id] ?? '', networkKind, unit(field.id, networkKind));
      return parsedValue.status === 'valid' && parsedValue.value > 0;
    })) componentCount++;
  }
  const networkComponents = $derived.by(() => {
    if (!isNetwork) return [];
    const last = Math.max(2, ...definition.inputs.filter(field => (raw[field.id] ?? '').trim()).map(field => Number(field.id.slice(1))));
    return isNetwork ? definition.inputs.slice(0, last).map(field => ({ id: field.id, pending: !(raw[field.id] ?? '').trim() })) : [];
  });
  function changeUnit(id: string, kind: QuantityKind, next: string) {
    raw[id] = changeQuantityUnit(raw[id] ?? '', kind, unit(id, kind), next);
    selectedUnits[id] = next;
  }
</script>
<CalculatorShell>
  {#if isDivider}
    <div class="calculator-mode"><ToggleSwitch checked={loaded} label={text.dividerLoad} offLabel={text.unloaded} onLabel={text.loaded} onchange={value => { loaded = value; activeQuantity = null; }} /></div>
  {/if}
  {#if isNetwork}
    <div class="calculator-mode"><ToggleSwitch checked={parallel} label={isCapacitorNetwork ? text.capacitorConnection : isInductorNetwork ? text.inductorConnection : text.resistorConnection} offLabel={text.series} onLabel={text.parallel} onchange={value => { parallel = value; activeQuantity = null; }} /></div>
  {/if}
  {#if isRcAc}
    <div class="calculator-mode"><ToggleSwitch checked={parallel} label={text.rcConnection} offLabel={text.series} onLabel={text.parallel} onchange={value => { parallel = value; activeQuantity = null; }} /></div>
  {/if}
  {#if isRlAc}
    <div class="calculator-mode"><ToggleSwitch checked={parallel} label={text.rlConnection} offLabel={text.series} onLabel={text.parallel} onchange={value => { parallel = value; activeQuantity = null; }} /></div>
  {/if}
  {#if isRcTransient}
    <div class="calculator-mode"><ToggleSwitch checked={discharging} label={text.rcProcess} offLabel={text.charging} onLabel={text.discharging} onchange={value => { discharging = value; activeQuantity = null; }} /></div>
  {/if}
  {#if isRlTransient}
    <div class="calculator-mode"><ToggleSwitch checked={discharging} label={text.rlProcess} offLabel={text.stepResponse} onLabel={text.discharging} onchange={value => { discharging = value; activeQuantity = null; }} /></div>
  {/if}
  {#if isStarDelta}
    <div class="calculator-mode"><ToggleSwitch checked={starToDelta} label={text.starDeltaConversion} offLabel={text.deltaToStar} onLabel={text.starToDelta} onchange={value => { starToDelta = value; activeQuantity = null; }} /></div>
  {/if}
  <div class="input-grid" class:input-grid--single={isNetwork}>
    {#each definition.inputs as field}
      <QuantityField id={`${modelId}-${field.id}`} symbol={inputSymbol(field.id)} name={inputName(field)} kind={field.kind} raw={raw[field.id] ?? ''} unit={unit(field.id, field.kind)} invalid={invalid.includes(field.id) || (result.status === 'no-solution' && result.fields.includes(field.id))} describedby={`${modelId}-assumptions`} pending={isNetwork && field.id !== `${networkPrefix}1` && !(raw[field.id] ?? '').trim()} onvalue={value => setValue(field.id, value)} onunit={next => changeUnit(field.id, field.kind, next)} onfocuschange={focused => { if (modelId === 'ohms-law' || isDivider || isNetwork || isRcAc || isRlAc || isStarDelta) activeQuantity = focused ? field.id : null; }} />
    {/each}
  </div>
  <CalculatorTools onreset={() => { raw = {}; selectedUnits = {}; activeQuantity = null; componentCount = 2; }} />
  <p class="assumption" id={`${modelId}-assumptions`}>{definition.assumption}</p>
  <div aria-live="polite" aria-atomic="true">
    {#if result.status !== 'success'}
      <p class="status" class:error={result.status !== 'incomplete'}>{result.status === 'invalid' ? text.invalid : result.status === 'out-of-range' ? text.range : result.status === 'no-solution' ? text.conflict : result.status === 'underdetermined' ? text.underdetermined : result.status === 'too-many-inputs' ? text.twoInputs : text.incomplete}</p>
    {:else}
      {#if result.assumedIdeal}<p class="assumption">{text.idealTransformer}</p>{/if}
      {#if modelId === 'transformer'}<p class="status">{text.partialTransformer}</p>{/if}
      {#if modelId === 'inductor'}<p class="status">{text.partialInductor}</p>{/if}
      {#if conversions.length}<EquationBlock label={text.conversion} equations={conversions} conversion />{/if}
      {#each resultOutputs as output, index}
        <div class="electrical-result">
          {#if unitGroups[output.kind].units.length > 1}
            <label class="output-unit"><span>{output.name} — {text.output}</span><UnitSelect kind={output.kind} value={unit(output.id, output.kind)} label={`${text.output}: ${output.name}`} onchange={value => selectedUnits[output.id] = value} /></label>
          {/if}
          <EquationBlock label={output.name} equations={[equations[index]]} />
        </div>
      {/each}
    {/if}
  </div>
  {#if isNetwork}<ComponentNetworkDiagram kind={networkKind} {parallel} components={networkComponents} active={activeQuantity} />{/if}
  {#if isDivider}<VoltageDividerDiagram {loaded} active={activeQuantity} />{/if}
  {#if modelId === 'ohms-law'}<OhmsLawDiagram active={activeQuantity} />{/if}
  {#if isRcAc}<RcCircuitDiagram {parallel} active={activeQuantity} />{/if}
  {#if isRlAc}<RcCircuitDiagram {parallel} inductive active={activeQuantity} />{/if}
  {#if isRcTransient}<RcTransientDiagram {discharging} />{/if}
  {#if isRlTransient}<RcTransientDiagram {discharging} inductive />{/if}
  {#if isStarDelta}<StarDeltaDiagram {starToDelta} inputs={enteredValues} outputs={result.status === 'success' ? result.outputs : {}} active={activeQuantity} />{/if}
  {#if isFilter}
    <FilterCircuitDiagram rc={modelId.startsWith('rc-')} highPass={modelId.endsWith('high-pass')} />
    <FilterResponseDiagrams {modelId} {result} />
  {/if}
  {#if isResonator}
    <ResonatorCircuitDiagram parallel={modelId === 'parallel-rlc'} />
    <ResonatorResponseDiagrams parallel={modelId === 'parallel-rlc'} {result} />
  {/if}
  {#if modelId === 'three-phase-generator'}<GeneratorDiagram {result} />{/if}
  {#if calculationId.endsWith('-ac')}<ElectricalPhasor {result} />{/if}
  {#if !isFilter && !isResonator && curves.length}
    <div class="electrical-curves">
      {#each curves as curve}
        <MotionChart title={curve.title} yLabel={curve.yLabel} times={curve.times} values={curve.values} xLabel={curve.xLabel} schematic={curve.schematic} color={curve.color} marker={curve.marker} description={curve.schematic ? text.schematic : text.calculated} shape="position" />
      {/each}
    </div>
  {/if}
</CalculatorShell>
<style>
  .calculator-mode { margin-bottom: 16px; }
  .status { margin-top: 12px; }
  .electrical-curves { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 24px; }
  .electrical-curves > :global(:only-child) { grid-column: 1 / -1; }
  .output-unit { display: flex; align-items: center; justify-content: space-between; gap: 12px; max-width: 28rem; margin-top: 16px; font-size: .8125rem; color: var(--color-text-muted); }
  @media (max-width: 44rem) { .electrical-curves { grid-template-columns: 1fr; } }
</style>
