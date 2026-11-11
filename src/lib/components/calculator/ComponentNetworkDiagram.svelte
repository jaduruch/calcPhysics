<script lang="ts">
  import '#lib/styles/circuit-diagram.css';
  import { electricalUi as text } from '#lib/i18n/runtime.ts';
  let { parallel = false, kind = 'resistance', active = null, components }: {
    parallel?: boolean; kind?: 'resistance' | 'capacitance' | 'inductance'; active?: string | null; components: readonly { id: string; pending: boolean }[];
  } = $props();
  const id = $props.id();
  const capacitor = $derived(kind === 'capacitance');
  const inductor = $derived(kind === 'inductance');
  const height = $derived(parallel ? 280 : components.length * 100 + 60);
  const branchSpacing = 100;
  const branchSpan = $derived(Math.max(0, components.length - 1) * branchSpacing);
  const width = $derived(parallel ? Math.max(400, branchSpan + 200) : 400);
  const firstBranch = $derived((width - branchSpan) / 2);
  const highlight = $derived(components.some(component => component.id === active) ? active : null);
</script>
<figure class="circuit-diagram component-network-diagram">
  <div class="circuit-scroll">
    <svg class:selection-active={highlight !== null} viewBox={`0 0 ${width} ${height}`} style:width={`calc(${width}px * var(--graphic-scale))`} style:min-width={parallel && components.length > 3 ? `calc(${width}px * var(--graphic-scale))` : undefined} role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{capacitor ? (parallel ? text.parallelCapacitorDiagram : text.seriesCapacitorDiagram) : inductor ? (parallel ? text.parallelInductorDiagram : text.seriesInductorDiagram) : (parallel ? text.parallelResistorDiagram : text.seriesResistorDiagram)}</title>
      <desc id={`${id}-description`}>{capacitor ? text.capacitorNetworkDescription : inductor ? text.inductorNetworkDescription : (parallel ? text.parallelResistorDescription : text.seriesResistorDescription)}</desc>
      {#if parallel}
        <path class="wire" data-topology="parallel" d={`M${width/2} 20V45 M${firstBranch} 45H${firstBranch+branchSpan} M${firstBranch} 235H${firstBranch+branchSpan} M${width/2} 235V260`} />
      {:else}
        <path class="wire" data-topology="series" d={`M200 20V55 ${components.map((_, index) => `M200 ${115 + index*100}V${index === components.length-1 ? height-20 : 155 + index*100}`).join(' ')}`} />
      {/if}
      <circle class="wire" cx={width/2} cy="17" r="3" /><circle class="wire" cx={width/2} cy={height-17} r="3" />
      {#each components as component, index}
        {@const x = parallel ? firstBranch + index * branchSpacing : 200}
        {@const y = parallel ? 105 : 55 + index*100}
        <g class="quantity resistance" class:muted={component.pending || (highlight !== null && highlight !== component.id)} data-quantity={component.id}>
          {#if parallel}<path class="wire" d={`M${x} 45V105 M${x} 165V235`} />{/if}
          {#if capacitor}
            <path class="wire" d={`M${x} ${y}V${y+24} M${x} ${y+36}V${y+60}`} />
            <path class="resistor" d={`M${x-20} ${y+24}H${x+20} M${x-20} ${y+36}H${x+20}`} stroke-dasharray={component.pending ? '4 3' : undefined} />
          {:else if inductor}
            <path class="wire" d={`M${x} ${y}v6 M${x} ${y+54}v6`} />
            <path class="resistor" d={`M${x} ${y+6} a6 6 0 0 1 0 12 a6 6 0 0 1 0 12 a6 6 0 0 1 0 12 a6 6 0 0 1 0 12`} stroke-dasharray={component.pending ? '4 3' : undefined} />
          {:else}<rect class="resistor" x={x-15} {y} width="30" height="60" stroke-dasharray={component.pending ? '4 3' : undefined} />{/if}
          <text x={x+28} y={y+36}><tspan class="symbol">{capacitor ? 'C' : inductor ? 'L' : 'R'}</tspan><tspan baseline-shift="sub" font-size="12">{index+1}</tspan><tspan class="unit"> [{capacitor ? 'F' : inductor ? 'H' : 'Ω'}]</tspan></text>
        </g>
      {/each}
    </svg>
  </div>
  <figcaption>{text.ohmDiagramHint}</figcaption>
</figure>
<style>
  .circuit-scroll { max-width: 100%; overflow-x: auto; }
  svg { max-width: 100%; }
</style>
