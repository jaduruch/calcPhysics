import { formatDuration } from './duration.ts';
import { getUnit, unitGroups, type QuantityKind } from '../physics/units.ts';
import type { Field, MotionResult } from '../physics/mechanics/uniform-motion.ts';
import { formatQuantity, prefixes, type ParsedQuantity, type Prefix } from './quantities.ts';

export const motionQuantityKinds: Record<Field, QuantityKind> = { s0: 'length', s: 'length', v: 'velocity', t: 'time' };
export const defaultMotionUnits: Record<Field, string> = { s0: unitGroups.length.si, s: unitGroups.length.si, v: unitGroups.velocity.si, t: unitGroups.time.si };
const symbols: Record<Field, string> = { s0: 's_0', s: 's', v: 'v', t: 't' };
const formulas: Record<Field, string> = {
  s: String.raw`s_0 + v \cdot t`, s0: String.raw`s - v \cdot t`,
  v: String.raw`\frac{s - s_0}{t}`, t: String.raw`\frac{s - s_0}{v}`
};
function numberLatex(value: string) {
  return value.replace(/e\+?(-?\d+)/i, String.raw`\times 10^{$1}`);
}
function quantityLatex(number: string, prefix: Prefix, unit: string) {
  const unitLatex = prefix === 'u' ? `\\mu\\mathrm{${unit}}` : `\\mathrm{${prefix}${unit}}`;
  return `${numberLatex(number)}\\,${unitLatex}`;
}
/** Converts non-SI sources visibly before substituting them into the physical equation.
 * Prefixes on SI input units are retained; all displayed measurements use three significant figures; solver values remain untouched.
 */
export function uniformMotionConversions(result: MotionResult, input: Record<Field, ParsedQuantity>, selectedUnits: Record<Field, string> = defaultMotionUnits): string[] {
  if (result.status !== 'success') return [];
  return (Object.keys(motionQuantityKinds) as Field[]).flatMap(field => {
    const parsed = input[field];
    const si = unitGroups[motionQuantityKinds[field]].si;
    if (parsed.status !== 'valid' || selectedUnits[field] === si) return [];
    const unit = getUnit(motionQuantityKinds[field], selectedUnits[field]);
    const factor = 'factorLatex' in unit ? unit.factorLatex : numberLatex(unit.factor.toString());
    const original = quantityLatex(Number(parsed.number).toPrecision(3), parsed.prefix, selectedUnits[field]);
    const conversion = `\\frac{${factor}\\,\\mathrm{${si}}}{1\\,\\mathrm{${selectedUnits[field]}}}`;
    const convertedNumber = result.values[field].toPrecision(3);
    const converted = quantityLatex(convertedNumber, '', si);
    const equality = Number(convertedNumber) === result.values[field] && Number(Number(parsed.number).toPrecision(3)) === Number(parsed.number) ? '=' : String.raw`\approx`;
    return [`${symbols[field]} = ${original} \\cdot ${conversion} ${equality} ${converted}`];
  });
}
export function uniformMotionEquation(result: MotionResult, input: Record<Field, ParsedQuantity>, selectedUnits: Record<Field, string> = defaultMotionUnits): string {
  if (result.status !== 'success') return '';
  for (const field of Object.keys(selectedUnits) as Field[]) getUnit(motionQuantityKinds[field], selectedUnits[field]);
  let substitutionRounded = false;
  const source = (field: Field) => {
    const parsed = input[field];
    if (field === 's0' && result.assumedInitial) return String.raw`\left(0.00\,\mathrm{m}\right)`;
    if (parsed.status !== 'valid') throw new Error('Missing source quantity');
    const si = unitGroups[motionQuantityKinds[field]].si;
    const value = selectedUnits[field] === si ? Number(parsed.number) : result.values[field];
    const displayed = value.toPrecision(3);
    if (Number(displayed) !== value) substitutionRounded = true;
    const quantity = quantityLatex(displayed, selectedUnits[field] === si ? parsed.prefix : '', si);
    return `\\left(${quantity}\\right)`;
  };
  const numeric = result.field === 's' ? `${source('s0')} + ${source('v')} \\cdot ${source('t')}`
    : result.field === 's0' ? `${source('s')} - ${source('v')} \\cdot ${source('t')}`
    : `\\frac{${source('s')} - ${source('s0')}}{${source(result.field === 'v' ? 't' : 'v')}}`;
  const outputFactor = getUnit(motionQuantityKinds[result.field], selectedUnits[result.field]).factor;
  const formatted = formatQuantity(result.value / outputFactor);
  const displayedValue = Number(formatted.number) * prefixes.find(item => item.symbol === formatted.prefix)!.factor * outputFactor;
  const equality = displayedValue === result.value && !substitutionRounded ? '=' : String.raw`\approx`;
  const clock = result.field === 't' ? formatDuration(result.value) : '';
  const duration = clock ? ` = \\text{${clock}}` : '';
  return `${symbols[result.field]} = ${formulas[result.field]} = ${numeric} ${equality} ${quantityLatex(formatted.number, formatted.prefix, selectedUnits[result.field])}${duration}`;
}
