/** Shared unit catalogue for every calculator. Factors convert to the SI unit.
 * AE: IAU astronomical unit, exact 149597870700 m.
 * Lj: light-year based on a Julian year of 365.25 days and c = 299792458 m/s.
 * Reference: https://ssd.jpl.nasa.gov/astro_par.html
 */
export const unitGroups = {
  pressure: { si: 'Pa', units: [{ symbol: 'Pa', factor: 1 }, { symbol: 'bar', factor: 100000 }, { symbol: 'atm', factor: 101325 }] },
  volume: { si: 'm³', units: [{ symbol: 'm³', factor: 1 }, { symbol: 'L', factor: 0.001 }] },
  amount: { si: 'mol', units: [{ symbol: 'mol', factor: 1 }] },
  temperature: { si: 'K', units: [{ symbol: 'K', factor: 1 }] },
  voltage: { si: 'V', units: [{ symbol: 'V', factor: 1 }] },
  current: { si: 'A', units: [{ symbol: 'A', factor: 1 }] },
  resistance: { si: 'Ω', units: [{ symbol: 'Ω', factor: 1 }] },
  capacitance: { si: 'F', units: [{ symbol: 'F', factor: 1 }] },
  inductance: { si: 'H', units: [{ symbol: 'H', factor: 1 }] },
  frequency: { si: 'Hz', units: [{ symbol: 'Hz', factor: 1 }] },
  power: { si: 'W', units: [{ symbol: 'W', factor: 1 }] },
  apparentPower: { si: 'VA', units: [{ symbol: 'VA', factor: 1 }] },
  reactivePower: { si: 'var', units: [{ symbol: 'var', factor: 1 }] },
  energy: { si: 'J', units: [{ symbol: 'J', factor: 1 }, { symbol: 'Wh', factor: 3600 }] },
  charge: { si: 'C', units: [{ symbol: 'C', factor: 1 }] },
  area: { si: 'm²', units: [{ symbol: 'm²', factor: 1 }, { symbol: 'cm²', factor: 1e-4 }, { symbol: 'mm²', factor: 1e-6 }] },
  flux: { si: 'Wb', units: [{ symbol: 'Wb', factor: 1 }] },
  fluxDensity: { si: 'T', units: [{ symbol: 'T', factor: 1 }] },
  fieldStrength: { si: 'A/m', units: [{ symbol: 'A/m', factor: 1 }] },
  electricField: { si: 'V/m', units: [{ symbol: 'V/m', factor: 1 }] },
  reluctance: { si: 'A/Wb', units: [{ symbol: 'A/Wb', factor: 1 }] },
  ratio: { si: '1', units: [{ symbol: '1', factor: 1 }, { symbol: '%', factor: 0.01 }] },
  decibel: { si: 'dB', units: [{ symbol: 'dB', factor: 1 }] },
  mass: { si: 'kg', units: [{ symbol: 'kg', factor: 1 }, { symbol: 'g', factor: 0.001 }] },
  angle: { si: 'rad', units: [{ symbol: 'rad', factor: 1 }, { symbol: '°', factor: Math.PI / 180, factorLatex: String.raw`\frac{\pi}{180}` }] },
  acceleration: { si: 'm/s²', units: [{ symbol: 'm/s²', factor: 1 }] },
  dimensionless: { si: '1', units: [{ symbol: '1', factor: 1 }] },
  force: { si: 'N', units: [{ symbol: 'N', factor: 1 }] },
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

/** English SI names used in theory; conversion factors remain in unitGroups. */
export const unitNames: Partial<Record<QuantityKind, string>> = {
  voltage: 'volt', current: 'ampere', resistance: 'ohm', capacitance: 'farad', inductance: 'henry',
  frequency: 'hertz', power: 'watt', apparentPower: 'volt-ampere', reactivePower: 'var',
  energy: 'joule', charge: 'coulomb', area: 'square meter', flux: 'weber', fluxDensity: 'tesla',
  fieldStrength: 'amperes per meter', electricField: 'volts per meter', reluctance: 'amperes per weber',
  ratio: 'dimensionless', decibel: 'decibel', dimensionless: 'dimensionless', length: 'meter',
  velocity: 'meters per second', time: 'second', angle: 'radian', force: 'newton'
};
