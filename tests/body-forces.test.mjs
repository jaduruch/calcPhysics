import test from 'node:test';
import assert from 'node:assert/strict';
import {initialBody,bodyWrench,stepBody} from '../src/lib/physics/mechanics/body-forces.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('central force translates without rotation',()=>{
 const forces=[{point:{x:0,y:0},force:{x:1,y:0}}];
 let state=initialBody();for(let i=0;i<240;i++)state=stepBody(state,forces,1/240);
 near(state.x,0.5);near(state.vx,1);near(state.angle,0);near(state.y,0);
});
test('force couple rotates without translation; opposite torque and equilibrium',()=>{
 const forces=[{point:{x:-0.7,y:0},force:{x:0,y:1}},{point:{x:0.7,y:0},force:{x:0,y:-1}}];
 near(bodyWrench(forces,0).torque,-1.4);
 near(bodyWrench(forces,Math.PI/2).torque,0);
 let state=initialBody();for(let i=0;i<240;i++)state=stepBody(state,forces,1/240);
 near(state.x,0);near(state.y,0);assert.ok(state.angle<0);
 const equilibrium=[{point:{x:0,y:0},force:{x:1,y:0}},{point:{x:0,y:0},force:{x:-1,y:0}}];
 assert.deepEqual(stepBody(initialBody(),equilibrium,0.01),initialBody());
});
test('zero forces preserve inertial motion; invalid steps rejected',()=>{
 const s={...initialBody(),vx:2,omega:1};const next=stepBody(s,[],0.01);
 near(next.x,0.02);near(next.angle,0.01);
 for(const dt of [-1,Infinity,NaN,1])assert.throws(()=>stepBody(s,[],dt),RangeError);
});

test('force constraints follow either edited vector and compose', async()=>{
 const {constrainForcePair}=await import('../src/lib/physics/mechanics/body-forces.ts');
 const vectors=[{x:1,y:0},{x:0,y:-2}];
 const magnitude=v=>Math.hypot(v.x,v.y);
 const cross=(a,b)=>a.x*b.y-a.y*b.x;
 for(const index of [0,1])for(const equal of [false,true])for(const parallel of [false,true]){
   const next={x:0.4,y:0.7};
   const pair=constrainForcePair(vectors,index,next,equal,parallel);
   assert.deepEqual(pair[index],next);
   if(equal)near(magnitude(pair[0]),magnitude(pair[1]));
   else near(magnitude(pair[1-index]),magnitude(vectors[1-index]));
   if(parallel)near(cross(...pair),0);
   if(!equal&&!parallel)assert.deepEqual(pair[1-index],vectors[1-index]);
 }
 const opposite=[{x:0,y:1},{x:0,y:-2}];
 const pair=constrainForcePair(opposite,0,{x:0.4,y:0.7},true,true);
 assert.ok(pair[0].x*pair[1].x+pair[0].y*pair[1].y<0);
 for(const equal of [false,true]){
  const zero=constrainForcePair(opposite,0,{x:0,y:0},equal,true);
  assert.ok(zero.flatMap(v=>[v.x,v.y]).every(Number.isFinite));
  near(magnitude(zero[1]),equal?0:2);
 }
 const recovered=constrainForcePair([{x:0,y:0},{x:0,y:0}],1,{x:1,y:0},true,true);
 assert.deepEqual(recovered,[{x:1,y:0},{x:1,y:0}]);
 assert.throws(()=>constrainForcePair(vectors,0,{x:NaN,y:0},true,true),RangeError);
});

test('intersection resultant preserves force and torque throughout rotation', async()=>{
 const {intersectingResultant}=await import('../src/lib/physics/mechanics/body-forces.ts');
 const forces=[{point:{x:-1,y:0},force:{x:1,y:1}},{point:{x:1,y:0},force:{x:-2,y:1}}];
 for(const angle of [0,0.5,Math.PI]){
  const r=intersectingResultant(forces,angle);assert.ok(r);
  const wrench=bodyWrench(forces,angle);
  near(r.force.x,wrench.x);near(r.force.y,wrench.y);
  near(r.point.x*r.force.y-r.point.y*r.force.x,wrench.torque);
  for(const f of forces){
   const {rotate}=await import('../src/lib/physics/mechanics/body-forces.ts');
   const p=rotate(f.point,angle);
   near((r.point.x-p.x)*f.force.y-(r.point.y-p.y)*f.force.x,0);
  }
 }
 for(const force of [{x:2,y:2},{x:-1,y:-1},{x:0,y:0}]){
  assert.equal(intersectingResultant([forces[0],{...forces[1],force}],0),null);
 }
 assert.equal(intersectingResultant([],0),null);
});

test('body boundary follows zoom, panning and rotated outline', async()=>{
 const {crossesBodyViewEdge,bodyViewBounds}=await import('../src/lib/visualization/body-forces-view.ts');
 const start=initialBody(),end={...start,x:3};
 assert.equal(crossesBodyViewEdge(start,end,{x:0,y:0,zoom:1}),true);
 assert.equal(crossesBodyViewEdge(start,end,{x:-330,y:-230,zoom:0.5}),false);
 assert.equal(crossesBodyViewEdge(start,end,{x:200,y:0,zoom:1}),false);
 const bounds=bodyViewBounds({...start,angle:Math.PI/2});
 near(bounds.left,240);near(bounds.right,410);near(bounds.top,120);near(bounds.bottom,350);
 assert.equal(crossesBodyViewEdge(end,start,{x:0,y:0,zoom:1}),false);
});

test('touch pinch anchors zoom and combines it with panning at all zoom limits', async()=>{
 const {pinchBodyView}=await import('../src/lib/visualization/body-forces-view.ts');
 const start={view:{x:10,y:20,zoom:1},anchor:{x:110,y:220},midpoint:{x:200,y:400},distance:100,screenToView:0.5};
 const same=pinchBodyView(start,start.midpoint,100);
 assert.deepEqual(same,start.view);
 const pan=pinchBodyView(start,{x:240,y:380},100);
 near(pan.x,-10);near(pan.y,30);near(pan.zoom,1);
 for(const distance of [0,50,200,10000]){
  const moved={x:230,y:440},view=pinchBodyView(start,moved,distance);
  assert.ok(view.zoom>=0.4&&view.zoom<=5);
  // The original world anchor follows the moving finger midpoint on screen.
  near((start.anchor.x-view.x)*view.zoom,(start.anchor.x-start.view.x)*start.view.zoom+(moved.x-start.midpoint.x)*start.screenToView*start.view.zoom);
  near((start.anchor.y-view.y)*view.zoom,(start.anchor.y-start.view.y)*start.view.zoom+(moved.y-start.midpoint.y)*start.screenToView*start.view.zoom);
 }
 // Rebase after a finger lifts: a new gesture starts without a camera jump.
 const first=pinchBodyView(start,{x:250,y:450},150);
 const rebased={...start,view:first,midpoint:{x:250,y:450},distance:90};
 const resumed=pinchBodyView(rebased,rebased.midpoint,90);
 near(resumed.x,first.x);near(resumed.y,first.y);near(resumed.zoom,first.zoom);
});
