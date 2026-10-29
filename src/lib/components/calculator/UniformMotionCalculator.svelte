<script lang="ts">
  import { fields, solveUniformMotion, type Field, type Values } from '#lib/physics/mechanics/uniform-motion.ts';
  import { parseQuantityInUnit, changeQuantityUnit } from '#lib/calculators/quantities.ts';
  import { getUnit, type QuantityKind } from '#lib/physics/units.ts';
  import { uniformMotionEquation, uniformMotionConversions, defaultMotionUnits, motionQuantityKinds } from '#lib/calculators/uniform-motion-equation.ts';
  import UnitSelect from '../ui/UnitSelect.svelte';
  import UniformMotionCharts from './UniformMotionCharts.svelte';
  import Formula from '../Formula.svelte';
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

<div class="calculator">
  <div class="input-grid">
    {#each definitions as field}
      {@const assumed = result.status === 'success' && result.assumedInitial && field.key === 's0'}
      <div class="quantity-field">
        <label for={`motion-${field.key}`}><span class="symbol">{field.symbol}</span> {field.name}<span class="field-state">{assumed ? text.assumed : ''}</span></label>
        <div class="quantity-controls">
          <input id={`motion-${field.key}`} type="text" autocomplete="off" spellcheck="false" value={raw[field.key]} placeholder="—" aria-invalid={invalidFields.includes(field.key) || (field.key === 't' && result.status === 'invalid' && result.code === 'negative-time')} aria-describedby="motion-status" oninput={event => raw[field.key] = event.currentTarget.value} />
          <UnitSelect kind={field.kind} value={selectedUnits[field.key]} label={`${text.unitFor} ${field.name}`} onchange={unit => changeUnit(field.key, field.kind, unit)} />
        </div>
      </div>
    {/each}
  </div>
  <div class="calculator-tools"><p>{text.precision}</p><button type="button" onclick={reset}>{text.reset}</button></div>
  <div id="motion-status" aria-live="polite" aria-atomic="true">
    {#if result.status === 'success' && resultDefinition}
      {#if conversions.length}
        <div class="conversions"><span>{text.unitConversion}</span>{#each conversions as conversion}<Formula expression={conversion} />{/each}</div>
      {/if}
      <div class="result"><span>{resultDefinition.name}</span><Formula expression={equation} /></div>
      {#if result.assumedInitial}<p class="assumption">{text.assumption}</p>{/if}
    {:else if message}<p class="status" class:error={result.status !== 'incomplete'}>{message}</p>{/if}
  </div>
  <UniformMotionCharts result={result.status === 'success' ? result : null} />
</div>

<style>
  .calculator { max-width: 52rem; }
  .status, .assumption, .calculator-tools p { color: var(--color-text-muted); font-size: .8125rem; margin: 0; }
  .input-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 24px; }
  label { display: flex; align-items: baseline; gap: 8px; font-size: .8125rem; margin-bottom: 8px; }
  .symbol { font-family: Georgia, serif; font-style: italic; font-size: 1.125rem; min-width: 22px; }
  .field-state { margin-left: auto; font-size: .7rem; color: var(--color-text-muted); }
  .quantity-controls { display: grid; grid-template-columns: minmax(0, 1fr) 88px; gap: 8px; }
  input { min-height: 44px; border: none; border-radius: 8px; background: var(--color-control); color: var(--color-text); font: inherit; font-size: .8125rem; padding: 8px 12px; min-width: 0; }
  input { width: 100%; font-variant-numeric: tabular-nums; }
  input:focus-visible { outline: 1px solid var(--color-text-muted); outline-offset: 0; }
  input[aria-invalid="true"] { border: none; outline: 1px dashed var(--color-text-muted); outline-offset: 0; }
  .calculator-tools { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin: 12px 0 20px; }
  .calculator-tools button { border: none; border-radius: 8px; background: var(--color-control); min-height: 44px; padding: 8px 16px; font-size: .8125rem; }
  .result, .conversions { min-width: 0; }
  .conversions { margin-bottom: 24px; }
  :is(.result, .conversions) :global(.formula) { background: transparent; padding: 0; margin: 12px 0; }
  :is(.result, .conversions) :global(.katex-display) { text-align: left; }
  .result > span, .conversions > span { font-size: .8125rem; color: var(--color-text-muted); text-transform: capitalize; }
  .assumption { margin-top: 8px; }
  .error { color: var(--color-text); }
  @media (max-width: 40rem) { .input-grid { grid-template-columns: 1fr; gap: 16px; } }
</style>
