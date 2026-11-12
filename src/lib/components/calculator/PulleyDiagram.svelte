<script lang="ts">
 import type {ResourceResult} from '#lib/physics/resources/solver.ts';
 import {pulleyScene} from '#lib/visualization/pulley.ts';
 import {resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {pulleyUi as text} from '#lib/i18n/runtime.ts';
 import Formula from '../Formula.svelte';
 let {result,mode,enteredCount}:{result:ResourceResult|null;enteredCount?:number;mode:'force'|'travel'}=$props();
 const scene=$derived(pulleyScene(result,enteredCount));
 const values=$derived(result?.status==='success'?result.values:null);
 const pullLength=$derived(70/scene.count);
 const pullWidth=$derived(Math.min(2,pullLength*.1));
 const left=$derived(Math.min(scene.beamLeft,scene.loadX-100)-15);
 const right=$derived(Math.max(scene.beamRight,scene.freeX+65)+15);
 const id=$props.id();
</script>
<figure class="pulley-diagram">
 <svg data-support-count={scene.count} data-compact={scene.compact} viewBox={`${left} 10 ${right-left} 410`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
  <title id={`${id}-title`}>{text.title}</title>
  <desc id={`${id}-desc`}>{text.description} {scene.schematic?text.schematic:text.calculated} {scene.compact?text.compact:''}</desc>
  <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z"/></marker><marker id={`${id}-pull-arrow`} markerUnits="userSpaceOnUse" viewBox="0 0 10 10" refX="10" refY="5" markerWidth={Math.min(10,pullLength*.35)} markerHeight={Math.min(10,pullLength*.35)} orient="auto"><path d="M0 0 L10 5 L0 10 Z"/></marker></defs>
  <line x1={scene.beamLeft} y1="30" x2={scene.beamRight} y2="30" class="beam"/>
  {#if scene.count>1&&(scene.compact||scene.count%2===0)}<line x1={scene.segments[0].x} y1="30" x2={scene.segments[0].x} y2="40" class="structure"/>{/if}
  {#each scene.fixed as wheel}
   <line x1={wheel.x} y1="30" x2={wheel.x} y2={wheel.y} class="structure"/>
   <circle cx={wheel.x} cy={wheel.y} r="22" class="wheel"/>
   <circle cx={wheel.x} cy={wheel.y} r="3" class="axle"/>
  {/each}
  {#if scene.moving.length}
   <line x1={scene.barLeft} y1="255" x2={scene.barRight} y2="255" class="structure"/>
   {#each scene.moving as wheel}
    <circle cx={wheel.x} cy={wheel.y} r="22" class="wheel"/>
    <line x1={wheel.x} y1={wheel.y} x2={wheel.x} y2="255" class="structure"/>
    <circle cx={wheel.x} cy={wheel.y} r="3" class="axle"/>
   {/each}
   <line x1={scene.loadX} y1="255" x2={scene.loadX} y2="280" class="structure"/>
  {:else}<line x1={scene.loadX} y1="265" x2={scene.loadX} y2="280" class="structure"/>{/if}
  <path d={scene.rope} class="rope"/>
  {#if scene.count===1}<circle cx={scene.loadX} cy="265" r="4" class="anchor"/>
  {:else}<circle cx={scene.segments[0].x} cy={scene.count%2===1&&!scene.compact?255:40} r="4" class="anchor"/>{/if}
  {#each scene.segments as segment,index}
   {#if !scene.compact}<text x={segment.x+9} y="166" class="segment-label">{index+1}</text>{/if}
  {/each}
  {#if scene.compact}<text x="260" y="180" class="omitted" text-anchor="middle">⋯</text>{/if}
  <rect x={scene.loadX-36} y="280" width="72" height="48" rx="5" class="load"/>
  <text x={scene.loadX} y="310" text-anchor="middle">{text.load}</text>
  {#if mode==='force'}
   {#if !values||values.Fg>0}<line x1={scene.loadX} y1="338" x2={scene.loadX} y2="408" class="vector" marker-end={`url(#${id}-arrow)`}/><text x={scene.loadX+14} y="380">F<tspan baseline-shift="sub" font-size="12">G</tspan></text>{/if}
   {#if !values||values.F>0}<line x1={scene.freeX} y1="285" x2={scene.freeX} y2={285+pullLength} class="vector" style:stroke-width={pullWidth} marker-end={`url(#${id}-pull-arrow)`}/><text x={scene.freeX+14} y={300+pullLength/2}>F</text>{/if}
  {:else}
   {#if !values||values.h>0}<line x1={scene.loadX-60} y1="321" x2={scene.loadX-60} y2="265" class="vector" marker-end={`url(#${id}-arrow)`}/><text x={scene.loadX-77} y="300">h</text>{/if}
   {#if !values||values.s>0}<line x1={scene.freeX+35} y1="280" x2={scene.freeX+35} y2="362" class="vector" marker-end={`url(#${id}-arrow)`}/><text x={scene.freeX+47} y="335">s</text>{/if}
  {/if}
 </svg>
 {#if values||enteredCount!==undefined}
  <div class="diagram-values">
   <Formula wrap expression={`n=${scene.count}`}/>
   {#if values}
   {#if mode==='force'}<Formula wrap expression={`F=${resourceQuantity(values.F,'force')}`}/><Formula wrap expression={`F_G=${resourceQuantity(values.Fg,'force')}`}/>
   {:else}<Formula wrap expression={`s=${resourceQuantity(values.s,'length')}`}/><Formula wrap expression={`h=${resourceQuantity(values.h,'length')}`}/>{/if}
   {/if}
  </div>
 {/if}
 <figcaption>{scene.schematic?text.schematic:text.calculated} {scene.compact?text.compact:''} {text.legend} {mode==='force'?text.forces:text.travel}</figcaption>
</figure>
<style>
 figure { margin:24px 0 0; max-width:var(--calculator-width); }
 svg { display:block; width:100%; max-width:420px; max-height:430px; height:auto; }
 .beam { stroke:var(--color-text); stroke-width:5; }
 .structure { stroke:var(--color-text-muted); stroke-width:2; }
 .wheel,.load { fill:var(--color-control); stroke:var(--color-text-muted); stroke-width:1.5; }
 .axle { fill:var(--color-text-muted); }
 .rope { fill:none; stroke:var(--color-accent); stroke-width:2.5; stroke-linecap:round; }
 .anchor { fill:var(--color-accent); }
 .vector { stroke:var(--color-accent); stroke-width:2; }
 marker path { fill:var(--color-accent); }
 text { fill:var(--color-text); font-size:17px; }
 .segment-label { fill:var(--color-text-muted); font-size:15px; }
 .omitted { font-size:32px; }
 figcaption { font-size:.75rem; color:var(--color-text-muted); max-width:72ch; }
 .diagram-values { display:flex; flex-wrap:wrap; gap:4px 20px; margin:12px 0; font-size:.8125rem; }
 .diagram-values :global(.formula) { margin:0; padding:0; background:transparent; }
 @media(max-width:40rem) { text { font-size:20px; } .segment-label { font-size:18px; } }
</style>
