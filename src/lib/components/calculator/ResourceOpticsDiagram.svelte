<script lang="ts">
  import type { ResourceResult } from '#lib/physics/resources/solver.ts';
  import { solveResourceModel } from '#lib/physics/resources/solver.ts';
  import { resourcePhysics } from '#lib/physics/resources/models.ts';
  import { resourceOpticsScene } from '#lib/visualization/resource-optics.ts';
  import { opticsDiagramUi as text } from '#lib/i18n/runtime.ts';
  let { modelId, result }: { modelId:string; result:ResourceResult|null } = $props();
  const id=$props.id();
  const preview=$derived(solveResourceModel(resourcePhysics[modelId], modelId==='parallel-plate'?{n:1.5,d:.03,i:Math.PI/4}:modelId==='prism-deviation'?{n:1.5,A:Math.PI/3,i:Math.PI/4}:modelId==='optical-medium'?{n:1.5}:{f:.1}));
  const resolved=$derived(result?.status==='success'?result:preview);
  const scene=$derived(resolved.status==='success'?resourceOpticsScene(modelId,resolved.values,resolved.outputs):null);
  const title=$derived(text[modelId as keyof typeof text]);
</script>
{#if scene}
<figure>
  <svg viewBox="0 0 640 350" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>{title}</title>
    <desc id={`${id}-desc`}>{text.description} {result?.status==='success'?text.calculated:text.schematic}</desc>
    <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z"/></marker><clipPath id={`${id}-clip`}><rect x="10" y="10" width="620" height="330"/></clipPath></defs>
    <g clip-path={`url(#${id}-clip)`}>
      <path d={scene.surface} class="surface"/>
      {#each scene.lines as line}
        <line {...line} class={line.kind} marker-end={line.kind==='ray'||line.kind==='dimension'?`url(#${id}-arrow)`:undefined} marker-start={line.kind==='dimension'?`url(#${id}-arrow)`:undefined}/>
      {/each}
      {#each scene.labels as label}<text x={label.x} y={label.y} text-anchor="middle">{label.text}</text>{/each}
    </g>
  </svg>
  <figcaption>{title}. {result?.status==='success'?text.calculated:text.schematic} {text.legend} {#if modelId==='mirror-focus'||modelId==='lens-power'}{text.focusLegend}{/if}</figcaption>
</figure>
{/if}
<style>
  figure { margin:24px 0 0; min-width:0; }
  svg { display:block; width:100%; height:auto; }
  .surface { fill:var(--color-control); stroke:var(--color-text-muted); stroke-width:1.5; }
  line { fill:none; stroke:var(--color-accent); stroke-width:2; }
  marker path { fill:var(--color-accent); }
  .normal,.extension { stroke:var(--color-text-muted); stroke-width:1; stroke-dasharray:5 5; }
  .dimension { stroke-width:1; }
  text { fill:var(--color-text); font-size:14px; }
  @media (max-width:40rem) { text { font-size:22px; } }
  figcaption { color:var(--color-text-muted); font-size:.75rem; margin-top:8px; }
</style>
