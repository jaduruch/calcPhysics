<script lang="ts">
 import {onMount} from 'svelte';
 import {quantityLatex} from '#lib/calculators/quantities.ts';
 import {orbitTimeInterval} from '#lib/physics/mechanics/kepler.ts';
 import {orbitPhaseFromTrueAngle} from '#lib/physics/mechanics/kepler-ellipse.ts';
 import RangeSlider from '../ui/RangeSlider.svelte';
 import type {ResourceResult} from '#lib/physics/resources/solver.ts';
 import {orbitGeometry,orbitProjection,defaultOrbitCamera,type OrbitPoint} from '#lib/visualization/kepler.ts';
 import {keplerUi as text} from '#lib/i18n/runtime.ts';
 import Formula from '../Formula.svelte';
 let {result,modelId,enteredE,pointPhase,pointAngle,focusedField=null}:{result:ResourceResult|null;modelId:string;enteredE?:number;pointPhase?:number;pointAngle?:number;focusedField?:string|null}=$props();
 const id=$props.id();
 let view=$state<'section'|'orbit'|null>(null);
 const section=$derived((view??(modelId==='kepler-ellipse'?'section':'orbit'))==='section');
 let camera=$state({...defaultOrbitCamera});let phase=$state(.12),interval=$state(.12),playing=$state(false),reducedMotion=$state(false);
 onMount(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)'),details=viewport.closest('details');
  const update=()=>{reducedMotion=media.matches;};
  const stopHidden=()=>{if(document.hidden||details&&!details.open)playing=false;};
  update();media.addEventListener('change',update);details?.addEventListener('toggle',stopHidden);document.addEventListener('visibilitychange',stopHidden);
  return ()=>{media.removeEventListener('change',update);details?.removeEventListener('toggle',stopHidden);document.removeEventListener('visibilitychange',stopHidden);};
 });
 let viewport:HTMLDivElement;
 let drag:{id:number;x:number;y:number}|null=null;
 const e=$derived(modelId==='kepler-ellipse'?(result?.status==='success'?result.values.e:enteredE??.533):.533);
 const areaRatio:readonly[number,number]=$derived(modelId==='kepler-areas'&&result?.status==='success'?[result.values.A1,result.values.A2]:[1,1]);
 const controlledPhase=$derived(pointPhase??(pointAngle===undefined?undefined:orbitPhaseFromTrueAngle(e,pointAngle)));
 const shape=$derived(orbitGeometry(e,0,areaRatio,0));
 const timeline=$derived(orbitTimeInterval(e,controlledPhase??phase,interval));
 const geometry=$derived({...shape,timeline,position:timeline.current});
 const project=$derived(orbitProjection(camera,section));
 const path=(points:readonly OrbitPoint[],close=false)=>points.map((p,i)=>{const q=project(p);return `${i?'L':'M'}${q.x},${q.y}`;}).join(' ')+(close?' Z':'');
 $effect(()=>{if((reducedMotion||controlledPhase!==undefined)&&playing)playing=false;});
 $effect(()=>{
  if(!playing||reducedMotion||controlledPhase!==undefined)return;
  let frame=0,last=performance.now();
  const tick=(now:number)=>{if(document.hidden||viewport?.closest('details:not([open])')!==null){playing=false;return;}const elapsed=(now-last)/1000;if(elapsed>=1/30){const dt=Math.min(.1,elapsed);last=now;phase=(phase+dt/12)%1;}frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(frame);
 });
 const startPoint=$derived(project({...geometry.timeline.start,z:0}));
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
<figure class="kepler-diagram" class:point-focus={focusedField!==null&&['X','Y','x','y','z','r','phi'].includes(focusedField)} class:geometry-focus={focusedField!==null&&!['X','Y','x','y','z','r','phi'].includes(focusedField)}>
 <div class="calculator-modes" role="group" aria-label={text.view}>
  <button type="button" aria-pressed={section} onclick={()=>view='section'}>{text.section}</button>
  <button type="button" aria-pressed={!section} onclick={()=>view='orbit'}>{text.orbit}</button>
  <button type="button" onclick={()=>camera={...defaultOrbitCamera}}>{text.resetView}</button>
 </div>
 <!-- Same scoped keyboard interaction as the existing Bloch-sphere viewport. -->
 <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
 <div bind:this={viewport} class="orbit-viewport" class:rotatable={section} role="application" tabindex="0" aria-label={text.viewport} aria-describedby={`${id}-help`} onpointerdown={down} onpointermove={move} onpointerup={()=>drag=null} onpointercancel={()=>drag=null} onlostpointercapture={()=>drag=null} onkeydown={key}>
  <svg viewBox="0 0 640 470" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
   <title id={`${id}-title`}>{section?text.section:text.orbit}</title>
   <desc id={`${id}-desc`}>{section?text.description3d:text.description2d} {schematic?text.schematic:text.calculated}</desc>
   {#if section}
    {#each geometry.cone as ring}<path d={path(ring)} class="cone"/>{/each}
    <path d={path(geometry.plane,true)} class="cut-plane"/>
   {/if}
   {#each [{x:2.2,y:0,z:0,label:'x'},{x:0,y:section?2.2:1.45,z:0,label:'y'},...(section?[{x:0,y:0,z:2.2,label:'z'}]:[])] as axis}
    {@const tip=project(axis)}{@const tail=project({x:-axis.x,y:-axis.y,z:-axis.z})}
    <g class:diagram-muted={focusedField!==null&&focusedField!==axis.label&&focusedField!==axis.label.toUpperCase()}>
    <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} class="axis"/>
    <text x={tip.x+9} y={tip.y-4}>{axis.label}</text>
    </g>
   {/each}
   {#if modelId==='kepler-ellipse'&&interval>0}
    <path d={path(geometry.timeline.sector,true)} class="time-sector"/>
   {/if}
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
   {#if modelId==='kepler-ellipse'&&interval>0}
    <g class:diagram-muted={focusedField!==null&&!['phi','r','x','y','X','Y','z'].includes(focusedField)}>
     <line x1={focus.x} y1={focus.y} x2={startPoint.x} y2={startPoint.y} class="radius start-radius"/>
     <circle cx={startPoint.x} cy={startPoint.y} r="4" class="start-point"/><text x={startPoint.x-24} y={startPoint.y-10}>P₀</text>
    </g>
   {/if}
   <line x1={focus.x} y1={focus.y} x2={point.x} y2={point.y} class="radius"/>
   <circle cx={focus.x} cy={focus.y} r="4" class="focus"/><text class="focus-label" x={focus.x+9} y={focus.y+21}>F₁</text>
   {#if modelId==='kepler-ellipse'&&e>0}<circle cx={other.x} cy={other.y} r="3" class="other-focus"/><text class="focus-label" x={other.x+9} y={other.y+21}>F₂</text>{/if}
   <circle cx={point.x} cy={point.y} r="5" class="body"/>{#if modelId==='kepler-ellipse'}<text class="point-label" x={point.x+10} y={point.y-10}>P₁</text>{/if}
  </svg>
 </div>
 {#if controlledPhase===undefined}
 <div class="phase-control phase-play-control animation-controls">
  <label for={`${id}-phase`}>{text.phase}</label>
  <RangeSlider id={`${id}-phase`} label={text.phase} value={phase} onvalue={value=>phase=value}/>
  {#if modelId==='kepler-ellipse'}<button class="orbit-play" type="button" aria-label={playing?text.pause:text.play} title={reducedMotion?text.reducedMotion:playing?text.pause:text.play} aria-pressed={playing} disabled={reducedMotion} onclick={()=>playing=!playing}>
   <svg aria-hidden="true" viewBox="0 0 24 24">{#if playing}<path d="M7 5h4v14H7zM14 5h4v14h-4z"/>{:else}<path d="M8 5v14l11-7z"/>{/if}</svg>
  </button>{/if}
 </div>
 {#if modelId==='kepler-ellipse'&&reducedMotion}<p class="diagram-help">{text.reducedMotion}</p>{/if}
 {:else}<p class="diagram-help">{text.pointFromInputs}</p>{/if}
 {#if modelId==='kepler-ellipse'}
 <label class="phase-control" for={`${id}-interval`}>{text.interval}<RangeSlider id={`${id}-interval`} label={text.interval} value={interval} onvalue={value=>interval=value}/></label>
 <div class="construction-equations timeline-readout" aria-live={playing?'off':'polite'}>
  <Formula wrap expression={`\\frac{t_0}{T}=${quantityLatex(geometry.timeline.startPhase,'',false)},\\quad\\frac{t_1}{T}=${quantityLatex(geometry.timeline.phase,'',false)},\\quad\\frac{\\Delta A}{A}=${quantityLatex(geometry.timeline.areaFraction,'',false)}`}/>
  <Formula wrap expression={`M_0=${quantityLatex(geometry.timeline.M0,'rad',false)},\\quad E_0=${quantityLatex(geometry.timeline.E0,'rad',false)},\\quad\\varphi_0=${quantityLatex(geometry.timeline.phi0*180/Math.PI,'°',false)}`}/>
  <Formula wrap expression={`M_1=${quantityLatex(geometry.timeline.M1,'rad',false)},\\quad E_1=${quantityLatex(geometry.timeline.E1,'rad',false)},\\quad\\varphi_1=${quantityLatex(geometry.timeline.phi1*180/Math.PI,'°',false)}`}/>
 </div>
 <p class="diagram-help">{text.timeHelp}</p>
 {/if}
 <p class="diagram-help" id={`${id}-help`}>{section?text.controls:text.phaseHelp}</p>
 {#if section}<div class="construction-equations"><Formula wrap expression={String.raw`x^2+y^2=z^2,\quad z=-\varepsilon x+p,\quad r=\frac{p}{1+\varepsilon\cos\varphi}`}/></div>{/if}
 {#if modelId==='kepler-areas'}<p class="diagram-help">{text.areaHelp}</p>{/if}
 <figcaption>{schematic?text.schematic:text.calculated} {section?text.constructionNote:''}</figcaption>
</figure>
<style>
 .orbit-play { display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; padding:0; background:var(--color-control); border:0; border-radius:var(--control-radius); }
 .orbit-play svg { width:18px; height:18px; fill:currentColor; }
 .time-sector { fill:var(--color-accent); fill-opacity:.14; stroke:var(--color-accent); stroke-width:.8; }
 .start-radius { stroke-dasharray:5 4; }
 .start-point { fill:var(--color-text); }
 .diagram-muted :global(circle) { fill:var(--color-diagram-muted); }
 .point-focus :global(.time-sector) { fill:var(--color-diagram-muted); stroke:var(--color-diagram-muted); }
 .geometry-focus :global(.start-point), .geometry-focus :global(.point-label) { fill:var(--color-diagram-muted); }

 .point-focus :global(.cone), .point-focus :global(.orbit-path), .point-focus :global(.intersection) { stroke:var(--color-diagram-muted); }
 .diagram-muted :global(line) { stroke:var(--color-diagram-muted); }
 .diagram-muted :global(text), .point-focus :global(.focus-label), .point-focus :global(.focus), .point-focus :global(.other-focus) { fill:var(--color-diagram-muted); }
 .point-focus :global(.cut-plane) { fill:var(--color-diagram-muted); }
 .geometry-focus :global(.radius), .geometry-focus :global(.projection) { stroke:var(--color-diagram-muted); }
 .geometry-focus :global(.body), .geometry-focus :global(.section-point) { fill:var(--color-diagram-muted); }

 figure { margin:24px 0 0; max-width:var(--calculator-width); }
 svg { display:block; width:100%; height:auto; }
 .orbit-viewport { -webkit-user-select:none; user-select:none; max-width:640px; border-radius:var(--control-radius); background:var(--color-control); }
 .rotatable { cursor:grab; touch-action:none; }
 .orbit-viewport:focus-visible { outline:2px solid var(--color-accent); outline-offset:3px; }
 .cone { fill:none; stroke:var(--color-text-muted); stroke-width:.7; opacity:.45; }
 .cut-plane { fill:var(--color-accent); fill-opacity:.1; stroke:none; }
 .axis { stroke:var(--color-text-muted); stroke-width:1; }
 .orbit-path { fill:none; stroke:var(--color-text); stroke-width:2; }
 .intersection { fill:none; stroke:var(--color-accent); stroke-width:2.5; }
 .projection { stroke:var(--color-text-muted); stroke-dasharray:4 4; }
 .radius { stroke:var(--color-accent); stroke-width:1.5; }
 .focus,.section-point { fill:var(--color-text); }
 .body { fill:var(--color-accent); }.other-focus { fill:var(--color-text-muted); }
 .sector { fill:var(--color-accent); fill-opacity:.18; stroke:var(--color-accent); stroke-width:1; }.sector.second { fill-opacity:.35; }
 text { fill:var(--color-text); font-size:15px; }
 .phase-control { display:flex; flex-wrap:wrap; align-items:center; gap:12px; font-size:.8125rem; margin-top:12px; max-width:640px; width:100%; }
 .phase-control :global(.range-control) { flex:1; min-width:140px; }
 .phase-play-control { display:grid; grid-template-columns:max-content minmax(0,1fr) auto; }
 .phase-play-control :global(.range-control) { min-width:0; }
 .diagram-help,figcaption { color:var(--color-text-muted); font-size:.75rem; margin:8px 0 0; }
 @media(max-width:40rem) { text { font-size:24px; } .phase-play-control { grid-template-columns:minmax(0,1fr) auto; gap:0 12px; } .phase-play-control label { grid-column:1; grid-row:1; } .phase-play-control .orbit-play { grid-column:2; grid-row:1; } .phase-play-control :global(.range-control) { grid-column:1 / -1; grid-row:2; } }
 .construction-equations :global(.formula) { margin:8px 0; padding:0; background:transparent; }
</style>
