<script lang="ts">
  import { formatQuantity } from '#lib/calculators/quantities.ts';
  import { electricalUi as text } from '#lib/i18n/en.ts';
  let { starToDelta, inputs, outputs, active }: { starToDelta: boolean; inputs: Record<string, number>; outputs: Record<string, number>; active: string | null } = $props();
  const resistance = (value: number | undefined, fallback: string) => {
    if (value === undefined) return fallback;
    const formatted = formatQuantity(value);
    return `${formatted.number} ${formatted.prefix === 'u' ? 'µ' : formatted.prefix}Ω`;
  };
  const delta = $derived(starToDelta
    ? [resistance(outputs.R1, 'R₁₂'), resistance(outputs.R2, 'R₂₃'), resistance(outputs.R3, 'R₃₁')]
    : [resistance(inputs.a, 'R₁₂'), resistance(inputs.b, 'R₂₃'), resistance(inputs.c, 'R₃₁')]);
  const star = $derived(starToDelta
    ? [resistance(inputs.a, 'R₁'), resistance(inputs.b, 'R₂'), resistance(inputs.c, 'R₃')]
    : [resistance(outputs.R1, 'R₁'), resistance(outputs.R2, 'R₂'), resistance(outputs.R3, 'R₃')]);
  const activeIndex = $derived(active === 'a' ? 0 : active === 'b' ? 1 : active === 'c' ? 2 : null);
  const highlighted = (network: 'delta' | 'star', index: number) => (network === 'star') === starToDelta && activeIndex === index;
  const muted = (network: 'delta' | 'star', index: number) => activeIndex !== null && !highlighted(network, index);
</script>

<div class="conversion-diagrams" class:star-to-delta={starToDelta} aria-label={text.starDeltaDiagrams}>
  <figure class="delta-diagram">
    <figcaption>{text.deltaNetwork}</figcaption>
    <svg class:selection-active={activeIndex !== null} viewBox="0 0 300 270" role="img" aria-label={text.deltaNetwork}>
      <g class="wire"><path d="M150 40 55 204.5H245Z"/><circle cx="150" cy="40" r="5"/><circle cx="55" cy="204.5" r="5"/><circle cx="245" cy="204.5" r="5"/></g>
      <g class="resistor" class:active={highlighted('delta',0)} class:muted={muted('delta',0)} transform="rotate(-60 102.5 122.25)"><rect x="68.5" y="110.25" width="68" height="24" rx="2"/></g>
      <g class="resistor" class:active={highlighted('delta',1)} class:muted={muted('delta',1)} transform="rotate(60 197.5 122.25)"><rect x="163.5" y="110.25" width="68" height="24" rx="2"/></g>
      <g class="resistor" class:active={highlighted('delta',2)} class:muted={muted('delta',2)}><rect x="116" y="192.5" width="68" height="24" rx="2"/></g>
      <g class="labels"><text class:active={highlighted('delta',0)} class:muted={muted('delta',0)} x="48" y="119">{delta[0]}</text><text class:active={highlighted('delta',1)} class:muted={muted('delta',1)} x="252" y="119" text-anchor="end">{delta[1]}</text><text class:active={highlighted('delta',2)} class:muted={muted('delta',2)} x="150" y="244" text-anchor="middle">{delta[2]}</text></g>
      <g class="nodes"><text x="150" y="24" text-anchor="middle">1</text><text x="38" y="214" text-anchor="middle">2</text><text x="262" y="214" text-anchor="middle">3</text></g>
    </svg>
  </figure>
  <figure class="star-diagram">
    <figcaption>{text.starNetwork}</figcaption>
    <svg class:selection-active={activeIndex !== null} viewBox="0 0 300 270" role="img" aria-label={text.starNetwork}>
      <g class="wire"><path d="M150 35V135L55 220M150 135 245 220"/><circle cx="150" cy="35" r="5"/><circle cx="55" cy="220" r="5"/><circle cx="245" cy="220" r="5"/><circle cx="150" cy="135" r="5"/></g>
      <g class="resistor" class:active={highlighted('star',0)} class:muted={muted('star',0)}><rect x="138" y="60" width="24" height="58" rx="2"/></g>
      <g class="resistor" class:active={highlighted('star',1)} class:muted={muted('star',1)} transform="rotate(-42 102 178)"><rect x="73" y="166" width="58" height="24" rx="2"/></g>
      <g class="resistor" class:active={highlighted('star',2)} class:muted={muted('star',2)} transform="rotate(42 198 178)"><rect x="169" y="166" width="58" height="24" rx="2"/></g>
      <g class="labels"><text class:active={highlighted('star',0)} class:muted={muted('star',0)} x="172" y="91">{star[0]}</text><text class:active={highlighted('star',1)} class:muted={muted('star',1)} x="55" y="160">{star[1]}</text><text class:active={highlighted('star',2)} class:muted={muted('star',2)} x="245" y="160" text-anchor="end">{star[2]}</text></g>
      <g class="nodes"><text x="150" y="20" text-anchor="middle">1</text><text x="38" y="230" text-anchor="middle">2</text><text x="262" y="230" text-anchor="middle">3</text></g>
    </svg>
  </figure>
</div>

<style>
  .conversion-diagrams { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; max-width: var(--calculator-width); margin-top: 24px; }
  .conversion-diagrams.star-to-delta .star-diagram { order: -1; }
  figure { margin: 0; min-width: 0; padding: 14px; border-radius: var(--control-radius); background: var(--color-surface-raised); }
  figcaption { color: var(--color-text-muted); font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  svg { display: block; width: 100%; height: auto; margin-top: 8px; overflow: visible; }
  .wire { fill: var(--color-surface-raised); stroke: var(--color-text); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .resistor { fill: var(--color-surface-raised); stroke: var(--color-text); stroke-width: 2; }
  .resistor rect { rx: 3px; ry: 3px; }
  .resistor.active { stroke: var(--color-text); }
  .resistor.muted { stroke: var(--color-diagram-muted); }
  text { fill: var(--color-text); font: 600 14px system-ui, sans-serif; paint-order: stroke; stroke: var(--color-surface-raised); stroke-width: 5px; stroke-linejoin: round; }
  .nodes text { fill: var(--color-text-muted); font-size: 12px; stroke-width: 4px; }
  .labels text.active { fill: var(--color-text); }
  .labels text.muted { fill: var(--color-diagram-muted); }
  svg.selection-active .wire { stroke: var(--color-diagram-muted); }
  svg.selection-active .nodes text { fill: var(--color-diagram-muted); }
  @media (max-width: 44rem) { .conversion-diagrams { grid-template-columns: 1fr; } }
</style>
