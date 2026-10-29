import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveUniformMotion } from '../src/lib/physics/mechanics/uniform-motion.ts';
import { prefixes, parseQuantity, formatQuantity } from '../src/lib/calculators/quantities.ts';

test('solves all four rearrangements with a nonzero initial position', () => {
  for (const [input, field, value] of [
    [{ s0: 20, v: 12, t: 10 }, 's', 140],
    [{ s: 140, v: 12, t: 10 }, 's0', 20],
    [{ s0: 20, s: 140, t: 10 }, 'v', 12],
    [{ s0: 20, s: 140, v: 12 }, 't', 10]
  ]) {
    const r = solveUniformMotion(input);
    assert.equal(r.status, 'success'); assert.equal(r.field, field); assert.equal(r.value, value);
    assert.equal(r.assumedInitial, false);
  }
});
test('assumes zero only for the three valid two-input combinations', () => {
  for (const [input, field, value] of [
    [{ s: 120, t: 10 }, 'v', 12], [{ v: 12, t: 10 }, 's', 120], [{ s: 120, v: 12 }, 't', 10]
  ]) {
    const r = solveUniformMotion(input);
    assert.equal(r.status, 'success'); assert.equal(r.field, field); assert.equal(r.value, value);
    assert.equal(r.assumedInitial, true); assert.equal(r.values.s0, 0);
  }
  assert.equal(solveUniformMotion({ s0: 10, t: 2 }).status, 'incomplete');
  assert.equal(solveUniformMotion({}).status, 'incomplete');
});
test('handles signed positions and velocities, zero inputs and negative time', () => {
  assert.equal(solveUniformMotion({ s0: 0, v: -2, t: 5 }).value, -10);
  assert.equal(solveUniformMotion({ s0: 0, v: 0, t: 5 }).value, 0);
  assert.equal(solveUniformMotion({ s0: 0, s: 0, v: 2 }).value, 0);
  assert.equal(solveUniformMotion({ s0: 0, s: -10, v: 2 }).status, 'no-solution');
  assert.equal(solveUniformMotion({ s0: 0, v: 2, t: -1 }).code, 'negative-time');
});
test('distinguishes impossible and underdetermined zero-divisor cases', () => {
  assert.equal(solveUniformMotion({ s0: 0, s: 1, t: 0 }).status, 'no-solution');
  assert.equal(solveUniformMotion({ s0: 0, s: 0, t: 0 }).status, 'underdetermined');
  assert.equal(solveUniformMotion({ s0: 2, s: 3, v: 0 }).status, 'no-solution');
  assert.equal(solveUniformMotion({ s0: 2, s: 2, v: 0 }).status, 'underdetermined');
});
test('rejects non-finite values, overflow and four manual values', () => {
  assert.equal(solveUniformMotion({ s: Infinity }).code, 'non-finite');
  assert.equal(solveUniformMotion({ s0: 0, v: 1e308, t: 1e308 }).code, 'non-finite');
  assert.equal(solveUniformMotion({ s0: 0, s: 10, v: 2, t: 5 }).code, 'too-many');
});
test('accepts every requested prefix, preserving case and zero', () => {
  assert.deepEqual(prefixes.map(p => p.symbol), ['p','n','u','m','c','d','','k','M','G','T']);
  for (const prefix of prefixes) assert.equal(parseQuantity('2', prefix.symbol).value, 2 * prefix.factor);
  assert.equal(parseQuantity('1,25', 'k').value, 1250);
  assert.equal(parseQuantity('2e-3', 'M').value, 2000);
  assert.equal(parseQuantity('0', '').value, 0);
  assert.equal(parseQuantity('0e10', '').value, 0);
  assert.equal(parseQuantity('  ', '').status, 'empty');
  for (const raw of ['12abc', '1,234.5', '-', '1e', 'Infinity', '1e999', '1e-999']) assert.equal(parseQuantity(raw, '').status, 'invalid');
});
test('formats three significant figures with prefixes and rounding carry', () => {
  for (const [value, expected] of [
    [12345, { number: '12.3', prefix: 'k' }],
    [0.0012345, { number: '1.23', prefix: 'm' }],
    [-0.000002, { number: '-2.00', prefix: 'u' }],
    [0, { number: '0.00', prefix: '' }],
    [999.9, { number: '1.00', prefix: 'k' }],
    [0.9999, { number: '1.00', prefix: '' }]
  ]) assert.deepEqual(formatQuantity(value), expected);
  assert.equal(formatQuantity(1e20).prefix, 'T');
  assert.equal(formatQuantity(1e-15).prefix, 'p');
  assert.throws(() => formatQuantity(Infinity));
});
test('derived results are invalidated rather than recycled as inputs', () => {
  const source = { s: 120, t: 10 };
  assert.equal(solveUniformMotion(source).value, 12);
  source.s = 240;
  assert.equal(solveUniformMotion(source).value, 24);
  delete source.t;
  assert.equal(solveUniformMotion(source).status, 'incomplete');
  assert.deepEqual(source, { s: 240 });
});

test('parses keyboard prefixes, whitespace, decimal commas and scientific notation', () => {
  for (const prefix of prefixes) {
    const parsed = parseQuantity(`2${prefix.symbol}`);
    assert.equal(parsed.status, 'valid'); assert.equal(parsed.value, 2 * prefix.factor);
    assert.equal(parsed.prefix, prefix.symbol); assert.equal(parsed.number, '2');
  }
  assert.equal(parseQuantity('1.5k').value, 1500);
  assert.equal(parseQuantity('250m').value, .25);
  assert.ok(Math.abs(parseQuantity('20u').value - 20e-6) <= 1e-18);
  assert.equal(parseQuantity(' 1,5 k ').value, 1500);
  assert.equal(parseQuantity('2e-3M').value, 2000);
  assert.equal(parseQuantity('5µ').prefix, 'u');
  assert.equal(parseQuantity('5μ').prefix, 'u');
  for (const raw of ['2K', '2mm', '1.2.3k', '2 k m', 'k', '2e', '<script>']) assert.equal(parseQuantity(raw).status, 'invalid');
});
