<script lang="ts">
  import { dopplerFields, solveDoppler, type DopplerField, type DopplerInput } from '#lib/physics/waves/doppler.ts';
  import { getUnit } from '#lib/physics/units.ts';
  import { dopplerEquations, dopplerKinds, dopplerUnits } from '#lib/calculators/doppler.ts';
  import { changeQuantityUnit, parseQuantityInUnit } from '#lib/calculators/quantities.ts';
  import { dopplerUi as text, calculatorUi } from '#lib/i18n/en.ts';
  import CalculatorShell from './CalculatorShell.svelte';
  import CalculatorTools from './CalculatorTools.svelte';
  import EquationBlock from './EquationBlock.svelte';
  import QuantityField from './QuantityField.svelte';
  import DopplerWavefronts from './DopplerWavefronts.svelte';
  type Field = DopplerField | 'c';
  const fields: readonly Field[] = [...dopplerFields, 'c'];
  const symbols = { fs: 'fₛ', fo: 'fₒ', vs: 'vₛ', vo: 'vₒ', c: 'c' };
  const empty = (): Record<Field, string> => ({ fs: '', fo: '', vs: '', vo: '', c: '' });
  let raw = $state(empty());
  let units = $state({ ...dopplerUnits });
  const parsed = $derived(Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key], dopplerKinds[key], units[key])])) as Record<Field, ReturnType<typeof parseQuantityInUnit>>);
  const invalid = $derived(fields.filter(key => parsed[key].status === 'invalid'));
  const result = $derived.by(() => {
    if (invalid.length) return { status: 'parse-error' } as const;
    const values: DopplerInput = {};
    for (const key of fields) { const item = parsed[key]; if (item.status === 'valid') values[key] = item.value; }
    const solution = solveDoppler(values);
    if (solution.status === 'success' && solution.field) {
      const value = solution.values[solution.field];
      const display = value / getUnit(dopplerKinds[solution.field], units[solution.field]).factor;
      if (!Number.isFinite(display) || (value !== 0 && display === 0)) return { status: 'invalid', fields: [solution.field], code: 'numerical' } as const;
    }
    return solution;
  });
  const equations = $derived(result.status === 'success' ? dopplerEquations(result, units) : null);
  const message = $derived(result.status === 'success' ? '' : result.status === 'parse-error' ? text.parseError : result.status === 'invalid' ? text[result.code] : text[result.status]);
  function changeUnit(key: Field, unit: string) {
    raw[key] = changeQuantityUnit(raw[key], dopplerKinds[key], units[key], unit);
    units[key] = unit;
  }
  function reset() { raw = empty(); units = { ...dopplerUnits }; }
</script>
<CalculatorShell>
  <div class="input-grid">
    {#each fields as key}
      <QuantityField id={`doppler-${key}`} symbol={symbols[key]} name={text[key]} kind={dopplerKinds[key]} raw={raw[key]} unit={units[key]} invalid={invalid.includes(key) || (result.status === 'invalid' && result.fields.some(field => field === key))} state={key === 'c' && !raw.c.trim() ? text.defaultSpeed : ''} describedby="doppler-status doppler-signs doppler-assumptions" onvalue={value => raw[key] = value} onunit={unit => changeUnit(key, unit)} />
    {/each}
  </div>
  <CalculatorTools onreset={reset} />
  <p id="doppler-signs" class="assumption">{text.signConvention}</p>
  {#if !raw.c.trim()}<p class="assumption">{text.assumedSpeed}</p>{/if}
  <div id="doppler-status" aria-live="polite" aria-atomic="true">
    {#if result.status === 'success' && equations}
      {#if equations.conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={equations.conversions} conversion />{/if}
      {#if result.field}<EquationBlock label={text[result.field]} equations={[equations.equation]} />{:else}<p class="status">{text.consistent}</p>{/if}
      <EquationBlock label={text.wavelength} equations={[equations.wavelength]} />
      <EquationBlock label={text.shift} equations={[equations.shift]} />
    {:else if message}<p class="status" class:error={result.status !== 'incomplete'}>{message}</p>{/if}
  </div>
  <DopplerWavefronts result={result.status === 'success' ? result : null} />
  <p id="doppler-assumptions" class="assumption">{text.assumptions}</p>
</CalculatorShell>
