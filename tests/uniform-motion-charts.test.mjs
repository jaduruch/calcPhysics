import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveUniformMotion } from '../src/lib/physics/mechanics/uniform-motion.ts';
import { uniformMotionChartData } from '../src/lib/visualization/uniform-motion.ts';

test('diagrams share solver endpoints and unrounded SI values', () => {
  const result = solveUniformMotion({ s0: 1.23456789, v: 2.34567891, t: 7.89123456 });
  const data = uniformMotionChartData(result);
  assert.equal(data.times.length, 11);
  assert.equal(data.times[0], 0);
  assert.equal(data.times.at(-1), result.values.t);
  assert.equal(data.positions[0], result.values.s0);
  assert.equal(data.positions.at(-1), result.values.s);
  assert.ok(data.velocities.every(value => value === result.values.v));
  assert.ok(Math.abs(data.positions[5] - (result.values.s0 + result.values.v * result.values.t / 2)) < 1e-12);
});
test('negative and stationary velocities are represented correctly', () => {
  const negative = uniformMotionChartData(solveUniformMotion({ s0: 10, v: -2, t: 10 }));
  assert.equal(negative.positions.at(-1), -10);
  assert.ok(negative.positions.every((value, i, all) => i === 0 || value <= all[i - 1]));
  const still = uniformMotionChartData(solveUniformMotion({ s0: -5, v: 0, t: 10 }));
  assert.ok(still.positions.every(value => value === -5));
  assert.ok(still.velocities.every(value => value === 0));
});
test('zero intervals show one point, and incomplete or invalid input removes diagrams', () => {
  assert.deepEqual(uniformMotionChartData(solveUniformMotion({ s0: 3, v: 5, t: 0 })), { times: [0], positions: [3], velocities: [5] });
  assert.equal(uniformMotionChartData(solveUniformMotion({ s0: 3 })), null);
  assert.equal(uniformMotionChartData(solveUniformMotion({ s0: 3, v: 5, t: -1 })), null);
});
test('chart interpolation avoids overflow for extreme finite endpoints', () => {
  const data = uniformMotionChartData(solveUniformMotion({ s0: 1.7e308, v: 0, t: 2 }));
  assert.ok(data.positions.every(Number.isFinite));
});
