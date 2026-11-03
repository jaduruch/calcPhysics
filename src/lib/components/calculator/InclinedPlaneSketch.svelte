<script lang="ts">
  import type { InclineResult } from '#lib/physics/mechanics/inclined-plane.ts';
  import { inclinedPlaneSketch } from '#lib/visualization/inclined-plane.ts';
  import { inclinedPlaneUi as text } from '#lib/i18n/en.ts';
  let { result, enteredAngle, enteredFriction, highlightAngle = false, highlightLength = false, highlightHeight = false }: { highlightAngle?: boolean; highlightLength?: boolean; highlightHeight?: boolean; result: InclineResult | null; enteredAngle?: number; enteredFriction?: number } = $props();
  const id = $props.id();
  const data = $derived(result?.status === 'success' ? result : null);
  const sketch = $derived(inclinedPlaneSketch(data, enteredAngle, enteredFriction));
  const { angle, cos, sin, base, end, centre, arrows } = $derived(sketch);
  const angleLabel = $derived(sketch.angleKnown ? `α = ${Number((angle * 180 / Math.PI).toPrecision(3))}°` : 'α');
</script>
<figure>
  <figcaption>{text.sketch}</figcaption>
  <svg viewBox="0 0 420 320" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{text.sketch}</title><desc id={`${id}-description`}>{text.sketchDescription}{!data ? ` ${text.schematic}` : ''}{highlightAngle ? ` ${text.angleHighlight}` : ''}{highlightLength ? ` ${text.lengthHighlight}` : ''}{highlightHeight ? ` ${text.heightHighlight}` : ''}</desc>

    <path class="plane-fill" d={`M${base.x} ${base.y} L${end.x} ${end.y} L${end.x} ${base.y} Z`} />
    <line class="ground" x1="60" y1={base.y} x2="350" y2={base.y} />
    <line class="plane" class:highlighted={highlightLength} data-angle-rad={angle} x1={base.x} y1={base.y} x2={end.x} y2={end.y} />
    {#if highlightLength}
      <text class="dimension-label" x={(base.x + end.x) / 2 + 16 * sin} y={(base.y + end.y) / 2 + 16 * cos + 4} text-anchor="middle">L</text>
    {/if}
    {#if highlightHeight}
      <g class="height-mark">
        <line class="dimension" x1={end.x} y1={base.y} x2={end.x} y2={end.y} />
        <text class="dimension-label" x={end.x + 12} y={(base.y + end.y) / 2 + 4}>h</text>
      </g>
    {/if}
    <g class="angle-mark" class:highlighted={highlightAngle}>
      <path class="angle-area" d={`M${base.x} ${base.y} L${base.x + 38} ${base.y} A38 38 0 0 0 ${base.x + 38 * cos} ${base.y - 38 * sin} Z`} />
      <path class="angle" d={`M${base.x + 38} ${base.y} A38 38 0 0 0 ${base.x + 38 * cos} ${base.y - 38 * sin}`} />
      <text class="angle-label" x={base.x + 47 * Math.cos(angle / 2)} y={base.y - 47 * Math.sin(angle / 2) - 3}>{angleLabel}</text>
    </g>
    <rect class="block" x={centre.x - 22} y={centre.y - 16} width="44" height="32" rx="4" transform={`rotate(${-angle * 180 / Math.PI} ${centre.x} ${centre.y})`} />
    {#each arrows as arrow}
      {#if arrow.length > 0}
        <line class="force" data-force={arrow.id} data-magnitude={data ? arrow.magnitude : undefined} class:component={arrow.component} x1={centre.x} y1={centre.y} x2={arrow.shaftEnd.x} y2={arrow.shaftEnd.y} style:stroke-width={arrow.shaftWidth} />
        <polygon class="arrowhead" points={arrow.head.map(point => `${point.x},${point.y}`).join(' ')} />
        <text class="force-label" x={arrow.labelPosition.x} y={arrow.labelPosition.y} text-anchor="middle">{arrow.label}</text>
      {/if}
    {/each}
  </svg>
  <p>{data ? text.diagramNote : text.schematic}</p>
</figure>
<style>
  figure { max-width: 30rem; margin: 24px 0 0; padding: 16px; border-radius: var(--control-radius); background: var(--color-control); }
  figcaption { font-size: .875rem; font-weight: 600; }
  svg { display: block; width: 100%; height: auto; }
  text { fill: var(--color-text); font-family: inherit; font-size: 12px; }
  .plane-fill { fill: var(--color-input); }
  .plane { stroke: var(--color-text-muted); stroke-width: 2; }
  .plane.highlighted, .dimension { stroke: var(--color-accent); stroke-width: 3; }
  .dimension-label { fill: var(--color-accent); font-weight: 700; }
  .ground, .angle { stroke: var(--color-text-muted); stroke-width: 1; fill: none; }
  .angle-area { fill: transparent; pointer-events: none; }
  .angle-mark.highlighted .angle-area { fill: var(--color-accent); fill-opacity: .18; }
  .angle-mark.highlighted .angle { stroke: var(--color-accent); stroke-width: 3; }
  .angle-mark.highlighted .angle-label { fill: var(--color-accent); font-weight: 700; }
  .block { fill: var(--color-surface); stroke: var(--color-text-muted); }
  .force { stroke: var(--color-accent); stroke-width: 2; }
  .arrowhead { fill: var(--color-accent); }
  .force.component { stroke-dasharray: 5 3; }
  .force-label { fill: var(--color-accent); }
  p { margin: 8px 0 0; font-size: .75rem; color: var(--color-text-muted); }
</style>
