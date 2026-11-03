<script lang="ts">
  import '#lib/styles/circuit-diagram.css';
  import { electricalUi as text } from '#lib/i18n/en.ts';
  let { parallel = false, inductive = false, active = null }: { parallel?: boolean; inductive?: boolean; active?: string | null } = $props();
  const id = $props.id();
  const highlight = $derived(['R', 'C', 'L', 'I', 'U', 'UR', 'UC', 'UL', 'IR', 'IC', 'IL'].includes(active ?? '') ? active : null);
</script>

{#snippet label(symbol: string, sub: string, unit: string)}
  <tspan class="symbol">{symbol}</tspan>{#if sub}<tspan baseline-shift="sub" font-size="12">{sub}</tspan>{/if}<tspan class="unit"> [{unit}]</tspan>
{/snippet}

<figure class="circuit-diagram rc-circuit-diagram">
  <svg class:selection-active={highlight !== null} style:width="calc(500px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 500 290" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{inductive ? (parallel ? text.parallelRlDiagram : text.seriesRlDiagram) : (parallel ? text.parallelRcDiagram : text.seriesRcDiagram)}</title>
    <desc id={`${id}-description`}>{inductive ? text.rlDiagramDescription : (parallel ? text.parallelRcDescription : text.seriesRcDescription)}</desc>
    <defs>
      <marker id={`${id}-current`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0L8 4L0 8Z" fill={highlight !== null && highlight !== 'I' ? 'var(--color-text-muted)' : 'var(--color-electric-current)'} />
      </marker>
    </defs>

    <circle class="wire" cx="75" cy="145" r="30" />
    <path class="wire" d="M57 145c6-14 12-14 18 0s12 14 18 0" />
    <g class="quantity voltage" class:muted={highlight !== null && highlight !== 'U'} data-quantity="U">
      <text x="10" y="105">{@render label('U', '', 'V')}</text>
    </g>

    {#if parallel}
      <path class="wire" data-topology="parallel" d={inductive ? 'M75 115V45H380 M75 175V245H380 M180 45V95 M180 155V245 M350 45V105 M350 153V245' : 'M75 115V45H380 M75 175V245H380 M180 45V95 M180 155V245 M350 45V119 M350 131V245'} />
      <g class="quantity resistance" class:muted={highlight !== null && !['R', 'IR'].includes(highlight)} data-quantity="R">
        <rect class="resistor" x="165" y="95" width="30" height="60" />
        <text x="210" y="132">{@render label('R', '', 'Ω')}</text>
      </g>
      <g class="quantity resistance" class:muted={highlight !== null && !(inductive ? ['L','IL'] : ['C','IC']).includes(highlight)} data-quantity={inductive?'L':'C'}>
        {#if inductive}<path class="resistor" d="M350 105a6 6 0 0 1 0 12a6 6 0 0 1 0 12a6 6 0 0 1 0 12a6 6 0 0 1 0 12" />{:else}<path class="resistor" d="M325 119H375 M325 131H375" />{/if}
        <text x="385" y="132">{@render label(inductive?'L':'C', '', inductive?'H':'F')}</text>
      </g>
    {:else}
      <path class="wire" data-topology="series" d={inductive ? 'M75 115V45H180 M240 45H430V105 M430 153V245H75V175' : 'M75 115V45H180 M240 45H430V119 M430 131V245H75V175'} />
      <g class="quantity resistance" class:muted={highlight !== null && !['R', 'UR'].includes(highlight)} data-quantity="R">
        <rect class="resistor" x="180" y="30" width="60" height="30" />
        <text x="210" y="88" text-anchor="middle">{@render label('R', '', 'Ω')}</text>
      </g>
      <g class="quantity resistance" class:muted={highlight !== null && !(inductive ? ['L','UL'] : ['C','UC']).includes(highlight)} data-quantity={inductive?'L':'C'}>
        {#if inductive}<path class="resistor" d="M430 105a6 6 0 0 1 0 12a6 6 0 0 1 0 12a6 6 0 0 1 0 12a6 6 0 0 1 0 12" />{:else}<path class="resistor" d="M405 119H455 M405 131H455" />{/if}
        <text x="390" y="132" text-anchor="end">{@render label(inductive?'L':'C', '', inductive?'H':'F')}</text>
      </g>
    {/if}

    <g class="quantity current" class:muted={highlight !== null && highlight !== 'I'} data-quantity="I">
      <path class="arrow" d="M105 45H150" marker-end={`url(#${id}-current)`} />
      <text x="128" y="28" text-anchor="middle">{@render label('I', '', 'A')}</text>
    </g>
  </svg>
  <figcaption>{text.automaticRcDiagramHint}</figcaption>
</figure>

<style>
  svg { max-width: 100%; }
</style>
