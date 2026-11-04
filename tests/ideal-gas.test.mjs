import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gasConstant, gasFields, solveIdealGas } from '../src/lib/physics/thermodynamics/ideal-gas.ts';
import { parseQuantityInUnit, changeQuantityUnit } from '../src/lib/calculators/quantities.ts';
import { gasEquations, gasUnits } from '../src/lib/calculators/ideal-gas.ts';
import katex from 'katex';
test('all ideal-gas rearrangements recover an independent reference state', () => {
  const reference = { p: 100000, V: 0.02494338785445972, n: 1, T: 300 };
  for (const field of gasFields) {
    const values = { ...reference }; delete values[field];
    const result = solveIdealGas(values);
    assert.equal(result.status, 'success');
    assert.equal(result.field, field);
    assert.ok(Math.abs(result.value / reference[field] - 1) < 1e-12);
    const display = gasEquations(field, result.value, values, gasUnits);
    katex.renderToString(display.equation, { throwOnError: true });
  }
  assert.ok(Math.abs(gasConstant - 8.31446261815324) < 1e-14);
  assert.equal(solveIdealGas(reference).status, 'consistent');
  assert.equal(solveIdealGas({ ...reference, T: 301 }).status, 'conflict');
});
test('invalid states replace results, including zero and non-finite values', () => {
  assert.equal(solveIdealGas({ n: 1, T: 300 }).status, 'incomplete');
  for (const field of gasFields) for (const value of [0, -1, NaN, Infinity]) {
    assert.equal(solveIdealGas({ [field]: value }).status, 'invalid');
  }
  assert.equal(solveIdealGas({ n: 1e308, T: 1e308, V: 1e-308 }).status, 'invalid');
  assert.equal(solveIdealGas({ n: 1e-308, T: 1e-308, V: 1e308 }).status, 'invalid');
  assert.equal(solveIdealGas({ n: 1e300, T: 300, V: 1e300 }).status, 'success');
});
test('pressure and volume conversions preserve SI and render valid steps', () => {
  assert.equal(parseQuantityInUnit('1', 'pressure', 'bar').value, 100000);
  assert.equal(parseQuantityInUnit('1', 'pressure', 'atm').value, 101325);
  assert.equal(parseQuantityInUnit('25', 'volume', 'L').value, 0.025);
  assert.equal(changeQuantityUnit('25', 'volume', 'L', 'm³'), '0.025');
  const values = { p: 100000, V: 0.025, n: 1 };
  const result = solveIdealGas(values);
  const display = gasEquations('T', result.value, values, { ...gasUnits, p: 'bar', V: 'L' });
  assert.equal(display.conversions.length, 2);
  for (const equation of display.conversions) katex.renderToString(equation, { throwOnError: true });
});
