import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { MU0, solveElectrical } from '../src/lib/physics/electricity.ts';
import { electricalDefinitions, electricalModels } from '../src/lib/content/electricity.ts';
import { electricalEquations } from '../src/lib/calculators/electrical-equations.ts';
import { parseQuantityInUnit } from '../src/lib/calculators/quantities.ts';
const definition = electricalDefinitions.find(model => model.id === 'inductor');
const reference = { L:.02, AL:2e-6, N:100, A:.001, l:.1, mu:2e-4/MU0, I:2, Phi:.0004, B:.4, W:.04, dI:.5, dPhi:.0001, dt:.01, Uind:-1, lm:.3, v:4, Umot:.48 };
const near = (a,b) => assert.ok(Math.abs(a-b) <= 1e-11 * Math.abs(b) || a === b, `${a} != ${b}`);
const solve = given => solveElectrical('inductor', given);
function verify(given, expected) {
  const copy = {...given};
  const result = solve(given);
  assert.equal(result.status, 'success', JSON.stringify({given,result}));
  for (const key of expected) near(result.outputs[key],reference[key]);
  assert.deepEqual(given,copy);
  for (const key of Object.keys(given)) assert.ok(!(key in result.outputs));
  for (const value of Object.values(result.values)) assert.ok(Number.isFinite(value));
  for (const equation of electricalEquations(definition,result,{})) {
    assert.ok(!/undefined|NaN|Infinity/.test(equation));
    katex.renderToString(equation,{throwOnError:true,strict:'error'});
  }
  return result;
}
test('one coil card replaces the three old cards and exposes all supported quantities', () => {
  assert.equal(electricalModels.filter(model=>['inductor','self-induction','motional-emf'].includes(model.id)).length,1);
  assert.deepEqual(new Set(definition.inputs.map(field=>field.id)),new Set(Object.keys(reference)));
  for (const formula of electricalModels.find(model=>model.id==='inductor').formulas) katex.renderToString(formula.expression,{throwOnError:true});
});
test('source relationships solve each uniquely determined forward and inverse target', () => {
  const groups = [['L','AL','N'],['AL','mu','A','l'],['Phi','B','A'],['Phi','L','I','N'],['dPhi','L','dI','N'],['Uind','L','dI','dt'],['Uind','N','dPhi','dt'],['Umot','B','lm','v']];
  for (const group of groups) for (const target of group) {
    const given = Object.fromEntries(group.filter(key=>key!==target).map(key=>[key,reference[key]]));
    verify(given,[target]);
  }
  verify({L:.02,I:2},['W']);
  verify({W:.04,I:2},['L']);
  verify({W:.04,L:.02,Phi:.0004},['I']);
  verify({W:.04,L:.02,B:.4},['I']);
});
test('coil propagation connects geometry, flux, energy and induction without conflating physical quantities', () => {
  verify({N:100,A:.001,l:.1,mu:reference.mu,I:2,dI:.5,dt:.01,lm:.3,v:4},['L','AL','Phi','B','W','dPhi','Uind','Umot']);
  const self = solve({L:.02,dI:.5,dt:.01});
  near(self.outputs.Uind,-1);
  assert.ok(!('I' in self.values));
  assert.ok(!('W' in self.values));
  const motion = solve({B:.4,lm:.3,v:4});
  near(motion.outputs.Umot,.48);
  assert.ok(!('l' in motion.values));
  assert.ok(!('Uind' in motion.values));
});
test('negative current and induced EMF signs are preserved; energy does not invent a current direction', () => {
  const result=solve({L:.02,I:-2,N:100,A:.001,dI:-.5,dt:.01});
  assert.equal(result.status,'success');near(result.outputs.Phi,-.0004);near(result.outputs.B,-.4);near(result.outputs.W,.04);near(result.outputs.Uind,1);
  assert.equal(solve({L:.02,W:.04}).status,'underdetermined');
  near(solve({L:.02,W:.04,Phi:-.0004}).outputs.I,-2);
  near(solve({B:-.4,lm:.3,v:4}).outputs.Umot,-.48);
  near(solve({B:.4,lm:.3,v:-4}).outputs.Umot,-.48);
});
test('zero, contradictions, missing and invalid quantities do not yield stale or fabricated results', () => {
  for(const given of [{},{L:.02}]) assert.equal(solve(given).status,'incomplete');
  const zero=solve({L:.02,I:0,N:100,A:.001,dI:0,dt:.01});
  assert.equal(zero.status,'success');for(const key of ['Phi','B','W','dPhi','Uind']) near(zero.outputs[key],0);
  near(solve({L:.02,W:0}).outputs.I,0);
  assert.equal(solve({Phi:0,B:0}).status,'underdetermined');
  for (const given of [{L:.02,N:100,AL:1e-6},{Uind:1,L:.02,dI:.5,dt:.01},{B:0,Phi:1},{I:0,W:1},{Phi:0,W:1},{I:-1,Phi:1},{dI:0,Uind:1},{Umot:1,B:0},{Umot:0,B:1,v:1}]) {
    assert.equal(solve(given).status,'no-solution',JSON.stringify(given));
  }
  for (const given of [{L:0},{N:-1},{dt:0},{W:-1},{L:Infinity},{I:NaN},{unknown:1}]) assert.equal(solve(given).status,'invalid');
  assert.equal(solve({AL:1,N:1e308}).status,'out-of-range');
  assert.equal(solve({L:.02,dI:.5}).status,'underdetermined');
});
test('SI conversion, prefixes and unrounded chaining feed the common equation renderer', () => {
  const given={L:parseQuantityInUnit('20m','inductance','H').value,dI:.5,dt:parseQuantityInUnit('166.66666666666667u','time','min').value};
  const result=solve(given);assert.equal(result.status,'success');near(result.outputs.Uind,-1);
  const equations=electricalEquations(definition,result,{});assert.ok(equations.some(eq=>eq.includes(String.raw`\Delta I`)));
  verify({L:.02,N:100,I:2},['Phi','AL','W']);
});
