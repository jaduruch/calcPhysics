<script lang="ts">
  import '#lib/styles/circuit-diagram.css';
  import { electricalUi as text } from '#lib/i18n/en.ts';
  let { parallel }: { parallel: boolean } = $props();
  const id=$props.id();
</script>
<figure class="circuit-diagram">
  <svg style:width="calc(500px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 500 270" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{parallel?text.parallelResonator:text.seriesResonator}</title>
    <desc id={`${id}-description`}>{text.resonatorCircuitDescription}</desc>
    <defs>
      <marker id={`${id}-current-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8Z" fill="var(--color-electric-current)"/></marker>
      <marker id={`${id}-voltage-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8Z" fill="var(--color-accent)"/></marker>
    </defs>
    <circle class="wire" cx="70" cy="145" r="30"/><path class="wire" d="M52 145c6-14 12-14 18 0s12 14 18 0"/>
    {#if parallel}
      <path class="wire" d="M70 115V55H410M410 235H70V175"/>
      <path class="wire" d="M170 55V90M170 180V235M300 55V95M300 175V235M410 55V120M410 150V235"/>
      <rect class="resistor" x="155" y="90" width="30" height="90"/>
      <path class="resistor" d="M300 95a10 10 0 0 1 0 20a10 10 0 0 1 0 20a10 10 0 0 1 0 20a10 10 0 0 1 0 20"/>
      <path class="resistor" d="M385 120H435M385 150H435"/>
      <g class="quantity resistance"><text x="202" y="142"><tspan class="symbol">R</tspan></text><text x="332" y="142"><tspan class="symbol">L</tspan></text><text x="450" y="142"><tspan class="symbol">C</tspan></text></g>
    {:else}
      <path class="wire" d="M70 115V55H145M225 55H260M340 55H385M415 55H430V235H70V175"/>
      <rect class="resistor" x="145" y="40" width="80" height="30"/>
      <path class="resistor" d="M260 55a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0"/>
      <path class="resistor" d="M385 30V80M415 30V80"/>
      <g class="quantity resistance"><text x="185" y="105" text-anchor="middle"><tspan class="symbol">R</tspan></text><text x="300" y="105" text-anchor="middle"><tspan class="symbol">L</tspan></text><text x="400" y="105" text-anchor="middle"><tspan class="symbol">C</tspan></text></g>
    {/if}
    <g class="quantity current"><path class="arrow" d="M100 32H145" marker-end={`url(#${id}-current-arrow)`}/><text x="118" y="24"><tspan class="symbol">I</tspan></text></g>
    <g class="quantity voltage"><path class="arrow" d="M32 105V185" marker-end={`url(#${id}-voltage-arrow)`}/><text x="5" y="150"><tspan class="symbol">U</tspan></text></g>
  </svg>
  <figcaption>{text.resonatorCircuitDescription}</figcaption>
</figure>
