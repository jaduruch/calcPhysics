/** Shared unit catalogue for every calculator. Factors convert to the SI unit.
 * AE: IAU astronomical unit, exact 149597870700 m.
 * Lj: light-year based on a Julian year of 365.25 days and c = 299792458 m/s.
 * Reference: https://ssd.jpl.nasa.gov/astro_par.html
 */
export const unitGroups = {
  length: { si: 'm', units: [
    { symbol: 'm', factor: 1 },
    { symbol: 'AE', factor: 149597870700 },
    { symbol: 'Lj', factor: 299792458 * 365.25 * 86400 }
  ] },
  velocity: { si: 'm/s', units: [
    { symbol: 'm/s', factor: 1 }, { symbol: 'km/h', factor: 1 / 3.6, factorLatex: String.raw`\frac{1000}{3600}` }
  ] },
  time: { si: 's', units: [
    { symbol: 's', factor: 1 }, { symbol: 'min', factor: 60 },
    { symbol: 'h', factor: 3600 }, { symbol: 'd', factor: 86400 }
  ] }
} as const;
export type QuantityKind = keyof typeof unitGroups;
export function getUnit(kind: QuantityKind, symbol: string) {
  const unit = unitGroups[kind].units.find(unit => unit.symbol === symbol);
  if (!unit) throw new RangeError(`Unsupported ${kind} unit: ${symbol}`);
  return unit;
}
