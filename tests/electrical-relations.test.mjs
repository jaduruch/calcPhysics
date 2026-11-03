import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveElectrical } from '../src/lib/physics/electricity.ts';
import { electricalDefinitions } from '../src/lib/content/electricity.ts';
import { electricalEquations } from '../src/lib/calculators/electrical-equations.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-12*Math.max(Math.abs(b),1),`${a} != ${b}`);
const ohm={U:12,I:.12,R:100,P:1.44};
test('one four-field Ohm calculator solves all six pairs, leaves sources intact and renders the chosen inverse',()=>{
 const keys=Object.keys(ohm); const d=electricalDefinitions.find(d=>d.id==='ohms-law');
 assert.deepEqual(d.inputs.map(f=>f.id),['U','I','R','P']);
 assert.ok(!electricalDefinitions.some(d=>['ohms-current','dc-power'].includes(d.id)));
 for(let a=0;a<4;a++)for(let b=a+1;b<4;b++) {
  const given={[keys[a]]:ohm[keys[a]],[keys[b]]:ohm[keys[b]]}; const copy=JSON.stringify(given);
  const r=solveElectrical('ohms-law',given);assert.equal(r.status,'success');
  assert.equal(Object.keys(r.outputs).length,2);
  for(const key of keys)near(r.values[key],ohm[key]);
  for(const key in given)assert.ok(!(key in r.outputs));
  assert.equal(JSON.stringify(given),copy);
  for(const eq of electricalEquations(d,r,{})){assert.ok(!eq.includes('undefined'));katex.renderToString(eq,{throwOnError:true});}
 }
});
test('Ohm handles zero, degenerate, impossible, invalid and excessive inputs without stale results',()=>{
 for(const pair of [{U:0,R:100},{I:0,R:100},{P:0,R:100}]) {
  const r=solveElectrical('ohms-law',pair);assert.equal(r.status,'success');near(r.values.U,0);near(r.values.I,0);near(r.values.P,0);
 }
 for(const pair of [{U:0,I:0},{P:0,I:0},{U:0,P:0}])assert.equal(solveElectrical('ohms-law',pair).status,'underdetermined');
 for(const pair of [{U:12,I:0},{U:0,I:1},{U:1,P:0},{I:1,P:0},{U:0,P:1},{I:0,P:1}])assert.equal(solveElectrical('ohms-law',pair).status,'no-solution');
 assert.equal(solveElectrical('ohms-law',{U:12}).status,'incomplete');
 assert.equal(solveElectrical('ohms-law',{U:12,I:.12,R:100}).status,'too-many-inputs');
 for(const pair of [{R:0,U:12},{P:-1,U:12},{U:Infinity,R:100},{U:NaN,R:1}])assert.equal(solveElectrical('ohms-law',pair).status,'invalid');
 assert.equal(solveElectrical('ohms-law',{U:1e308,R:1e-308}).status,'out-of-range');
});
const transformer={U1:100,U2:50,I1:2,I2:3.2,R1:50,R2:15.625,P1:200,P2:160,N1:200,N2:100,C1:1e-6,C2:4e-6,n:2,eta:.8};
test('transformer supports forward and inverse quantities on both sides, inferred efficiency and partial results',()=>{
 const cases=[['U1','U2'],['N1','N2'],['C1','C2'],['I1','I2','eta'],['R1','R2','eta'],['P1','P2'],['U1','I1','U2','I2'],['U2','R2','N1','N2','eta'],['U1','P1','n','eta'],['n','N2'],['n','N1'],['n','C2'],['n','C1']];
 const definition=electricalDefinitions.find(d=>d.id==='transformer');assert.equal(definition.inputs.length,14);
 for(const keys of cases) {
  const given=Object.fromEntries(keys.map(k=>[k,transformer[k]]));const r=solveElectrical('transformer',given);assert.equal(r.status,'success',JSON.stringify({keys,r}));
  for(const [key,value] of Object.entries(r.outputs)) {
   // Pairs which cannot establish losses explicitly assume ideal efficiency.
   if(!r.assumedIdeal || !['I1','I2','R1','R2','P1','P2'].includes(key))near(value,transformer[key]);
   assert.ok(!keys.includes(key));
  }
  if(keys.length===2 && keys.includes('U1') && keys.includes('U2')) {assert.deepEqual(Object.keys(r.outputs),['n']);assert.equal(r.assumedIdeal,true);}
  for(const eq of electricalEquations(definition,r,{})){assert.ok(!/undefined|NaN/.test(eq));katex.renderToString(eq,{throwOnError:true});}
 }
 const r=solveElectrical('transformer',{U1:100,U2:50,I1:2,I2:3.2});near(r.outputs.eta,.8);assert.equal(r.assumedIdeal,false);
});
test('transformer detects conflicts and invalid ranges and never invents absolute turns or loads',()=>{
 for(const given of [{U1:100,U2:50,n:3},{N1:200,N2:100,n:3},{P1:100,P2:200},{eta:1.1},{eta:0},{N1:0},{U1:Infinity}])assert.ok(['invalid','no-solution'].includes(solveElectrical('transformer',given).status),JSON.stringify(given));
 const r=solveElectrical('transformer',{N1:200,N2:100});assert.equal(r.status,'success');assert.deepEqual(r.outputs,{n:2});
 assert.equal(solveElectrical('transformer',{U1:100}).status,'incomplete');
 assert.equal(solveElectrical('transformer',{}).status,'incomplete');
 const zero=solveElectrical('transformer',{U1:0,n:2});assert.equal(zero.status,'success');near(zero.outputs.U2,0);
 assert.ok(!Object.values(zero.values).some(v=>!Number.isFinite(v)));
});
