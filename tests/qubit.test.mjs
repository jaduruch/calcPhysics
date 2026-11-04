import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { gateIds, gateMatrix, applyGate, blochVector, blochAngles, gateTrajectory, probability, zeroQubit } from '../src/lib/physics/quantum/qubit.ts';
import { qubitGates, qubitModel } from '../src/lib/content/quantum.ts';
import { qubitStateEquation } from '../src/lib/calculators/qubit.ts';
import { projectBloch, defaultBlochCamera, blochAngleGuides } from '../src/lib/visualization/bloch.ts';
import { topics, models, childrenOf } from '../src/lib/content/topics.ts';
const close = (a, b, tolerance = 1e-12) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`);
const stateClose = (a, b) => a.forEach((value, i) => { close(value.re, b[i].re); close(value.im, b[i].im); });
const vectorClose = (a, b) => ['x', 'y', 'z'].forEach(key => close(a[key], b[key]));
const c = (re, im = 0) => ({ re, im });
const q = Math.SQRT1_2;
const plus = [c(q), c(q)];
const parameters = { theta: 1.234, phi: 0.86, lambda: 2.3 };
test('gate selection and matrices match every gate shown in portal.html', () => {
  assert.deepEqual(qubitGates.map(gate => gate.id), [...gateIds]);
  const matrices = {
    X: [[c(0), c(1)], [c(1), c(0)]],
    Y: [[c(0), c(0, -1)], [c(0, 1), c(0)]],
    Z: [[c(1), c(0)], [c(0), c(-1)]],
    sqrtX: [[c(.5, .5), c(.5, -.5)], [c(.5, -.5), c(.5, .5)]],
    sqrtZ: [[c(1), c(0)], [c(0), c(0, 1)]],
    H: [[c(q), c(q)], [c(q), c(-q)]],
    Rx: [[c(q), c(0, -q)], [c(0, -q), c(q)]],
    Ry: [[c(q), c(-q)], [c(q), c(q)]],
    Rz: [[c(q, -q), c(0)], [c(0), c(q, q)]],
    U: [[c(q), c(-q)], [c(q), c(q)]]
  };
  for (const id of gateIds) {
    const actual = gateMatrix({ id, theta: Math.PI / 2, phi: 0, lambda: 0 });
    actual.forEach((row, index) => stateClose(row, matrices[id][index]));
  }
});
test('phase, signs and Bloch orientation agree with analytic states', () => {
  stateClose(applyGate(zeroQubit, { id: 'X' }), [c(0), c(1)]);
  stateClose(applyGate(zeroQubit, { id: 'Y' }), [c(0), c(0, 1)]);
  stateClose(applyGate(zeroQubit, { id: 'H' }), plus);
  vectorClose(blochVector(applyGate(plus, { id: 'sqrtZ' })), { x: 0, y: 1, z: 0 });
  vectorClose(blochVector(applyGate(zeroQubit, { id: 'Rx', theta: Math.PI / 2 })), { x: 0, y: -1, z: 0 });
  vectorClose(blochVector(applyGate(zeroQubit, { id: 'Ry', theta: Math.PI / 2 })), { x: 1, y: 0, z: 0 });
  const phased = plus.map(a => c(-a.im, a.re));
  vectorClose(blochVector(phased), blochVector(plus));
  assert.equal(blochAngles(zeroQubit).phi, null);
  close(blochAngles(plus).phi, 0);
});
test('U uses IBM complex phases rather than only real rotations', () => {
  const { theta: t, phi: p, lambda: l } = parameters;
  const co = Math.cos(t / 2), si = Math.sin(t / 2);
  const expected = [
    c(q * (co - Math.cos(l) * si), -q * Math.sin(l) * si),
    c(q * (Math.cos(p) * si + Math.cos(p + l) * co), q * (Math.sin(p) * si + Math.sin(p + l) * co))
  ];
  stateClose(applyGate(plus, { id: 'U', ...parameters }), expected);
});
test('unitaries preserve norm through sequences and continuous paths', () => {
  let state = zeroQubit;
  for (let repeat = 0; repeat < 30; repeat++) for (const id of gateIds) {
    const gate = { id, ...parameters };
    state = applyGate(state, gate);
    close(probability(state[0]) + probability(state[1]), 1);
    const path = gateTrajectory(state, gate);
    vectorClose(path[0], blochVector(state));
    vectorClose(path.at(-1), blochVector(applyGate(state, gate)));
    for (const v of path) close(Math.hypot(v.x, v.y, v.z), 1);
    stateClose(applyGate(state, gate, 0), state);
  }
  for (const id of ['X', 'Y', 'Z', 'H']) stateClose(applyGate(applyGate(plus, { id }), { id }), plus);
  for (const [root, pauli] of [['sqrtX', 'X'], ['sqrtZ', 'Z']]) stateClose(applyGate(applyGate(plus, { id: root }), { id: root }), applyGate(plus, { id: pauli }));
});
test('antipodal state transitions follow the actual axis without shrinking the vector', () => {
  const middle = blochVector(applyGate(zeroQubit, { id: 'X' }, .5));
  vectorClose(middle, { x: 0, y: -1, z: 0 });
  const fullTurn = applyGate(plus, { id: 'Rz', theta: 2 * Math.PI });
  stateClose(fullTurn, plus.map(a => c(-a.re, -a.im)));
  vectorClose(blochVector(fullTurn), blochVector(plus));
});
test('invalid states, gate parameters and progress are rejected at physics boundary', () => {
  for (const state of [[c(0), c(0)], [c(2), c(0)], [c(NaN), c(0)], [c(Infinity), c(0)]]) assert.throws(() => applyGate(state, { id: 'X' }), RangeError);
  for (const theta of [NaN, Infinity, 7, -7, undefined]) assert.throws(() => gateMatrix({ id: 'Rx', theta }), RangeError);
  for (const fraction of [NaN, -0.1, 1.1]) assert.throws(() => gateMatrix({ id: 'X' }, fraction), RangeError);
  for (const override of [{ theta: -1 }, { theta: 4 }, { phi: -1 }, { lambda: 2 * Math.PI }, { phi: Infinity }]) assert.throws(() => gateMatrix({ id: 'U', ...parameters, ...override }), RangeError);
  assert.throws(() => gateMatrix({ id: 'unknown' }), RangeError);
});
test('camera changes the projection without changing quantum state and all equations render', () => {
  const vector = blochVector(plus);
  const projected = projectBloch(vector, defaultBlochCamera);
  const rotated = projectBloch(vector, { ...defaultBlochCamera, yaw: 1.2 });
  assert.notEqual(projected.x, rotated.x);
  vectorClose(vector, { x: 1, y: 0, z: 0 });
  for (const formula of qubitModel.formulas) katex.renderToString(formula.expression, { throwOnError: true, trust: false });
  for (const id of gateIds) katex.renderToString(qubitStateEquation(applyGate(plus, { id, ...parameters })), { throwOnError: true });
});
test('Modern Physics is an overview with Quantum as its published subtopic', () => {
  assert.ok(topics.find(topic => topic.id === 'modern-physics').published);
  assert.ok(childrenOf('modern-physics').some(topic => topic.id === 'quantum' && topic.published && topic.path === '/modern-physics/quantum'));
  assert.ok(models.some(model => model.topicId === 'quantum' && model.id === 'qubit'));
  assert.ok(!models.some(model => model.topicId === 'modern-physics'));
});

test('angle guides follow the state meridian and positive azimuth in 3D', () => {
  const vector = { x: 0.3, y: -0.4, z: Math.sqrt(0.75) };
  const guides = blochAngleGuides(vector);
  vectorClose(guides.foot, { x: 0.3, y: -0.4, z: 0 });
  vectorClose(guides.thetaArc[0], { x: 0, y: 0, z: .42 });
  vectorClose(guides.thetaArc.at(-1), { x: vector.x * .42, y: vector.y * .42, z: vector.z * .42 });
  vectorClose(guides.phiArc[0], { x: .36, y: 0, z: 0 });
  vectorClose(guides.phiArc.at(-1), { x: .216, y: -.288, z: 0 });
  for (const point of guides.thetaArc) close(Math.hypot(point.x, point.y, point.z), .42);
  for (const point of guides.phiArc) { close(Math.hypot(point.x, point.y), .36); close(point.z, 0); }
  assert.equal(blochAngleGuides({ x: 0, y: 0, z: 1 }), null);
  for (const vector of [{ x: 0, y: 0, z: -1 }, blochVector(applyGate(zeroQubit, { id: 'X' }))]) {
    const south = blochAngleGuides(vector);
    assert.equal(south.southPole, true);
    vectorClose(south.thetaArc[0], { x: 0, y: 0, z: .42 });
    vectorClose(south.thetaArc.at(-1), { x: 0, y: 0, z: -.42 });
    vectorClose(south.thetaArc[24], { x: .42, y: 0, z: 0 });
    assert.equal(south.phiLabel, null);
    assert.deepEqual(south.phiArc, []);
  }
  const zeroPhi = blochAngleGuides({ x: 1, y: 0, z: 0 });
  vectorClose(zeroPhi.phiArc.at(-1), { x: .36, y: 0, z: 0 });
});

test('Bloch camera preserves right-handedness for every viewing direction', () => {
  const basis = [{ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }];
  for (const yaw of [-3, -.65, 0, 1.2, 3]) for (const elevation of [-1.35, 0, .35, 1.35]) {
    const columns = basis.map(point => {
      const projected = projectBloch(point, { yaw, elevation });
      const scale = 126 * 4 / (4 - projected.depth);
      return [(projected.x - 240) / scale, (195 - projected.y) / scale, projected.depth];
    });
    const [a, b, c] = columns;
    const cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    cross.forEach((value, index) => close(value, c[index]));
    close(cross.reduce((sum, value, index) => sum + value * c[index], 0), 1);
  }
  const front = projectBloch(basis[0], { yaw: 0, elevation: 0 });
  const right = projectBloch(basis[1], { yaw: 0, elevation: 0 });
  const up = projectBloch(basis[2], { yaw: 0, elevation: 0 });
  close(front.depth, 1); close(front.x, 240); close(front.y, 195);
  assert.ok(right.x > 240); assert.ok(up.y < 195);
  const x = projectBloch(basis[0], defaultBlochCamera);
  const y = projectBloch(basis[1], defaultBlochCamera);
  assert.ok(x.x < 240 && x.y > 195);
  assert.ok(y.x > 240 && y.y > 195);
});
