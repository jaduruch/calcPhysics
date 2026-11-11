<script lang="ts">
  import { onMount, type Component } from 'svelte';
  import { applyGate, blochAngles, blochVector, gateTrajectory, probability, zeroQubit, type Gate, type GateId, type Qubit, type Vector3 } from '#lib/physics/quantum/qubit.ts';
  import { qubitGates } from '#lib/content/quantum.ts';
  import { qubitNumber, qubitStateEquation } from '#lib/calculators/qubit.ts';
  import { parseQuantityInUnit } from '#lib/calculators/quantities.ts';
  import { qubitUi as text } from '#lib/i18n/runtime.ts';
  import QuantityField from './QuantityField.svelte';
  import QubitGateInfo from './QubitGateInfo.svelte';
  import CalculatorShell from './CalculatorShell.svelte';
  import EquationBlock from './EquationBlock.svelte';
  type AngleKey = 'gamma' | 'theta' | 'phi' | 'lambda';
  type Step = { before: Qubit; after: Qubit; gate: Gate };
  let root: HTMLDivElement;
  let qubitState = $state<Qubit>(zeroQubit);
  let active = $state<Step | null>(null);
  let progress = $state(1);
  let trajectory = $state<readonly Vector3[]>([]);
  let raw = $state<Record<AngleKey, string>>({ gamma: '', theta: '', phi: '', lambda: '' });
  let units = $state<Record<AngleKey, string>>({ gamma: 'rad', theta: 'rad', phi: 'rad', lambda: 'rad' });
  let reducedMotion = $state(false);
  let mounted = $state(false);
  let viewError = $state(false);
  let Sphere = $state<Component<{ vector: Vector3; trajectory?: readonly Vector3[] }> | null>(null);
  let raf = 0;
  let startTime: number | null = null;
  const defaults = { gamma: Math.PI / 2, theta: Math.PI / 2, phi: 0, lambda: 0 };
  const keys: AngleKey[] = ['gamma', 'theta', 'phi', 'lambda'];
  const parsed = $derived(Object.fromEntries(keys.map(key => [key, raw[key].trim() ? parseQuantityInUnit(raw[key], 'angle', units[key]) : { status: 'valid' as const, value: defaults[key] }])) as Record<AngleKey, { status: 'empty' | 'invalid' } | { status: 'valid'; value: number }>);
  const angles = $derived(Object.fromEntries(keys.map(key => [key, parsed[key].status === 'valid' ? parsed[key].value : NaN])) as Record<AngleKey, number>);
  const rotationValid = $derived(Number.isFinite(angles.gamma) && Math.abs(angles.gamma) <= 2 * Math.PI);
  const uValid = $derived(Number.isFinite(angles.theta) && angles.theta >= 0 && angles.theta <= Math.PI && Number.isFinite(angles.phi) && angles.phi >= 0 && angles.phi < 2 * Math.PI && Number.isFinite(angles.lambda) && angles.lambda >= 0 && angles.lambda < 2 * Math.PI);
  const displayed = $derived(active ? applyGate(active.before, active.gate, progress) : qubitState);
  const vector = $derived(blochVector(displayed));
  const polar = $derived(blochAngles(displayed));
  function fieldInvalid(key: AngleKey): boolean {
    const value = angles[key];
    return !Number.isFinite(value) || (key === 'gamma' ? Math.abs(value) > 2 * Math.PI : value < 0 || (key === 'theta' ? value > Math.PI : value >= 2 * Math.PI));
  }
  function changeUnit(key: AngleKey, unit: string) {
    units[key] = unit;
  }
  function finish() {
    cancelAnimationFrame(raf);
    if (active) qubitState = active.after;
    active = null; progress = 1; startTime = null;
  }
  function frame(time: number) {
    if (!active) return;
    if (document.hidden || !root.closest('details')?.open || reducedMotion) { finish(); return; }
    startTime ??= time;
    progress = Math.min(1, (time - startTime) / 850);
    if (progress >= 1) finish();
    else raf = requestAnimationFrame(frame);
  }
  function apply(id: GateId) {
    if (!mounted || active || ((id === 'Rx' || id === 'Ry' || id === 'Rz') && !rotationValid) || (id === 'U' && !uValid)) return;
    const gate: Gate = id === 'U' ? { id, theta: angles.theta, phi: angles.phi, lambda: angles.lambda }
      : id === 'Rx' || id === 'Ry' || id === 'Rz' ? { id, theta: angles.gamma } : { id };
    const step = { before: qubitState, after: applyGate(qubitState, gate), gate };
    trajectory = gateTrajectory(qubitState, gate);
    active = step; progress = 0; startTime = null;
    if (reducedMotion) finish();
    else raf = requestAnimationFrame(frame);
  }
  onMount(() => {
    mounted = true;
    let disposed = false;
    void import('./BlochSphere.svelte').then(module => { if (!disposed) Sphere = module.default; }).catch(() => { if (!disposed) viewError = true; });
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => { reducedMotion = preference.matches; if (active && reducedMotion) finish(); };
    motion(); preference.addEventListener('change', motion);
    const visibility = () => { if (document.hidden && active) finish(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { disposed = true; cancelAnimationFrame(raf); preference.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  });
</script>
<CalculatorShell>
  <div bind:this={root} class="qubit-simulator">
    <div class="qubit-controls">
      <div class="gate-section"><QubitGateInfo label={text.pauli} gates={['X', 'Y', 'Z']} /><div class="gate-buttons">{#each qubitGates.slice(0, 3) as gate}<button class="qubit-button" type="button" data-gate={gate.id} disabled={!mounted || !!active} onclick={() => apply(gate.id)}>{gate.label}</button>{/each}</div></div>
      <div class="gate-pair">
        <div class="gate-section"><QubitGateInfo label={text.squareRoot} gates={['sqrtX', 'sqrtZ']} /><div class="gate-buttons">{#each qubitGates.slice(3, 5) as gate}<button class="qubit-button" type="button" data-gate={gate.id} disabled={!mounted || !!active} onclick={() => apply(gate.id)}>{gate.label}</button>{/each}</div></div>
        <div class="gate-section"><QubitGateInfo label={text.hadamard} gates={['H']} /><div class="gate-buttons"><button class="qubit-button" type="button" data-gate="H" disabled={!mounted || !!active} onclick={() => apply('H')}>H</button></div></div>
      </div>
      <div class="gate-section">
        <QubitGateInfo label={text.rotations} gates={['Rx', 'Ry', 'Rz']} />
        <QuantityField id="qubit-gamma" symbol="γ" name={text.rotationAngle} kind="angle" raw={raw.gamma} unit={units.gamma} state={!raw.gamma.trim() ? text.defaultHalfPi : ''} invalid={fieldInvalid('gamma')} describedby="qubit-angle-help" onvalue={value => raw.gamma = value} onunit={unit => changeUnit('gamma', unit)} />
        <div class="gate-buttons">{#each qubitGates.slice(6, 9) as gate}<button class="qubit-button" type="button" data-gate={gate.id} disabled={!mounted || !!active || !rotationValid} onclick={() => apply(gate.id)}>R<sub>{gate.id.slice(1).toLowerCase()}</sub></button>{/each}</div>
      </div>
      <div class="gate-section">
        <QubitGateInfo label={text.general} gates={['U']} />
        {#each ['theta', 'phi', 'lambda'] as item}
          {@const key = item as 'theta' | 'phi' | 'lambda'}
          <QuantityField id={`qubit-${key}`} symbol={key === 'theta' ? 'θ' : key === 'phi' ? 'φ' : 'λ'} name={text[key]} kind="angle" raw={raw[key]} unit={units[key]} state={!raw[key].trim() ? (key === 'theta' ? text.defaultHalfPi : text.defaultZero) : ''} invalid={fieldInvalid(key)} describedby="qubit-angle-help" onvalue={value => raw[key] = value} onunit={unit => changeUnit(key, unit)} />
        {/each}
        <button class="qubit-button" type="button" data-gate="U" disabled={!mounted || !!active || !uValid} onclick={() => apply('U')}>U(θ, φ, λ)</button>
      </div>
    </div>
    <div class="qubit-visualization">
      {#if Sphere}<Sphere {vector} {trajectory} />{:else}<div class="sphere-placeholder"><p class="status">{viewError ? text.viewError : text.loading}</p></div>{/if}
      <div class="qubit-state" data-state="qubit">
        <EquationBlock label={text.currentState} equations={[qubitStateEquation(displayed)]} />
        <EquationBlock label={text.probabilities} equations={[String.raw`P(0)=|\alpha|^2\approx ${qubitNumber(probability(displayed[0]))},\quad P(1)=|\beta|^2\approx ${qubitNumber(probability(displayed[1]))}`]} />
        <EquationBlock label={text.coordinates} equations={[String.raw`(x,y,z)\approx(${qubitNumber(vector.x)},${qubitNumber(vector.y)},${qubitNumber(vector.z)})`, String.raw`\theta\approx ${qubitNumber(polar.theta)}\,\mathrm{rad},\quad \phi ${polar.phi === null ? `=\\text{${text.undefinedPhase}}` : `\\approx ${qubitNumber(polar.phi)}\\,\\mathrm{rad}`}`]} />
      </div>
    </div>
    <div class="qubit-footer">
      <p id="qubit-angle-help" class="assumption">{text.defaults} {text.rotationHint}</p>
      {#if !rotationValid || !uValid}<p class="status error" role="status">{text.invalidAngle}</p>{/if}
      {#if reducedMotion}<p class="status">{text.reducedMotion}</p>{/if}
      <p class="assumption">{text.assumptions}</p>
    </div>
  </div>
</CalculatorShell>

<style>
  .qubit-simulator { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 24px; }
  .qubit-controls, .qubit-visualization { min-width: 0; }
  .qubit-controls { display: grid; gap: 20px; align-content: start; }
  .gate-section { min-width: 0; display: grid; gap: 10px; }
  .gate-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .gate-buttons :global(button) { flex: 1; }
  .gate-pair { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .qubit-footer { grid-column: 1 / -1; min-width: 0; display: grid; gap: 16px; }
  .sphere-placeholder { aspect-ratio: 480 / 390; display: grid; place-items: center; }
  @media (max-width: 44rem) { .qubit-simulator { grid-template-columns: minmax(0, 1fr); } .gate-pair { grid-template-columns: minmax(0, 1fr); } }
</style>
