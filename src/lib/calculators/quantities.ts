import {evaluateArithmetic} from './arithmetic.ts';
import { getUnit, toSI, fromSI, type QuantityKind } from '../physics/units.ts';

export const prefixes = [
  { symbol: 'p', factor: 1e-12 }, { symbol: 'n', factor: 1e-9 },
  { symbol: 'u', factor: 1e-6 }, { symbol: 'm', factor: 1e-3 },
  { symbol: 'c', factor: 1e-2 }, { symbol: 'd', factor: 1e-1 },
  { symbol: '', factor: 1 }, { symbol: 'k', factor: 1e3 },
  { symbol: 'M', factor: 1e6 }, { symbol: 'G', factor: 1e9 },
  { symbol: 'T', factor: 1e12 }
] as const;
export type Prefix = (typeof prefixes)[number]['symbol'];
export type ParsedQuantity = { status: 'empty' | 'invalid' } | { status: 'valid'; value: number; number: string; prefix: Prefix; expression?: string; hasExplicitPrefix?: boolean };
export function parseQuantity(raw: string, fallbackPrefix: Prefix = ''): ParsedQuantity {
  if(raw.length>4096)return {status:'invalid'};
  const text = raw.trim();
  if (!text) return { status: 'empty' };
  const match = text.match(/^([+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?)\s*([pnumcdkMGTµμ]?)$/);
  const parseLiteral=(numberText:string,prefix:Prefix):number=>{
    const number=Number(numberText),value=number*prefixes.find(item=>item.symbol===prefix)!.factor;
    if(!Number.isFinite(value)||(number!==0&&value===0)||(number===0&&/[1-9]/.test(numberText.split(/[eE]/)[0])))throw new RangeError('Invalid numeric literal');
    return value;
  };
  if(match){
    const numberText=match[1].replace(',','.'),prefix=(match[2].replace(/[µμ]/,'u')||fallbackPrefix) as Prefix;
    try{return {status:'valid',value:parseLiteral(numberText,prefix),number:numberText,prefix};}catch{return {status:'invalid'};}
  }
  const expression=evaluateArithmetic(text,(number,prefix)=>parseLiteral(number,prefix as Prefix));
  if(!expression)return {status:'invalid'};
  const prefix=expression.hasPrefix?'':fallbackPrefix;
  const value=expression.value*prefixes.find(item=>item.symbol===prefix)!.factor;
  if(!Number.isFinite(value)||(expression.value!==0&&value===0))return {status:'invalid'};
  // Existing equation adapters receive an evaluated scalar, never expression text as a number.
  return {status:'valid',value,number:String(expression.value),prefix,expression:raw,hasExplicitPrefix:expression.hasPrefix};
}
/** Engineering prefixes by default. Round only for display, retaining trailing significant zeroes. */
export function formatQuantity(value: number): { number: string; prefix: Prefix } {
  if (!Number.isFinite(value)) throw new RangeError('A finite value is required');
  if (value === 0) return { number: '0.00', prefix: '' };
  const engineering = prefixes.filter(item => !['c', 'd'].includes(item.symbol));
  let index = Math.max(0, engineering.findLastIndex(item => Math.abs(value) >= item.factor));
  let scaled = value / engineering[index].factor;
  if (Math.abs(Number(scaled.toPrecision(3))) >= 1000 && index < engineering.length - 1) {
    index++;
    scaled = value / engineering[index].factor;
  }
  // Scientific notation retains three significant digits outside the available prefix range.
  return { number: scaled.toPrecision(3), prefix: engineering[index].symbol };
}

/** Converts typed prefix + selected unit to SI while retaining the original input notation. */
export function parseQuantityInUnit(raw: string, kind: QuantityKind, unit: string): ParsedQuantity {
  const definition = getUnit(kind, unit);
  const parsed = parseQuantity(raw);
  if (parsed.status !== 'valid') return parsed;
  if (('offset' in definition || kind==='powerLevel') && (parsed.prefix||parsed.hasExplicitPrefix)) return { status: 'invalid' };
  const value = toSI(parsed.value, kind, unit);
  if (!Number.isFinite(value) || (!('offset' in definition) && parsed.value !== 0 && value === 0)) return { status: 'invalid' };
  return { ...parsed, value };
}
/** Explicit text conversion preserving physical value and prefix, without display rounding.
 * Calculator unit menus deliberately keep raw input unchanged and do not call this helper. */
export function changeQuantityUnit(raw: string, kind: QuantityKind, from: string, to: string): string {
  const oldUnit = getUnit(kind, from);
  const newUnit = getUnit(kind, to);
  const parsed = parseQuantity(raw);
  if (parsed.status !== 'valid' || from === to) return raw;
  if ('offset' in oldUnit || 'offset' in newUnit) return `${fromSI(toSI(parsed.value, kind, from), kind, to)}`;
  return `${Number(parsed.number) * (oldUnit.factor / newUnit.factor)}${parsed.prefix}`;
}

/** A scalar engineering prefix cannot be prepended to m²/m³ or kg unchanged.
 * For these compound base units, retain three significant digits in the base unit.
 */
export function formatMeasurement(value:number,unit:string,engineering=true):{number:string;prefix:Prefix} {
 if(!Number.isFinite(value))throw new RangeError('A finite value is required');
 return engineering&&!/^(?:m[²³]|kg(?:$|\/)|1\/|°(?:[CF]|Ra|Ré))/.test(unit)?formatQuantity(value):{number:value.toPrecision(3),prefix:''};
}
/** Shared three-significant-digit LaTeX measurement, with optional engineering prefixes. */
export function quantityLatex(value: number, unit: string, engineering = true): string {
  const formatted = formatMeasurement(value,unit,engineering);
  const number = formatted.number.replace(/e\+?(-?\d+)/i, String.raw`\times 10^{$1}`);
  const prefix = formatted.prefix === 'u' ? String.raw`\mu ` : formatted.prefix;
  return `${number}${unit ? `\\,\\mathrm{${prefix}${unit.replace('°Ré', String.raw`{}^\circ Re`).replace('²', '^{2}').replace('³', '^{3}')}}` : ''}`;
}
