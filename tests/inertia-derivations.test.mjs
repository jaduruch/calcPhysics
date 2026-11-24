import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {inertiaDerivations} from '../src/lib/content/inertia-derivations.ts';
import {shapeRelation} from '../src/lib/physics/mechanics/rigid-body.ts';

test('all derivation equations render and sphere ends with the requested two-fifths result',()=>{
 assert.deepEqual(inertiaDerivations.map(s=>s.id),['sphere','cylinder']);
 for(const shape of inertiaDerivations)for(const step of shape.steps)assert.doesNotThrow(()=>katex.renderToString(step.expression,{throwOnError:true}));
 assert.ok(inertiaDerivations[0].steps.at(-1).expression.endsWith(String.raw`\boxed{\frac{2}{5}MR^2}`));
});
test('disk and shell integrations agree with existing inertia relations at varied physical scales',()=>{
 // Independent numerical quadrature verifies the integrands used in the derivations.
 const integrate=(f,a,b)=>{const n=1000,h=(b-a)/n;let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);return sum*h/3;};
 for(const M of [0.02,1,125])for(const R of [0.01,1,7])for(const H of [0.03,2]){
  const sphereDensity=M/(4/3*Math.PI*R**3),cylinderDensity=M/(Math.PI*R**2*H);
  const sphere=integrate(z=>Math.PI*sphereDensity/2*(R**2-z**2)**2,-R,R);
  const cylinder=integrate(s=>2*Math.PI*cylinderDensity*H*s**3,0,R);
  for(const [shape,actual]of [['sphere',sphere],['cylinder',cylinder]]){
   const expected=shapeRelation(shape).inverse.I0({m:M,R})[0];
   assert.ok(Math.abs(actual-expected)<=Math.abs(expected)*1e-10);
  }
 }
});
