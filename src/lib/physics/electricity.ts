import { solveResistorNetwork, solveCapacitorNetwork, solveInductorNetwork } from './resistor-network.ts';
import { solveOhm, solveTransformer, type TransformerMode, solveInductor, solveRcAc, solveRlAc, solveRcTransient, solveRlTransient, solveCapacitorCalculations, solveSine, solveAmplitude, solvePwm, solveFilter, solveResonator, solveGain, filterDomains, resonatorDomains, gainDomains, sineDomains, amplitudeDomains, pwmDomains, rcAcDomains, rlAcDomains, rcTransientDomains, rlTransientDomains, capacitorCalculationDomains, inductorDomains, ohmDomains, transformerDomains, solveDivider, dividerDomains, loadedDividerDomains } from './electrical-relations.ts';
/** Explicit SI models adapted and reviewed from Elecalculate electrical engineering.
 * Each model's domains and assumptions are documented in content/electricity.ts.
 * Constants: NIST CODATA 2022, https://physics.nist.gov/cuu/Constants/ . */
export const MU0 = 1.25663706127e-6;
export const EPS0 = 8.8541878188e-12;
export type Domain = 'positive' | 'nonnegative' | 'signed' | 'unitInterval' | 'efficiency' | 'powerAngle';
export type ElectricalPhysics = { inputs: Readonly<Record<string, Domain>> } & (
  { calculate: (values: Readonly<Record<string, number>>) => Record<string, number>; resolve?: never }
  | { resolve: (values: Readonly<Record<string, number>>) => ElectricalResult; calculate?: never }
);
export const electricalPhysics = {
  'ohms-law': { inputs: ohmDomains, resolve: solveOhm },
  'voltage-divider': { inputs: dividerDomains, resolve: values => solveDivider(values) },
  'loaded-divider': { inputs: loadedDividerDomains, resolve: values => solveDivider(values, true) },
  'resistance-series': { inputs: { R1: 'positive', R2: 'positive' }, resolve: values => solveResistorNetwork(values) },
  'resistance-parallel': { inputs: { R1: 'positive', R2: 'positive' }, resolve: values => solveResistorNetwork(values, true) },
  'capacitance-series': { inputs: { C1: 'positive', C2: 'positive' }, resolve: values => solveCapacitorNetwork(values) },
  'capacitance-parallel': { inputs: { C1: 'positive', C2: 'positive' }, resolve: values => solveCapacitorNetwork(values, true) },
  'inductance-series': { inputs: { L1: 'positive', L2: 'positive' }, resolve: values => solveInductorNetwork(values) },
  'inductance-parallel': { inputs: { L1: 'positive', L2: 'positive' }, resolve: values => solveInductorNetwork(values, true) },
  'delta-star': { inputs: {"a": "positive", "b": "positive", "c": "positive"}, calculate: v => ({ "R1": v.a*v.b/(v.a+v.b+v.c), "R2": v.b*v.c/(v.a+v.b+v.c), "R3": v.c*v.a/(v.a+v.b+v.c) }) },
  'star-delta': { inputs: {"a": "positive", "b": "positive", "c": "positive"}, calculate: v => ({ "R1": v.a+v.b+v.a*v.b/v.c, "R2": v.b+v.c+v.b*v.c/v.a, "R3": v.c+v.a+v.c*v.a/v.b }) },
  'sine-rms': { inputs:amplitudeDomains,resolve:values=>solveAmplitude(values,2) },
  'square-rms': { inputs:amplitudeDomains,resolve:values=>solveAmplitude(values,1) },
  'triangle-rms': { inputs:amplitudeDomains,resolve:values=>solveAmplitude(values,3) },
  'sine-signal': { inputs:sineDomains,resolve:solveSine },
  'pwm': { inputs:pwmDomains,resolve:solvePwm },
  'ac-power': { inputs: {"U": "nonnegative", "I": "nonnegative", "phi": "powerAngle"}, calculate: v => ({ "S": v.U*v.I, "P": v.U*v.I*Math.cos(v.phi), "Q": v.U*v.I*Math.sin(v.phi) }) },
  'transformer': { inputs: transformerDomains, resolve: solveTransformer },
  'magnetic-circuit': { inputs: {"N": "positive", "I": "nonnegative", "l": "positive", "A": "positive", "mu": "positive"}, calculate: v => ({ "Theta": v.N*v.I, "H": v.N*v.I/v.l, "B": MU0*v.mu*v.N*v.I/v.l, "Phi": MU0*v.mu*v.N*v.I*v.A/v.l, "Rm": v.l/(MU0*v.mu*v.A) }) },
  'faraday': { inputs: {"N": "positive", "dPhi": "signed", "dt": "positive"}, calculate: v => ({ "Uind": -v.N*v.dPhi/v.dt }) },
  'capacitor': { inputs: capacitorCalculationDomains, resolve: solveCapacitorCalculations },
  'plate-capacitor': { inputs: {"A": "positive", "d": "positive", "er": "positive", "U": "nonnegative"}, calculate: v => ({ "C": EPS0*v.er*v.A/v.d, "E": v.U/v.d }) },
  'charge-flow': { inputs: {"Q": "signed", "dt": "positive", "E": "signed"}, calculate: v => ({ "I": v.Q/v.dt, "F": v.Q*v.E }) },
  'circular-plate': { inputs: {"d": "positive"}, calculate: v => ({ "A": Math.PI*v.d*v.d/4 }) },
  'inductor': { inputs: inductorDomains, resolve: solveInductor },
  'rc-series-ac': { inputs: rcAcDomains, resolve: values => solveRcAc(values) },
  'rc-parallel-ac': { inputs: rcAcDomains, resolve: values => solveRcAc(values, true) },
  'rc-charge': { inputs: rcTransientDomains, resolve: values => solveRcTransient(values) },
  'rc-discharge': { inputs: rcTransientDomains, resolve: values => solveRcTransient(values, true) },
  'rl-series-ac': { inputs: rlAcDomains, resolve: values=>solveRlAc(values) },
  'rl-parallel-ac': { inputs: rlAcDomains, resolve: values=>solveRlAc(values,true) },
  'rl-charge': { inputs:rlTransientDomains,resolve:values=>solveRlTransient(values) },
  'rl-discharge': { inputs:rlTransientDomains,resolve:values=>solveRlTransient(values,true) },
  'series-rlc': { inputs:resonatorDomains,resolve:v=>solveResonator(v) },
  'parallel-rlc': { inputs:resonatorDomains,resolve:v=>solveResonator(v,true) },
  'voltage-gain': { inputs:gainDomains,resolve:solveGain },
  'power-gain': { inputs: {"a": "positive", "b": "positive"}, calculate: v => ({ "gain": 10*Math.log10(v.b/v.a), "attenuation": 10*Math.log10(v.a/v.b), "ratio": v.b/v.a }) },
  'rc-high-pass': { inputs:filterDomains,resolve:v=>solveFilter(v,true,true) },
  'rc-low-pass': { inputs:filterDomains,resolve:v=>solveFilter(v,false,true) },
  'rl-high-pass': { inputs:filterDomains,resolve:v=>solveFilter(v,true,false) },
  'rl-low-pass': { inputs:filterDomains,resolve:v=>solveFilter(v,false,false) },
  'star-system': { inputs: {"Up": "nonnegative", "Ip": "nonnegative", "phi": "powerAngle"}, calculate: v => ({ "UL": Math.sqrt(3)*v.Up, "IL": v.Ip, "P": 3*v.Up*v.Ip*Math.cos(v.phi), "Q": 3*v.Up*v.Ip*Math.sin(v.phi), "S": 3*v.Up*v.Ip }) },
  'delta-system': { inputs: {"Up": "nonnegative", "Ip": "nonnegative", "phi": "powerAngle"}, calculate: v => ({ "UL": v.Up, "IL": Math.sqrt(3)*v.Ip, "P": 3*v.Up*v.Ip*Math.cos(v.phi), "Q": 3*v.Up*v.Ip*Math.sin(v.phi), "S": 3*v.Up*v.Ip }) },
  'three-phase-generator': { inputs: {"Up": "nonnegative", "f": "positive", "t": "nonnegative"}, calculate: v => ({ "u1": v.Up*Math.sin(2*Math.PI*v.f*v.t), "u2": v.Up*Math.sin(2*Math.PI*v.f*v.t-2*Math.PI/3), "u3": v.Up*Math.sin(2*Math.PI*v.f*v.t+2*Math.PI/3) }) },
} satisfies Record<string, ElectricalPhysics>;
export type ElectricalModelId = keyof typeof electricalPhysics;
export type ElectricalResult = { status: 'success'; values: Record<string, number>; outputs: Record<string, number>; steps?: { target: string; formula: string }[]; assumedIdeal?: boolean } | { status: 'incomplete' | 'invalid' | 'out-of-range' | 'no-solution' | 'underdetermined' | 'too-many-inputs'; fields: string[] };
export function inDomain(value: number, domain: Domain): boolean {
  return Number.isFinite(value) && (domain === 'positive' ? value > 0
    : domain === 'nonnegative' ? value >= 0 : domain === 'unitInterval' ? value >= 0 && value <= 1
    : domain === 'efficiency' ? value > 0 && value <= 1
    : domain === 'powerAngle' ? value >= -Math.PI / 2 && value <= Math.PI / 2 : true);
}
export function solveElectrical(id: ElectricalModelId, values: Readonly<Record<string, number>>, transformerMode?: TransformerMode): ElectricalResult {
  if (id === 'transformer' && transformerMode) return solveTransformer(values, transformerMode);
  const model: ElectricalPhysics = electricalPhysics[id];
  if(model.resolve) return model.resolve(values);
  const invalid = Object.entries(model.inputs).filter(([key, domain]) => values[key] !== undefined && !inDomain(values[key], domain)).map(([key]) => key);
  if (invalid.length) return { status: 'invalid', fields: invalid };
  const missing = Object.keys(model.inputs).filter(key => values[key] === undefined);
  if (missing.length) return { status: 'incomplete', fields: missing };
  const outputs = model.calculate(values);
  if (Object.values(outputs).some(value => !Number.isFinite(value))) return { status: 'out-of-range', fields: [] };
  return { status: 'success', values: { ...values }, outputs };
}

/** Ideal unipolar PWM voltage. Pulse starts at each integer period, high for dT. */
export function pwmVoltage(peak: number, frequency: number, duty: number, time: number): number {
  if (!inDomain(peak, 'nonnegative') || !inDomain(frequency, 'positive') || !inDomain(duty, 'unitInterval') || !inDomain(time, 'nonnegative')) throw new RangeError('Invalid PWM domain');
  const cycles = frequency * time;
  if (!Number.isFinite(cycles)) throw new RangeError('PWM phase exceeds numeric range');
  return duty === 1 || cycles - Math.floor(cycles) < duty ? peak : 0;
}
