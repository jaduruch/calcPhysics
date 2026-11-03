import type { InclineResult } from '../physics/mechanics/inclined-plane.ts';
import { getUnit, unitGroups, type QuantityKind } from '../physics/units.ts';
import { formatQuantity, type ParsedQuantity, type Prefix } from './quantities.ts';

export const inclineFields = ['mass', 'angle', 'friction', 'gravity', 'length', 'height'] as const;
export type InclineField = (typeof inclineFields)[number];
export const inclineKinds: Record<InclineField, QuantityKind> = { mass: 'mass', angle: 'angle', friction: 'dimensionless', gravity: 'acceleration', length: 'length', height: 'length' };
export const inclineDefaults: Record<InclineField, string> = Object.fromEntries(inclineFields.map(key => [key, unitGroups[inclineKinds[key]].si])) as Record<InclineField, string>;
const symbols = { mass: 'm', angle: String.raw`\alpha`, friction: String.raw`\mu_k`, gravity: 'g', length: 'L', height: 'h' };
function number(value: string) { return value.replace(/e\+?(-?\d+)/i, String.raw`\times 10^{$1}`); }
function quantity(value: number, unit: string, prefix: Prefix = '') {
  const prefixLatex = prefix === 'u' ? '\\mu' : prefix ? `\\mathrm{${prefix}}` : '';
  const suffix = unit === '1' ? '' : unit === '°' ? `\\,${prefixLatex}{}^{\\circ}` : `\\,${prefix === 'u' ? '\\mu' : ''}\\mathrm{${prefix === 'u' ? '' : prefix}${unit.replace('²', '^{2}')}}`;
  return `${number(value.toPrecision(3))}${suffix}`;
}
function final(value: number, unit: string) {
  const formatted = formatQuantity(value);
  return quantity(Number(formatted.number), unit, formatted.prefix);
}
export function inclineEquations(result: InclineResult): string[] {
  if (result.status !== 'success') return [];
  const r = result;
  const m = `\\left(${quantity(r.mass, 'kg')}\\right)`;
  const g = `\\left(${quantity(r.gravity, 'm/s²')}\\right)`;
  const a = `\\left(${quantity(r.angle, 'rad')}\\right)`;
  const mu = quantity(r.friction, '1');
  const normal = `\\left(${quantity(r.normal, 'N')}\\right)`;
  const parallel = `\\left(${quantity(r.parallel, 'N')}\\right)`;
  const friction = `\\left(${quantity(r.frictionForce, 'N')}\\right)`;
  const extra: string[] = [];
  if (r.geometryTarget === 'height') extra.push(`h = L \\sin\\alpha = ${quantity(r.length!, 'm')} \\sin${a} \\approx ${final(r.height!, 'm')}`);
  if (r.geometryTarget === 'length') extra.push(`L = \\frac{h}{\\sin\\alpha} = \\frac{${quantity(r.height!, 'm')}}{\\sin${a}} \\approx ${final(r.length!, 'm')}`);
  if (r.geometryTarget === 'angle') extra.push(`\\alpha = \\arcsin\\left(\\frac{h}{L}\\right) = \\arcsin\\left(\\frac{${quantity(r.height!, 'm')}}{${quantity(r.length!, 'm')}}\\right) \\approx ${final(r.angle, 'rad')}`);

  return [
    ...extra,
    `F_g = m g = ${m} \\cdot ${g} \\approx ${final(r.weight, 'N')}`,
    `F_N = m g \\cos(\\alpha) = ${m} \\cdot ${g} \\cos${a} \\approx ${final(r.normal, 'N')}`,
    `F_{\\parallel} = m g \\sin(\\alpha) = ${m} \\cdot ${g} \\sin${a} \\approx ${final(r.parallel, 'N')}`,
    `F_f = \\mu_k F_N = ${mu} \\cdot ${normal} \\approx ${final(r.frictionForce, 'N')}`,
    `F_{net} = F_{\\parallel} - F_f = ${parallel} - ${friction} \\approx ${final(r.net, 'N')}`,
    `a = g(\\sin\\alpha - \\mu_k\\cos\\alpha) = ${g} \\left(\\sin${a} - ${mu} \\cos${a}\\right) \\approx ${final(r.acceleration, 'm/s²')}`,
    ...(r.endVelocity === undefined ? [] : [`v_{end} = \\sqrt{2 a L} = \\sqrt{2 \\cdot ${quantity(r.acceleration, 'm/s²')} \\cdot ${quantity(r.length!, 'm')}} \\approx ${final(r.endVelocity, 'm/s')}`])
  ];
}
export function inclineConversions(result: InclineResult, parsed: Record<InclineField, ParsedQuantity>, units: Record<InclineField, string>): string[] {
  if (result.status !== 'success') return [];
  return inclineFields.flatMap(field => {
    const input = parsed[field];
    if (input.status !== 'valid' || units[field] === inclineDefaults[field]) return [];
    const definition = getUnit(inclineKinds[field], units[field]);
    const factor = 'factorLatex' in definition ? definition.factorLatex : number(definition.factor.toString());
    const original = quantity(Number(input.number), units[field], input.prefix);
    return [`${symbols[field]} = ${original} \\cdot \\frac{${factor}\\,\\mathrm{${inclineDefaults[field]}}}{1\\,\\mathrm{${units[field]}}} \\approx ${quantity(input.value, inclineDefaults[field])}`];
  });
}
