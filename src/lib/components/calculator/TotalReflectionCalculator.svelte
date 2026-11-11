<script lang="ts">
  import { solveTotalReflection, type ReflectionInput } from '#lib/physics/optics/total-internal-reflection.ts';
  import { reflectionEquations, reflectionKinds, reflectionUnits } from '#lib/calculators/total-reflection.ts';
  import { parseQuantityInUnit } from '#lib/calculators/quantities.ts';
  import { reflectionUi as text, calculatorUi } from '#lib/i18n/runtime.ts';
  import CalculatorShell from './CalculatorShell.svelte';
  import CalculatorTools from './CalculatorTools.svelte';
  import EquationBlock from './EquationBlock.svelte';
  import QuantityField from './QuantityField.svelte';
  import TotalReflectionDiagram from './TotalReflectionDiagram.svelte';
  type Field = keyof ReflectionInput;
  const fields: readonly Field[] = ['n1', 'n2', 'angle'];
  const symbols = { n1: 'n₁', n2: 'n₂', angle: 'θ₁' };
  const empty = (): Record<Field, string> => ({ n1: '', n2: '', angle: '' });
  let raw = $state(empty());
  let units = $state({ ...reflectionUnits });
  const parsed = $derived(Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key], reflectionKinds[key], units[key])])) as Record<Field, ReturnType<typeof parseQuantityInUnit>>);
  const invalid = $derived(fields.filter(key => parsed[key].status === 'invalid'));
  const result = $derived.by(() => {
    if (invalid.length) return { status: 'parse-error' } as const;
    const input: ReflectionInput = {};
    for (const key of fields) { const item = parsed[key]; if (item.status === 'valid') input[key] = item.value; }
    return solveTotalReflection(input);
  });
  const equations = $derived(result.status === 'success' ? reflectionEquations(result, units.angle) : null);
  const message = $derived(result.status === 'success' ? '' : result.status === 'parse-error' ? text.parseError : result.status === 'invalid' ? text[result.code] : text.incomplete);
  function changeUnit(key: Field, unit: string) {
    units[key] = unit;
  }
  function reset() { raw = empty(); units = { ...reflectionUnits }; }
</script>
<CalculatorShell>
  <div class="input-grid">
    {#each fields as key}
      <QuantityField id={`reflection-${key}`} symbol={symbols[key]} name={text[key]} kind={reflectionKinds[key]} raw={raw[key]} unit={units[key]} invalid={invalid.includes(key) || (result.status === 'invalid' && result.fields.includes(key))} describedby="reflection-status reflection-convention reflection-assumptions" onvalue={value => raw[key] = value} onunit={unit => changeUnit(key, unit)} />
    {/each}
  </div>
  <CalculatorTools onreset={reset} />
  <p id="reflection-convention" class="assumption">{text.convention}</p>
  <div id="reflection-status" aria-live="polite" aria-atomic="true">
    {#if result.status === 'success' && equations}
      {#if equations.conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={equations.conversions} conversion />{/if}
      {#if equations.critical}<EquationBlock label={text.criticalAngle} equations={[equations.critical]} />{:else}<p class="status">{text.noCritical}</p>{/if}
      {#if result.incidence}
        <p class="status">{result.n1 === result.n2 ? text.matched : text[result.incidence.regime]}</p>
        {#if equations.reflected}<EquationBlock label={text.reflectedAngle} equations={[equations.reflected]} />{/if}
        {#if equations.transmitted}<EquationBlock label={text.transmittedAngle} equations={[equations.transmitted]} />{/if}
      {:else}<p class="status">{text.addAngle}</p>{/if}
    {:else}<p class="status" class:error={result.status !== 'incomplete'}>{message}</p>{/if}
  </div>
  <TotalReflectionDiagram result={result.status === 'success' ? result : null} />
  <p id="reflection-assumptions" class="assumption">{text.assumptions}</p>
</CalculatorShell>
