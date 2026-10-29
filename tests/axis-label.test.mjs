import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatAxisLabel } from '../src/lib/visualization/axis-label.ts';

test('axis values use powers of ten from 1000, including signed values and rounding carry', () => {
  assert.deepEqual(formatAxisLabel(0), { coefficient: '0' });
  assert.deepEqual(formatAxisLabel(123.456), { coefficient: '123' });
  assert.deepEqual(formatAxisLabel(999), { coefficient: '999' });
  assert.deepEqual(formatAxisLabel(1000), { coefficient: '1', exponent: 3 });
  assert.deepEqual(formatAxisLabel(12345), { coefficient: '1.23', exponent: 4 });
  assert.deepEqual(formatAxisLabel(-12345), { coefficient: '-1.23', exponent: 4 });
  assert.deepEqual(formatAxisLabel(999.9), { coefficient: '1', exponent: 3 });
  assert.deepEqual(formatAxisLabel(1e100), { coefficient: '1', exponent: 100 });
});

test('small axis values use negative exponents up to and including 0.001', () => {
  assert.deepEqual(formatAxisLabel(0.001), { coefficient: '1', exponent: -3 });
  assert.deepEqual(formatAxisLabel(0.000012345), { coefficient: '1.23', exponent: -5 });
  assert.deepEqual(formatAxisLabel(-0.001), { coefficient: '-1', exponent: -3 });
  assert.deepEqual(formatAxisLabel(0.01), { coefficient: '0.01' });
  assert.deepEqual(formatAxisLabel(0), { coefficient: '0' });
});
