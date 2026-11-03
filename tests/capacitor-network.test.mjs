import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveElectrical } from '../src/lib/physics/electricity.ts';
import { capacitorNetworkDefinition, electricalModels } from '../src/lib/content/electricity.ts';
import { electricalEquations } from '../src/lib/calculators/electrical-equations.ts';
import { parseQuantityInUnit } from '../src/lib/calculators/quantities.ts';
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) <= Math.abs(expected) * 1e-12, `${actual} != ${expected}`);

test('capacitors combine in one card, with reciprocal series and additive parallel calculation', () => {
  assert.equal(electricalModels.filter(model => model.id.startsWith('capacitance-')).length, 1);
  const given = { C1: 1e-6, C2: 2e-6, C3: 3e-6 };
  for (const [id, expected] of [['capacitance-series', 6e-6 / 11], ['capacitance-parallel', 6e-6]]) {
    const result = solveElectrical(id, given);
    assert.equal(result.status, 'success');
    near(result.outputs.C, expected);
    const equation = electricalEquations(capacitorNetworkDefinition(id, 4), result, {})[0];
    assert.ok(equation.includes('C_{3}'));
    assert.ok(!equation.includes('C_{4}'));
    assert.ok(!equation.includes('undefined'));
    katex.renderToString(equation, { throwOnError: true, strict: 'error' });
  }
  assert.deepEqual(given, { C1: 1e-6, C2: 2e-6, C3: 3e-6 });
});

test('capacitor prefixes, many components and extreme values preserve SI results', () => {
  const value = parseQuantityInUnit('2u', 'capacitance', 'F').value;
  const given = Object.fromEntries(Array.from({ length: 12 }, (_, index) => [`C${index + 1}`, value]));
  near(solveElectrical('capacitance-parallel', given).outputs.C, 24e-6);
  const result = solveElectrical('capacitance-series', given);
  near(result.outputs.C, 2e-6 / 12);
  const equation = electricalEquations(capacitorNetworkDefinition('capacitance-series', 13), result, {})[0];
  assert.ok(equation.includes('C_{12}'));
  katex.renderToString(equation, { throwOnError: true });
  near(solveElectrical('capacitance-series', { C1: 1e-308, C2: 1e-308 }).outputs.C, 5e-309);
  assert.equal(solveElectrical('capacitance-parallel', { C1: 1e308, C2: 1e308 }).status, 'out-of-range');
});

test('missing, invalid and non-finite capacitances invalidate the network', () => {
  for (const id of ['capacitance-series', 'capacitance-parallel']) {
    for (const given of [{}, { C1: 1 }, { C1: 1, C3: 2 }]) assert.equal(solveElectrical(id, given).status, 'incomplete');
    for (const given of [{ C1: 0, C2: 1 }, { C1: -1, C2: 1 }, { C1: NaN, C2: 1 }, { C1: Infinity, C2: 1 }, { C1: 1, C2: 2, R3: 3 }]) {
      assert.equal(solveElectrical(id, given).status, 'invalid');
    }
  }
});
