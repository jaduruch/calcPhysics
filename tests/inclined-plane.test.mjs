import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveInclinedPlane } from '../src/lib/physics/mechanics/inclined-plane.ts';
import { parseQuantityInUnit } from '../src/lib/calculators/quantities.ts';
import { inclineFields, inclineKinds, inclineDefaults, inclineEquations, inclineConversions } from '../src/lib/calculators/inclined-plane-equations.ts';
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) <= 1e-12 * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);

test('frictionless 30 degree plane has expected force components and acceleration', () => {
  const r = solveInclinedPlane({ mass: 10, angle: Math.PI / 6 });
  assert.equal(r.status, 'success');
  near(r.weight, 98.1); near(r.parallel, 49.05); near(r.normal, 84.95709211125343);
  near(r.acceleration, 4.905); assert.equal(r.frictionForce, 0);
  near(r.net / r.mass, r.acceleration);
});
test('kinetic friction opposes downhill sliding and may produce negative acceleration', () => {
  const r = solveInclinedPlane({ mass: 10, angle: Math.PI / 6, friction: .2 });
  near(r.frictionForce, .2 * 98.1 * Math.sqrt(3) / 2);
  near(r.acceleration, 9.81 * (.5 - .2 * Math.sqrt(3) / 2));
  const braking = solveInclinedPlane({ mass: 10, angle: .1, friction: .5 });
  assert.ok(braking.acceleration < 0);
  assert.ok(braking.frictionForce > braking.parallel);
});
test('horizontal and vertical endpoint cases avoid spurious force components', () => {
  const flat = solveInclinedPlane({ mass: 2, angle: 0 });
  assert.equal(flat.parallel, 0); assert.equal(flat.acceleration, 0); near(flat.normal, 19.62);
  const vertical = solveInclinedPlane({ mass: 2, angle: Math.PI / 2, friction: 10 });
  assert.equal(vertical.normal, 0); assert.equal(vertical.frictionForce, 0); assert.equal(vertical.acceleration, 9.81);
});
test('acceleration is independent of mass, while forces scale with mass', () => {
  const a = solveInclinedPlane({ mass: 2, angle: .4, friction: .1, gravity: 1.62 });
  const b = solveInclinedPlane({ mass: 20, angle: .4, friction: .1, gravity: 1.62 });
  assert.equal(a.acceleration, b.acceleration); near(b.weight / a.weight, 10); near(b.net / a.net, 10);
});
test('domains, incomplete inputs, zero coefficients and extreme values are handled', () => {
  assert.equal(solveInclinedPlane({}).status, 'incomplete');
  near(solveInclinedPlane({ mass: 1 }).weight,9.81);
  for (const bad of [{ mass: 0 }, { mass: -1 }, { angle: -.01 }, { angle: 2 }, { friction: -1 }, { gravity: 0 }]) {
    assert.equal(solveInclinedPlane({ mass: 1, angle: .5, ...bad }).status, 'invalid');
  }
  for (const mass of [NaN, Infinity, 1e308]) assert.equal(solveInclinedPlane({ mass, gravity: 100, angle: .3 }).status, 'invalid');
  assert.equal(solveInclinedPlane({ mass: Number.MIN_VALUE, gravity: .01, angle: .3 }).status, 'invalid');
  assert.equal(solveInclinedPlane({ mass: 1, angle: 0, friction: 0 }).status, 'success');
});
test('unit conversions and equation strings use the same unrounded result', () => {
  const units = { ...inclineDefaults, mass: 'g', angle: '°' };
  const raw = { mass: '10k', angle: '30', friction: '200m', gravity: '', length: '', height: '', endVelocity: '' };
  const parsed = Object.fromEntries(inclineFields.map(key => [key, parseQuantityInUnit(raw[key], inclineKinds[key], units[key])]));
  const values = Object.fromEntries(inclineFields.filter(key => parsed[key].status === 'valid').map(key => [key, parsed[key].value]));
  const result = solveInclinedPlane(values);
  assert.equal(result.status, 'success'); near(result.mass, 10); near(result.angle, Math.PI / 6); near(result.friction, .2);
  const before = JSON.stringify(result);
  const conversions = inclineConversions(result, parsed, units);
  assert.equal(conversions.length, 2);
  const equations = inclineEquations(result);
  assert.equal(equations.length, 6);
  for (const expression of [...conversions, ...equations]) assert.doesNotThrow(() => katex.renderToString(expression, { throwOnError: true, trust: false }));
  assert.equal(JSON.stringify(result), before);
  assert.deepEqual(inclineEquations({ status: 'incomplete' }), []);
});


test('any two geometry values determine the third and the speed from rest', () => {
  for (const [geometry, target] of [[{length: 10, height: 5}, 'angle'], [{length: 10, angle: Math.PI/6}, 'height'], [{height: 5, angle: Math.PI/6}, 'length']]) {
    const r = solveInclinedPlane({mass: 2, ...geometry});
    assert.equal(r.status, 'success');
    near(r.angle, Math.PI/6); near(r.length, 10); near(r.height, 5);
    near(r.endVelocity, Math.sqrt(98.1)); assert.equal(r.geometryTarget, target);
    for (const expression of inclineEquations(r)) assert.doesNotThrow(() => katex.renderToString(expression, {throwOnError:true}));
  }
});
test('geometry rejects impossible, contradictory and degenerate values', () => {
  for (const geometry of [{length: 0}, {height: -1}, {length: 2, height: 3}, {angle: 0, height: 1}, {angle: .5, height: 0}, {angle: .5, length: 10, height: 9}]) {
    assert.equal(solveInclinedPlane({mass: 2, ...geometry}).status, 'invalid');
  }
  const consistent = solveInclinedPlane({mass: 2, length: 10, height: 5, angle: Math.PI/6});
  assert.equal(consistent.status, 'success'); assert.equal(consistent.geometryTarget, undefined);
  const flat = solveInclinedPlane({mass: 2, angle: 0, height: 0});
  assert.equal(flat.length, undefined); assert.equal(flat.endVelocity, 0);
});
test('speed from rest uses full precision and never invents motion against friction', () => {
  const r = solveInclinedPlane({mass: 2, length: 13.4567, height: 4.12345, friction: .1});
  assert.equal(r.status, 'success');
  near(r.endVelocity ** 2, 2 * r.acceleration * r.length);
  const blocked = solveInclinedPlane({mass: 2, angle: .1, length: 10, friction: .5});
  assert.equal(blocked.motion, 'no-start'); assert.equal(blocked.endVelocity, undefined);
  const flat = solveInclinedPlane({mass: 2, angle: 0, length: 10});
  assert.equal(flat.endVelocity, 0);
  const vertical = solveInclinedPlane({mass: 2, length: 10, height: 10, friction: 100});
  near(vertical.endVelocity, Math.sqrt(196.2));
});

test('geometry, acceleration and speed are available without mass',()=>{
 for(const input of [{length:10,height:5},{length:10,angle:Math.PI/6},{height:5,angle:Math.PI/6}]){
  const result=solveInclinedPlane(input);assert.equal(result.status,'success');near(result.height,5);near(result.length,10);near(result.acceleration,4.905);near(result.endVelocity,Math.sqrt(98.1));assert.equal(result.weight,undefined);
  const equations=inclineEquations(result);assert.ok(equations.some(eq=>eq.startsWith('a=')));assert.ok(!equations.some(eq=>eq.startsWith('F_')));
  for(const eq of equations)katex.renderToString(eq,{throwOnError:true});
 }
 const onlyHeight=solveInclinedPlane({height:5});near(onlyHeight.endVelocity,Math.sqrt(98.1));assert.equal(onlyHeight.angle,undefined);
});
test('entered end speed solves the height and geometry without mass',()=>{
 const speed=Math.sqrt(98.1);
 for(const input of [{endVelocity:speed},{endVelocity:speed,length:10},{endVelocity:speed,angle:Math.PI/6}]){
  const r=solveInclinedPlane(input);assert.equal(r.status,'success');near(r.height,5);assert.equal(r.velocityCalculated,false);
  if(input.angle!==undefined)near(r.length,10);if(input.length!==undefined)near(r.angle,Math.PI/6);
  for(const eq of inclineEquations(r))katex.renderToString(eq,{throwOnError:true});
 }
});
test('kinetic-friction speed inverses recover slope, height and length',()=>{
 const original=solveInclinedPlane({angle:.6,length:10,friction:.2});assert.equal(original.status,'success');
 for(const input of [{endVelocity:original.endVelocity,length:10,friction:.2},{endVelocity:original.endVelocity,angle:.6,friction:.2},{endVelocity:original.endVelocity,height:original.height,friction:.2}]){
  const r=solveInclinedPlane(input);assert.equal(r.status,'success');near(r.angle,.6);near(r.length,10);near(r.height,original.height);
  for(const eq of inclineEquations(r))katex.renderToString(eq,{throwOnError:true});
 }
});
test('overdetermined speed inputs are checked; impossible speed and friction pairs fail',()=>{
 for(const input of [{angle:.5,length:10,endVelocity:100},{height:1,endVelocity:100},{length:1,endVelocity:100},{angle:0,length:10,endVelocity:1},{angle:.1,friction:1,endVelocity:1},{height:1,friction:.2,endVelocity:100},{endVelocity:-1}])assert.equal(solveInclinedPlane(input).status,'invalid',JSON.stringify(input));
 const r=solveInclinedPlane({height:5,endVelocity:Math.sqrt(98.1)});assert.equal(r.status,'success');assert.equal(r.length,undefined);
});
test('partial invalidation cannot retain earlier geometric or force results',()=>{
 assert.equal(solveInclinedPlane({length:10,height:11}).status,'invalid');
 const r=solveInclinedPlane({length:10,height:5});assert.equal(r.weight,undefined);assert.equal(r.net,undefined);
 assert.equal(solveInclinedPlane({length:10}).status,'incomplete');
 const zero=solveInclinedPlane({endVelocity:0});near(zero.height,0);near(zero.endVelocity,0);
});

test('zero end speed at kinetic balance is not turned into a spurious positive acceleration',()=>{
 const r=solveInclinedPlane({endVelocity:0,length:10,friction:.2});assert.equal(r.status,'success');near(r.angle,Math.atan(.2));assert.equal(r.acceleration,0);assert.equal(r.motion,'no-start');
});

test('prefixed zero speed and non-SI speed conversion remain finite and render correctly',()=>{
 const raw=Object.fromEntries(inclineFields.map(key=>[key,'']));raw.endVelocity='0k';
 const units={...inclineDefaults,endVelocity:'km/h'};
 const parsed=Object.fromEntries(inclineFields.map(key=>[key,parseQuantityInUnit(raw[key],inclineKinds[key],units[key])]));
 const result=solveInclinedPlane({endVelocity:parsed.endVelocity.value});
 for(const eq of [...inclineConversions(result,parsed,units),...inclineEquations(result)]){assert.ok(!eq.includes('NaN'));katex.renderToString(eq,{throwOnError:true});}
 raw.endVelocity='36';parsed.endVelocity=parseQuantityInUnit(raw.endVelocity,'velocity','km/h');
 const r=solveInclinedPlane({endVelocity:parsed.endVelocity.value});near(r.height,100/(2*9.81));
 for(const eq of [...inclineConversions(r,parsed,units),...inclineEquations(r)])katex.renderToString(eq,{throwOnError:true});
});
