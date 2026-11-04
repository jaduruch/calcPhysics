import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveDoppler, dopplerFields, DEFAULT_SOUND_SPEED } from '../src/lib/physics/waves/doppler.ts';
import { dopplerEquations, dopplerUnits } from '../src/lib/calculators/doppler.ts';
import { dopplerScene } from '../src/lib/visualization/doppler.ts';
import { parseQuantityInUnit, changeQuantityUnit } from '../src/lib/calculators/quantities.ts';
import { dopplerModel } from '../src/lib/content/waves.ts';
import { topics, models, childrenOf } from '../src/lib/content/topics.ts';
import { pageMetadata, publishedPaths } from '../src/lib/seo.ts';
const close = (a, b, tolerance = 1e-10) => assert.ok(Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b)), `${a} != ${b}`);
const success = input => { const result = solveDoppler(input); assert.equal(result.status, 'success'); return result; };
test('all four Doppler rearrangements recover independent analytic reference', () => {
  // 1000 Hz × (340 + 10)/(340 - 20) = 1093.75 Hz.
  const reference = { fs: 1000, fo: 1093.75, vs: 20, vo: 10, c: 340 };
  for (const field of dopplerFields) {
    const input = { ...reference }; delete input[field];
    const result = success(input);
    assert.equal(result.field, field);
    close(result.values[field], reference[field]);
    close(result.wavelength, .32);
    close(result.shift, 93.75);
    assert.equal(result.assumedSoundSpeed, false);
    assert.equal(input[field], undefined);
    const equations = dopplerEquations(result, dopplerUnits);
    for (const equation of [equations.equation, equations.wavelength, equations.shift]) katex.renderToString(equation, { throwOnError: true });
  }
  const consistent = success(reference);
  assert.equal(consistent.field, null);
  assert.equal(solveDoppler({ ...reference, fo: 1093 }).status, 'conflict');
});
test('stationary, approaching, receding, comoving and distinct source/observer effects', () => {
  const stationary = success({ fs: 1000, vs: 0, vo: 0 });
  close(stationary.values.fo, 1000); close(stationary.shift, 0);
  assert.equal(stationary.values.c, DEFAULT_SOUND_SPEED);
  assert.equal(stationary.assumedSoundSpeed, true);
  const toward = success({ fs: 1000, vs: 34, vo: 0, c: 340 });
  close(toward.values.fo, 10000 / 9);
  close(success({ fs: 1000, vs: -34, vo: 0, c: 340 }).values.fo, 10000 / 11);
  close(success({ fs: 1000, vs: 0, vo: 34, c: 340 }).values.fo, 1100);
  close(success({ fs: 1000, vs: 0, vo: -34, c: 340 }).values.fo, 900);
  close(success({ fs: 1000, vs: 34, vo: -34, c: 340 }).values.fo, 1000);
  close(success({ fs: 1000, fo: 1000, vo: 0 }).values.vs, 0);
  close(success({ fs: 1000, fo: 1000, vs: 0 }).values.vo, 0);
});
test('domain, sonic boundaries, underdetermination and stale result invalidation', () => {
  assert.equal(solveDoppler({ fs: 1000, vs: 0 }).status, 'incomplete');
  assert.equal(solveDoppler({ fs: 1000, fo: 1100 }).status, 'incomplete');
  const base = { fs: 1000, vs: 0, vo: 0, c: 340 };
  for (const field of ['fs', 'fo', 'c']) for (const value of [0, -1, NaN, Infinity]) assert.equal(solveDoppler({ ...base, [field]: value }).status, 'invalid');
  for (const field of ['vs', 'vo']) for (const value of [-341, -340, 340, 341, NaN, Infinity]) assert.equal(solveDoppler({ ...base, [field]: value }).status, 'invalid');
  assert.equal(solveDoppler({ fs: 1000, fo: 2000, vs: 0, c: 340 }).status, 'no-solution');
  assert.equal(solveDoppler({ fs: 1000, fo: 100, vo: 0, c: 340 }).status, 'no-solution');
  assert.equal(solveDoppler({ ...base, fs: 1e308, vs: 339 }).status, 'invalid');
  assert.equal(solveDoppler({ fs: Number.MIN_VALUE, vo: -339, vs: 0, c: 340 }).status, 'invalid');
  assert.equal(success({ ...base, vs: 339.999 }).values.fo > 1e8, true);
});
test('SI unit conversions, signed substitutions and output units stay consistent', () => {
  const input = { fs: parseQuantityInUnit('1k', 'frequency', 'Hz').value, vs: parseQuantityInUnit('72', 'velocity', 'km/h').value, vo: -10, c: 340 };
  const result = success(input);
  close(result.values.fo, 1031.25);
  assert.equal(changeQuantityUnit('72', 'velocity', 'km/h', 'm/s'), '20');
  const units = { ...dopplerUnits, vs: 'km/h' };
  const equations = dopplerEquations(result, units);
  assert.equal(equations.conversions.length, 1);
  assert.ok(equations.conversions[0].includes('1000'));
  assert.ok(equations.equation.includes('\\left(-10.0'));
  for (const equation of [...equations.conversions, equations.equation, equations.wavelength, equations.shift]) katex.renderToString(equation, { throwOnError: true });
  const inverse = success({ fs: 1000, fo: 1093.75, vo: 10, c: 340 });
  assert.ok(dopplerEquations(inverse, units).equation.includes('72.0'));
  for (const formula of dopplerModel.formulas) katex.renderToString(formula.expression, { throwOnError: true });
});
test('wavefront geometry keeps emission centers and spacing from the same solver values', () => {
  const result = success({ fs: 1000, vs: 68, vo: 34, c: 340 });
  const first = dopplerScene(result.values, 1.2), later = dopplerScene(result.values, 1.8);
  close(first.sourcePosition, .24); close(first.observerPosition, 5.88);
  close(later.sourcePosition - first.sourcePosition, .12);
  close(later.observerPosition - first.observerPosition, -.06);
  for (let index = 0; index < first.fronts.length; index++) {
    close(first.fronts[index].center, later.fronts[index].center);
    close(later.fronts[index].radius - first.fronts[index].radius, .6);
  }
  const [newer, older] = first.fronts;
  const normalizedSpacing = older.center + older.radius - newer.center - newer.radius;
  close(normalizedSpacing * result.values.c / result.values.fs, result.wavelength);
  const end = dopplerScene(success({ fs: 1000, vs: 339, vo: 339, c: 340 }).values, 100);
  assert.ok(end.observerPosition > end.sourcePosition);
  close(end.observerPosition - end.sourcePosition, 3);
});
test('Waves is an overview with a published Doppler subtopic, canonical and sitemap path', () => {
  assert.ok(topics.find(topic => topic.id === 'waves').published);
  assert.ok(childrenOf('waves').some(topic => topic.id === 'doppler-effect' && topic.published));
  assert.ok(models.some(model => model.topicId === 'doppler-effect' && model.id === 'acoustic-doppler'));
  assert.ok(!models.some(model => model.topicId === 'waves'));
  const path = '/oscillations-and-waves/doppler-effect';
  assert.ok(publishedPaths().includes(path));
  assert.equal(pageMetadata(path).canonical, `https://calcphysics.com${path}`);
});
