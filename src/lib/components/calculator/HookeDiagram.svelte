<script lang="ts">
 import {hookeSketch} from '#lib/visualization/hooke.ts';
 import type {Values} from '#lib/physics/resources/solver.ts';
 import {text} from '#lib/i18n/runtime.ts';
 import {resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import Formula from '../Formula.svelte';
 let {values,focused=null}:{values:Values;focused?:string|null}=$props();
 const scene=$derived(hookeSketch(values));
 const id=$props.id();
</script>
<figure>
 <figcaption>{text('Linear spring — schematic deformation')}</figcaption>
 <svg viewBox="0 0 420 190" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
  <title id={`${id}-title`}>{text('Hooke’s Law')}</title>
  <desc id={`${id}-desc`}>{text('The deformation is shown schematically without a length scale. The restoring force points opposite to the displacement. Unknown values have no numerical scale.')}</desc>
  <path d="M45 55V125 M32 65L45 55 M32 85L45 75 M32 105L45 95 M32 125L45 115" class="wall"/>
  <g class:muted={focused!==null&&focused!=='k'}><path d={scene.path} class="spring"/><text x="130" y="52">k</text></g>
  <g class:muted={focused!==null&&focused!=='x'}>
   <line x1="230" x2="230" y1="65" y2="158" class="origin"/>
   <rect x={scene.end} y="72" width="30" height="36" class="block"/>
   {#if values.x!==undefined&&values.x!==0}<path d={`M230 140H${scene.end}`} class="dimension"/>{/if}
   <text x="230" y="177" text-anchor="middle">x = 0</text><text x={scene.end+35} y="140">x</text>
  </g>
  {#if scene.forceEnd!==undefined}
   <g class:muted={focused!==null&&focused!=='F'}>
    <path d={`M${scene.end+15} 32H${scene.forceEnd+15}`} class="force"/>
    <path d={`M${scene.forceEnd+15+(values.F>0?-7:7)} 27L${scene.forceEnd+15} 32L${scene.forceEnd+15+(values.F>0?-7:7)} 37`} class="force"/>
    <text x={scene.forceEnd+15} y="20" text-anchor="middle">Fₛ</text>
   </g>
  {/if}
 </svg>
 {#each [['F','force','F_s'],['k','springConstant','k'],['x','length','x']] as [key,kind,symbol]}
 {#if values[key]!==undefined}<Formula expression={`${symbol}=${resourceQuantity(values[key],kind as 'force'|'springConstant'|'length')}`}/>{/if}
 {/each}
 <p>{text('The deformation is shown schematically without a length scale. The restoring force points opposite to the displacement. Unknown values have no numerical scale.')}</p>
</figure>
<style>
 figure{max-width:30rem;margin:24px 0 0;padding:16px;background:var(--color-control);border-radius:var(--control-radius)}
 figcaption{font-size:.875rem;font-weight:600}svg{display:block;width:100%;height:auto}path,line{fill:none;stroke:var(--color-text);stroke-width:2}text{fill:var(--color-text);font-size:13px}.spring,.force,.dimension{stroke:var(--color-accent)}.block{fill:var(--color-surface);stroke:var(--color-text)}.origin{stroke:var(--color-text-muted);stroke-dasharray:4 4;stroke-width:1}.muted path,.muted line,.muted rect{stroke:var(--color-diagram-muted)}.muted text{fill:var(--color-diagram-muted)}p{font-size:.75rem;color:var(--color-text-muted)}
</style>
