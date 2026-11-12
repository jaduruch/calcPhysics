import test from 'node:test';
import assert from 'node:assert/strict';
import {resourceOpticsScene} from '../src/lib/visualization/resource-optics.ts';
import {resourcePhysics} from '../src/lib/physics/resources/models.ts';
import {solveResourceModel} from '../src/lib/physics/resources/solver.ts';
function scene(id,input){const r=solveResourceModel(resourcePhysics[id],input);assert.equal(r.status,'success');return resourceOpticsScene(id,r.values,r.outputs);}
test('plate ray directions remain parallel; zero index contrast has no displacement',()=>{
 const s=scene('parallel-plate',{n:1,d:.03,i:.7});const rays=s.lines.filter(l=>l.kind==='ray');
 const slope=l=>(l.x2-l.x1)/(l.y2-l.y1);
 assert.ok(Math.abs(slope(rays[0])-slope(rays[1]))<1e-12);
 assert.ok(Math.abs(slope(rays[0])-slope(rays[2]))<1e-12);
 const displacement=s.lines.filter(l=>l.kind==='dimension')[1];assert.ok(Math.hypot(displacement.x2-displacement.x1,displacement.y2-displacement.y1)<1e-12);
});
test('diverging lenses and convex mirrors show virtual focus extensions',()=>{
 for(const id of ['lens-power','mirror-focus'])for(const f of [-.1,.1]){
  const s=scene(id,{f});assert.equal(s.lines.some(l=>l.kind==='extension'),f<0);
 }
});
test('prism has no emergence label during total internal reflection',()=>{
 const input={n:1.5,A:Math.PI/3,i:0};const s=scene('prism-deviation',input);assert.equal(s.labels.some(l=>l.text==='e'),false);
 const t=scene('prism-deviation',{...input,i:Math.PI/4});assert.equal(t.labels.some(l=>l.text==='e'),true);
});
test('extreme valid plate and prism angles keep geometry finite',()=>{
 for(const id of ['parallel-plate','prism-deviation'])for(const i of [0,1e-12,Math.PI/2-1e-12]){
 const r=solveResourceModel(resourcePhysics[id],id==='parallel-plate'?{n:1,d:1,i}:{n:1.5,A:Math.PI/3,i});if(r.status!=='success')continue;
 const s=resourceOpticsScene(id,r.values,r.outputs);for(const l of s.lines)for(const k of ['x1','x2','y1','y2'])assert.ok(Number.isFinite(l[k]));
 }
});
