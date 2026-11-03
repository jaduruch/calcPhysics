import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveElectrical } from '../src/lib/physics/electricity.ts';
import { inductorNetworkDefinition, electricalModels } from '../src/lib/content/electricity.ts';
import { electricalEquations } from '../src/lib/calculators/electrical-equations.ts';
import { parseQuantityInUnit } from '../src/lib/calculators/quantities.ts';
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) <= Math.abs(expected) * 1e-12, `${actual} != ${expected}`);

test('uncoupled inductors share one card and use direct series and reciprocal parallel sums', () => {
  const cards = electricalModels.filter(model => model.id.startsWith('inductance-'));
  assert.equal(cards.length, 1);
  assert.ok(cards[0].notes.some(note => note.text.includes('no mutual magnetic coupling')));
  const given = { L1: .01, L2: .02, L3: .03 };
  for (const [id, expected] of [['inductance-series', .06], ['inductance-parallel', .06 / 11]]) {
    const result = solveElectrical(id, given);
    assert.equal(result.status, 'success');
    near(result.outputs.L, expected);
    const equation = electricalEquations(inductorNetworkDefinition(id, 4), result, {})[0];
    assert.ok(equation.includes('L_{3}'));
    assert.ok(!equation.includes('L_{4}'));
    assert.ok(!equation.includes('undefined'));
    katex.renderToString(equation, { throwOnError: true, strict: 'error' });
  }
  assert.deepEqual(given, { L1: .01, L2: .02, L3: .03 });
});

test('inductor prefixes, many components and extreme values preserve SI results', () => {
  const value = parseQuantityInUnit('2m', 'inductance', 'H').value;
  const given = Object.fromEntries(Array.from({ length: 12 }, (_, index) => [`L${index + 1}`, value]));
  near(solveElectrical('inductance-series', given).outputs.L, .024);
  const result = solveElectrical('inductance-parallel', given);
  near(result.outputs.L, .002 / 12);
  const equation = electricalEquations(inductorNetworkDefinition('inductance-parallel', 13), result, {})[0];
  assert.ok(equation.includes('L_{12}'));
  katex.renderToString(equation, { throwOnError: true });
  near(solveElectrical('inductance-parallel', { L1: 1e-308, L2: 1e-308 }).outputs.L, 5e-309);
  assert.equal(solveElectrical('inductance-series', { L1: 1e308, L2: 1e308 }).status, 'out-of-range');
});

test('missing, invalid and non-finite inductances invalidate either topology', () => {
  for (const id of ['inductance-series', 'inductance-parallel']) {
    for (const given of [{}, { L1: 1 }, { L1: 1, L3: 2 }]) assert.equal(solveElectrical(id, given).status, 'incomplete');
    for (const given of [{ L1: 0, L2: 1 }, { L1: -1, L2: 1 }, { L1: NaN, L2: 1 }, { L1: Infinity, L2: 1 }, { L1: 1, L2: 2, C3: 3 }]) {
      assert.equal(solveElectrical(id, given).status, 'invalid');
    }
  }
});
