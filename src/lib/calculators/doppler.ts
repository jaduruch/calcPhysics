import { quantityLatex } from './quantities.ts';
import { getUnit, type QuantityKind } from '../physics/units.ts';
import { dopplerFields, type DopplerField, type DopplerResult } from '../physics/waves/doppler.ts';
export const dopplerKinds: Record<DopplerField | 'c', QuantityKind> = { fs: 'frequency', fo: 'frequency', vs: 'velocity', vo: 'velocity', c: 'velocity' };
export const dopplerUnits = { fs: 'Hz', fo: 'Hz', vs: 'm/s', vo: 'm/s', c: 'm/s' };
export const dopplerSymbols = { fs: 'f_s', fo: 'f_o', vs: 'v_s', vo: 'v_o', c: 'c' };
export function dopplerEquations(result: Extract<DopplerResult, { status: 'success' }>, units: Record<DopplerField | 'c', string>) {
  const v = result.values;
  const source = (key: DopplerField | 'c') => {
    const quantity = quantityLatex(v[key], dopplerUnits[key]);
    return v[key] < 0 ? `\\left(${quantity}\\right)` : quantity;
  };
  const c = source('c'), fs = source('fs'), fo = source('fo'), vs = source('vs'), vo = source('vo');
  const formulas: Record<DopplerField, string> = {
    fo: String.raw`f_s\cdot\frac{c+v_o}{c-v_s}`,
    fs: String.raw`f_o\cdot\frac{c-v_s}{c+v_o}`,
    vs: String.raw`c-\frac{f_s\cdot(c+v_o)}{f_o}`,
    vo: String.raw`\frac{f_o\cdot(c-v_s)}{f_s}-c`
  };
  const numeric = {
    fo: `${fs}\\cdot\\frac{${c}+${vo}}{${c}-${vs}}`,
    fs: `${fo}\\cdot\\frac{${c}-${vs}}{${c}+${vo}}`,
    vs: `${c}-\\frac{${fs}\\cdot\\left(${c}+${vo}\\right)}{${fo}}`,
    vo: `\\frac{${fo}\\cdot\\left(${c}-${vs}\\right)}{${fs}}-${c}`
  };
  const field = result.field;
  const equation = field ? `${dopplerSymbols[field]}=${formulas[field]}=${numeric[field]}\\approx ${quantityLatex(v[field] / getUnit(dopplerKinds[field], units[field]).factor, units[field], units[field] === dopplerUnits[field])}` : '';
  const conversions = [...dopplerFields, 'c' as const].flatMap(key => {
    if (key === field || units[key] === dopplerUnits[key] || (key === 'c' && result.assumedSoundSpeed)) return [];
    const unit = getUnit(dopplerKinds[key], units[key]);
    const factor = 'factorLatex' in unit ? unit.factorLatex : unit.factor.toString();
    return [`${dopplerSymbols[key]}=${quantityLatex(v[key] / unit.factor, units[key], false)}\\cdot\\frac{${factor}\\,\\mathrm{${dopplerUnits[key]}}}{1\\,\\mathrm{${units[key]}}}\\approx ${quantityLatex(v[key], dopplerUnits[key])}`];
  });
  return { equation, conversions,
    wavelength: `\\lambda=\\frac{c-v_s}{f_s}=\\frac{${c}-${vs}}{${fs}}\\approx ${quantityLatex(result.wavelength, 'm')}`,
    shift: `\\Delta f=f_o-f_s=${fo}-${fs}\\approx ${quantityLatex(result.shift, 'Hz')}`
  };
}
