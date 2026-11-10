import {test} from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {solveAcceleratedMotion,nonnegativeMotionTimes,motionAt} from '../src/lib/physics/mechanics/accelerated-motion.ts';
import {solveVerticalThrow,solveHorizontalThrow} from '../src/lib/physics/mechanics/projectiles.ts';
import {kinematicsChartData} from '../src/lib/visualization/kinematics.ts';
import {kinematicsEquations} from '../src/lib/calculators/kinematics-equations.ts';
import {kinematicModels} from '../src/lib/content/kinematics.ts';
import {parseQuantityInUnit} from '../src/lib/calculators/quantities.ts';
import {models} from '../src/lib/content/topics.ts';
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<=1e-12*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);
const success=result=>{assert.equal(result.status,'success');return result;};
const values=result=>success(result).scenarios[0].values;
const fixture={s0:10,s:42,v0:2,a:3,t:4};
for(const target of Object.keys(fixture))test(`accelerated motion inverse: ${target}`,()=>{
 const input={...fixture};delete input[target];const result=success(solveAcceleratedMotion(input));
 assert.equal(result.target,target);close(result.scenarios[0].values[target],fixture[target]);close(result.scenarios[0].finalVelocity,14);
 const equations=kinematicsEquations('accelerated-motion',result,{});
 for(const eq of equations.scenarios.flat())katex.renderToString(eq.expression,{throwOnError:true});
});
test('accelerated time branches, apex, signed position and linear cases',()=>{
 const result=success(solveAcceleratedMotion({s0:0,s:15,v0:20,a:-10}));
 close(result.scenarios[0].duration,1);close(result.scenarios[1].duration,3);
 close(result.scenarios[0].finalVelocity,10);close(result.scenarios[1].finalVelocity,-10);
 assert.deepEqual(nonnegativeMotionTimes(-5,20,-20),[2]);
 assert.equal(solveAcceleratedMotion({s0:0,s:21,v0:20,a:-10}).status,'no-solution');
 close(values(solveAcceleratedMotion({s0:0,s:-10,v0:-2,a:0})).t,5);
 assert.equal(solveAcceleratedMotion({s0:0,s:10,v0:-2,a:0}).status,'no-solution');
 assert.equal(solveAcceleratedMotion({s0:0,s:0,v0:0,a:0}).status,'underdetermined');
 assert.equal(solveAcceleratedMotion({s0:0,s:1,v0:0,a:0}).status,'no-solution');
 const assumed=success(solveAcceleratedMotion({v0:2,a:3,t:4}));assert.deepEqual(assumed.assumed,['s0']);close(assumed.scenarios[0].values.s,32);
});
test('zero intervals, incomplete, excessive and invalid inputs stay distinct',()=>{
 assert.equal(solveAcceleratedMotion({s0:2,s:2,a:3,t:0}).status,'underdetermined');
 assert.equal(solveAcceleratedMotion({s0:2,s:3,a:3,t:0}).status,'no-solution');
 assert.equal(solveAcceleratedMotion({s0:2,v0:1}).status,'incomplete');
 assert.equal(solveAcceleratedMotion(fixture).code,'too-many');
 for(const input of [{t:-1},{a:Infinity},{v0:NaN}])assert.equal(solveAcceleratedMotion(input).status,'invalid');
 const zero=success(solveAcceleratedMotion({s0:2,v0:3,a:4,t:0})).scenarios[0];
 assert.deepEqual(kinematicsChartData(zero),{times:[0],positions:[2],velocities:[3],horizontal:[0]});
});
test('stable quadratic roots, scaled coefficients and finite numeric limits',()=>{
 const roots=nonnegativeMotionTimes(1,-1e8,1);close(roots[0],1e-8);close(roots[1],1e8);
 const scaled=nonnegativeMotionTimes(1e200,-3e200,2e200);close(scaled[0],1);close(scaled[1],2);
 assert.equal(solveAcceleratedMotion({s0:0,s:1,v0:0,a:Number.MIN_VALUE}).code,'numerical');
 assert.equal(solveAcceleratedMotion({s0:Number.MAX_VALUE,v0:Number.MAX_VALUE,a:Number.MAX_VALUE,t:10}).code,'numerical');
 assert.equal(nonnegativeMotionTimes(1e-300,1,1e-300),'numerical');
});
test('vertical throw upward, downward, drop and ground-contact conventions',()=>{
 const up=values(solveVerticalThrow({v0:10,g:10}));close(up.flight,2);close(up.peakTime,1);close(up.peakHeight,5);close(up.impactVelocity,-10);
 const drop=values(solveVerticalThrow({y0:10,v0:0,g:10}));close(drop.flight,Math.sqrt(2));close(drop.impactVelocity,-Math.sqrt(200));
 const down=values(solveVerticalThrow({y0:10,v0:-10,g:10}));close(down.flight,Math.sqrt(3)-1);close(down.peakTime,0);close(down.peakHeight,10);
 for(const v0 of [-10,0])close(values(solveVerticalThrow({y0:0,v0})).flight,0);
 assert.deepEqual(success(solveVerticalThrow({v0:10})).assumed,['y0','g']);
 assert.equal(solveVerticalThrow({}).status,'incomplete');
 for(const input of [{v0:1,y0:-1},{v0:Infinity},{v0:1,g:0},{v0:1,g:-1}])assert.equal(solveVerticalThrow(input).status,'invalid');
 assert.equal(solveVerticalThrow({v0:Number.MAX_VALUE,g:Number.MIN_VALUE}).code,'numerical');
});
test('horizontal throw signed displacement, zero horizontal velocity and ground launch',()=>{
 const right=values(solveHorizontalThrow({h:20,vx:5,g:10}));close(right.flight,2);close(right.range,10);close(right.vyImpact,-20);close(right.speedImpact,Math.sqrt(425));
 close(values(solveHorizontalThrow({h:20,vx:-5,g:10})).range,-10);
 close(values(solveHorizontalThrow({h:20,vx:0,g:10})).range,0);
 const ground=values(solveHorizontalThrow({h:0,vx:5}));close(ground.flight,0);close(ground.range,0);close(ground.speedImpact,5);
 assert.equal(solveHorizontalThrow({h:1}).status,'incomplete');
 for(const input of [{h:-1,vx:2},{h:1,vx:NaN},{h:1,vx:1,g:0}])assert.equal(solveHorizontalThrow(input).status,'invalid');
 assert.equal(solveHorizontalThrow({h:Number.MAX_VALUE,vx:Number.MAX_VALUE,g:1}).code,'numerical');
});
test('all curves use unrounded solver data and exact ground boundaries',()=>{
 const scenarios=[...success(solveAcceleratedMotion({s0:0,s:15,v0:20,a:-10})).scenarios,...success(solveVerticalThrow({v0:17.1234})).scenarios,...success(solveHorizontalThrow({h:23.456,vx:-8.7654})).scenarios,...success(solveHorizontalThrow({h:20,vx:0})).scenarios];
 for(const scenario of scenarios){const data=kinematicsChartData(scenario);assert.equal(data.times.at(-1),scenario.duration);assert.equal(data.positions.at(-1),scenario.finalPosition);assert.equal(data.velocities.at(-1),scenario.finalVelocity);assert.ok(Object.values(data).flat().every(Number.isFinite));
  for(let i=0;i<data.times.length-1;i++){assert.equal(data.positions[i],motionAt(scenario.motion,data.times[i]).position);assert.ok(data.times[i]<data.times[i+1]);}
  const peak=-scenario.motion.v0/scenario.motion.a;if(peak>0&&peak<scenario.duration)assert.ok(data.times.includes(peak));
 }
});
test('unit conversion, result units, duration and all theory/calculation formulas render',()=>{
 const v0=parseQuantityInUnit('36','velocity','km/h');assert.equal(v0.value,10);
 const result=success(solveAcceleratedMotion({s0:0,v0:v0.value,a:2,t:10}));
 close(result.scenarios[0].values.s,200);
 const eq=kinematicsEquations('accelerated-motion',result,{v0:'km/h',s:'AE'});assert.equal(eq.conversions.length,1);assert.ok(eq.scenarios[0][0].expression.includes('AE'));
 const time=kinematicsEquations('accelerated-motion',success(solveAcceleratedMotion({s0:0,s:3600,v0:1,a:0})),{t:'h'});assert.ok(time.scenarios[0][0].expression.includes('01:00:00.0'));
 const cases=[['accelerated-motion',result],['vertical-throw',success(solveVerticalThrow({y0:10,v0:-10,g:10}))],['horizontal-throw',success(solveHorizontalThrow({h:20,vx:-5,g:10}))]];
 for(const [id,r] of cases){const eqs=kinematicsEquations(id,r,{});for(const eq of eqs.scenarios.flat())katex.renderToString(eq.expression,{throwOnError:true});}
 for(const model of kinematicModels)for(const eq of model.formulas)katex.renderToString(eq.expression,{throwOnError:true});
 for(const expression of [...eq.conversions,...eq.scenarios.flat().map(eq=>eq.expression)])katex.renderToString(expression,{throwOnError:true});
 assert.deepEqual(models.filter(model=>model.topicId==='kinematics').map(model=>model.id),['uniform-motion','accelerated-motion','vertical-throw','horizontal-throw']);
});
