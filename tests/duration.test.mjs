import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { formatDuration } from '../src/lib/calculators/duration.ts';
import { uniformMotionEquation, motionQuantityKinds, defaultMotionUnits } from '../src/lib/calculators/uniform-motion-equation.ts';
import { parseQuantityInUnit } from '../src/lib/calculators/quantities.ts';
import { fields, solveUniformMotion } from '../src/lib/physics/mechanics/uniform-motion.ts';

test('formats days, padded time and one decimal place with rollover', () => {
  for (const [value, expected] of [
    [94368.8, '1d, 02:12:48.8'], [0, ''],
    [1.26, ''], [59.96, ''], [60, '01:00.0'], [3599, '59:59.0'], [3600, '01:00:00.0'],
    [3599.96, '01:00:00.0'], [86399.96, '1d, 00:00:00.0'],
    [172800, '2d, 00:00:00.0']
  ]) assert.equal(formatDuration(value), expected);
  assert.doesNotThrow(() => formatDuration(1e308));
  for (const invalid of [-1, NaN, Infinity]) assert.throws(() => formatDuration(invalid));
});
function equation(raw, units = defaultMotionUnits) {
  const input = Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key] ?? '', motionQuantityKinds[key], units[key])]));
  const values = Object.fromEntries(fields.filter(key => input[key].status === 'valid').map(key => [key, input[key].value]));
  return uniformMotionEquation(solveUniformMotion(values), input, units);
}
test('appends duration only when time is solved, using full precision SI time', () => {
  for (const unit of ['s', 'min', 'h', 'd']) {
    const latex = equation({ s: '94368.8', v: '1' }, { ...defaultMotionUnits, t: unit });
    assert.ok(latex.includes('1d, 02:12:48.8'));
    assert.doesNotThrow(() => katex.renderToString(latex));
  }
  assert.ok(!equation({ v: '1', t: '94368.8' }).includes('02:12:48.8'));
  assert.ok(!equation({ s: '94368.8', t: '94368.8' }).includes('02:12:48.8'));
});

test('time result uses an equals sign before the clock display, without zero days', () => {
  const latex = equation({ s: '13680', v: '1' });
  assert.ok(latex.endsWith(String.raw`\approx 13.7\,\mathrm{ks} = \text{03:48:00.0}`));
  assert.doesNotThrow(() => katex.renderToString(latex));
});

test('clock display starts at 60 SI seconds and adds hours at 3600 seconds', () => {
  for (const unit of ['s', 'min', 'h', 'd']) {
    assert.ok(!equation({ s: '59.99', v: '1' }, { ...defaultMotionUnits, t: unit }).includes(' = \\text{'));
    assert.ok(equation({ s: '60', v: '1' }, { ...defaultMotionUnits, t: unit }).endsWith(String.raw`= \text{01:00.0}`));
    assert.ok(equation({ s: '3600', v: '1' }, { ...defaultMotionUnits, t: unit }).endsWith(String.raw`= \text{01:00:00.0}`));
  }
});
