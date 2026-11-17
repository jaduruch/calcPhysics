import test from 'node:test';import assert from 'node:assert/strict';
import {combinedSpecs,combinedDefinition} from '../src/lib/content/combined-models.ts';
import {solveCombined} from '../src/lib/physics/resources/combined.ts';
import {models} from '../src/lib/content/topics.ts';
import {groupTopicModels,linkedModelIndex} from '../src/lib/content/model-groups.ts';
import {resourceFormula} from '../src/lib/calculators/resource-equations.ts';
import katex from 'katex';
import {formulaBookRule} from '../src/lib/calculators/formula-book-equations.ts';
const fixtures={
'book-work-force':{W:40,F:20,s:2,m:4,a:5},
'book-friction-work':{W:60,mu:.2,Fn:100,s:3,m:10,g:10},
'book-potential-energy':{E:60,m:2,g:10,h:3,Fg:20},
'book-kinetic-energy':{E:9,m:2,v:3,Fg:20,g:10},
'book-power-time':{W:40,P:20,t:2,F:10,v:2,s:4},
'solid-volume-expansion':{dV:.6,V0:10,alpha:.001,dT:20,z:10.6,beta:.003},
'liquid-volume-expansion':{dV:.6,V0:10,beta:.003,dT:20,z:10.6,rho1:1060,rho2:1000},
'book-conduction-rate':{P:48,k:2,A:3,dT:4,l:.5,Q:96,t:2,U:4},
'book-overall-heat':{Q:60,U:2.5,A:3,dT:4,t:2,h1:10,h2:20,k:2,l:.5},
'book-free-fall-height':{h:20,g:10,t:2,v:20},
'book-speed-components':{v:5,vx:3,vy:4,alpha:Math.atan2(4,3)},
'book-pulley-force':{F:100,Fg:400,n:4,s:8,h:2},
'book-angular-frequency':{N:10,omega:4*Math.PI,f:2,T:.5,t:5},
'book-angular-motion':{phi:12,omega:3,t:4,s:24,r:2,v:6},
'book-tangential-period':{v:6,r:2,T:2*Math.PI/3,f:3/(2*Math.PI)},
'book-angular-velocity':{w0:1,w1:5,alpha:2,t:2,phi:6},
'book-angular-acceleration-rest':{omega:4,alpha:2,t:2,phi:4,N:2/Math.PI},
'hydrostatic-pressure':{p:20000,rho:1000,h:2,g:10,m:6000,A:3},
'book-surface-energy':{E:.14,gamma:.07,A:2,F:.21,l:3},
'volume-flow':{V:24,A:2,v:3,t:4,A2:3,v2:2,q:6},
'linear-expansion':{dl:.2,l0:10,alpha:.001,dT:20,z:10.2},
'area-expansion':{dA:.4,A0:10,alpha:.001,dT:20,z:10.4},
'heat-capacity':{C:8,m:2,c:4,Q:24,dT:3},
 'thermal-mixing':{Tm:320,T1:300,T2:360,c1:4,c2:4,m1:2,m2:1},
'fuel-energy':{Q:1000,rho:2,V:5,m:10,H:100},
'book-thin-lens':{f:2,g:3,b:6,mag:-2,B:-8,G:4},
'book-real-image-ratio':{f:2,g:3,b:6,ratio:2,B:8,G:4},
'book-image-extension':{ext:4,b:6,f:2,mag:2,V:9},
'string-speed':{v:100,F:100,rho:1,A:.01,f:25,L:2},
'book-luminous-flux':{Phi:6,I:2,Omega:3,Q:30,t:5,A:12,r:2},
'book-luminance-area':{L:5,I:10,A:2,E:15,Omega:3},
'book-fiber-ratio':{a:.1,P1:100,P2:10,L:-10}
};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${a} ≠ ${b}`);
for(const spec of combinedSpecs)test(`${spec.title}: coherent fields, every inverse and all known-value subsets`,()=>{
 const definition=combinedDefinition(spec.members[0]),known=fixtures[definition.id];assert.ok(known,definition.id);
 assert.deepEqual(new Set(definition.fields.map(f=>f.id)),new Set(Object.keys(known)));
 const run=input=>solveCombined(definition.relations,input);
 for(const missing of Object.keys(known)){
  const input={...known};delete input[missing];const branches=run(input);
  assert.ok(branches.some(r=>r.values[missing]!==undefined&&Math.abs(r.values[missing]-known[missing])<1e-8*Math.max(1,Math.abs(known[missing]))),`${definition.id}: missing ${missing}: ${JSON.stringify(branches)}`);
 }
 const fields=Object.keys(known);
 for(let mask=0;mask<2**fields.length;mask++){
  const input=Object.fromEntries(fields.filter((_,i)=>mask&(1<<i)).map(k=>[k,known[k]]));
  const r=run(input).find(r=>!r.conflicts.length&&!r.impossible.length&&!r.numerical.length);
  assert.ok(r,`${definition.id} subset ${JSON.stringify(input)}`);
  for(const [key,value]of Object.entries(r.values))assert.ok(Number.isFinite(value),key);
 }
 for(const relation of definition.relations)for(const formula of Object.values(relation.formulas))katex.renderToString(resourceFormula(formula,definition.fields),{throwOnError:true});
});
test('fuel has exactly five inputs, partial results, consistency and dependency invalidation',()=>{
 const d=combinedDefinition('fuel-energy'),run=(input,invalid=[])=>solveCombined(d.relations,input,invalid,d.zeros)[0];
 close(run({Q:0}).values.m,0);close(run({Q:0}).values.V,0);assert.equal(run({Q:0}).values.H,undefined);
 close(run({m:0}).values.Q,0);close(run({V:0}).values.Q,0);
 assert.deepEqual(d.fields.map(f=>f.id),['Q','rho','V','m','H']);
 close(run({rho:2,V:5}).values.m,10);assert.equal(run({rho:2,V:5}).values.Q,undefined);
 close(run({Q:1000,m:10,rho:2}).values.H,100);close(run({Q:1000,m:10,rho:2}).values.V,5);
 const bad=run({Q:1000,m:10,H:200,rho:2,V:5});assert.ok(bad.conflicts.includes('Q'));assert.equal(bad.values.Q,undefined);
 const invalid=run({rho:2,V:5,H:100},['H']);close(invalid.values.m,10);assert.equal(invalid.values.Q,undefined);
});
test('all model selectors are genuine binary configurations; old links still open merged cards',()=>{
 for(const topic of new Set(models.map(m=>m.topicId)))for(const card of groupTopicModels(models.filter(m=>m.topicId===topic))){
  if(card.variants)assert.equal(card.variants.length,2,card.id);
  for(const source of card.integratedModels??[])assert.equal(linkedModelIndex(card,`#model-${source.id}`),0,source.id);
 }
 const fuel=groupTopicModels(models.filter(m=>m.topicId==='fuels-and-heating'));assert.equal(fuel.length,1);assert.ok(!fuel[0].variants);assert.equal(fuel[0].variables.length,5);
 assert.ok(models.filter(m=>m.id.startsWith('rigid-inertia')).length===9);
});

test('combined velocity components include both quadrant endpoints without roundoff arrows',()=>{
 const d=combinedDefinition('book-speed-components');
 const run=v=>solveCombined(d.relations,v,[],d.zeros)[0];
 const vertical=run({v:5,alpha:Math.PI/2});close(vertical.values.vx,0);close(vertical.values.vy,5);assert.equal(vertical.conflicts.length,0);
 const horizontal=run({v:5,alpha:0});close(horizontal.values.vy,0);close(horizontal.values.vx,5);
 const inverse=run({vx:0,vy:5});close(inverse.values.alpha,Math.PI/2);close(inverse.values.v,5);
 const zero=run({v:0});close(zero.values.vx,0);close(zero.values.vy,0);assert.equal(zero.values.alpha,undefined);
});

test('signed motion, descending potential and zero optical transmission preserve valid quantities',()=>{
 let d=combinedDefinition('book-angular-motion'),r=solveCombined(d.relations,{omega:-3,r:2,t:4})[0];close(r.values.v,-6);close(r.values.phi,-12);close(r.values.s,-24);
 d=combinedDefinition('book-potential-energy');r=solveCombined(d.relations,{m:2,g:10,h:-3})[0];close(r.values.E,-60);
 d=combinedDefinition('book-fiber-ratio');r=solveCombined(d.relations,{P1:100,P2:0})[0];close(r.values.a,0);assert.equal(r.values.L,undefined);assert.ok(r.impossible.includes('L'));close(r.values.P2,0);
});

test('joined optical inverses solve two coupled unknown distances without choosing a method',()=>{
 let d=combinedDefinition('book-thin-lens');let r=solveCombined(d.relations,{f:2,mag:-2})[0];close(r.values.g,3);close(r.values.b,6);
 r=solveCombined(d.relations,{f:-2,mag:.5})[0];close(r.values.g,2);close(r.values.b,-1);
 d=combinedDefinition('book-image-extension');r=solveCombined(d.relations,{b:6,V:9})[0];close(r.values.f,2);close(r.values.ext,4);
});

test('exact zero intervals retain determinate partial results without inventing parameters',()=>{
 const run=(id,input)=>{const d=combinedDefinition(id);return solveCombined(d.relations,input,[],d.zeros)[0];};
 let r=run('book-free-fall-height',{h:0});close(r.values.t,0);close(r.values.v,0);assert.equal(r.values.g,undefined);
 r=run('book-angular-velocity',{t:0,w0:3});close(r.values.w1,3);close(r.values.phi,0);assert.equal(r.values.alpha,undefined);
 r=run('book-angular-velocity',{alpha:0,w1:3,phi:6});close(r.values.w0,3);close(r.values.t,2);
 r=run('linear-expansion',{dT:0,l0:10});close(r.values.dl,0);close(r.values.z,10);assert.equal(r.values.alpha,undefined);
 r=run('heat-capacity',{Q:0});close(r.values.dT,0);assert.equal(r.values.C,undefined);
});

test('quadratic time branches and linear limits use the matching displayed inverse',()=>{
 const d=combinedDefinition('book-angular-velocity');
 const roots=solveCombined(d.relations,{w0:3,alpha:-1,phi:4},[],d.zeros);
 assert.equal(roots.length,2);assert.deepEqual(roots.map(r=>r.values.t).sort((a,b)=>a-b),[2,4]);
 for(const branch of roots){const step=branch.steps.find(s=>s.target==='t');const formula=formulaBookRule(step.source,step.sourceTarget,step.formula,step.local);assert.ok(!formula.includes('\\pm'));if(branch.values.t===4)assert.ok(formula.includes('-\\sqrt'));}
 const linear=solveCombined(d.relations,{alpha:0,w0:3,phi:6},[],d.zeros)[0];const s=linear.steps.find(s=>s.target==='t');assert.ok(!formulaBookRule(s.source,s.sourceTarget,s.formula,s.local).includes('[[alpha]]'));
});
