import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveElectrical } from '../src/lib/physics/electricity.ts';
import { electricalDefinitions, electricalModels } from '../src/lib/content/electricity.ts';
import { electricalEquations } from '../src/lib/calculators/electrical-equations.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-12*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const solve=(id,given)=>{const r=solveElectrical(id,given);assert.equal(r.status,'success',JSON.stringify(r));return r;};
test('one voltage-divider card provides the theory for both circuit modes',()=>{
 assert.equal(electricalModels.filter(m=>m.id==='voltage-divider').length,1);
 assert.ok(!electricalModels.some(m=>m.id==='loaded-divider'));
 const card=electricalModels.find(m=>m.id==='voltage-divider');
 assert.ok(card.variables.some(v=>v.symbol==='RL'));
 for(const formula of card.formulas)katex.renderToString(formula.expression,{throwOnError:true});
});
test('unloaded divider solves forward, inverse source/resistors and current inputs',()=>{
 const reference={Uin:12,Uout:8,U1:4,R1:1000,R2:2000,I:.004,Rt:3000};
 for(const keys of [['Uin','R1','R2'],['Uout','R1','R2'],['Uin','Uout','R1'],['Uin','Uout','R2'],['I','R1','R2'],['Uin','U1','I']]){
  const given=Object.fromEntries(keys.map(k=>[k,reference[k]]));const copy=JSON.stringify(given);const r=solve('voltage-divider',given);
  for(const [key,value] of Object.entries(r.values))near(value,reference[key]);
  for(const key of keys)assert.ok(!(key in r.outputs));assert.equal(JSON.stringify(given),copy);
  const d=electricalDefinitions.find(d=>d.id==='voltage-divider');
  for(const eq of electricalEquations(d,r,{})){assert.ok(!/undefined|NaN/.test(eq));katex.renderToString(eq,{throwOnError:true});}
 }
});
test('loaded divider applies parallel loading and Kirchhoff currents with inverse load calculation',()=>{
 const reference={Uin:12,Uout:4,U1:8,R1:1000,R2:1000,RL:1000,I:.008,IR2:.004,IL:.004,Rp:500,Rt:1500};
 for(const keys of [['Uin','R1','R2','RL'],['Uout','R1','R2','RL'],['Uin','Uout','R1','R2'],['Uin','Uout','R1','RL'],['Uout','IR2','IL','R1'],['I','IR2','Uin','R1']]) {
  const given=Object.fromEntries(keys.map(k=>[k,reference[k]]));const r=solve('loaded-divider',given);
  for(const [key,value] of Object.entries(r.values))near(value,reference[key]);
  near(r.values.IR2+r.values.IL,r.values.I);
  const d=electricalDefinitions.find(d=>d.id==='loaded-divider');
  for(const eq of electricalEquations(d,r,{})){assert.ok(!/undefined|NaN/.test(eq));katex.renderToString(eq,{throwOnError:true});}
 }
 near(solve('loaded-divider',{Uin:12,R1:1000,R2:2000,RL:1e12}).values.Uout,8-5.3333333e-9);
 const skewed=solve('voltage-divider',{Uin:12,R1:1e-12,R2:1e12});near(skewed.values.Uout,12);assert.ok(skewed.values.U1>0);
});
test('zero, insufficient, invalid and contradictory divider inputs invalidate results',()=>{
 for(const id of ['voltage-divider','loaded-divider']) {
  const given={Uin:0,R1:1000,R2:1000,...(id==='loaded-divider'?{RL:1000}:{})};const zero=solve(id,given);
  near(zero.values.Uout,0);near(zero.values.I,0);
  assert.equal(solveElectrical(id,{}).status,'incomplete');
  for(const extra of [{R1:0},{R2:-1},{Uin:Infinity}])assert.equal(solveElectrical(id,{...given,...extra}).status,'invalid');
  assert.equal(solveElectrical(id,{...given,Uin:12,Uout:20}).status,'no-solution');
  assert.equal(solveElectrical(id,{...given,Uin:12,Uout:2,I:1}).status,'no-solution');
 }
 assert.equal(solveElectrical('loaded-divider',{RL:0}).status,'invalid');
 const partial=solve('voltage-divider',{Uin:12,Uout:4});near(partial.outputs.U1,8);assert.ok(partial.values.R1===undefined && partial.values.R2===undefined);
 near(solve('voltage-divider',{Uin:0,Uout:0}).outputs.U1,0);
});
