import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveObliqueModel as solve } from '../src/lib/physics/mechanics/oblique-throw.ts';
import { solveObliqueThrow } from '../src/lib/physics/mechanics/projectiles.ts';
import { obliqueEquations, obliqueConversions } from '../src/lib/calculators/oblique-throw.ts';
import { groupTopicModels, linkedModelIndex } from '../src/lib/content/model-groups.ts';
import { models } from '../src/lib/content/topics.ts';
import { formulaBookFixtures } from './formula-book-fixtures.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const branches=input=>{const result=solve(input);assert.equal(result.status,'success',JSON.stringify({input,result}));return result.branches;};

test('one projectile card integrates all 18 source definitions and keeps historical links',()=>{
 const card=groupTopicModels(models.filter(model=>model.topicId==='kinematics')).find(model=>model.id==='oblique-throw');
 assert.equal(card.variants,undefined);
 assert.equal(card.integratedModels.length,18);
 assert.equal(card.variables.length,17);
 for(const source of card.integratedModels)assert.equal(linkedModelIndex(card,`#model-${source.id}`),0);
});

test('every former scalar inverse is available through the combined input fields',()=>{
 for(const id of ['book-oblique-flight-time','book-oblique-range','book-oblique-apex-height','book-oblique-trajectory','book-oblique-vertical-velocity','book-oblique-apex-time']){
  const sample=Object.fromEntries(Object.entries(formulaBookFixtures[id]).map(([key,value])=>[key==='R'?'range':key==='h'?'rise':key==='t'&&id==='book-oblique-flight-time'?'flight':key==='t'&&id==='book-oblique-apex-time'?'peakTime':key,value]));
  for(const target of Object.keys(sample)){
   const input={...sample,y0:0};delete input[target];
   const answers=branches(input);
   assert.ok(answers.some(branch=>Math.abs(branch.values[target]-sample[target])<1e-8),`${id}: ${target}`);
  }
 }
});

test('forward flight matches the existing stable projectile model for upward, leftward, vertical and downward launches',()=>{
 for(const alpha of [0,Math.PI/6,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI,-Math.PI/2,-Math.PI/4]){
  const input={v0:20,alpha,y0:10,g:10};
  const actual=branches(input)[0],expected=solveObliqueThrow(input).scenarios[0];
  for(const key of ['vx','vy0','flight','range','vyImpact','speedImpact',...(alpha<0?[]:['peakTime','peakHeight'])])near(actual.values[key],expected.values[key]);
  if(alpha<0)for(const key of ['peakTime','peakHeight','rise'])assert.equal(actual.values[key],undefined);
  assert.ok(actual.scenario);near(actual.scenario.duration,expected.duration);
 }
 const zero=branches({v0:0,y0:5,g:10})[0];near(zero.values.flight,1);assert.equal(zero.values.alpha,undefined);
});

test('flight time, range and apex data reconstruct speed and angle without original launch inputs',()=>{
 for(const input of [{flight:2,range:20,g:10},{rise:5,range:20,g:10},{peakTime:1,range:20,g:10}]){
  const values=branches(input)[0].values;
  near(values.v0,Math.sqrt(200));near(values.alpha,Math.PI/4);near(values.vx,10);near(values.vy0,10);
 }
 const values=branches({vx:6,vy0:8,y0:10,g:10})[0].values;near(values.v0,10);near(values.alpha,Math.atan2(8,6));near(values.rise,3.2);
 for(const input of [{range:0,alpha:Math.PI/6,g:10,y0:0},{flight:0,alpha:Math.PI/6,g:10,y0:0},{rise:0,alpha:Math.PI/6,g:10}])near(branches(input)[0].values.v0,0);
});

test('both launch angles and both observation times are retained and additional data disambiguates them',()=>{
 const answers=branches({v0:10,range:5*Math.sqrt(3),g:10});
 assert.equal(answers.length,2);
 assert.ok(answers.some(branch=>Math.abs(branch.values.alpha-Math.PI/6)<1e-9));
 assert.ok(answers.some(branch=>Math.abs(branch.values.alpha-Math.PI/3)<1e-9));
 assert.equal(branches({v0:10,range:5*Math.sqrt(3),g:10,rise:1.25}).length,1);
 const times=branches({vx:10,vy0:10,y:3,g:10});assert.equal(times.length,2);
 for(const branch of times)near(branch.values.y,10*branch.values.t-5*branch.values.t**2);
 const left=branches({v0:10,range:-5*Math.sqrt(3),g:10});assert.equal(left.length,2);assert.ok(left.every(branch=>branch.values.vx<0));
});

test('observation point inverses handle two angles, unknown height and unknown gravity',()=>{
 const answers=branches({v0:10,x:5,y:1,g:10});assert.equal(answers.length,2);
 for(const branch of answers){const v=branch.values;near(v.x,v.vx*v.t);near(v.y,v.y0+v.vy0*v.t-v.g*v.t*v.t/2);}
 const height=branches({v0:10,alpha:Math.atan2(8,6),g:10,t:1,y:13})[0];near(height.values.y0,10);assert.ok(!height.assumed.includes('y0'));
 const gravity=branches({v0:10,alpha:Math.PI/6,range:5*Math.sqrt(3)})[0];near(gravity.values.g,10);assert.ok(!gravity.assumed.includes('g'));
});

test('partial results do not require all 17 fields and defaults are explicit',()=>{
 const partial=branches({vy0:10,g:10})[0];near(partial.values.flight,2);near(partial.values.rise,5);assert.equal(partial.values.vx,undefined);assert.equal(partial.scenario,undefined);
 const full=branches({v0:10,alpha:Math.PI/4})[0];assert.deepEqual(full.assumed,['y0','g']);
 assert.equal(solve({}).status,'incomplete');
});

test('overdetermined contradictions, impossible trajectories and invalid data never leave valid-looking stale results',()=>{
 for(const input of [{v0:10,alpha:Math.PI/4,vx:100},{vx:10,vy0:10,y0:0,g:10,t:3},{v0:1,range:100,g:10},{flight:0,y0:1,g:10}])assert.equal(solve(input).status,'no-solution',JSON.stringify(input));
 for(const input of [{v0:-1},{g:0},{y:-1},{alpha:Math.PI+.1},{vyImpact:1},{t:-1},{range:Infinity}])assert.equal(solve(input).status,'invalid');
 assert.equal(solve({v0:Number.MIN_VALUE,alpha:.1}).status,'numerical');
});

test('every derived step and unit conversion renders valid KaTeX, including multiple-angle quadrants',()=>{
 const inputs=[{v0:20,alpha:Math.PI/4,g:10,t:1},{v0:10,range:5*Math.sqrt(3),g:10},{v0:10,range:-5*Math.sqrt(3),g:10},{v0:10,x:5,y:1,g:10},{vx:10,vy0:10,y:3,g:10},{v0:10,vy0:5,g:10},{range:0,alpha:Math.PI/6,g:10}];
 for(const input of inputs)for(const branch of branches(input))for(const equation of obliqueEquations(branch,{alpha:'°'})){
  assert.ok(!equation.expression.includes('undefined')&&!equation.expression.includes('NaN'));
  assert.doesNotThrow(()=>katex.renderToString(equation.expression,{throwOnError:true,strict:'error'}));
 }
 for(const expression of obliqueConversions({alpha:Math.PI/4,v0:20},{alpha:'°',v0:'km/h'}))assert.doesNotThrow(()=>katex.renderToString(expression,{throwOnError:true}));
});

test('all 17 quantities can be recovered without replacing the other supplied values',()=>{
 const flight=(8+Math.sqrt(264))/10;
 const fixture={y0:10,v0:10,alpha:Math.atan2(8,6),vx:6,vy0:8,g:10,flight,range:6*flight,peakTime:.8,rise:3.2,peakHeight:13.2,t:.5,x:3,y:12.75,vy:3,vyImpact:-Math.sqrt(264),speedImpact:Math.sqrt(300)};
 for(const target of Object.keys(fixture)){
  const input={...fixture};delete input[target];
  const answer=branches(input);assert.ok(answer.some(branch=>Math.abs(branch.values[target]-fixture[target])<1e-8),target);
  for(const [key,value] of Object.entries(input))for(const branch of answer)assert.equal(branch.values[key],value,key);
 }
});

test('invalid UI fields cannot be replaced by defaults or recalculated as valid; independent partials survive',()=>{
 const result=solve({v0:10,alpha:Math.PI/4},{blocked:['g']});
 assert.equal(result.status,'success');
 for(const branch of result.branches){assert.equal(branch.values.g,undefined);assert.equal(branch.values.flight,undefined);near(branch.values.vx,10/Math.sqrt(2));assert.equal(branch.scenario,undefined);}
});

test('negative launch angles never calculate apex quantities, including stale or invalid old apex inputs',()=>{
 for(const alpha of [-Math.PI/6,-Math.PI/2,-Math.PI]){
  const result=branches({v0:10,alpha,y0:10,g:10,peakTime:-1,peakHeight:NaN,rise:100});
  for(const branch of result){
   for(const key of ['peakTime','peakHeight','rise']){assert.equal(branch.values[key],undefined);assert.ok(!branch.steps.some(step=>step.target===key));assert.equal(branch.scenario.values[key],undefined);}
   assert.ok(branch.values.flight>0);assert.ok(Number.isFinite(branch.values.speedImpact));
  }
 }
 const inferred=branches({vx:6,vy0:-8,y0:10,g:10})[0];assert.ok(inferred.values.alpha<0);assert.equal(inferred.values.peakTime,undefined);
 const up=branches({v0:10,vx:5,rise:3.75,g:10});assert.equal(up.length,1);assert.ok(up[0].values.alpha>0);
 const horizontal=branches({v0:10,alpha:0,y0:10,g:10})[0];near(horizontal.values.peakTime,0);near(horizontal.values.peakHeight,10);
});

test('projectile motion replaces vertical and horizontal cards without adding special-case controls',()=>{
 const cards=groupTopicModels(models.filter(model=>model.topicId==='kinematics'));
 assert.ok(!cards.some(card=>['vertical-throw','horizontal-throw'].includes(card.id)));
 const card=cards.find(card=>card.id==='oblique-throw');
 assert.equal(card.title,'Projectile Motion');assert.equal(card.variants,undefined);
 assert.equal(linkedModelIndex(card,'#model-vertical-throw'),0);assert.equal(linkedModelIndex(card,'#model-horizontal-throw'),0);
});
