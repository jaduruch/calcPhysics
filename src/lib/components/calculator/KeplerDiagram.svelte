<script lang="ts">
 import type {ResourceResult} from '#lib/physics/resources/solver.ts';
 import {orbitGeometry,orbitProjection,defaultOrbitCamera,type OrbitPoint} from '#lib/visualization/kepler.ts';
 import {keplerUi as text} from '#lib/i18n/runtime.ts';
 import {DESMOS_ELLIPSE_URL} from '#lib/content/kepler.ts';
 import Formula from '../Formula.svelte';
 let {result,modelId,enteredE}:{result:ResourceResult|null;modelId:string;enteredE?:number}=$props();
 const id=$props.id();
 let view=$state<'section'|'orbit'|null>(null);
 const section=$derived((view??(modelId==='kepler-ellipse'?'section':'orbit'))==='section');
 let camera=$state({...defaultOrbitCamera});let phase=$state(.12);
 let drag:{id:number;x:number;y:number}|null=null;
 const e=$derived(modelId==='kepler-ellipse'?(result?.status==='success'?result.values.e:enteredE??.624):.624);
 const areaRatio:readonly[number,number]=$derived(modelId==='kepler-areas'&&result?.status==='success'?[result.values.A1,result.values.A2]:[1,1]);
 const geometry=$derived(orbitGeometry(e,phase,areaRatio));
 const project=$derived(orbitProjection(camera,section));
 const path=(points:readonly OrbitPoint[],close=false)=>points.map((p,i)=>{const q=project(p);return `${i?'L':'M'}${q.x},${q.y}`;}).join(' ')+(close?' Z':'');
 const point=$derived(project({...geometry.position,z:0}));
 const elevated=$derived(project(geometry.position));
 const focus=$derived(project({x:0,y:0,z:0}));
 const other=$derived(project(geometry.secondFocus));
 const schematic=$derived(modelId!=='kepler-ellipse'||result?.status!=='success');
 function rotate(dx:number,dy:number){camera={yaw:camera.yaw+dx,elevation:Math.max(-1.35,Math.min(1.35,camera.elevation+dy))};}
 function down(event:PointerEvent){if(!section||event.button!==0)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY};(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);}
 function move(event:PointerEvent){if(!drag||drag.id!==event.pointerId)return;rotate((event.clientX-drag.x)*.008,(event.clientY-drag.y)*.008);drag={id:event.pointerId,x:event.clientX,y:event.clientY};}
 function key(event:KeyboardEvent){if(event.key==='Home'){event.preventDefault();camera={...defaultOrbitCamera};}if(!section||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();rotate(event.key==='ArrowLeft'?-.12:event.key==='ArrowRight'?.12:0,event.key==='ArrowUp'?.12:event.key==='ArrowDown'?-.12:0);}
</script>
<figure class="kepler-diagram">
 <div class="calculator-modes" role="group" aria-label={text.view}>
  <button type="button" aria-pressed={section} onclick={()=>view='section'}>{text.section}</button>
  <button type="button" aria-pressed={!section} onclick={()=>view='orbit'}>{text.orbit}</button>
  <button type="button" onclick={()=>camera={...defaultOrbitCamera}}>{text.resetView}</button>
 </div>
 <!-- Same scoped keyboard interaction as the existing Bloch-sphere viewport. -->
 <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
 <div class="orbit-viewport" class:rotatable={section} role="application" tabindex="0" aria-label={text.viewport} aria-describedby={`${id}-help`} onpointerdown={down} onpointermove={move} onpointerup={()=>drag=null} onpointercancel={()=>drag=null} onlostpointercapture={()=>drag=null} onkeydown={key}>
  <svg viewBox="0 0 640 470" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
   <title id={`${id}-title`}>{section?text.section:text.orbit}</title>
   <desc id={`${id}-desc`}>{section?text.description3d:text.description2d} {schematic?text.schematic:text.calculated}</desc>
   {#if section}
    {#each geometry.cone as ring}<path d={path(ring)} class="cone"/>{/each}
    <path d={path(geometry.plane,true)} class="cut-plane"/>
   {/if}
   {#each [{x:2.2,y:0,z:0,label:'x'},{x:0,y:section?2.2:1.45,z:0,label:'y'},...(section?[{x:0,y:0,z:2.2,label:'z'}]:[])] as axis}
    {@const tip=project(axis)}{@const tail=project({x:-axis.x,y:-axis.y,z:-axis.z})}
    <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} class="axis"/>
    <text x={tip.x+9} y={tip.y-4}>{axis.label}</text>
   {/each}
   {#if modelId==='kepler-areas'}
    {#each geometry.sectors as sector,index}
     <path d={path(sector,true)} class="sector" class:second={index===1}/>
     {@const mid=sector[32]}{@const label=project({x:mid.x*.65,y:mid.y*.65,z:0})}
     <text x={label.x+6} y={label.y-6}>{index===0?'A₁':'A₂'}</text>
    {/each}
   {/if}
   <path d={path(geometry.orbit.map(p=>({...p,z:0})))} class="orbit-path"/>
   {#if section}
    <path d={path(geometry.orbit)} class="intersection"/>
    <line x1={point.x} y1={point.y} x2={elevated.x} y2={elevated.y} class="projection"/>
    <circle cx={elevated.x} cy={elevated.y} r="4" class="section-point"/>
   {/if}
   <line x1={focus.x} y1={focus.y} x2={point.x} y2={point.y} class="radius"/>
   <circle cx={focus.x} cy={focus.y} r="4" class="focus"/><text x={focus.x+9} y={focus.y+21}>F₁</text>
   {#if modelId==='kepler-ellipse'&&e>0}<circle cx={other.x} cy={other.y} r="3" class="other-focus"/><text x={other.x+9} y={other.y+21}>F₂</text>{/if}
   <circle cx={point.x} cy={point.y} r="5" class="body"/>
  </svg>
 </div>
 <label class="phase-control" for={`${id}-phase`}>{text.phase}<input id={`${id}-phase`} type="range" min="0" max="1" step="0.001" bind:value={phase}/></label>
 <p class="diagram-help" id={`${id}-help`}>{section?text.controls:text.phaseHelp}</p>
 {#if section}<div class="construction-equations"><Formula wrap expression={String.raw`x^2+y^2=z^2,\quad z=e x+p,\quad r=\frac{p}{1+e\cos\varphi}`}/></div>{/if}
 {#if modelId==='kepler-areas'}<p class="diagram-help">{text.areaHelp}</p>{/if}
 <figcaption>{schematic?text.schematic:text.calculated} {section?text.constructionNote:''} <a href={DESMOS_ELLIPSE_URL} target="_blank" rel="noopener noreferrer">{text.desmos}</a></figcaption>
</figure>
<style>
 figure { margin:24px 0 0; max-width:var(--calculator-width); }
 svg { display:block; width:100%; height:auto; }
 .orbit-viewport { max-width:640px; border-radius:var(--control-radius); background:var(--color-control); }
 .rotatable { cursor:grab; touch-action:none; }
 .orbit-viewport:focus-visible { outline:2px solid var(--color-accent); outline-offset:3px; }
 .cone { fill:none; stroke:var(--color-text-muted); stroke-width:.7; opacity:.45; }
 .cut-plane { fill:var(--color-accent); fill-opacity:.1; stroke:var(--color-accent); stroke-width:.8; }
 .axis { stroke:var(--color-text-muted); stroke-width:1; }
 .orbit-path { fill:none; stroke:var(--color-text); stroke-width:2; }
 .intersection { fill:none; stroke:var(--color-accent); stroke-width:2.5; }
 .projection { stroke:var(--color-text-muted); stroke-dasharray:4 4; }
 .radius { stroke:var(--color-accent); stroke-width:1.5; }
 .focus,.section-point { fill:var(--color-text); }
 .body { fill:var(--color-accent); }.other-focus { fill:var(--color-text-muted); }
 .sector { fill:var(--color-accent); fill-opacity:.18; stroke:var(--color-accent); stroke-width:1; }.sector.second { fill-opacity:.35; }
 text { fill:var(--color-text); font-size:15px; }
 .phase-control { display:flex; flex-wrap:wrap; align-items:center; gap:12px; font-size:.8125rem; margin-top:12px; }
 input[type=range] { flex:1; min-width:140px; accent-color:var(--color-accent); }
 .diagram-help,figcaption { color:var(--color-text-muted); font-size:.75rem; margin:8px 0 0; }
 @media(max-width:40rem) { text { font-size:24px; } }
 .construction-equations :global(.formula) { margin:8px 0; padding:0; background:transparent; }
</style>
