<script lang="ts">
  import { solveInclinedPlane, type InclineInput } from '#lib/physics/mechanics/inclined-plane.ts';
  import { parseQuantityInUnit, changeQuantityUnit } from '#lib/calculators/quantities.ts';
  import { inclineFields, inclineKinds, inclineDefaults, inclineEquations, inclineConversions, type InclineField } from '#lib/calculators/inclined-plane-equations.ts';
  import { calculatorUi, inclinedPlaneUi as text } from '#lib/i18n/runtime.ts';
  import CalculatorShell from './CalculatorShell.svelte';
  import CalculatorTools from './CalculatorTools.svelte';
  import QuantityField from './QuantityField.svelte';
  import EquationBlock from './EquationBlock.svelte';
  import InclinedPlaneSketch from './InclinedPlaneSketch.svelte';
  const definitions = [
    { key: 'mass', symbol: 'm', name: text.mass }, { key: 'angle', symbol: 'α', name: text.angle },
    { key: 'length', symbol: 'L', name: text.length }, { key: 'height', symbol: 'h', name: text.height },
    { key: 'friction', symbol: 'μₖ', name: text.friction }, { key: 'gravity', symbol: 'g', name: text.gravity }
  ] as const;
  let focusedField = $state<InclineField | null>(null);
  let raw = $state<Record<InclineField, string>>({ mass: '', angle: '', friction: '', gravity: '', length: '', height: '' });
  let units = $state({ ...inclineDefaults });
  const parsed = $derived(Object.fromEntries(inclineFields.map(field => [field, parseQuantityInUnit(raw[field], inclineKinds[field], units[field])])) as Record<InclineField, ReturnType<typeof parseQuantityInUnit>>);
  const invalid = $derived(inclineFields.filter(field => parsed[field].status === 'invalid'));
  const result = $derived.by(() => {
    if (invalid.length) return { status: 'parse-error' } as const;
    const values: InclineInput = {};
    for (const field of inclineFields) { const input = parsed[field]; if (input.status === 'valid') values[field] = input.value; }
    return solveInclinedPlane(values);
  });
  const equations = $derived(result.status === 'success' ? inclineEquations(result) : []);
  const conversions = $derived(result.status === 'success' ? inclineConversions(result, parsed, units) : []);
  function changeUnit(field: InclineField, unit: string) {
    raw[field] = changeQuantityUnit(raw[field], inclineKinds[field], units[field], unit);
    units[field] = unit;
  }
  function reset() { raw = { mass: '', angle: '', friction: '', gravity: '', length: '', height: '' }; units = { ...inclineDefaults }; }
</script>
<CalculatorShell>
  <div class="input-grid">
    {#each definitions as field}
      <QuantityField id={`incline-${field.key}`} symbol={field.symbol} name={field.name} kind={inclineKinds[field.key]} raw={raw[field.key]} unit={units[field.key]} invalid={invalid.includes(field.key) || (result.status === 'invalid' && result.fields.includes(field.key))} describedby="incline-status incline-assumptions" onvalue={value => raw[field.key] = value} onunit={unit => changeUnit(field.key, unit)} onfocuschange={focused => { if (focused) focusedField = field.key; else if (focusedField === field.key) focusedField = null; }} />
    {/each}
  </div>
  <p class="assumption">{text.defaults}</p>
  <CalculatorTools onreset={reset} />
  <p class="assumption" id="incline-assumptions">{text.assumptions}</p>
  <div id="incline-status" aria-live="polite" aria-atomic="true">
    {#if result.status === 'parse-error'}<p class="status error">{calculatorUi.invalidNumber}</p>
    {:else if result.status === 'invalid'}<p class="status error">{result.code === 'geometry' ? text.geometryInvalid : result.code === 'domain' ? text.invalid : text.range}</p>
    {:else if result.status === 'success'}
      {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion />{/if}
      <EquationBlock label="" {equations} />
      {#if result.motion === 'no-start'}<p class="assumption">{text.noStart}</p>{/if}
      {#if result.acceleration < 0}<p class="assumption">{text.braking}</p>{/if}
    {/if}
  </div>
  <InclinedPlaneSketch highlightAngle={focusedField === 'angle'} highlightLength={focusedField === 'length'} highlightHeight={focusedField === 'height'} result={result.status === 'success' ? result : null} enteredAngle={parsed.angle.status === 'valid' ? parsed.angle.value : undefined} enteredFriction={parsed.friction.status === 'valid' ? parsed.friction.value : undefined} />
</CalculatorShell>
