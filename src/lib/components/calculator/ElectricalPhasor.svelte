<script lang="ts">
  import type { ElectricalResult } from '#lib/physics/electricity.ts';
  import { electricalQuantity } from '#lib/calculators/electrical-equations.ts';
  import { electricalUi as text } from '#lib/i18n/en.ts';
  import Formula from '../Formula.svelte';
  let { result }: { result: ElectricalResult } = $props();
  const phase = $derived(result.status === 'success' ? result.outputs.phi ?? result.values.phi : undefined);
  const angle = $derived(phase ?? -Math.PI / 4);
  const end = $derived({ x: 70 + 90 * Math.cos(angle), y: 135 - 90 * Math.sin(angle) });
</script>
<figure>
  <figcaption>{text.phasor}</figcaption>
  <svg style:width="calc(330px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 330 270" role="img" aria-label={text.phasor}>
    <line class="axis" x1="40" y1="135" x2="300" y2="135" />
    <line class="axis" x1="70" y1="245" x2="70" y2="20" />
    <text x="297" y="153" text-anchor="end">Re</text><text x="58" y="25" text-anchor="end">Im</text>
    <path class="component" d={`M70,135 H${end.x} V${end.y}`} />
    <path class="vector" d={`M70,135 L${end.x},${end.y}`} />
    <text x={(70+end.x)/2} y={(135+end.y)/2-10}>Z</text>
  </svg>
  {#if phase !== undefined}<Formula expression={`\\phi = ${electricalQuantity(phase, 'rad', false)}`} />{/if}
  <p>{phase === undefined ? text.schematic : text.phasorNote}</p>
</figure>
<style>
  figure { margin: 24px 0 0; padding: 16px; max-width: 25rem; border-radius: var(--control-radius); background: var(--color-control); }
  figcaption { font-size: .875rem; font-weight: 600; }
  svg { width: 100%; height: auto; display: block; }
  text { font-size: 12px; fill: var(--color-text-muted); }
  .axis { stroke: var(--color-text-muted); stroke-width: 1; }
  .component { stroke: var(--color-text-muted); stroke-dasharray: 5 4; stroke-width: 2; fill: none; }
  .vector { stroke: var(--color-accent); stroke-width: 2.5; fill: none; }
  p { color: var(--color-text-muted); font-size: .75rem; margin-bottom: 0; }
</style>
