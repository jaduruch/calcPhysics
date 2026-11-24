import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {formulaBookDefinitions} from '../src/lib/content/formula-book.ts';
import {formulaBookPhysics} from '../src/lib/physics/resources/formula-book.ts';
import {solveResourceModel} from '../src/lib/physics/resources/solver.ts';
import {resourceEquations,resourceFormula} from '../src/lib/calculators/resource-equations.ts';
import {topics,models} from '../src/lib/content/topics.ts';
import {formulaBookFixtures} from './formula-book-fixtures.mjs';
const near=(a,b)=>Math.abs(a-b)<=1e-12+1e-9*Math.max(Math.abs(a),Math.abs(b));
for(const d of formulaBookDefinitions){
 test(`${d.id}: independent reference, every inverse, equation rendering and domains`,()=>{
  const p=formulaBookPhysics[d.id],fixture=formulaBookFixtures[d.id];assert.ok(fixture);
  assert.equal(solveResourceModel(p,fixture).status,'success','reference consistency');
  assert.equal(solveResourceModel(p,{}).status,'incomplete');
  assert.deepEqual(Object.keys(p.inverse).sort(),d.fields.map(f=>f.id).sort());
  assert.deepEqual(Object.keys(d.rules).sort(),d.fields.map(f=>f.id).sort());
  for(const key of p.primary){
   const input={...fixture};delete input[key];const snapshot={...input};
   const r=solveResourceModel(p,input);assert.equal(r.status,'success',key+': '+JSON.stringify(r));
   const candidates=r.solutions??[r.values];
   assert.ok(candidates.some(values=>near(values[key],fixture[key])),key+': expected '+fixture[key]+', got '+JSON.stringify(candidates));
   assert.deepEqual(input,snapshot);
   for(const values of candidates){
    assert.equal(solveResourceModel(p,values).status,'success','inverse must satisfy the original relation');
    const display=resourceEquations(d,{...r,values},{});
    assert.equal(display.equations.length,1);
    assert.ok(!display.equations[0].expression.includes('undefined'));
    katex.renderToString(display.equations[0].expression,{throwOnError:true,trust:false});
   }
   for(const bad of [NaN,Infinity,-Infinity])assert.equal(solveResourceModel(p,{...fixture,[key]:bad}).status,'invalid');
  }
  for(const rule of Object.values(d.rules))katex.renderToString(resourceFormula(rule,d.fields),{throwOnError:true,trust:false});
  assert.ok(topics.some(topic=>topic.id===d.topic&&topic.published));
  assert.equal(models.some(model=>model.id===d.id), !['book-orthogonal-force', 'book-kinetic-friction', 'book-weight'].includes(d.id));
 });
}
test('formula-book fixture and implementation inventories agree',()=>{
 assert.deepEqual(Object.keys(formulaBookFixtures).sort(),formulaBookDefinitions.map(d=>d.id).sort());
 assert.deepEqual(Object.keys(formulaBookPhysics).sort(),formulaBookDefinitions.map(d=>d.id).sort());
 assert.equal(new Set(formulaBookDefinitions.map(d=>d.id)).size,formulaBookDefinitions.length);
});
test('both ascending and descending times and both range angles are retained',()=>{
 const vertical=solveResourceModel(formulaBookPhysics['book-vertical-position'],{y:10,y0:0,u:15,g:10});
 assert.equal(vertical.status,'success');assert.equal(vertical.solutions.length,2);assert.ok(near(vertical.solutions[0].t,1));assert.ok(near(vertical.solutions[1].t,2));
 const range=solveResourceModel(formulaBookPhysics['book-oblique-range'],{R:5*Math.sqrt(3),v0:10,g:10});
 assert.equal(range.status,'success');assert.equal(range.solutions.length,2);
 assert.ok(near(range.solutions[0].alpha,Math.PI/6));assert.ok(near(range.solutions[1].alpha,Math.PI/3));
});
test('singular inverse cases distinguish underdetermined, impossible and numerical',()=>{
 assert.equal(solveResourceModel(formulaBookPhysics['book-force'],{F:0,a:0}).status,'underdetermined');
 assert.equal(solveResourceModel(formulaBookPhysics['book-force'],{F:1,a:0}).status,'no-solution');
 assert.equal(solveResourceModel(formulaBookPhysics['book-bellows-factor'],{V:1,ext:0}).status,'underdetermined');
 assert.equal(solveResourceModel(formulaBookPhysics['book-snell'],{n1:1,i:0,r:0}).status,'underdetermined');
 assert.equal(solveResourceModel(formulaBookPhysics['book-bernoulli'],{p1:1,p2:1,rho:1000,v1:1,v2:1,h1:0,h2:0}).status,'underdetermined');
 assert.equal(solveResourceModel(formulaBookPhysics['book-critical-index'],{n1:1,n2:1.5}).status,'no-solution');
 assert.equal(solveResourceModel(formulaBookPhysics['book-thin-lens'],{f:.1,g:.1}).status,'no-solution');
 assert.equal(solveResourceModel(formulaBookPhysics['book-fiber-dbm'],{L:-1e6}).status,'numerical');
 assert.equal(solveResourceModel(formulaBookPhysics['book-force'],{m:2,F:0,a:0}).status,'success');
});

test('declared domains reject invalid finite values',()=>{
 const invalid={positive:[0,-1],nonnegative:[-1],nonzero:[0],real:[],incidence:[-1,Math.PI/2],acute:[0,Math.PI/2],index:[.5],quadrant:[-1,Math.PI/2+.1],solidAngle:[-1,4*Math.PI+.1],unitInterval:[-1,2],positiveInteger:[0,1.5,Number.MAX_SAFE_INTEGER+1],atLeastOne:[0,.9],criticalAngle:[0,Math.PI/2]};
 for(const [id,p] of Object.entries(formulaBookPhysics))for(const [key,domain] of Object.entries(p.domains))for(const value of invalid[domain])assert.equal(solveResourceModel(p,{[key]:value}).status,'invalid',`${id}.${key}=${value}`);
});
test('virtual lens images and signed rotation roots retain their valid branches',()=>{
 const lens=solveResourceModel(formulaBookPhysics['book-thin-lens'],{f:-.1,g:.3});assert.equal(lens.status,'success');assert.ok(near(lens.values.b,-.075));
 const angular=solveResourceModel(formulaBookPhysics['book-angular-energy'],{w0:1,alpha:2,phi:12});assert.equal(angular.status,'success');assert.deepEqual(angular.solutions.map(v=>v.w1),[-7,7]);
 const sphere=solveResourceModel(formulaBookPhysics['book-solid-angle'],{A:100,r:1});assert.equal(sphere.status,'no-solution');
 const mix=solveResourceModel(formulaBookPhysics['book-equal-heat-mixing'],{Tm:300,T1:300,T2:300,m1:1});assert.equal(mix.status,'underdetermined');
});

test('display selects each branch and handles linear angular motion without a zero denominator',()=>{
 for(const [id,p] of Object.entries(formulaBookPhysics)){
  const d=formulaBookDefinitions.find(d=>d.id===id),input={...formulaBookFixtures[id]};
  for(const key of p.primary){const v={...input};delete v[key];const r=solveResourceModel(p,v);if(r.status!=='success')continue;
   for(const values of r.solutions??[r.values])for(const eq of resourceEquations(d,{...r,values},{}).equations)assert.equal(eq.expression.includes(String.raw`\pm`),false,`${id}.${key}`);
  }
 }
 const p=formulaBookPhysics['book-angular-displacement'],d=formulaBookDefinitions.find(d=>d.id==='book-angular-displacement');
 const r=solveResourceModel(p,{phi:6,w0:2,alpha:0});assert.equal(r.status,'success');assert.equal(r.values.t,3);
 const expr=resourceEquations(d,r,{}).equations[0].expression;assert.ok(expr.includes(String.raw`\frac{`));assert.ok(!expr.includes('sqrt'));katex.renderToString(expr,{throwOnError:true});
});

test('normal incidence is consistent, underflow is not reported as an exact zero',()=>{
 assert.equal(solveResourceModel(formulaBookPhysics['book-snell'],{n1:1,n2:1.5,i:0,r:0}).status,'success');
 assert.equal(solveResourceModel(formulaBookPhysics['book-speed-refraction'],{v1:3e8,v2:2e8,i:0,r:0}).status,'success');
 assert.equal(solveResourceModel(formulaBookPhysics['book-kinetic-energy'],{m:1,v:1e-200}).status,'numerical');
 assert.equal(solveResourceModel(formulaBookPhysics['book-force'],{F:0,m:1e-200,a:1e-200}).status,'numerical');
});
