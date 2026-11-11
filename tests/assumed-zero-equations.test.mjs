import {test} from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {solveAcceleratedMotion} from '../src/lib/physics/mechanics/accelerated-motion.ts';
import {solveVerticalThrow,solveObliqueThrow} from '../src/lib/physics/mechanics/projectiles.ts';
import {kinematicsEquations} from '../src/lib/calculators/kinematics-equations.ts';

test('assumed initial position is omitted in accelerated position and displacement',()=>{
 const r=solveAcceleratedMotion({v0:2,a:3,t:4});
 assert.equal(r.status,'success');
 const equations=kinematicsEquations('accelerated-motion',r,{}).scenarios.flat();
 assert.ok(equations.every(e=>!e.expression.includes('s_0')));
 assert.equal(r.scenarios[0].values.s,32);
 for(const eq of equations)katex.renderToString(eq.expression,{throwOnError:true});
 const explicit=kinematicsEquations('accelerated-motion',solveAcceleratedMotion({s0:0,v0:2,a:3,t:4}),{}).scenarios[0][0].expression;
 assert.ok(explicit.includes('s_0'));assert.ok(explicit.includes('0.00\\,\\mathrm{m}'));
});

test('assumed zero launch height disappears from projectile formulas, explicit height remains',()=>{
 for(const [id,solver,input] of [['vertical-throw',solveVerticalThrow,{v0:10,g:10}],['oblique-throw',solveObliqueThrow,{v0:20,alpha:Math.PI/4,g:10}]]){
  const result=solver(input);
  assert.equal(result.status,'success');
  const equations=kinematicsEquations(id,result,{}).scenarios.flat();
  assert.ok(equations.every(eq=>!eq.expression.includes('y_0')));
  for(const eq of equations)katex.renderToString(eq.expression,{throwOnError:true});
  const explicit=kinematicsEquations(id,solver({...input,y0:0}),{}).scenarios.flat();
  assert.ok(explicit.find(eq=>eq.key==='flight').expression.includes('y_0'));
  assert.ok(explicit.find(eq=>eq.key==='peakHeight').expression.includes('0.00\\,\\mathrm{m}+'));
 }
});
