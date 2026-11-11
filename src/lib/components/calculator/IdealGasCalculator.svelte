<script lang="ts">
  import { gasFields, solveIdealGas, type GasField, type GasValues } from '#lib/physics/thermodynamics/ideal-gas.ts';
  import { fromSI } from '#lib/physics/units.ts';
  import { gasKinds, gasUnits, gasEquations } from '#lib/calculators/ideal-gas.ts';
  import { parseQuantityInUnit, changeQuantityUnit } from '#lib/calculators/quantities.ts';
  import { idealGasUi as text, calculatorUi } from '#lib/i18n/runtime.ts';
  import QuantityField from './QuantityField.svelte';
  import CalculatorShell from './CalculatorShell.svelte';
  import CalculatorTools from './CalculatorTools.svelte';
  import EquationBlock from './EquationBlock.svelte';
  const empty = (): Record<GasField, string> => ({ p: '', V: '', n: '', T: '' });
  let raw = $state(empty());
  let units = $state({ ...gasUnits });
  const parsed = $derived(Object.fromEntries(gasFields.map(key => [key, parseQuantityInUnit(raw[key], gasKinds[key], units[key])])) as Record<GasField, ReturnType<typeof parseQuantityInUnit>>);
  const invalid = $derived(gasFields.filter(key => parsed[key].status === 'invalid' || (parsed[key].status === 'valid' && parsed[key].value <= 0)));
  const values = $derived.by(() => {
    const values: GasValues = {};
    for (const key of gasFields) { const item = parsed[key]; if (item.status === 'valid') values[key] = item.value; }
    return values;
  });
  const result = $derived.by(() => {
    if (invalid.length) return { status: 'invalid' } as const;
    const solution = solveIdealGas(values);
    if (solution.status === 'success') {
      const displayed = fromSI(solution.value, gasKinds[solution.field], units[solution.field]);
      if (!Number.isFinite(displayed)) return { status: 'invalid' } as const;
    }
    return solution;
  });
  const equations = $derived(result.status === 'success' ? gasEquations(result.field, result.value, values, units) : null);
  function changeUnit(key: GasField, unit: string) {
    raw[key] = changeQuantityUnit(raw[key], gasKinds[key], units[key], unit);
    units[key] = unit;
  }
  function reset() { raw = empty(); units = { ...gasUnits }; }
</script>
<CalculatorShell>
  <div class="input-grid">
    {#each gasFields as key}
      <QuantityField id={`ideal-gas-${key}`} symbol={key} name={text[key]} kind={gasKinds[key]} raw={raw[key]} unit={units[key]} invalid={invalid.includes(key)} describedby="ideal-gas-status ideal-gas-assumptions" onvalue={value => raw[key] = value} onunit={unit => changeUnit(key, unit)} />
    {/each}
  </div>
  <CalculatorTools onreset={reset} />
  <div id="ideal-gas-status" aria-live="polite" aria-atomic="true">
    {#if result.status === 'success' && equations}
      {#if equations.conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={equations.conversions} conversion />{/if}
      <EquationBlock label={text[result.field]} equations={[equations.equation]} />
    {:else if result.status !== 'success'}<p class="status" class:error={result.status === 'invalid' || result.status === 'conflict'}>{text[result.status]}</p>{/if}
  </div>
  <p id="ideal-gas-assumptions" class="assumption">{text.assumptions}</p>
</CalculatorShell>
