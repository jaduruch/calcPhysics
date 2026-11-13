import {test} from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {solveObliqueThrow,solveVerticalThrow,solveHorizontalThrow} from '../src/lib/physics/mechanics/projectiles.ts';
import {kinematicsChartData} from '../src/lib/visualization/kinematics.ts';
import {kinematicsEquations} from '../src/lib/calculators/kinematics-equations.ts';
import {parseQuantityInUnit} from '../src/lib/calculators/quantities.ts';
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-12*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const solved=input=>{const r=solveObliqueThrow(input);assert.equal(r.status,'success');return r;};
const scenario=input=>solved(input).scenarios[0];

test('45 degree launch matches independent range, peak and energy formulas',()=>{
 const s=scenario({v0:20,alpha:Math.PI/4,g:10}),v=s.values;
 close(v.vx,10*Math.SQRT2);close(v.vy0,10*Math.SQRT2);
 close(v.flight,2*Math.SQRT2);close(v.range,40);close(v.peakTime,Math.SQRT2);close(v.peakHeight,10);close(v.speedImpact,20);
 assert.deepEqual(solved({v0:20,alpha:Math.PI/4}).assumed,['y0','g']);
 // Independent unequal-height ballistic reference: initial components (6,8), height 10.
 const h=scenario({y0:10,v0:10,alpha:Math.atan2(8,6),g:10}).values;
 close(h.flight,(8+Math.sqrt(264))/10);close(h.range,6*h.flight);close(h.peakHeight,13.2);close(h.speedImpact,Math.sqrt(300));
});

test('cardinal, leftward and downward launches agree with existing special cases',()=>{
 for(const alpha of [0,Math.PI,-Math.PI]){
  const s=scenario({y0:20,v0:5,alpha,g:10});const horizontal=solveHorizontalThrow({h:20,vx:alpha===0?5:-5,g:10}).scenarios[0];
  close(s.values.flight,horizontal.values.flight);close(s.values.range,horizontal.values.range);close(s.values.speedImpact,horizontal.values.speedImpact);
 }
 for(const alpha of [Math.PI/2,-Math.PI/2]){
  const s=scenario({y0:10,v0:10,alpha,g:10});const vertical=solveVerticalThrow({y0:10,v0:alpha>0?10:-10,g:10}).scenarios[0];
  assert.equal(s.values.vx,0);assert.equal(s.values.range,0);close(s.duration,vertical.duration);if(alpha>=0)close(s.values.peakHeight,vertical.values.peakHeight);else assert.equal(s.values.peakHeight,undefined);
 }
 const left=scenario({v0:20,alpha:3*Math.PI/4,g:10});close(left.values.range,-40);
 const down=scenario({y0:10,v0:10,alpha:-Math.PI/4,g:10});assert.ok(down.duration>0);assert.equal(down.values.peakTime,undefined);assert.equal(down.values.peakHeight,undefined);
});

test('ground contact, rest, domains, incomplete and numeric extremes stay explicit',()=>{
 for(const alpha of [0,-Math.PI/4,Math.PI]){
  const s=scenario({v0:10,alpha});assert.equal(s.duration,0);assert.equal(s.values.range,0);assert.deepEqual(kinematicsChartData(s).times,[0]);
 }
 const rest=scenario({v0:0,alpha:1});assert.equal(rest.duration,0);assert.equal(rest.values.speedImpact,0);
 close(scenario({v0:0,y0:5,alpha:1,g:10}).duration,1);
 assert.equal(solveObliqueThrow({v0:10}).status,'incomplete');assert.equal(solveObliqueThrow({alpha:1}).status,'incomplete');
 for(const input of [{v0:-1},{y0:-1},{g:0},{g:-1},{alpha:Math.PI+0.01},{alpha:-Math.PI-0.01},{v0:Infinity},{alpha:NaN}])assert.equal(solveObliqueThrow(input).code,'domain');
 assert.equal(solveObliqueThrow({v0:Number.MAX_VALUE,alpha:Math.PI/4,g:Number.MIN_VALUE}).code,'numerical');
 assert.equal(solveObliqueThrow({v0:Number.MIN_VALUE,alpha:0.1}).code,'numerical');
 // Downward cancellation must not erase a tiny but valid flight time.
 const fast=scenario({v0:1e100,alpha:-Math.PI/2,y0:1,g:10});close(fast.duration/1e-100,1);
});

test('trajectory includes the apex and exact ground boundary, including leftward and vertical flights',()=>{
 for(const alpha of [Math.PI/4,3*Math.PI/4,Math.PI/2,-Math.PI/4]){
  const s=scenario({v0:20,alpha,y0:10,g:10}),d=kinematicsChartData(s);
  assert.ok(Object.values(d).flat().every(Number.isFinite));assert.equal(d.positions.at(-1),0);assert.equal(d.horizontal.at(-1),s.values.range);
  assert.equal(d.velocities.at(-1),s.values.vyImpact);
  if(s.values.peakTime>0){const i=d.times.indexOf(s.values.peakTime);assert.ok(i>=0);close(d.positions[i],s.values.peakHeight);}
  assert.ok(d.positions.every(y=>y>=-1e-10));
 }
});

test('degree and km/h conversions and every calculation step render valid KaTeX',()=>{
 const alpha=parseQuantityInUnit('45','angle','°').value,v0=parseQuantityInUnit('72','velocity','km/h').value;
 const result=solved({v0,alpha,g:10});close(result.scenarios[0].values.range,40);
 const steps=kinematicsEquations('oblique-throw',result,{alpha:'°',v0:'km/h'});
 assert.equal(steps.conversions.length,2);assert.equal(steps.scenarios[0].length,8);
 assert.match(steps.conversions.find(s=>s.startsWith('\\alpha')),/\\mathrm\{rad\}/);
 for(const expr of [...steps.conversions,...steps.scenarios.flat().map(eq=>eq.expression)]){
  katex.renderToString(expr,{throwOnError:true,strict:'error'});
  assert.ok(!expr.includes('\f')&&!expr.includes('\r'));
 }
 const vx=steps.scenarios[0].find(eq=>eq.key==='vx').expression;
 assert.match(vx,/\\cos\\left/);assert.match(vx,/\\cdot/);assert.ok(!vx.includes('\\mathrm{m}='));
});
