/** Shared unit catalogue for every calculator. Factors convert to the SI unit.
 * AE: IAU astronomical unit, exact 149597870700 m.
 * Lj: light-year based on a Julian year of 365.25 days and c = 299792458 m/s.
 * Reference: https://ssd.jpl.nasa.gov/astro_par.html
 */
export const unitGroups = {
  areaRate: { si:'m²/s',units:[{symbol:'m²/s',factor:1}] },
  angularVelocity: { si: 'rad/s', units: [{ symbol: 'rad/s', factor: 1 }] },
  angularAcceleration: { si: 'rad/s²', units: [{ symbol: 'rad/s²', factor: 1 }] },
  torque: { si: 'N m', units: [{ symbol: 'N m', factor: 1 }] },
  viscosity: { si: 'Pa s', units: [{ symbol: 'Pa s', factor: 1 }] },
  volumeFlow: { si: 'm³/s', units: [{ symbol: 'm³/s', factor: 1 }, { symbol: 'L/s', factor: .001 }, { symbol: 'L/min', factor: .001/60 }] },
  massFlow: { si: 'kg/s', units: [{ symbol: 'kg/s', factor: 1 }, { symbol: 'kg/h', factor: 1/3600 }] },
  molarMass: { si: 'kg/mol', units: [{ symbol: 'kg/mol', factor: 1 }, { symbol: 'g/mol', factor: .001 }] },
  springConstant: { si: 'N/m', units: [{symbol:'N/m',factor:1},{symbol:'N/mm',factor:1000}] },
  surfaceTension: { si: 'N/m', units: [{ symbol: 'N/m', factor: 1 }, { symbol: 'J/m²', factor: 1 }] },
  thermalConductivity: { si: 'W/(m K)', units: [{ symbol: 'W/(m K)', factor: 1 }] },
  heatTransferCoefficient: { si: 'W/(m² K)', units: [{ symbol: 'W/(m² K)', factor: 1 }] },
  luminousIntensity: { si: 'cd', units: [{ symbol: 'cd', factor: 1 }] },
  luminousFlux: { si: 'lm', units: [{ symbol: 'lm', factor: 1 }] },
  luminousEnergy: { si: 'lm s', units: [{ symbol: 'lm s', factor: 1 }] },
  illuminance: { si: 'lx', units: [{ symbol: 'lx', factor: 1 }] },
  luminance: { si: 'cd/m²', units: [{ symbol: 'cd/m²', factor: 1 }] },
  solidAngle: { si: 'sr', units: [{ symbol: 'sr', factor: 1 }] },
  powerLevel: { si: 'dBm', units: [{ symbol: 'dBm', factor: 1 }] },

  pressure: { si: 'Pa', units: [{ symbol: 'Pa', factor: 1 }, { symbol: 'bar', factor: 100000 }, { symbol: 'atm', factor: 101325 }] },
  volume: { si: 'm³', units: [{ symbol: 'm³', factor: 1 }, { symbol: 'L', factor: 0.001 }] },
  amount: { si: 'mol', units: [{ symbol: 'mol', factor: 1 }] },
  temperature: { si: 'K', units: [{ symbol: 'K', factor: 1 }, { symbol: '°C', factor: 1, offset: 273.15 }, { symbol: '°F', factor: 5 / 9, offset: 459.67 }, { symbol: '°Ra', factor: 5 / 9, factorLatex: String.raw`\frac{5}{9}` }, { symbol: '°Ré', factor: 5 / 4, offset: 218.52, factorLatex: String.raw`\frac{5}{4}` }] },
  temperatureDifference: { si: 'K', units: [{ symbol: 'K', factor: 1 }, { symbol: '°C', factor: 1 }] },
  density: { si: 'kg/m³', units: [{ symbol: 'kg/m³', factor: 1 }, { symbol: 'g/cm³', factor: 1000 }] },
  heatCapacity: { si: 'J/K', units: [{ symbol: 'J/K', factor: 1 }] },
  specificHeat: { si: 'J/(kg K)', units: [{ symbol: 'J/(kg K)', factor: 1 }] },
  specificEnergy: { si: 'J/kg', units: [{ symbol: 'J/kg', factor: 1 }] },
  expansionCoefficient: { si: '1/K', units: [{ symbol: '1/K', factor: 1 }] },
  thermalResistance: { si: 'K/W', units: [{ symbol: 'K/W', factor: 1 }] },
  intensity: { si: 'W/m²', units: [{ symbol: 'W/m²', factor: 1 }] },
  opticalPower: { si: '1/m', units: [{ symbol: '1/m', factor: 1 }] },
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
/** Input defaults are separate from the SI units used internally. */
export function defaultInputUnit(kind: QuantityKind): string {
  return kind === 'angle' ? '°' : unitGroups[kind].si;
}
export function getUnit(kind: QuantityKind, symbol: string) {
  const unit = unitGroups[kind].units.find(unit => unit.symbol === symbol);
  if (!unit) throw new RangeError(`Unsupported ${kind} unit: ${symbol}`);
  return unit;
}

/** English SI names used in theory; conversion factors remain in unitGroups. */
export const unitNames: Partial<Record<QuantityKind, string>> = {
  areaRate:'square meters per second',
  angularVelocity:'radians per second',angularAcceleration:'radians per second squared',torque:'newton meter',
  viscosity:'pascal second',volumeFlow:'cubic meters per second',massFlow:'kilograms per second',molarMass:'kilograms per mole',
  springConstant:'newtons per meter',surfaceTension:'newtons per meter',thermalConductivity:'watts per meter kelvin',heatTransferCoefficient:'watts per square meter kelvin',
  luminousIntensity:'candela',luminousFlux:'lumen',luminousEnergy:'lumen second',illuminance:'lux',luminance:'candelas per square meter',solidAngle:'steradian',powerLevel:'decibels referenced to one milliwatt',

  temperature: 'kelvin', temperatureDifference: 'kelvin interval', density: 'kilograms per cubic meter',
  heatCapacity: 'joules per kelvin', specificHeat: 'joules per kilogram kelvin', specificEnergy: 'joules per kilogram',
  expansionCoefficient: 'inverse kelvin', thermalResistance: 'kelvins per watt', intensity: 'watts per square meter', opticalPower: 'inverse meter (diopter)', mass: 'kilogram',
  voltage: 'volt', current: 'ampere', resistance: 'ohm', capacitance: 'farad', inductance: 'henry',
  frequency: 'hertz', power: 'watt', apparentPower: 'volt-ampere', reactivePower: 'var',
  energy: 'joule', charge: 'coulomb', area: 'square meter', flux: 'weber', fluxDensity: 'tesla',
  fieldStrength: 'amperes per meter', electricField: 'volts per meter', reluctance: 'amperes per weber',
  ratio: 'dimensionless', decibel: 'decibel', dimensionless: 'dimensionless', length: 'meter',
  velocity: 'meters per second', time: 'second', angle: 'radian', force: 'newton'
};

/** Affine scale offset is applied before the factor: K = (°F + 459.67) × 5/9. */
export function toSI(value: number, kind: QuantityKind, symbol: string): number {
  const unit = getUnit(kind, symbol);
  return (value + ('offset' in unit ? unit.offset : 0)) * unit.factor;
}
export function fromSI(value: number, kind: QuantityKind, symbol: string): number {
  const unit = getUnit(kind, symbol);
  return value / unit.factor - ('offset' in unit ? unit.offset : 0);
}
