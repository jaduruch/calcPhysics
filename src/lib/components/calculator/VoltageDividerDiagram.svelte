<script lang="ts">
  import '#lib/styles/circuit-diagram.css';
  import { electricalUi as text } from '#lib/i18n/en.ts';
  let { active = null, loaded = false }: { active?: string | null; loaded?: boolean } = $props();
  const id = $props.id();
  const voltageArrows = [
    { key: 'Uin', sub: 'in', path: 'M25 75V270', x: 40, y: 110 },
    { key: 'U1', sub: '1', path: 'M350 75V135', x: 370, y: 110 },
    { key: 'Uout', sub: 'out', path: 'M350 205V270', x: 370, y: 244 }
  ];
  const currentArrows = $derived([
    { key: 'I', sub: '', path: 'M175 40H245', x: 210, y: 22 },
    ...(loaded ? [
      { key: 'IR2', sub: 'R2', path: 'M300 175V198', x: 260, y: 187 },
      { key: 'IL', sub: 'L', path: 'M480 175V198', x: 515, y: 187 }
    ] : [])
  ]);
  const resistors = $derived([
    { key: 'R1', sub: '1', x: 285, y: 75, labelX: 265, labelY: 110, anchor: 'end' },
    { key: 'R2', sub: '2', x: 285, y: 205, labelX: 265, labelY: 244, anchor: 'end' },
    ...(loaded ? [{ key: 'RL', sub: 'L', x: 465, y: 205, labelX: 520, labelY: 244, anchor: 'start' }] : [])
  ]);
</script>
{#snippet label(symbol: string, sub: string, unit: string)}
  <tspan class="symbol">{symbol}</tspan>{#if sub}<tspan baseline-shift="sub" font-size="12">{sub}</tspan>{/if}<tspan class="unit"> [{unit}]</tspan>
{/snippet}
<figure class="circuit-diagram divider-diagram">
  <svg class:selection-active={active !== null} style:width="calc(600px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 600 350" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{loaded ? text.loadedDividerDiagram : text.dividerDiagram}</title>
    <desc id={`${id}-description`}>{loaded ? text.loadedDividerDescription : text.dividerDescription}</desc>
    <defs>
      {#each [...voltageArrows, ...currentArrows] as arrow}
        <marker id={`${id}-${arrow.key}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill={active !== null && active !== arrow.key ? 'var(--color-text-muted)' : arrow.key.startsWith('U') ? 'var(--color-accent)' : 'var(--color-electric-current)'} />
        </marker>
      {/each}
    </defs>
    <path class="wire" d="M100 145V40H300V75 M300 135V205 M300 270V315H100V205" />
    <circle class="wire" cx="100" cy="175" r="30" />
    <path class="wire" d="M93 162H107 M100 155V169 M93 188H107" />
    {#if loaded}<path class="wire" data-load-branch d="M300 170H480V205 M480 270V315H300" />{/if}
    {#each voltageArrows as arrow}
      <g class="quantity voltage" class:muted={active !== null && active !== arrow.key} data-quantity={arrow.key}>
        <path class="arrow" d={arrow.path} marker-end={`url(#${id}-${arrow.key})`} />
        <text x={arrow.x} y={arrow.y}>{@render label('U', arrow.sub, 'V')}</text>
      </g>
    {/each}
    {#each currentArrows as arrow}
      <g class="quantity current" class:muted={active !== null && active !== arrow.key} data-quantity={arrow.key}>
        <path class="arrow" d={arrow.path} marker-end={`url(#${id}-${arrow.key})`} />
        <text x={arrow.x} y={arrow.y} text-anchor="middle">{@render label('I', arrow.sub, 'A')}</text>
      </g>
    {/each}
    {#each resistors as resistor}
      <g class="quantity resistance" class:muted={active !== null && active !== resistor.key} data-quantity={resistor.key}>
        <rect class="resistor" x={resistor.x} y={resistor.y} width="30" height={resistor.key === 'R1' ? 60 : 65} />
        <text x={resistor.labelX} y={resistor.labelY} text-anchor={resistor.anchor}>{@render label('R', resistor.sub, 'Ω')}</text>
      </g>
    {/each}
  </svg>
  <figcaption>{text.ohmDiagramHint}</figcaption>
</figure>
