import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { parseQuantity } from '../src/lib/calculators/quantities.ts';
import { uniformMotionEquation } from '../src/lib/calculators/uniform-motion-equation.ts';
import { fields, solveUniformMotion } from '../src/lib/physics/mechanics/uniform-motion.ts';
function calculate(raw) {
  const parsed = Object.fromEntries(fields.map(key => [key, parseQuantity(raw[key] ?? '')]));
  const values = Object.fromEntries(fields.filter(key => parsed[key].status === 'valid').map(key => [key, parsed[key].value]));
  return uniformMotionEquation(solveUniformMotion(values), parsed);
}
test('shows a full equation for every target, preserving input prefixes and units', () => {
  for (const [raw, start] of [
    [{ s0: '1k', v: '20', t: '500m' }, 's = s_0 + v \\cdot t ='],
    [{ s: '2k', v: '20', t: '500m' }, 's_0 = s - v \\cdot t ='],
    [{ s0: '1k', s: '2k', t: '500m' }, 'v = \\frac{s - s_0}{t} ='],
    [{ s0: '1k', s: '2k', v: '500m' }, 't = \\frac{s - s_0}{v} =']
  ]) {
    const equation = calculate(raw);
    assert.ok(equation.startsWith(start), equation);
    assert.ok(equation.includes('\\mathrm{km}'));
    assert.ok(equation.includes('500\\,\\mathrm{m'));
    assert.doesNotThrow(() => katex.renderToString(equation, { throwOnError: true, trust: false }));
  }
});
test('omits assumed initial zero and preserves a rounded result', () => {
  const equation = calculate({ s: '1k', t: '3' });
  assert.ok(equation.startsWith('v = \\frac{s}{t} ='));
  assert.ok(!equation.includes('0.00\\,\\mathrm{m}'));
  assert.ok(!equation.includes('s_0'));
  assert.ok(equation.includes('\\approx 333\\,\\mathrm{m/s}'));
  assert.ok(equation.includes('1.00\\,\\mathrm{km}'));
});
test('renders micro prefixes, negative values and exponents with valid KaTeX', () => {
  const equation = calculate({ s0: '-2u', v: '2e-3', t: '1m' });
  assert.ok(equation.includes('\\mu\\mathrm{m}'));
  assert.doesNotThrow(() => katex.renderToString(equation));
});

test('assumed-zero equations simplify every target while explicit zeros stay visible', () => {
 for (const [raw, formula] of [
  [{v:'2',t:'1'}, String.raw`s = v \cdot t = 2.00\,\mathrm{m/s} \cdot 1.00\,\mathrm{s} = 2.00\,\mathrm{m}`],
  [{s:'2',t:'1'}, String.raw`v = \frac{s}{t} =`],
  [{s:'2',v:'2'}, String.raw`t = \frac{s}{v} =`]
 ]) {
  const equation=calculate(raw);
  assert.ok(equation.startsWith(formula), equation);
  assert.ok(!equation.includes('s_0'));
  assert.doesNotThrow(()=>katex.renderToString(equation,{throwOnError:true}));
 }
 const explicit=calculate({s0:'0',v:'2',t:'1'});
 assert.ok(explicit.startsWith(String.raw`s = s_0 + v \cdot t =`));
 assert.ok(explicit.includes(String.raw`0.00\,\mathrm{m} +`));
 const negative=calculate({v:'-2',t:'1'});
 assert.ok(negative.includes(String.raw`\left(-2.00\,\mathrm{m/s}\right)`));
});
