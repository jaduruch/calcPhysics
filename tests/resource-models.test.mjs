import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { resourcePhysics } from '../src/lib/physics/resources/models.ts';
import { solveResourceModel } from '../src/lib/physics/resources/solver.ts';
import { resourceDefinitions } from '../src/lib/content/resource-catalog.ts';
import { resourceModels } from '../src/lib/content/resource-models.ts';
import { resourceEquations,resourceDisplaySymbol,resourceQuantity } from '../src/lib/calculators/resource-equations.ts';
import { parseQuantityInUnit,changeQuantityUnit,formatMeasurement } from '../src/lib/calculators/quantities.ts';
import { toSI,fromSI } from '../src/lib/physics/units.ts';
import { gasEquations,gasUnits } from '../src/lib/calculators/ideal-gas.ts';
import { solveIdealGas } from '../src/lib/physics/thermodynamics/ideal-gas.ts';
import { topics,models } from '../src/lib/content/topics.ts';
const fixtures={
 'contact-pressure':[{p:200,F:100,A:.5},{}],
 'hydraulic-press':[{F1:10,A1:.01,F2:100,A2:.1},{p:1000}],
 'hydrostatic-pressure':[{p:981,rho:1000,h:.1,g:9.81},{}],
 'mass-density':[{m:2,rho:1000,V:.002},{}],
 'volume-flow':[{V:.6,A:.1,v:2,t:3},{}],
 'continuity':[{A1:.1,v1:2,A2:.2,v2:1},{}],
 'boyle-law':[{p1:100000,V1:.004,p2:400000,V2:.001},{}],
 'temperature-scales':[{T:293.15},{TC:293.15,TF:293.15}],
 'linear-expansion':[{dl:.002,l0:1,alpha:1e-5,dT:200},{final:1.002}],
 'area-expansion':[{dA:.004,A0:1,alpha:1e-5,dT:200},{final:1.004}],
 'solid-volume-expansion':[{dV:.006,V0:1,alpha:1e-5,dT:200},{final:1.006}],
 'liquid-volume-expansion':[{dV:.004,V0:1,beta:2e-5,dT:200},{final:1.004}],
 'expanded-density':[{rho2:1000/1.02,rho1:1000,beta:.001,dT:20},{}],
 'heat-capacity':[{C:200,m:2,c:100},{}],
 'sensible-heat':[{Q:40000,m:2,c:100,dT:200},{}],
 'thermal-mixing':[{m1:1,c1:2,T1:300,m2:1,c2:2,T2:400},{Tm:350}],
 'fuel-energy':[{Q:42e6,m:1,H:42e6},{}],
 'fuel-volume':[{Q:84e6,rho:1000,V:.002,H:42e6},{}],
 'thermal-resistance':[{T1:350,T2:300,Rth:2},{dT:50,P:25}],
 'mirror-focus':[{r:1,f:.5},{}],
 'lens-power':[{D:2,f:.5},{}],
 'optical-medium':[{n:1.5,v:299792458/1.5},{}],
 'parallel-plate':[{n:1.5,d:.03,i:Math.PI/3},{r:Math.asin(1/Math.sqrt(3)),s:.03*(Math.sqrt(3)/2-1/(2*Math.sqrt(2))),apparent:.02}],
 'prism-deviation':[{n:1.5,A:Math.PI/3,i:Math.PI/6},{r1:Math.asin(1/3),r2:Math.PI/3-Math.asin(1/3),e:Math.asin(Math.sqrt(6)/2-.25),delta:Math.asin(Math.sqrt(6)/2-.25)-Math.PI/6}],
 'wave-relation':[{v:340,f:1000,lambda:.34},{T:.001}],
 'string-speed':[{v:100,F:100,rho:1000,A:1e-5},{}],
 'string-fundamental':[{f:100,v:200,L:1},{}],
 'open-pipe':[{f:170,v:340,L:1},{}],
 'closed-pipe':[{f:85,v:340,L:1},{}],
 'acoustic-beats':[{f1:450,f2:550},{carrier:500,envelope:50,beat:100}],
 'sound-pressure-level':[{Lp:60,p:.02,p0:2e-5},{}],
 'sound-intensity':[{P:2,I:4,A:.5},{}]
};
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const success=(id,input)=>{const result=solveResourceModel(resourcePhysics[id],input);assert.equal(result.status,'success',`${id}: ${JSON.stringify(result)}`);return result;};
for(const [id,[reference,outputs]] of Object.entries(fixtures)) {
 test(`${id}: reference and every explicit inverse, no mutation, display equations`,()=>{
  const physics=resourcePhysics[id],definition=resourceDefinitions.find(item=>item.id===id);
  assert.ok(definition);const full=success(id,reference);
  for(const [key,value] of Object.entries(outputs))close(full.outputs[key],value);
  for(const target of physics.primary??[]) {
   const input={...reference};delete input[target];const snapshot={...input};
   const result=success(id,input);assert.equal(result.target,target);close(result.values[target],reference[target]);assert.deepEqual(input,snapshot);
   const display=resourceEquations(definition,result,{});
   assert.ok(display.equations.some(e=>e.id===target));
   for(const equation of display.equations)katex.renderToString(equation.expression,{throwOnError:true,trust:false});
  }
  const display=resourceEquations(definition,full,{});
  for(const equation of display.equations)katex.renderToString(equation.expression,{throwOnError:true,trust:false});
  for(const field of Object.keys(physics.domains)) for(const value of [NaN,Infinity,-Infinity])assert.equal(solveResourceModel(physics,{[field]:value}).status,'invalid');
  const invalidDomainValues={positive:[0,-1],nonnegative:[-1],nonzero:[0],real:[],incidence:[-1,Math.PI/2],acute:[0,Math.PI/2],index:[.5]};
  for(const [key,domain] of Object.entries(physics.domains))for(const value of invalidDomainValues[domain])assert.equal(solveResourceModel(physics,{[key]:value}).status,'invalid');
  assert.equal(solveResourceModel(physics,{}).status,'incomplete');
 });
}
test('inventory is complete, every formula renders and new pages have working cards',()=>{
 assert.equal(resourceDefinitions.length,32);assert.equal(Object.keys(fixtures).length,32);
 for(const model of resourceModels){assert.ok(models.some(item=>item.id===model.id));assert.ok(topics.find(topic=>topic.id===model.topicId)?.published);assert.ok(model.notes.length>=3);for(const formula of model.formulas)katex.renderToString(formula.expression,{throwOnError:true});}
 for(const definition of resourceDefinitions){assert.equal(new Set(definition.fields.map(f=>f.id)).size,definition.fields.length);for(const field of resourcePhysics[definition.id].primary??[])assert.ok(definition.rules[field]);}
 assert.equal(resourceDisplaySymbol('\\Delta T'),'Δ T');assert.equal(resourceDisplaySymbol('\\rho_1'),'ρ₁');
 assert.equal(resourceQuantity(.004,'area'),String.raw`0.00400\,\mathrm{m^{2}}`);
 assert.equal(resourceQuantity(.002,'volume'),String.raw`0.00200\,\mathrm{m^{3}}`);
 assert.equal(resourceQuantity(1,'mass'),String.raw`1.00\,\mathrm{kg}`);
 assert.deepEqual(formatMeasurement(.024,'m³'),{number:'0.0240',prefix:''});
 assert.deepEqual(formatMeasurement(.004,'m²'),{number:'0.00400',prefix:''});
});
test('zero, contradiction, signed heat, invalid final size and degenerate inverses',()=>{
 assert.equal(solveResourceModel(resourcePhysics['contact-pressure'],{p:0,F:0}).status,'underdetermined');
 assert.equal(solveResourceModel(resourcePhysics['contact-pressure'],{p:0,F:10}).status,'no-solution');
 assert.equal(solveResourceModel(resourcePhysics['contact-pressure'],{p:5,F:0,A:1}).status,'conflict');
 close(success('contact-pressure',{F:0,A:1}).values.p,0);
 assert.equal(success('continuity',{A1:1,v1:0,A2:2,v2:0}).target,null);
 assert.equal(solveResourceModel(resourcePhysics.continuity,{A1:1,v1:0,A2:2,v2:1}).status,'conflict');
 assert.equal(solveResourceModel(resourcePhysics.continuity,{v1:0,A2:2,v2:0}).status,'underdetermined');
 assert.equal(solveResourceModel(resourcePhysics['sensible-heat'],{Q:100,m:1,dT:-1}).status,'no-solution');
 close(success('sensible-heat',{m:1,c:100,dT:-10}).values.Q,-1000);
 assert.equal(solveResourceModel(resourcePhysics['linear-expansion'],{l0:1,alpha:1,dT:-2}).status,'no-solution');
 assert.equal(solveResourceModel(resourcePhysics['expanded-density'],{rho1:1000,beta:.1,dT:-20}).status,'no-solution');
 assert.equal(solveResourceModel(resourcePhysics['lens-power'],{D:0}).status,'invalid');
 close(success('mirror-focus',{r:-2}).values.f,-1);
 close(success('lens-power',{f:-.5}).values.D,-2);
 assert.equal(solveResourceModel(resourcePhysics['parallel-plate'],{n:1.5,d:1,i:Math.PI/2}).status,'invalid');
 const unchanged=success('parallel-plate',{n:1,d:1,i:.5});close(unchanged.outputs.s,0);close(unchanged.outputs.r,.5);
 const tir=success('prism-deviation',{n:1.5,A:Math.PI/3,i:0});assert.equal(tir.outputs.e,undefined);assert.equal(tir.outputs.delta,undefined);
 assert.equal(solveResourceModel(resourcePhysics['prism-deviation'],{n:1,A:.1,i:.5}).status,'no-solution');
 close(success('acoustic-beats',{f1:100,f2:100}).outputs.beat,0);
});
test('temperature offsets, intervals, absolute zero and existing ideal gas compatibility',()=>{
 close(parseQuantityInUnit('20','temperature','°C').value,293.15);
 close(parseQuantityInUnit('68','temperature','°F').value,293.15);
 close(parseQuantityInUnit('-273.15','temperature','°C').value,0);
 close(parseQuantityInUnit('-459.67','temperature','°F').value,0);
 assert.equal(parseQuantityInUnit('1k','temperature','°C').status,'invalid');
 close(parseQuantityInUnit('10','temperatureDifference','°C').value,10);
 close(Number(changeQuantityUnit('20','temperature','°C','K')),293.15);
 close(Number(changeQuantityUnit('68','temperature','°F','°C')),20);
 for(const kelvin of [0,273.15,293.15,1000])for(const unit of ['K','°C','°F'])close(toSI(fromSI(kelvin,'temperature',unit),'temperature',unit),kelvin);
 assert.equal(solveResourceModel(resourcePhysics['temperature-scales'],{T:-1}).status,'invalid');
 const values={n:1,V:.024,T:parseQuantityInUnit('20','temperature','°C').value};const gas=solveIdealGas(values);assert.equal(gas.status,'success');
 const equations=gasEquations(gas.field,gas.value,values,{...gasUnits,T:'°C'});assert.equal(equations.conversions.length,1);assert.ok(equations.conversions[0].includes('273.15'));katex.renderToString(equations.conversions[0],{throwOnError:true});
});
test('extremes are rejected or solved without nonfinite outputs; defaults stay explicit',()=>{
 assert.equal(solveResourceModel(resourcePhysics['fuel-energy'],{m:1e308,H:1e308}).status,'numerical');
 const mix=success('thermal-mixing',{m1:1e300,c1:1e300,T1:300,m2:1e300,c2:1e300,T2:400});close(mix.outputs.Tm,350);
 const hydro=success('hydrostatic-pressure',{rho:1000,h:1,g:undefined});assert.deepEqual(hydro.assumed,['g']);close(hydro.values.p,9810);
 const level=success('sound-pressure-level',{p:.02});close(level.values.Lp,60);assert.deepEqual(level.assumed,['p0']);
 assert.equal(solveResourceModel(resourcePhysics['contact-pressure'],{p:1e-300,A:1e-300}).status,'numerical');
 assert.equal(solveResourceModel(resourcePhysics['sound-pressure-level'],{Lp:-1e300}).status,'numerical');
 const silence=solveResourceModel(resourcePhysics['sound-pressure-level'],{p:0});assert.equal(silence.status,'invalid');
});
export {fixtures};
