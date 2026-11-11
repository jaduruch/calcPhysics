import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { unitGroups, getUnit } from '../src/lib/physics/units.ts';
import { parseQuantityInUnit, changeQuantityUnit } from '../src/lib/calculators/quantities.ts';
import { fields, solveUniformMotion } from '../src/lib/physics/mechanics/uniform-motion.ts';
import { uniformMotionEquation, uniformMotionConversions, defaultMotionUnits, motionQuantityKinds } from '../src/lib/calculators/uniform-motion-equation.ts';
const near = (a, b) => assert.ok(Math.abs(a - b) <= 1e-12 * Math.max(Math.abs(b), 1), `${a} != ${b}`);

test('shared catalogue has the exact requested unit options and SI defaults', () => {
  assert.deepEqual(unitGroups.length.units.map(x => x.symbol), ['m', 'AE', 'Lj']);
  assert.deepEqual(unitGroups.velocity.units.map(x => x.symbol), ['m/s', 'km/h']);
  assert.deepEqual(unitGroups.time.units.map(x => x.symbol), ['s', 'min', 'h', 'd']);
  assert.deepEqual(defaultMotionUnits, { s0: 'm', s: 'm', v: 'm/s', t: 's' });
  assert.equal(getUnit('length', 'AE').factor, 149597870700);
  assert.equal(getUnit('length', 'Lj').factor, 9460730472580800);
  assert.throws(() => getUnit('time', 'm'));
});
test('typed prefixes combine with selected units and convert to SI', () => {
  assert.equal(parseQuantityInUnit('1k', 'length', 'm').value, 1000);
  near(parseQuantityInUnit('36', 'velocity', 'km/h').value, 10);
  assert.equal(parseQuantityInUnit('2', 'time', 'min').value, 120);
  assert.equal(parseQuantityInUnit('1', 'time', 'h').value, 3600);
  assert.equal(parseQuantityInUnit('1', 'time', 'd').value, 86400);
  assert.equal(parseQuantityInUnit('1m', 'time', 'h').value, 3.6);
  assert.equal(parseQuantityInUnit('1', 'length', 'AE').value, 149597870700);
  assert.equal(parseQuantityInUnit('1', 'length', 'Lj').value, 9460730472580800);
  assert.equal(parseQuantityInUnit('1e308', 'length', 'Lj').status, 'invalid');
});
test('switching units preserves the physical input and its prefix', () => {
  assert.equal(changeQuantityUnit('1k', 'length', 'm', 'AE').endsWith('k'), true);
  assert.equal(changeQuantityUnit('1', 'time', 'h', 'min'), '60');
  assert.equal(changeQuantityUnit('', 'time', 's', 'min'), '');
  assert.equal(changeQuantityUnit('-', 'time', 's', 'min'), '-');
  for (const kind of Object.keys(unitGroups)) {
    for (const unit of unitGroups[kind].units) {
      const si = unitGroups[kind].si;
      const converted = changeQuantityUnit('12.345k', kind, si, unit.symbol);
      near(parseQuantityInUnit(converted, kind, unit.symbol).value, 12345);
      const back = changeQuantityUnit(converted, kind, unit.symbol, si);
      near(parseQuantityInUnit(back, kind, si).value, 12345);
    }
  }
});
test('mixed-unit calculation shows conversion first, then SI substitution and chosen result unit', () => {
  const raw = { s0: '', s: '', v: '36', t: '1' };
  const units = { s0: 'm', s: 'AE', v: 'km/h', t: 'h' };
  const parsed = Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key], motionQuantityKinds[key], units[key])]));
  const values = Object.fromEntries(fields.filter(key => parsed[key].status === 'valid').map(key => [key, parsed[key].value]));
  const result = solveUniformMotion(values);
  assert.equal(result.status, 'success'); near(result.value, 36000);
  const equation = uniformMotionEquation(result, parsed, units);
  const conversions = uniformMotionConversions(result, parsed, units);
  assert.equal(conversions.length, 2);
  assert.ok(conversions[0].includes('36.0\\,\\mathrm{km/h}'));
  assert.ok(conversions[0].endsWith('10.0\\,\\mathrm{m/s}'));
  assert.ok(conversions[1].includes('1.00\\,\\mathrm{h}'));
  assert.ok(conversions[1].endsWith('3.60\\times 10^{3}\\,\\mathrm{s}'));
  for (const conversion of conversions) assert.doesNotThrow(() => katex.renderToString(conversion));
  assert.ok(equation.includes('10.0\\,\\mathrm{m/s}'));
  assert.ok(equation.includes('3.60\\times 10^{3}\\,\\mathrm{s}'));
  assert.ok(!equation.includes('km/h'));
  assert.ok(equation.includes('\\mathrm{nAE}'));
  assert.doesNotThrow(() => katex.renderToString(equation, { throwOnError: true }));
  units.s = 'm';
  assert.ok(uniformMotionEquation(result, parsed, units).endsWith('36.0\\,\\mathrm{km}'));
});

test('conversion steps cover astronomical/time units and omit SI or missing inputs', () => {
  for (const [kind, symbol] of [['length', 'AE'], ['length', 'Lj'], ['time', 'min'], ['time', 'd']]) {
    const raw = kind === 'length' ? { s0: '2m', s: '3', t: '4' } : { s0: '2', s: '3', t: '4u' };
    const units = { ...defaultMotionUnits, [kind === 'length' ? 's0' : 't']: symbol };
    const input = Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key] ?? '', motionQuantityKinds[key], units[key])]));
    const values = Object.fromEntries(fields.filter(key => input[key].status === 'valid').map(key => [key, input[key].value]));
    const result = solveUniformMotion(values);
    assert.equal(result.status, 'success');
    const conversions = uniformMotionConversions(result, input, units);
    assert.equal(conversions.length, 1);
    assert.ok(conversions[0].includes(symbol));
    assert.doesNotThrow(() => katex.renderToString(conversions[0]));
    assert.doesNotThrow(() => katex.renderToString(uniformMotionEquation(result, input, units)));
    assert.deepEqual(uniformMotionConversions({ status: 'incomplete' }, input, units), []);
  }
  const raw = { s: '1k', t: '3' };
  const input = Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key] ?? '', motionQuantityKinds[key], defaultMotionUnits[key])]));
  assert.deepEqual(uniformMotionConversions(solveUniformMotion({ s: 1000, t: 3 }), input), []);
});

test('conversion and substitution round only display; final result uses unrounded sources', () => {
  const raw = { v: '1.23456', t: '123.456' };
  const units = { ...defaultMotionUnits, v: 'km/h', t: 'h' };
  const input = Object.fromEntries(fields.map(key => [key, parseQuantityInUnit(raw[key] ?? '', motionQuantityKinds[key], units[key])]));
  const values = { v: input.v.value, t: input.t.value };
  const result = solveUniformMotion(values);
  near(result.value, 152413.83936);
  const before = JSON.stringify({ result, input });
  const conversions = uniformMotionConversions(result, input, units);
  assert.ok(conversions[0].includes('1.23\\,\\mathrm{km/h}'));
  assert.ok(conversions[0].endsWith('\\approx 0.343\\,\\mathrm{m/s}'));
  assert.ok(conversions[1].endsWith('\\approx 4.44\\times 10^{5}\\,\\mathrm{s}'));
  const equation = uniformMotionEquation(result, input, units);
  assert.ok(equation.startsWith('s = v \\cdot t = '));
  assert.ok(equation.includes('0.343\\,\\mathrm{m/s}'));
  assert.ok(equation.endsWith('152\\,\\mathrm{km}'));
  assert.equal(JSON.stringify({ result, input }), before);
  for (const latex of [...conversions, equation]) assert.doesNotThrow(() => katex.renderToString(latex));
});
