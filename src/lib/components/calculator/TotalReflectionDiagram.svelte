<script lang="ts">
  import type { ReflectionResult } from '#lib/physics/optics/total-internal-reflection.ts';
  import { totalReflectionScene, type RayPoint } from '#lib/visualization/total-reflection.ts';
  import { reflectionUi as text } from '#lib/i18n/runtime.ts';
  let { result }: { result: Extract<ReflectionResult, { status: 'success' }> | null } = $props();
  const scene = $derived(totalReflectionScene(result));
  const id = $props.id();
  const path = (points: readonly RayPoint[]) => points.map((point, index) => `${index ? 'L' : 'M'}${point.x},${point.y}`).join(' ');
</script>
<figure class="reflection-diagram">
  <svg viewBox="0 0 640 390" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{text.diagramTitle}</title>
    <desc id={`${id}-description`}>{text.diagramDescription} {scene.schematic ? text.schematic : text.calculated}</desc>
    <defs>
      <clipPath id={`${id}-clip`}><rect x="12" y="12" width="616" height="366" rx="8" /></clipPath>
      {#each ['incident', 'reflected', 'transmitted'] as ray}
        <marker id={`${id}-${ray}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" class={ray} /></marker>
      {/each}
    </defs>
    <g clip-path={`url(#${id}-clip)`}>
      <rect x="12" y="12" width="616" height="178" class="medium-two" />
      <rect x="12" y="190" width="616" height="188" class="medium-one" />
      <line x1="12" y1="190" x2="628" y2="190" class="interface" />
      <line x1="320" y1="28" x2="320" y2="360" class="normal" />
      <text x="28" y="40">{text.medium2} (n₂{#if result && !scene.schematic} = {result.n2.toPrecision(3)}{/if})</text>
      <text x="28" y="354">{text.medium1} (n₁{#if result && !scene.schematic} = {result.n1.toPrecision(3)}{/if})</text>
      <text x="334" y="29" class="normal-label">{text.normal}</text>
      <line x1={scene.incident.x} y1={scene.incident.y} x2={scene.origin.x} y2={scene.origin.y} class="ray incident" marker-end={`url(#${id}-incident-arrow)`} />
      <text x={scene.incident.x - 12} y={scene.incident.y + 8} text-anchor="end">{text.incident}</text>
      {#if scene.reflected}
        <line x1={scene.origin.x} y1={scene.origin.y} x2={scene.reflected.x} y2={scene.reflected.y} class="ray reflected" marker-end={`url(#${id}-reflected-arrow)`} />
        <text x={scene.reflected.x + 12} y={scene.reflected.y + 8}>{text.reflected}</text>
      {/if}
      {#if scene.transmitted}
        <line x1={scene.origin.x} y1={scene.origin.y} x2={scene.transmitted.x} y2={scene.transmitted.y} class="ray transmitted" marker-end={`url(#${id}-transmitted-arrow)`} />
        <text x={scene.transmitted.x + 12} y={scene.transmitted.y - 10}>{text.transmitted}</text>
      {/if}
      {#if scene.labelAngles}
        <path d={path(scene.incidenceArc)} class="angle-arc" />
        <text x={scene.incidenceLabel.x} y={scene.incidenceLabel.y} text-anchor="middle" dominant-baseline="middle">θ₁</text>
        {#if scene.transmissionLabel}
          <path d={path(scene.transmissionArc)} class="angle-arc" />
          <text x={scene.transmissionLabel.x} y={scene.transmissionLabel.y} text-anchor="middle" dominant-baseline="middle">θ₂</text>
        {/if}
      {/if}
    </g>
  </svg>
  <figcaption>{scene.schematic ? text.schematic : text.calculated}</figcaption>
</figure>
<style>
  figure { margin: 24px 0 0; min-width: 0; }
  svg { display: block; width: 100%; height: auto; }
  .medium-one { fill: var(--color-surface); }
  .medium-two { fill: var(--color-control); }
  .interface { stroke: var(--color-text-muted); stroke-width: 1.5; }
  .normal { stroke: var(--color-text-muted); stroke-width: 1; stroke-dasharray: 5 5; }
  .ray { stroke-width: 2.2; }
  .incident { stroke: var(--color-text); fill: var(--color-text); }
  .reflected { stroke: var(--color-accent); fill: var(--color-accent); }
  .transmitted { stroke: var(--color-text-muted); fill: var(--color-text-muted); }
  .angle-arc { fill: none; stroke: var(--color-text-muted); stroke-width: 1; }
  text { fill: var(--color-text); font-size: 13px; }
  .normal-label { fill: var(--color-text-muted); }
  figcaption { font-size: .75rem; color: var(--color-text-muted); margin-top: 8px; }
</style>
