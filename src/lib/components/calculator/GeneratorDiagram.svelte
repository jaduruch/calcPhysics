<script lang="ts">
  import type { ElectricalResult } from '#lib/physics/electricity.ts';
  import { generatorVectors } from '#lib/visualization/electrical.ts';
  import { electricalUi as text } from '#lib/i18n/runtime.ts';
  let { result }: { result: ElectricalResult } = $props();
  const diagram = $derived(generatorVectors(result));
  let enabled = $state([true, true, true]);
</script>
<figure>
  <figcaption>{text.generator}</figcaption>
  <svg style:width="calc(300px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 300 280" role="img" aria-label={text.generator}>
    <circle class="rotor" cx="150" cy="140" r="100" />
    <path class="axis" d="M35 140H265 M150 25V255" />
    {#each diagram.vectors as vector, index}
      {#if enabled[index]}
        <path class="phase" class:second={index===1} class:third={index===2} d={`M150 140L${150+100*vector.x} ${140+100*vector.y}`} />
        <text x={150+114*vector.x} y={144+114*vector.y} text-anchor="middle">{vector.label}</text>
      {/if}
    {/each}
  </svg>
  <div class="phase-controls">{#each enabled as on, index}<label><input type="checkbox" checked={on} onchange={event => enabled[index] = event.currentTarget.checked} />{text.phase} {index+1}</label>{/each}</div>
  <p>{diagram.schematic ? text.schematic : text.generatorNote}</p>
</figure>
<style>
  figure { margin: 24px 0 0; padding: 16px; max-width: 28rem; background: var(--color-control); border-radius: var(--control-radius); }
  figcaption { font-weight: 600; font-size: .875rem; }
  svg { display: block; width: 100%; height: auto; }
  .rotor, .axis { fill: none; stroke: var(--color-text-muted); stroke-width: 1; opacity: .35; }
  .phase { stroke: var(--color-accent); stroke-width: 3; }
  .second { stroke-dasharray: 8 4; }
  .third { stroke-dasharray: 2 4; }
  text { fill: var(--color-text); font-size: 12px; }
  .phase-controls { display: flex; flex-wrap: wrap; gap: 12px; }
  label { display: flex; align-items: center; min-height: 44px; gap: 6px; font-size: .8125rem; }
  p { color: var(--color-text-muted); font-size: .75rem; margin-bottom: 0; }
</style>
