<script lang="ts">
  import '#lib/styles/circuit-diagram.css';
  import { electricalUi as text } from '#lib/i18n/runtime.ts';
  let { rc, highPass }: { rc: boolean; highPass: boolean } = $props();
  const id=$props.id();
  const seriesComponent=$derived(highPass?(rc?'C':'R'):(rc?'R':'L'));
  const shuntComponent=$derived(highPass?(rc?'R':'L'):(rc?'C':'R'));
</script>
<figure class="circuit-diagram">
  <svg style:width="calc(500px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 500 260" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{highPass?text.highPassCircuit:text.lowPassCircuit}</title>
    <desc id={`${id}-description`}>{text.filterCircuitDescription}</desc>
    <defs><marker id={`${id}-voltage-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8Z" fill="var(--color-accent)"/></marker></defs>
    <circle class="wire" cx="70" cy="140" r="30"/><path class="wire" d="M52 140c6-14 12-14 18 0s12 14 18 0M70 110V55H170M250 55H400V105M400 165V220H70V170"/>
    {#if seriesComponent==='R'}<rect class="resistor" x="170" y="40" width="80" height="30"/>
    {:else if seriesComponent==='C'}<path class="wire" d="M170 55H198M222 55H250"/><path class="resistor" d="M198 30V80M222 30V80"/>
    {:else}<path class="resistor" d="M170 55a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0"/>{/if}
    {#if shuntComponent==='R'}<rect class="resistor" x="385" y="105" width="30" height="60"/>
    {:else if shuntComponent==='C'}<path class="wire" d="M400 105V123M400 147V165"/><path class="resistor" d="M375 123H425M375 147H425"/>
    {:else}<path class="resistor" d="M400 105a10 10 0 0 1 0 20a10 10 0 0 1 0 20a10 10 0 0 1 0 20"/>{/if}
    <g class="quantity resistance"><text x="210" y="105" text-anchor="middle"><tspan class="symbol">{seriesComponent}</tspan></text><text x="440" y="140"><tspan class="symbol">{shuntComponent}</tspan></text></g>
    <g class="quantity voltage"><text x="20" y="102"><tspan class="symbol">U</tspan><tspan baseline-shift="sub" font-size="12">in</tspan></text><path class="arrow" d="M460 105V165" marker-end={`url(#${id}-voltage-arrow)`}/><text x="470" y="140"><tspan class="symbol">U</tspan><tspan baseline-shift="sub" font-size="12">out</tspan></text></g>
  </svg>
  <figcaption>{text.filterCircuitDescription}</figcaption>
</figure>
