import test from 'node:test';
import assert from 'node:assert/strict';
import {solveRigid,rigidRelations,rigidDomain} from '../src/lib/physics/mechanics/rigid-body.ts';
import {rigidGeometry} from '../src/lib/visualization/rigid-body.ts';
import {rigidModels,fieldsForRigid} from '../src/lib/content/rigid-body.ts';
import {resourceFormula} from '../src/lib/calculators/resource-equations.ts';
import katex from 'katex';
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(a),Math.abs(b)),`${a} ≠ ${b}`);
const first=(mode,v,shape='general',bad=[])=>solveRigid(mode,v,shape,bad)[0];
test('energy chains retain independent partial results and every signed root',()=>{
 const r=first('energy',{I:2,w:3});close(r.values.Er,9);assert.equal(r.values.E,undefined);
 const branches=solveRigid('energy',{Er:9,I:2,Et:8,m:4});assert.equal(branches.length,4);
 assert.deepEqual([...new Set(branches.map(r=>r.values.w))],[-3,3]);
 for(const b of branches){close(b.values.E,17);close(Math.abs(b.values.v),2);}
 close(first('energy',{E:17,Et:8,w:3}).values.I,2);
 close(first('energy',{E:17,Er:9,v:2}).values.m,4);
});
test('conflicts and invalidation remove dependent energies while preserving translation',()=>{
 let r=first('energy',{Er:10,I:2,w:3,m:4,v:2});assert.ok(r.conflicts.includes('Er'));assert.equal(r.values.Er,undefined);close(r.values.Et,8);assert.equal(r.values.E,undefined);
 r=first('energy',{I:-2,w:3,m:4,v:2});close(r.values.Et,8);assert.equal(r.values.Er,undefined);
 r=first('energy',{I:2,w:3,m:4,v:2},'general',['w']);close(r.values.Et,8);assert.equal(r.values.Er,undefined);
 assert.ok(first('energy',{E:1,Et:2}).impossible.length);
});
test('zero energy and velocities resolve without inventing scale parameters',()=>{
 const r=first('energy',{E:0});close(r.values.Er,0);close(r.values.Et,0);close(r.values.w,0);close(r.values.v,0);assert.equal(r.values.I,undefined);assert.equal(r.values.m,undefined);
 assert.equal(first('energy',{Er:0,w:0}).values.I,undefined);
 assert.ok(first('energy',{Er:1,w:0}).impossible.length);
 close(first('energy',{w:0}).values.Er,0);
});
test('axial momentum and torque solve all inverses and signed components',()=>{
 for(const [input,key,expected] of [[{I:2,w:-3},'L',-6],[{L:-6,w:-3},'I',2],[{I:2,L:-6},'w',-3],[{I:2,alpha:-4},'M',-8],[{M:-8,alpha:-4},'I',2],[{M:-8,I:2},'alpha',-4]])close(first('momentum',input).values[key],expected);
 const r=first('momentum',{L:-6,w:-3,M:8});close(r.values.I,2);close(r.values.alpha,4);
 assert.equal(first('momentum',{L:0,w:0,M:8,alpha:4}).singular.length,0);
 close(first('momentum',{L:0}).values.w,0);assert.equal(first('momentum',{L:0,w:0}).values.I,undefined);
 const bad=first('momentum',{I:2,L:9,w:3,alpha:4});assert.ok(bad.conflicts.length);assert.equal(bad.values.M,undefined);
});
test('all homogeneous bodies and every explicit minimal inverse recover reference values',()=>{
 const shapeCases={ring:{m:6,R:2,I0:24},cylinder:{m:6,R:2,I0:12},tube:{m:6,R:2,r:1,I0:15},sphere:{m:5,R:2,I0:8},shell:{m:3,R:2,I0:8},cone:{m:10,R:2,I0:12},rod:{m:3,l:2,I0:1},cuboid:{m:12,a:3,b:4,I0:25}};
 for(const [shape,values]of Object.entries(shapeCases)){const input={...values,IA:values.I0+values.m*4,d:2};delete input.m;delete input.I0;const r=first('inertia',input,shape);close(r.values.m,values.m);close(r.values.I0,values.I0);}
 for(const [shape,values]of Object.entries(shapeCases))for(const key of Object.keys(values)){
  const input={...values};delete input[key];const r=first('inertia',input,shape);close(r.values[key],values[key]);assert.equal(r.conflicts.length,0);
 }
});
test('parallel-axis theorem covers all targets, zero displacement, invalid geometry and chains',()=>{
 const known={IA:10,I0:2,m:2,d:2};
 for(const key of Object.keys(known)){const input={...known};delete input[key];close(first('inertia',input).values[key],known[key]);}
 const rod=first('inertia',{m:3,l:2,d:1},'rod');close(rod.values.I0,1);close(rod.values.IA,4);
 const reverse=first('inertia',{IA:4,m:3,d:1},'rod');close(reverse.values.l,2);
 assert.ok(first('inertia',{IA:1,I0:2,m:2}).impossible.length);
 assert.ok(first('inertia',{m:3,R:1,r:2},'tube').impossible.length);
 close(first('inertia',{IA:2,I0:2}).values.d,0);
 close(first('inertia',{I0:2,d:0}).values.IA,2);
 const zero=first('inertia',{I0:2,m:3,d:0});close(zero.values.IA,2);
 assert.equal(first('inertia',{IA:2,I0:2,d:0}).values.m,undefined);
});
test('solver never returns nonfinite values and direct input domains reject invalid values',()=>{
 assert.equal(rigidDomain('I',0),false);assert.equal(rigidDomain('m',-1),false);assert.equal(rigidDomain('w',Infinity),false);
 const r=first('energy',{I:1e308,w:1e308});assert.ok(r.numerical.length);assert.equal(r.values.Er,undefined);
});
test('every theory and inverse calculation renders as valid KaTeX',()=>{
 for(const m of rigidModels)for(const f of m.formulas)katex.renderToString(f.expression,{throwOnError:true});
 for(const [mode,shape]of [['energy','general'],['momentum','general'],...['general','ring','cylinder','tube','sphere','shell','cone','rod','cuboid'].map(s=>['inertia',s])]){
  const fields=fieldsForRigid(mode,shape);for(const r of rigidRelations(mode,shape))for(const formula of Object.values(r.formulas))katex.renderToString(resourceFormula(formula,fields),{throwOnError:true});
 }
});
test('diagram scales real dimensions consistently and orientation changes no solver quantity',()=>{
 const v={R:2,r:1,d:3,I0:5};const a=rigidGeometry('tube',v,0),b=rigidGeometry('tube',v,90);close(a.radius/a.innerRadius,2);close(a.offset/a.radius,1.5);assert.deepEqual(v,{R:2,r:1,d:3,I0:5});assert.notEqual(a.marker.x,b.marker.x);
 assert.equal(rigidGeometry('ring',{},0).offset,undefined);assert.equal(rigidGeometry('general',{Er:0,Et:0},0).energyRatio,undefined);
});
