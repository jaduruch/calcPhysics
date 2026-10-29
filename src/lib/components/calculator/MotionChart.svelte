<script lang="ts">
  import { formatAxisLabel } from '#lib/visualization/axis-label.ts';
  import { chartUi as text } from '#lib/i18n/en.ts';
  let { title, yLabel, times, values, description, shape }: {
    title: string; yLabel: string; times: number[]; values: number[]; description: string; shape: 'position' | 'velocity';
  } = $props();
  const hasData = $derived(times.length > 0 && values.length === times.length);
  const id = $props.id();
  const plot = { left: 62, top: 24, width: 298, height: 196 };
  const maximumTime = $derived(times.at(-1) || 1);
  // Normalize before subtracting so very large signed values cannot overflow the extent.
  const scale = $derived(Math.max(...values.map(Math.abs)) || 1);
  const minimum = $derived(Math.min(0, ...values.map(value => value / scale)));
  const maximum = $derived(Math.max(0, ...values.map(value => value / scale)));
  const extent = $derived(maximum - minimum || 1);
  const low = $derived(Math.max(minimum - extent * .1, -Number.MAX_VALUE / scale));
  const high = $derived(Math.min(maximum + extent * .1, Number.MAX_VALUE / scale));
  const x = (time: number) => plot.left + (time / maximumTime) * plot.width;
  const y = (value: number) => plot.top + ((high - value / scale) / (high - low)) * plot.height;
  const points = $derived(times.map((time, index) => `${x(time)},${y(values[index])}`).join(' '));
  const schematicPoints = $derived(shape === 'position'
    ? `${plot.left},${plot.top + plot.height} ${plot.left + plot.width},${plot.top + 20}`
    : `${plot.left},${plot.top + plot.height / 2} ${plot.left + plot.width},${plot.top + plot.height / 2}`);
  const ticks = [0, .25, .5, .75, 1];
</script>

{#snippet tickLabel(value: number)}
  {@const formatted = formatAxisLabel(value)}
  {formatted.coefficient}{#if formatted.exponent !== undefined} × 10<tspan baseline-shift="super" font-size="7">{formatted.exponent}</tspan>{/if}
{/snippet}

<figure>
  <figcaption><strong>{title}</strong></figcaption>
  <svg viewBox="0 0 390 270" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{title} — {yLabel}</title>
    <desc id={`${id}-description`}>{description}{!hasData ? ` ${text.empty}` : ''}</desc>
    <defs>
      <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M0 0L8 4L0 8Z" fill="var(--color-text-muted)" />
      </marker>
    </defs>
    {#each ticks as fraction}
      {@const px = plot.left + fraction * plot.width}
      {@const py = plot.top + fraction * plot.height}
      <line class="grid" x1={px} y1={plot.top} x2={px} y2={plot.top + plot.height} />
      <line class="grid" x1={plot.left} y1={py} x2={plot.left + plot.width} y2={py} />
      {#if hasData}<text x={px} y={plot.top + plot.height + 20} text-anchor="middle">{@render tickLabel(maximumTime * fraction)}</text>
      {#if Math.abs(py - y(0)) >= 12}<text x={plot.left - 9} y={py + 4} text-anchor="end">{@render tickLabel((high - fraction * (high - low)) * scale)}</text>{/if}{/if}
    {/each}
    <line class="axis" x1={plot.left} y1={plot.top + plot.height} x2={plot.left} y2={plot.top - 8} marker-end={`url(#${id}-arrow)`} />
    {#if hasData}
      <line class="zero" x1={plot.left} y1={y(0)} x2={plot.left + plot.width + 10} y2={y(0)} marker-end={`url(#${id}-arrow)`} />
      <text x={plot.left - 9} y={y(0) + 4} text-anchor="end">0</text>
    {:else}
      <line class="zero" x1={plot.left} y1={plot.top + plot.height} x2={plot.left + plot.width + 10} y2={plot.top + plot.height} marker-end={`url(#${id}-arrow)`} />
    {/if}
    <text class="axis-label" x={plot.left - 9} y={plot.top - 12} text-anchor="end">{yLabel}</text>
    <text class="axis-label" x={plot.left + plot.width} y="260" text-anchor="end">t [s]</text>
    {#if times.length > 1}<polyline class="curve" {points} />{:else if !hasData}<polyline class="curve" points={schematicPoints} />{/if}
  </svg>
  <p>{description}{#if times.length === 1} {text.zeroInterval}{/if}</p>
</figure>

<style>
  figure { margin: 0; padding: 16px; background: var(--color-control); border-radius: 8px; min-width: 0; }
  figcaption { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; margin-bottom: 8px; font-size: .875rem; }
  svg { display: block; width: 100%; height: auto; overflow: visible; }
  text { fill: var(--color-text-muted); font-family: inherit; font-size: 10px; }
  .axis-label { font-size: 11px; }
  .grid { stroke: var(--color-text-muted); stroke-opacity: .15; }
  .axis { stroke: var(--color-text-muted); stroke-width: 1; }
  .zero { stroke: var(--color-text-muted); stroke-width: 2; }
  .curve { fill: none; stroke: var(--color-accent); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  p { margin: 8px 0 0; font-size: .75rem; color: var(--color-text-muted); }
</style>
