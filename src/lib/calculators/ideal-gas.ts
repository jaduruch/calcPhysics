import { formatQuantity } from './quantities.ts';
import { getUnit, unitGroups, type QuantityKind } from '../physics/units.ts';
import { gasFields, type GasField } from '../physics/thermodynamics/ideal-gas.ts';
export const gasKinds: Record<GasField, QuantityKind> = { p: 'pressure', V: 'volume', n: 'amount', T: 'temperature' };
export const gasUnits: Record<GasField, string> = { p: 'Pa', V: 'm³', n: 'mol', T: 'K' };
const latexUnit = (unit: string) => unit.replace('³', '^{3}');
export function gasQuantity(value: number, unit: string, prefixed = true): string {
  const formatted = prefixed ? formatQuantity(value) : { number: value.toPrecision(3), prefix: '' };
  const number = formatted.number.replace(/e\+?(-?\d+)/i, String.raw`\times 10^{$1}`);
  const prefix = formatted.prefix === 'u' ? String.raw`\mu ` : formatted.prefix;
  return `${number}\\,\\mathrm{${prefix}${latexUnit(unit)}}`;
}
export function gasEquations(field: GasField, value: number, values: Partial<Record<GasField, number>>, units: Record<GasField, string>) {
  const source = (key: GasField) => gasQuantity(values[key]!, gasUnits[key]);
  const r = String.raw`8.31446261815324\,\mathrm{J\,mol^{-1}\,K^{-1}}`;
  const formulas = { p: String.raw`\frac{n \cdot R \cdot T}{V}`, V: String.raw`\frac{n \cdot R \cdot T}{p}`, n: String.raw`\frac{p \cdot V}{R \cdot T}`, T: String.raw`\frac{p \cdot V}{n \cdot R}` };
  const numeric = field === 'p' || field === 'V'
    ? `\\frac{${source('n')} \\cdot ${r} \\cdot ${source('T')}}{${source(field === 'p' ? 'V' : 'p')}}`
    : `\\frac{${source('p')} \\cdot ${source('V')}}{${field === 'n' ? r : source('n')} \\cdot ${field === 'n' ? source('T') : r}}`;
  const unit = units[field];
  const conversions = gasFields.flatMap(key => {
    if (values[key] === undefined || units[key] === gasUnits[key]) return [];
    const factor = getUnit(gasKinds[key], units[key]).factor;
    return [`${key} = ${gasQuantity(values[key]! / factor, units[key], false)} \\cdot \\frac{${factor}\\,\\mathrm{${latexUnit(unitGroups[gasKinds[key]].si)}}}{1\\,\\mathrm{${latexUnit(units[key])}}} \\approx ${source(key)}`];
  });
  return { conversions, equation: `${field} = ${formulas[field]} = ${numeric} \\approx ${gasQuantity(value / getUnit(gasKinds[field], unit).factor, unit, unit === gasUnits[field])}` };
}
