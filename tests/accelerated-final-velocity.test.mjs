import {test} from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {solveAcceleratedMotion,acceleratedFields} from '../src/lib/physics/mechanics/accelerated-motion.ts';
import {kinematicsEquations} from '../src/lib/calculators/kinematics-equations.ts';
import {kinematicsChartData} from '../src/lib/visualization/kinematics.ts';
import {kinematicModels} from '../src/lib/content/kinematics.ts';
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const fixture={s0:10,s:42,v0:2,a:3,t:4,v:14};
const success=input=>{const r=solveAcceleratedMotion(input);assert.equal(r.status,'success',JSON.stringify({input,r}));return r;};

for(let i=0;i<acceleratedFields.length;i++)for(let j=i+1;j<acceleratedFields.length;j++){
 const missing=[acceleratedFields[i],acceleratedFields[j]];
 test(`six-field solver with unknown ${missing.join(' and ')}`,()=>{
  const input={...fixture};for(const field of missing)delete input[field];
  const result=solveAcceleratedMotion(input);
  if(missing.includes('s0')&&missing.includes('s')){assert.equal(result.status,'underdetermined');return;}
  assert.equal(result.status,'success',JSON.stringify(result));
  assert.ok(result.scenarios.some(s=>Math.abs(s.values.t-4)<1e-10&&Math.abs(s.values.v0-2)<1e-10));
  assert.equal(result.assumed.length,0);
  for(const scenario of result.scenarios){
   const x=scenario.values;close(x.v,x.v0+x.a*x.t);close(x.s,x.s0+x.v0*x.t+0.5*x.a*x.t*x.t);assert.ok(x.t>=0);
   for(const field of Object.keys(input))assert.equal(x[field],input[field]);
   const chart=kinematicsChartData(scenario);assert.equal(chart.velocities.at(-1),x.v);assert.equal(chart.positions.at(-1),x.s);
  }
  const eq=kinematicsEquations('accelerated-motion',result,{});
  for(const item of eq.scenarios.flat())katex.renderToString(item.expression,{throwOnError:true,strict:'error'});
 });
}

test('all six pairs without initial conditions reproduce the page-49 rest formulas',()=>{
 const rest={s:24,v:12,a:3,t:4},keys=Object.keys(rest);
 for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++){
  const result=success({[keys[i]]:rest[keys[i]],[keys[j]]:rest[keys[j]]});
  assert.deepEqual(result.assumed,['s0','v0']);
  const x=result.scenarios[0].values;for(const key of keys)close(x[key],rest[key]);
  const steps=kinematicsEquations('accelerated-motion',result,{v:'km/h',t:'min'});
  assert.ok(steps.scenarios.flat().every(eq=>!eq.expression.includes('s_0')&&!eq.expression.includes('v_0')));
  for(const expression of [...steps.conversions,...steps.scenarios.flat().map(item=>item.expression)])katex.renderToString(expression,{throwOnError:true});
 }
});

test('final velocity works as input, output and a consistency constraint',()=>{
 const given=success({s0:10,v0:2,v:14,t:4});close(given.scenarios[0].values.a,3);close(given.scenarios[0].values.s,42);
 const inferred=success({s0:10,s:42,v:14,t:4});close(inferred.scenarios[0].values.v0,2);close(inferred.scenarios[0].values.a,3);
 const output=success({s0:10,s:42,v0:2,a:3,t:4});assert.equal(output.target,'v');close(output.scenarios[0].values.v,14);
 const complete=success(fixture);assert.equal(complete.target,null);assert.deepEqual(complete.scenarios[0].steps,[]);
 for(const input of [{...fixture,v:15},{...fixture,s:43},{s0:10,s:42,v0:2,v:14,t:5}])assert.equal(solveAcceleratedMotion(input).code,'conflict');
 assert.equal(solveAcceleratedMotion({v:Infinity,t:1}).code,'domain');
 const near=success({...fixture,v:14*(1+1e-12)});assert.equal(near.target,null);
});

test('energy square-root branches, reversal and nonnegative-time filtering',()=>{
 const two=success({s0:10,s:42,v:14,a:3});assert.equal(two.scenarios.length,2);close(two.scenarios[0].values.v0,2);close(two.scenarios[1].values.v0,-2);
 const braking=success({s0:0,s:15,v:10,a:-10});assert.equal(braking.scenarios.length,1);close(braking.scenarios[0].values.v0,20);close(braking.scenarios[0].duration,1);
 const left=success({v:-12,a:-3});close(left.scenarios[0].values.s,-24);close(left.scenarios[0].values.t,4);
 assert.equal(solveAcceleratedMotion({v:12,a:-3}).status,'no-solution');
 assert.equal(solveAcceleratedMotion({s0:0,s:10,v:1,a:1}).status,'no-solution');
});

test('zero denominators, zero time and equal/opposite velocity cases stay distinct',()=>{
 const stationary=success({s0:2,v0:0,a:0,t:4});close(stationary.scenarios[0].values.s,2);close(stationary.scenarios[0].values.v,0);
 const instant=success({s0:2,v0:3,a:4,t:0});close(instant.scenarios[0].values.v,3);close(instant.scenarios[0].values.s,2);
 assert.equal(solveAcceleratedMotion({s0:0,s:0,v0:2,v:-2}).status,'underdetermined');
 assert.equal(solveAcceleratedMotion({s0:0,s:1,v0:2,v:-2}).status,'no-solution');
 assert.equal(solveAcceleratedMotion({s0:0,s:0,v0:2,v:3,t:0}).code,'conflict');
 assert.equal(solveAcceleratedMotion({v:0,a:0}).status,'underdetermined');
 assert.equal(solveAcceleratedMotion({v:1,t:0}).status,'no-solution');
 assert.equal(solveAcceleratedMotion({s0:0,v0:1,v:1,a:0}).status,'underdetermined');
});

test('all page-49 formula families are present and render',()=>{
 const model=kinematicModels.find(model=>model.id==='accelerated-motion');
 assert.ok(model.variables.some(field=>field.symbol==='v₁'));
 for(const formula of model.formulas)katex.renderToString(formula.expression,{throwOnError:true});
 for(const label of ['Without initial velocity: displacement','Without initial velocity: final velocity','Without initial velocity: time','Without initial velocity: acceleration','With initial velocity: displacement','With initial velocity: final velocity','Initial velocity','With initial velocity: time','Quadratic time equation','With initial velocity: acceleration'])assert.ok(model.formulas.some(formula=>formula.label===label));
});

test('calculated end velocity is displayed in the chosen unit without a fictitious input conversion',()=>{
 const computed=kinematicsEquations('accelerated-motion',success({a:3,t:4}),{v:'km/h'});
 assert.equal(computed.conversions.length,0);
 const velocity=computed.scenarios[0].find(item=>item.key==='v').expression;
 assert.ok(velocity.endsWith(String.raw`43.2\,\mathrm{km/h}`));
 const given=kinematicsEquations('accelerated-motion',success({v:12,a:3}),{v:'km/h'});
 assert.equal(given.conversions.length,1);
 assert.ok(given.conversions[0].startsWith('v_1='));
 assert.ok(!given.scenarios[0].some(item=>item.key==='v'));
});
