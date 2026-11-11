import {test} from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {solveAcceleratedMotion} from '../src/lib/physics/mechanics/accelerated-motion.ts';
import {kinematicsEquations} from '../src/lib/calculators/kinematics-equations.ts';
import {kinematicsChartData} from '../src/lib/visualization/kinematics.ts';
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-12*Math.max(1,Math.abs(b)),`${a} != ${b}`);

for(const [target,input,expected,formula] of [
 ['s',{a:3,t:4},24,String.raw`s=\frac12a\cdot t^2=`],
 ['a',{s:24,t:4},3,String.raw`a=\frac{2s}{t^2}=`],
 ['t',{s:24,a:3},4,String.raw`t=\sqrt{\frac{2s}{a}}=`]
])test(`rest assumptions solve ${target} and simplify the full working`,()=>{
 const result=solveAcceleratedMotion(input);assert.equal(result.status,'success');
 assert.equal(result.target,target);assert.deepEqual(result.assumed,['s0','v0']);
 const scenario=result.scenarios[0];close(scenario.values[target],expected);close(scenario.finalVelocity,12);
 assert.equal(scenario.motion.s0,0);assert.equal(scenario.motion.v0,0);
 const equations=kinematicsEquations('accelerated-motion',result,{}).scenarios[0];
 assert.ok(equations[0].expression.startsWith(formula),equations[0].expression);
 assert.ok(equations.every(eq=>!eq.expression.includes('s_0')&&!eq.expression.includes('v_0')));
 assert.ok(equations.find(eq=>eq.key==='v').expression.startsWith(String.raw`v_1=a\cdot t=`));
 for(const eq of equations)katex.renderToString(eq.expression,{throwOnError:true});
 const chart=kinematicsChartData(scenario);assert.equal(chart.positions[0],0);assert.equal(chart.velocities[0],0);close(chart.positions.at(-1),24);
});

test('rest assumptions preserve signed motion and distinguish degenerate cases',()=>{
 const left=solveAcceleratedMotion({s:-24,a:-3});assert.equal(left.status,'success');close(left.scenarios[0].duration,4);close(left.scenarios[0].finalVelocity,-12);
 assert.equal(solveAcceleratedMotion({s:24,a:-3}).status,'no-solution');
 assert.equal(solveAcceleratedMotion({s:0,a:0}).status,'underdetermined');
 assert.equal(solveAcceleratedMotion({s:1,a:0}).status,'no-solution');
 assert.equal(solveAcceleratedMotion({s:0,t:0}).status,'underdetermined');
 assert.equal(solveAcceleratedMotion({s:1,t:0}).status,'no-solution');
 const zero=solveAcceleratedMotion({a:3,t:0});assert.equal(zero.status,'success');assert.equal(zero.scenarios[0].values.s,0);
 for(const input of [{},{s:24},{a:3},{t:4},{a:NaN,t:4},{s:24,t:-1}])assert.notEqual(solveAcceleratedMotion(input).status,'success');
 assert.equal(solveAcceleratedMotion({s:24,a:Number.MIN_VALUE}).code,'numerical');
});

test('explicit inputs keep their existing targets and are never silently overwritten',()=>{
 const computed=solveAcceleratedMotion({s:24,a:3,t:4});assert.equal(computed.status,'success');assert.equal(computed.target,'v0');assert.deepEqual(computed.assumed,['s0']);
 const explicit=solveAcceleratedMotion({s0:0,v0:0,a:3,t:4});assert.equal(explicit.status,'success');assert.deepEqual(explicit.assumed,[]);
 const equations=kinematicsEquations('accelerated-motion',explicit,{}).scenarios[0];assert.ok(equations[0].expression.includes('s_0+v_0'));
 const single=solveAcceleratedMotion({v0:2,a:3,t:4});assert.equal(single.status,'success');assert.deepEqual(single.assumed,['s0']);close(single.scenarios[0].values.s,32);
 assert.equal(solveAcceleratedMotion({s0:1,a:3,t:4}).status,'incomplete');
});
