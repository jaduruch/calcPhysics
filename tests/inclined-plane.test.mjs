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
  assert.equal(solveInclinedPlane({ mass: 1 }).status, 'incomplete');
  for (const bad of [{ mass: 0 }, { mass: -1 }, { angle: -.01 }, { angle: 2 }, { friction: -1 }, { gravity: 0 }]) {
    assert.equal(solveInclinedPlane({ mass: 1, angle: .5, ...bad }).status, 'invalid');
  }
  for (const mass of [NaN, Infinity, 1e308]) assert.equal(solveInclinedPlane({ mass, gravity: 100, angle: .3 }).status, 'invalid');
  assert.equal(solveInclinedPlane({ mass: Number.MIN_VALUE, gravity: .01, angle: .3 }).status, 'invalid');
  assert.equal(solveInclinedPlane({ mass: 1, angle: 0, friction: 0 }).status, 'success');
});
test('unit conversions and equation strings use the same unrounded result', () => {
  const units = { ...inclineDefaults, mass: 'g', angle: '°' };
  const raw = { mass: '10k', angle: '30', friction: '200m', gravity: '', length: '', height: '' };
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
  assert.equal(flat.length, undefined); assert.equal(flat.endVelocity, undefined);
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
