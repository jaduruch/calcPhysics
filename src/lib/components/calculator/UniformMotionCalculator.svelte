<script lang="ts">
  import { fields, solveUniformMotion, type Field, type Values } from '#lib/physics/mechanics/uniform-motion.ts';
  import { parseQuantityInUnit, changeQuantityUnit } from '#lib/calculators/quantities.ts';
  import { getUnit, type QuantityKind } from '#lib/physics/units.ts';
  import { uniformMotionEquation, uniformMotionConversions, defaultMotionUnits, motionQuantityKinds } from '#lib/calculators/uniform-motion-equation.ts';
  import QuantityField from './QuantityField.svelte';
  import CalculatorShell from './CalculatorShell.svelte';
  import CalculatorTools from './CalculatorTools.svelte';
  import EquationBlock from './EquationBlock.svelte';
  import UniformMotionCharts from './UniformMotionCharts.svelte';
  import { calculatorUi as text } from '#lib/i18n/en.ts';
  const definitions = [
    { key: 's0', symbol: 's₀', name: text.initialPosition, kind: 'length' },
    { key: 's', symbol: 's', name: text.position, kind: 'length' },
    { key: 'v', symbol: 'v', name: text.velocity, kind: 'velocity' },
    { key: 't', symbol: 't', name: text.time, kind: 'time' }
  ] as const;
  let raw = $state<Record<Field, string>>({ s0: '', s: '', v: '', t: '' });
  let selectedUnits = $state<Record<Field, string>>({ ...defaultMotionUnits });
  function changeUnit(field: Field, kind: QuantityKind, unit: string) {
    if (field !== 'v') raw[field] = changeQuantityUnit(raw[field], kind, selectedUnits[field], unit);
    selectedUnits[field] = unit;
  }
  const parsed = $derived(Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key], motionQuantityKinds[key], selectedUnits[key])])) as Record<Field, ReturnType<typeof parseQuantityInUnit>>);
  const invalidFields = $derived(fields.filter(key => parsed[key].status === 'invalid'));
  const result = $derived.by(() => {
    if (invalidFields.length) return { status: 'parse-error' } as const;
    const values: Values = {};
    for (const key of fields) { const item = parsed[key]; if (item.status === 'valid') values[key] = item.value; }
    const solution = solveUniformMotion(values);
    if (solution.status === 'success') {
      const displayValue = solution.value / getUnit(motionQuantityKinds[solution.field], selectedUnits[solution.field]).factor;
      if (!Number.isFinite(displayValue) || (solution.value !== 0 && displayValue === 0)) return { status: 'invalid', code: 'non-finite' } as const;
    }
    return solution;
  });
  const resultDefinition = $derived(result.status === 'success' ? definitions.find(item => item.key === result.field)! : null);
  const conversions = $derived(result.status === 'success' ? uniformMotionConversions(result, parsed, selectedUnits) : []);
  const equation = $derived(result.status === 'success' ? uniformMotionEquation(result, parsed, selectedUnits) : '');
  const message = $derived(result.status === 'incomplete' ? ''
    : result.status === 'parse-error' ? text.invalidNumber
    : result.status === 'invalid' ? text[result.code]
    : result.status === 'no-solution' ? text.noSolution
    : result.status === 'underdetermined' ? text.underdetermined : '');
  function reset() { raw = { s0: '', s: '', v: '', t: '' }; selectedUnits = { ...defaultMotionUnits }; }
</script>

<CalculatorShell>
  <div class="input-grid">
    {#each definitions as field}
      {@const assumed = result.status === 'success' && result.assumedInitial && field.key === 's0'}
      <QuantityField id={`motion-${field.key}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.key]} unit={selectedUnits[field.key]} state={assumed ? text.assumed : ''} invalid={invalidFields.includes(field.key) || (field.key === 't' && result.status === 'invalid' && result.code === 'negative-time')} describedby="motion-status" onvalue={value => raw[field.key] = value} onunit={unit => changeUnit(field.key, field.kind, unit)} />
    {/each}
  </div>
  <CalculatorTools onreset={reset} />
  <div id="motion-status" aria-live="polite" aria-atomic="true">
    {#if result.status === 'success' && resultDefinition}
      {#if conversions.length}
        <EquationBlock label={text.unitConversion} equations={conversions} conversion />
      {/if}
      <EquationBlock label={resultDefinition.name} equations={[equation]} />
      {#if result.assumedInitial}<p class="assumption">{text.assumption}</p>{/if}
    {:else if message}<p class="status" class:error={result.status !== 'incomplete'}>{message}</p>{/if}
  </div>
  <UniformMotionCharts result={result.status === 'success' ? result : null} />
</CalculatorShell>
