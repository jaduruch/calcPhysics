<script lang="ts">
  import { onMount } from 'svelte';
  import {bodyOutline, crossesBodyViewEdge, pinchBodyView, type PinchView} from '#lib/visualization/body-forces-view.ts';
  import { text } from '#lib/i18n/runtime.ts';
  import { initialBody, rotate, stepBody, intersectingResultant, constrainForcePair, type Vector, type AppliedForce } from '#lib/physics/mechanics/body-forces.ts';
  let svg: SVGSVGElement;
  let zoom = $state(1);
  let viewX = $state(0);
  let viewY = $state(0);
  let panning = $state(false);
  let panStart = {x:0,y:0,viewX:0,viewY:0,scale:1};
  const touches = new Map<number, {x:number;y:number}>();
  let pinch: PinchView | null = null;
  let dragPointer: number | null = null;
  function resetView() { zoom=1;viewX=0;viewY=0; }
  function touchPair() {
    const [a,b]=[...touches.values()];
    return {midpoint:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},distance:Math.hypot(b.x-a.x,b.y-a.y)};
  }
  function registerTouch(e: PointerEvent) {
    if(e.pointerType!=='touch')return false;
    touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    svg.setPointerCapture(e.pointerId);
    if(touches.size<2)return false;
    dragging=null;dragPointer=null;panning=true;
    const pair=touchPair();
    const anchor=position({clientX:pair.midpoint.x,clientY:pair.midpoint.y});
    pinch={view:{x:viewX,y:viewY,zoom},anchor,midpoint:pair.midpoint,distance:Math.max(1,pair.distance),screenToView:svg.getScreenCTM()!.inverse().a};
    return true;
  }
  function changeZoom(factor: number, anchor?: Vector) {
    const next=Math.max(0.4,Math.min(5,zoom*factor));
    const point=anchor??{x:viewX+330/zoom,y:viewY+230/zoom};
    const ratio=zoom/next;
    viewX=point.x-(point.x-viewX)*ratio;
    viewY=point.y-(point.y-viewY)*ratio;
    zoom=next;
  }
  function startPan(e: PointerEvent) {
    if(e.button!==0)return;
    if(registerTouch(e))return;
    if(dragging)return;
    panning=true;dragPointer=e.pointerId;
    panStart={x:e.clientX,y:e.clientY,viewX,viewY,scale:svg.getScreenCTM()!.inverse().a};
    svg.setPointerCapture(e.pointerId);
  }
  function movePointer(e: PointerEvent) {
    if(touches.has(e.pointerId))touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&touches.size>=2){
      const pair=touchPair(),next=pinchBodyView(pinch,pair.midpoint,pair.distance);
      viewX=next.x;viewY=next.y;zoom=next.zoom;return;
    }
    if(e.pointerId!==dragPointer)return;
    if(panning){viewX=panStart.viewX-(e.clientX-panStart.x)*panStart.scale;viewY=panStart.viewY-(e.clientY-panStart.y)*panStart.scale;}
    else update(e);
  }
  function endPointer(e: PointerEvent) {
    // Capture can move between SVG descendants without ending the gesture.
    if(e.type==='lostpointercapture'&&svg.hasPointerCapture(e.pointerId))return;
    const wasPinching=pinch!==null;
    const wasTouch=touches.delete(e.pointerId);
    if(e.pointerId!==dragPointer&&!wasTouch)return;
    dragging=null;dragPointer=null;panning=false;pinch=null;
    if(wasPinching&&touches.size===1){
      const [id,point]=[...touches.entries()][0];
      panning=true;dragPointer=id;
      panStart={x:point.x,y:point.y,viewX,viewY,scale:svg.getScreenCTM()!.inverse().a};
    }else if(touches.size>=2){
      const pair=touchPair();
      pinch={view:{x:viewX,y:viewY,zoom},anchor:position({clientX:pair.midpoint.x,clientY:pair.midpoint.y}),midpoint:pair.midpoint,distance:Math.max(1,pair.distance),screenToView:svg.getScreenCTM()!.inverse().a};
      panning=true;
    }
  }
  function viewKey(e: KeyboardEvent) {
    if(e.target!==svg)return;
    const step=30/zoom;
    if(e.key==='ArrowLeft')viewX-=step;
    else if(e.key==='ArrowRight')viewX+=step;
    else if(e.key==='ArrowUp')viewY-=step;
    else if(e.key==='ArrowDown')viewY+=step;
    else if(e.key==='+'||e.key==='=')changeZoom(1.25);
    else if(e.key==='-')changeZoom(0.8);
    else if(e.key==='Home')resetView();
    else return;
    e.preventDefault();
  }
  let body = $state(initialBody());
  let forces = $state<AppliedForce[]>([{ point: { x: -0.7, y: 0.25 }, force: { x: 0, y: 0.6 } }, { point: { x: 0.65, y: -0.2 }, force: { x: 0, y: -0.6 } }]);
  let selected = $state<number | null>(null);
  let dragging = $state<'point' | 'force' | null>(null);
  let dragOffset = {x:0,y:0};
  let equalMagnitude = $state(false);
  let parallel = $state(false);
  function setForce(index: number, next: Vector) {
    const pair = constrainForcePair([forces[0].force, forces[1].force], index as 0 | 1, next, equalMagnitude, parallel);
    forces = forces.map((f,i) => ({ ...f, force: pair[i] }));
  }
  function toggleConstraint(kind: 'equal' | 'parallel') {
    rewind();
    if (kind === 'equal') equalMagnitude = !equalMagnitude;
    else parallel = !parallel;
    const index = selected ?? 0;
    setForce(index, forces[index].force);
  }
  let running = $state(false);
  let reduced = $state(false);
  const points = bodyOutline;
  const center = $derived({x: 330 + body.x * 85, y: 230 - body.y * 85});
  const arrows = $derived(forces.map(f => { const r = rotate(f.point,body.angle); return {x:center.x+r.x*85,y:center.y-r.y*85,dx:f.force.x*85,dy:-f.force.y*85}; }));
  const resultant = $derived(intersectingResultant(forces,body.angle));
  const resultantArrow = $derived(resultant ? {
    x:center.x+resultant.point.x*85,y:center.y-resultant.point.y*85,
    dx:resultant.force.x*85,dy:-resultant.force.y*85
  } : null);
  function rewind() { running=false; body=initialBody(); }
  function position(e: {clientX:number;clientY:number}) {
    const p = new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
    return {x:p.x,y:p.y};
  }
  function insideBody(point: Vector) {
    const polygon=points.split(' ').map(p=>p.split(',').map(Number));
    const x=point.x*85,y=-point.y*85;
    let inside=false;
    for(let j=0,k=polygon.length-1;j<polygon.length;k=j++){
      const [ax,ay]=polygon[j], [bx,by]=polygon[k];
      if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
    }
    return inside;
  }
  function stopForEdit() {
    running=false;body={...body,vx:0,vy:0,omega:0};
  }
  function beginDrag(e: PointerEvent, i: number, kind: 'point' | 'force') {
    e.stopPropagation();
    if(e.button!==0 || registerTouch(e))return;
    stopForEdit();selected=i;dragging=kind;dragPointer=e.pointerId;panning=false;
    const p=position(e),a=arrows[i];
    dragOffset={x:p.x-a.x-(kind==='force'?a.dx:0),y:p.y-a.y-(kind==='force'?a.dy:0)};
    svg.setPointerCapture(e.pointerId);
  }
  function update(e: PointerEvent) {
    if (!dragging || selected===null) return;
    const p=position(e), a=arrows[selected];
    const x=p.x-dragOffset.x,y=p.y-dragOffset.y;
    if(dragging==='point') {
      const point=rotate({x:(x-center.x)/85,y:-(y-center.y)/85},-body.angle);
      if(insideBody(point))forces[selected].point=point;
    } else {
      const dx=(x-a.x)/85,dy=-(y-a.y)/85,scale=Math.max(1,Math.hypot(dx,dy)/1.8);
      setForce(selected,{x:dx/scale,y:dy/scale});
    }
  }
  function key(e: KeyboardEvent, i:number, kind: 'point' | 'force') {
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
    e.preventDefault();stopForEdit();selected=i;
    const delta={x:e.key==='ArrowRight'?0.05:e.key==='ArrowLeft'?-0.05:0,y:e.key==='ArrowUp'?0.05:e.key==='ArrowDown'?-0.05:0};
    const v=kind==='point'?forces[i].point:forces[i].force;
    const d=kind==='point'?rotate(delta,-body.angle):delta;
    const next={x:v.x+d.x,y:v.y+d.y};
    if(kind==='point') {if(insideBody(next))forces[i].point=next;}
    else if(Math.hypot(next.x,next.y)<=1.8)setForce(i,next);
  }
  function advance(dt:number) {
    let remaining=dt;
    const view={x:viewX,y:viewY,zoom};
    while(remaining>0){
      const h=Math.min(remaining,1/240),next=stepBody(body,forces,h);
      if(crossesBodyViewEdge(body,next,view)){
        let low=0,high=h;
        for(let i=0;i<32;i++){
          const mid=(low+high)/2;
          if(crossesBodyViewEdge(body,stepBody(body,forces,mid),view))high=mid;else low=mid;
        }
        body=stepBody(body,forces,low);running=false;return;
      }
      body=next;remaining-=h;
    }
  }

  onMount(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>{reduced=media.matches;if(reduced)running=false;};change();media.addEventListener('change',change);
    let frame=0,last=0;
    function loop(now:number){if(running){const hidden=svg.closest('details')?.open===false;if(hidden||document.hidden)running=false;else advance(Math.min((now-last)/1000,0.04));}last=now;frame=requestAnimationFrame(loop);}
    frame=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',change);};
  });
</script>
<div class="simulation">
  <p>{text('Drag either application point to move it on the body. Drag an arrow tip to change force direction and magnitude. Tab selects a point or arrow tip; arrow keys adjust it.')}</p>
  <div class="controls">
    <button aria-pressed={equalMagnitude} aria-label={text('Equal force magnitudes')} onclick={()=>toggleConstraint('equal')}>|F₁| = |F₂|</button>
    <button aria-pressed={parallel} aria-label={text('Parallel or antiparallel forces')} onclick={()=>toggleConstraint('parallel')}>F₁ ∥ F₂</button>
    <button onclick={()=>{if(reduced){advance(0.1);}else{running=!running;}}}>{reduced?text('Step'):running?text('Pause'):text('Play')}</button>
    <button onclick={rewind}>{text('Reset motion')}</button>
  </div>
  <p class="assumptions">{text('Active constraints remain in effect while editing either force. Parallel includes opposite directions. Switching off preserves the current arrows.')}</p>
  <p class="assumptions">{text('Scroll or pinch with two fingers to zoom; drag the background with one finger or the mouse to pan. Focus the diagram to use arrow keys, + / − and Home.')}</p>
  <div class="viewport">
  <div class="controls view-controls" role="group" aria-label={text('Diagram view')}>
    <button aria-label={text('Zoom in')} disabled={zoom>=5} onclick={()=>changeZoom(1.25)}>+</button>
    <button aria-label={text('Zoom out')} disabled={zoom<=0.4} onclick={()=>changeZoom(0.8)}>−</button>
    <button aria-label={text('Reset view')} title={text('Reset view')} onclick={resetView}>
      <svg class="view-reset-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V4m0 0L2 7m3-3 3 3M5 19h15m0 0-3-3m3 3-3 3M5 19l9-9m0 0h-4m4 0v4"/></svg>
    </button>
  </div>
  <!-- Custom interactive SVG viewport: focus enables documented pan/zoom keys; child handles retain their own keyboard controls. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <svg bind:this={svg} viewBox={`${viewX} ${viewY} ${660/zoom} ${460/zoom}`} class:panning role="application" tabindex="0" onkeydown={viewKey} aria-label={text('Rigid body with two forces, center of mass SP and dashed lines of action')} onwheel={(e)=>{e.preventDefault();changeZoom(Math.exp(-Math.max(-100,Math.min(100,e.deltaY))*0.003),position(e));}} onpointerdown={startPan} onpointermove={movePointer} onpointerup={endPointer} onpointercancel={endPointer} onlostpointercapture={endPointer}>
    <defs>
      <marker id="body-force-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent)"/></marker>
      <marker id="body-resultant-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-text-muted)"/></marker>
    </defs>
    <path d="M 315 230 h 30 M 330 215 v 30" class="origin"/>
    <g transform={`translate(${center.x} ${center.y}) rotate(${-body.angle*180/Math.PI})`}>
      <polygon {points} class="body"/>
      <path d="M -10 0 H 10 M 0 -10 V 10" class="reference"/>
    </g>
    <circle cx={center.x} cy={center.y} r="5" fill="currentColor"/><text x={center.x+10} y={center.y+18}>SP</text>
    {#each arrows as a,i}
      {@const length=Math.hypot(a.dx,a.dy)}
      <g class="applied-force">
        {#if length>0.001}<line x1={a.x-a.dx/length*900} y1={a.y-a.dy/length*900} x2={a.x+a.dx/length*900} y2={a.y+a.dy/length*900} class="action"/>
        <line x1={a.x} y1={a.y} x2={a.x+a.dx} y2={a.y+a.dy} class="force" marker-end="url(#body-force-arrow)"/>{/if}
        <circle cx={a.x} cy={a.y} r="5" fill="currentColor"/>
        <circle cx={a.x} cy={a.y} r="22" class="handle point-handle" role="button" tabindex="0" aria-label={`${text('Move application point')} F${i+1}`} onkeydown={(e)=>key(e,i,'point')} onpointerdown={(e)=>beginDrag(e,i,'point')}/>

        <text style="pointer-events:none" x={a.x+a.dx+12} y={a.y+a.dy-12}>F{i+1}</text>
        <circle cx={a.x+a.dx} cy={a.y+a.dy} r="22" class="handle" role="button" tabindex="0" aria-label={`${text('Adjust force')} F${i+1}`} onkeydown={(e)=>key(e,i,'force')} onpointerdown={(e)=>beginDrag(e,i,'force')}/>
      </g>
    {/each}
    {#if resultantArrow}
      {@const r = resultantArrow}
      <g class="resultant" aria-label={text('Net force at the intersection of the lines of action')}>
        <line x1={r.x} y1={r.y} x2={r.x+r.dx} y2={r.y+r.dy} marker-end="url(#body-resultant-arrow)"/>
        <text x={r.x+r.dx+12} y={r.y+r.dy-12}>{text('Fnet')}</text>
      </g>
    {/if}
  </svg>
  </div>
  <p class="assumptions">{text('The dashed net-force arrow starts at the intersection of the lines of action and uses the same force scale as F1 and F2. It is hidden for parallel forces. For nearly parallel forces, the intersection can lie outside the view.')}</p>
  <p class="assumptions">{text('Illustrative planar motion from rest: m = 1 kg, I about SP = 0.6 kg m². Fixed mass distribution; no gravity, friction or collisions. Application points move with the body; force directions stay fixed in space. Dashed lines show lines of action. Playback pauses when the body reaches the current view boundary. Reset motion preserves the forces.')}</p>
</div>
<style>
  .simulation{max-width:52rem}p{line-height:1.6}.controls{display:flex;flex-wrap:wrap;gap:8px}button{background:var(--color-control);color:var(--color-text);border:0;border-radius:8px;min-height:44px;padding:8px 14px;cursor:pointer}button[aria-pressed=true]{outline:2px solid currentColor;font-weight:700;box-shadow:inset 0 -3px currentColor} .viewport{position:relative;margin-top:16px}.view-controls{position:absolute;top:8px;left:8px;z-index:1;pointer-events:none;flex-direction:column}.view-controls button{pointer-events:auto;width:44px;height:44px;min-height:44px;padding:0;border-radius:50%;display:grid;place-items:center;font-size:1.25rem}.viewport > svg{aspect-ratio:660/460;cursor:grab;width:100%;display:block;overflow:hidden;touch-action:none;background:var(--color-surface);border-radius:8px;color:var(--color-text)}.viewport > svg.panning{cursor:grabbing}.view-reset-icon{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.body{fill:color-mix(in srgb,var(--color-surface) 84%,var(--color-text) 16%);stroke:none}.force{pointer-events:none;stroke:currentColor;stroke-width:2.5}.action{pointer-events:none;stroke:var(--color-text-muted);stroke-width:1;stroke-dasharray:7 6}.applied-force{color:var(--color-accent)}.applied-force text,.resultant text{fill:var(--color-text)}.resultant{pointer-events:none;color:var(--color-text-muted)}.resultant line{stroke:currentColor;stroke-width:2.5;stroke-dasharray:6 4}.reference{pointer-events:none;stroke:currentColor;stroke-width:2}.origin{stroke:var(--color-diagram-muted);stroke-width:2}.handle{fill:transparent;cursor:grab}.handle:focus{stroke:currentColor;stroke-dasharray:3 3;outline:none}.assumptions{font-size:.85rem;color:var(--color-text-muted)}
</style>
