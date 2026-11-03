import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveResistorNetwork } from '../src/lib/physics/resistor-network.ts';
import { resistorNetworkDefinition } from '../src/lib/content/electricity.ts';
import { electricalEquations } from '../src/lib/calculators/electrical-equations.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<=Math.abs(b)*1e-12,`${a} != ${b}`);
test('three and more resistors use every populated quantity without rounding',()=>{
 const given={R1:100,R2:200,R3:300};
 const series=solveResistorNetwork(given);assert.equal(series.status,'success');near(series.outputs.R,600);
 const parallel=solveResistorNetwork(given,true);assert.equal(parallel.status,'success');near(parallel.outputs.R,600/11);
 assert.deepEqual(given,{R1:100,R2:200,R3:300});
 const many=Object.fromEntries(Array.from({length:100},(_,i)=>[`R${i+1}`,100]));
 near(solveResistorNetwork(many).outputs.R,10000);near(solveResistorNetwork(many,true).outputs.R,1);
 for(const [id,r] of [['resistance-series',series],['resistance-parallel',parallel]]) {
  const definition=resistorNetworkDefinition(id,4);const equations=electricalEquations(definition,r,{});
  assert.equal(equations.length,1);assert.ok(!equations[0].includes('undefined'));assert.ok(equations[0].includes('R_{3}'));
  katex.renderToString(equations[0],{throwOnError:true});
  if(id==='resistance-parallel')assert.ok(equations[0].includes(String.raw`\frac{1}{\frac{1}{`));
  assert.ok(!equations[0].includes('R_{4}'));
 }
});
test('missing interior fields and invalid values cannot silently disappear from the network',()=>{
 for(const given of [{},{R1:100},{R1:100,R3:300}])assert.equal(solveResistorNetwork(given).status,'incomplete');
 for(const given of [{R1:0,R2:100},{R1:-1,R2:100},{R1:Infinity,R2:100},{R1:NaN,R2:100},{R1:1,R2:2,unknown:3}])assert.equal(solveResistorNetwork(given).status,'invalid');
 assert.equal(solveResistorNetwork({R1:1e308,R2:1e308}).status,'out-of-range');
 const tiny=solveResistorNetwork({R1:1e-308,R2:1e-308},true);assert.equal(tiny.status,'success');near(tiny.outputs.R,5e-309);
});
