<script lang="ts">
  import '#lib/styles/circuit-diagram.css';
  import { electricalUi as text } from '#lib/i18n/en.ts';
  let { active = null }: { active?: string | null } = $props();
  const id = $props.id();
</script>
<figure class="circuit-diagram ohms-diagram">
  <svg class:selection-active={active !== null} style:width="calc(500px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 500 300" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{text.ohmDiagram}</title>
    <desc id={`${id}-description`}>{text.ohmDiagramDescription}</desc>
    <defs>
      {#each [{ key: 'I', color: 'var(--color-electric-current)' }, { key: 'U', color: 'var(--color-accent)' }, { key: 'P', color: 'var(--color-text)' }] as arrow}
        <marker id={`${id}-${arrow.key}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill={active !== null && active !== arrow.key ? 'var(--color-text-muted)' : arrow.color} />
        </marker>
      {/each}
    </defs>
    <path class="wire" d="M100 115V55H335V110 M335 190V245H100V185" />
    <circle class="wire" cx="100" cy="150" r="35" />
    <path class="wire" d="M93 137H107 M100 130V144 M93 165H107" />
    <g class="quantity current" class:muted={active !== null && active !== 'I'} data-quantity="I">
      <path class="arrow" d="M180 55H260" marker-end={`url(#${id}-I-arrow)`} />
      <text x="220" y="32" text-anchor="middle"><tspan class="symbol">I</tspan><tspan class="unit"> [A]</tspan></text>
    </g>
    <g class="quantity resistance" class:muted={active !== null && active !== 'R'} data-quantity="R">
      <rect class="resistor" x="320" y="110" width="30" height="80" />
      <text x="296" y="154" text-anchor="end"><tspan class="symbol">R</tspan><tspan class="unit"> [Ω]</tspan></text>
    </g>
    <g class="quantity voltage" class:muted={active !== null && active !== 'U'} data-quantity="U">
      <path class="arrow" d="M385 110V190" marker-end={`url(#${id}-U-arrow)`} />
      <path class="guide" d="M358 110H393 M358 190H393" />
      <text x="405" y="154"><tspan class="symbol">U</tspan><tspan class="unit"> [V]</tspan></text>
    </g>
    <g class="quantity power" class:muted={active !== null && active !== 'P'} data-quantity="P">
      <path class="arrow" d="M210 215L305 172" marker-end={`url(#${id}-P-arrow)`} />
      <text x="192" y="225" text-anchor="end"><tspan class="symbol">P</tspan><tspan class="unit"> [W]</tspan></text>
    </g>
  </svg>
  <figcaption>{text.ohmDiagramHint}</figcaption>
</figure>
