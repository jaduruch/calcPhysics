import type { ElectricalResult, Domain } from './electricity.ts';
import { inDomain, MU0, EPS0 } from './electricity.ts';

type Values = Readonly<Record<string, number>>;
interface Relation { target: string; inputs: string[]; formula: string; calculate: (v: Values) => number; deriveOnly?: boolean }
const relation = (target: string, inputs: string[], formula: string, calculate: Relation['calculate'], deriveOnly = false): Relation => ({ target, inputs, formula, calculate, deriveOnly });
/** All inverses are explicit. These relations are limited to the concrete circuit models below. */
function product(total: string, a: string, b: string): Relation[] {
  return [relation(total,[a,b],`${a}${b}`,v=>v[a]*v[b]), relation(a,[total,b],`\\frac{${total}}{${b}}`,v=>v[total]/v[b]), relation(b,[total,a],`\\frac{${total}}{${a}}`,v=>v[total]/v[a])];
}
function ohmRelations(suffix = ''): Relation[] {
  const u='U'+suffix, i='I'+suffix, r='R'+suffix, p='P'+suffix;
  return [...product(u,i,r), ...product(p,u,i),
    relation(p,[i,r],`${i}^2${r}`,v=>v[i]*v[i]*v[r]),
    relation(p,[u,r],`\\frac{${u}^2}{${r}}`,v=>v[u]*(v[u]/v[r])),
    relation(u,[p,r],`\\sqrt{${p}${r}}`,v=>Math.sqrt(v[p])*Math.sqrt(v[r])),
    relation(i,[p,r],`\\sqrt{\\frac{${p}}{${r}}}`,v=>Math.sqrt(v[p])/Math.sqrt(v[r])),
    relation(r,[p,i],`\\frac{${p}}{${i}^2}`,v=>(v[p]/v[i])/v[i]),
    relation(r,[u,p],`\\frac{${u}^2}{${p}}`,v=>v[u]*(v[u]/v[p]))];
}
export const ohmDomains: Record<string,Domain> = { U:'nonnegative', I:'nonnegative', R:'positive', P:'nonnegative' };
export const transformerDomains: Record<string,Domain> = {
  U1:'nonnegative', U2:'nonnegative', I1:'nonnegative', I2:'nonnegative', R1:'positive', R2:'positive', P1:'nonnegative', P2:'nonnegative',
  N1:'positive', N2:'positive', C1:'positive', C2:'positive', n:'positive', eta:'efficiency'
};
const agrees = (a: number,b: number) => a === b || Math.abs(a-b) <= 1e-9 * Math.max(Math.abs(a),Math.abs(b));
/** Model-bounded propagation: each pass can add at most one value per field, never replace a manual value. */
function resolve(given: Values, domains: Record<string,Domain>, relations: readonly Relation[], assumedIdeal = false): ElectricalResult {
  const invalid = Object.keys(given).filter(key=>!(key in domains) || !inDomain(given[key],domains[key]));
  if(invalid.length) return {status:'invalid',fields:invalid};
  const values={...given};
  const steps: {target:string; formula:string}[]=[];
  const conflicts=new Set<string>();
  let outOfRange=false;
  for(let pass=0;pass<=Object.keys(domains).length;pass++) {
    let changed=false;
    for(const rule of relations) {
      if(!rule.inputs.every(key=>values[key] !== undefined)) continue;
      if(rule.deriveOnly && values[rule.target] !== undefined)continue;
      const computed=rule.calculate(values);
      // A zero divisor cannot determine a unique inverse. Forward equations below still validate the constraint.
      if(Number.isNaN(computed)) continue;
      if(!Number.isFinite(computed)) { if(values[rule.target] === undefined) outOfRange=true; continue; }
      if(!inDomain(computed,domains[rule.target])) {conflicts.add(rule.target); continue;}
      if(values[rule.target] !== undefined) {
        if(!agrees(values[rule.target],computed)) {conflicts.add(rule.target);rule.inputs.forEach(key=>conflicts.add(key));}
      } else {
        values[rule.target]=computed;steps.push({target:rule.target,formula:rule.formula});changed=true;
      }
    }
    if(!changed)break;
  }
  if(conflicts.size)return {status:'no-solution',fields:[...conflicts]};
  const outputs=Object.fromEntries(steps.map(step=>[step.target,values[step.target]]));
  if(!steps.length)return {status:outOfRange?'out-of-range':Object.keys(given).length>=2?'underdetermined':'incomplete',fields:[]};
  return {status:'success',values,outputs,steps,assumedIdeal};
}
export function solveOhm(given: Values): ElectricalResult {
  const fields=Object.keys(given);
  const invalid=fields.filter(key=>!(key in ohmDomains) || !inDomain(given[key],ohmDomains[key]));
  if(invalid.length)return {status:'invalid',fields:invalid};
  if(fields.length>2)return {status:'too-many-inputs',fields};
  if ((given.U !== undefined && given.I !== undefined && (given.U === 0) !== (given.I === 0))
    || (given.P === 0 && ((given.U ?? 0) > 0 || (given.I ?? 0) > 0))
    || ((given.U === 0 || given.I === 0) && (given.P ?? 0) > 0)) return {status:'no-solution',fields};
  const result=resolve(given,ohmDomains,ohmRelations());
  if(result.status === 'success' && Object.keys(result.outputs).length<2) return {status:'underdetermined',fields:[]};
  return result;
}
const transformerBase: Relation[] = [
  ...ohmRelations('1'),...ohmRelations('2'),
  ...product('U1','n','U2'),...product('N1','n','N2'),...product('P2','eta','P1'),
  relation('n',['C1','C2'],String.raw`\sqrt{C2/C1}`,v=>Math.sqrt(v.C2)/Math.sqrt(v.C1)),
  relation('C1',['C2','n'],String.raw`\frac{C2}{n^2}`,v=>v.C2/v.n/v.n),
  relation('C2',['C1','n'],'C1 n^2',v=>v.C1*v.n*v.n),
  relation('eta',['I1','I2','n'],String.raw`\frac{I2}{n I1}`,v=>v.I2/v.n/v.I1),
  relation('eta',['R1','R2','n'],String.raw`\frac{R1}{n^2 R2}`,v=>v.R1/v.n/v.n/v.R2)
];
const transformerCoupled: Relation[] = [
  relation('I2',['eta','n','I1'],'eta n I1',v=>v.eta*v.n*v.I1),
  relation('I1',['eta','n','I2'],String.raw`\frac{I2}{eta n}`,v=>v.I2/v.eta/v.n),
  relation('n',['eta','I1','I2'],String.raw`\frac{I2}{eta I1}`,v=>v.I2/v.eta/v.I1),
  relation('R1',['eta','n','R2'],'eta n^2 R2',v=>v.eta*v.n*v.n*v.R2),
  relation('R2',['eta','n','R1'],String.raw`\frac{R1}{eta n^2}`,v=>v.R1/v.eta/v.n/v.n),
  relation('n',['eta','R1','R2'],String.raw`\sqrt{\frac{R1}{eta R2}}`,v=>Math.sqrt(v.R1/v.eta/v.R2))
];
export type TransformerMode = 'ideal' | 'real';
const transformerIdeal: Relation[] = [
  ...transformerBase.filter(rule => rule.target !== 'eta' && !rule.inputs.includes('eta')),
  relation('P2',['P1'],'P1',v=>v.P1), relation('P1',['P2'],'P2',v=>v.P2),
  relation('I2',['n','I1'],'n I1',v=>v.n*v.I1),
  relation('I1',['n','I2'],String.raw`\frac{I2}{n}`,v=>v.I2/v.n),
  relation('n',['I1','I2'],String.raw`\frac{I2}{I1}`,v=>v.I2/v.I1),
  relation('R1',['n','R2'],'n^2 R2',v=>v.n*v.n*v.R2),
  relation('R2',['n','R1'],String.raw`\frac{R1}{n^2}`,v=>v.R1/v.n/v.n),
  relation('n',['R1','R2'],String.raw`\sqrt{\frac{R1}{R2}}`,v=>Math.sqrt(v.R1/v.R2))
];
export function solveTransformer(given: Values, mode?: TransformerMode): ElectricalResult {
  if (mode === 'ideal') {
    if (given.eta !== undefined && given.eta !== 1) return {status: inDomain(given.eta,'efficiency') ? 'no-solution' : 'invalid',fields:['eta']};
    const result = resolve({...given,eta:1},transformerDomains,transformerIdeal,true);
    return result.status === 'underdetermined' && Object.keys(given).length < 2 ? {status:'incomplete',fields:[]} : result;
  }
  if (mode === 'real') return resolve(given,transformerDomains,[...transformerBase,...transformerCoupled]);
  // Preserve inference for existing direct API callers; the UI always supplies an explicit mode.

  const base=resolve(given,transformerDomains,transformerBase);
  if(base.status === 'invalid' || base.status === 'no-solution')return base;
  const values=base.status==='success'?base.values:given;
  const assumedIdeal=values.eta === undefined;
  const result=resolve({...given,...(assumedIdeal?{eta:1}:{})},transformerDomains,[...transformerBase,...transformerCoupled],assumedIdeal);
  if(result.status==='underdetermined' && Object.keys(given).length<2)return {status:'incomplete',fields:[]};
  if(result.status==='success' && assumedIdeal) {
    // The assumed efficiency is visible as an assumption, never as a calculated/manual input.
    delete result.outputs.eta;
  }
  return result;
}

export const dividerDomains: Record<string, Domain> = {
  Uin:'nonnegative', Uout:'nonnegative', U1:'nonnegative', R1:'positive', R2:'positive', I:'nonnegative', Rt:'positive'
};
export const loadedDividerDomains: Record<string, Domain> = {
  ...dividerDomains, RL:'positive', IR2:'nonnegative', IL:'nonnegative', Rp:'positive'
};
function sum(total: string,a: string,b: string): Relation[] {
  return [relation(total,[a,b],`${a}+${b}`,v=>v[a]+v[b]),
    relation(a,[total,b],`${total}-${b}`,v=>v[total]-v[b],true),
    relation(b,[total,a],`${total}-${a}`,v=>v[total]-v[a],true)];
}
/** Positive resistive divider, optionally shunted by RL; all supported inverses are explicit. */
export function solveDivider(given: Values, loaded = false): ElectricalResult {
  const bottom=loaded?'Rp':'R2';
  const relations: Relation[] = [
    relation('U1',['Uin','R1',bottom],`\\frac{Uin R1}{R1+${bottom}}`,v=>v.Uin*(v.R1/(v.R1+v[bottom]))),
    ...product('U1','I','R1'),...product('Uout','I',bottom),...product('Uin','I','Rt'),
    ...sum('Uin','U1','Uout'),...sum('Rt','R1',bottom),
    relation('Uout',['Uin','R1',bottom],`\\frac{Uin ${bottom}}{R1+${bottom}}`,v=>v.Uin*(v[bottom]/(v.R1+v[bottom]))),
    relation('Uin',['Uout','R1',bottom],`\\frac{Uout(R1+${bottom})}{${bottom}}`,v=>v.Uout*((v.R1+v[bottom])/v[bottom])),
    relation('R1',['Uin','Uout',bottom],`\\frac{${bottom}(Uin-Uout)}{Uout}`,v=>v[bottom]*((v.Uin-v.Uout)/v.Uout),true),
    relation(bottom,['Uin','Uout','R1'],String.raw`\frac{R1 Uout}{Uin-Uout}`,v=>v.R1*(v.Uout/(v.Uin-v.Uout)),true)
  ];
  if(loaded)relations.push(
    relation('Rp',['R2','RL'],String.raw`\frac{1}{\frac{1}{R2}+\frac{1}{RL}}`,v=>1/(1/v.R2+1/v.RL)),
    relation('R2',['Rp','RL'],String.raw`\frac{1}{\frac{1}{Rp}-\frac{1}{RL}}`,v=>1/(1/v.Rp-1/v.RL),true),
    relation('RL',['Rp','R2'],String.raw`\frac{1}{\frac{1}{Rp}-\frac{1}{R2}}`,v=>1/(1/v.Rp-1/v.R2),true),
    ...product('Uout','IR2','R2'),...product('Uout','IL','RL'),...sum('I','IR2','IL')
  );
  return resolve(given,loaded?loadedDividerDomains:dividerDomains,relations);
}

/** Linear coil and induction relations, adapted from Elecalculate's Spulenberechnungen.
 * Static quantities, changes and motional geometry are distinct. All values are SI.
 * Current/flux/field/EMF are signed; stored energy cannot determine a current sign alone.
 */
export const inductorDomains: Record<string, Domain> = {
  I: 'signed', L: 'positive', AL: 'positive', N: 'positive', mu: 'positive',
  A: 'positive', l: 'positive', Phi: 'signed', B: 'signed', W: 'nonnegative',
  dI: 'signed', dPhi: 'signed', dt: 'positive', Uind: 'signed',
  lm: 'positive', v: 'signed', Umot: 'signed'
};
const divide = (numerator: number, denominator: number) => denominator === 0 ? NaN : numerator / denominator;
const coilRelations: Relation[] = [
  relation('L', ['AL','N'], 'AL N^2', v=>v.AL*v.N*v.N),
  relation('AL', ['L','N'], String.raw`\frac{L}{N^2}`, v=>v.L/v.N/v.N),
  relation('N', ['L','AL'], String.raw`\sqrt{\frac{L}{AL}}`, v=>Math.sqrt(v.L)/Math.sqrt(v.AL)),
  relation('AL', ['mu','A','l'], String.raw`\frac{\mu_0 mu A}{l}`, v=>MU0*v.mu*v.A/v.l),
  relation('mu', ['AL','A','l'], String.raw`\frac{AL l}{\mu_0 A}`, v=>v.AL*v.l/v.A/MU0),
  relation('A', ['AL','mu','l'], String.raw`\frac{AL l}{\mu_0 mu}`, v=>v.AL*v.l/v.mu/MU0),
  relation('l', ['AL','mu','A'], String.raw`\frac{\mu_0 mu A}{AL}`, v=>MU0*v.mu*v.A/v.AL),
  relation('Phi', ['B','A'], 'B A', v=>v.B*v.A),
  relation('B', ['Phi','A'], String.raw`\frac{Phi}{A}`, v=>v.Phi/v.A),
  relation('A', ['Phi','B'], String.raw`\frac{Phi}{B}`, v=>divide(v.Phi,v.B)),
  relation('Phi', ['L','I','N'], String.raw`\frac{L I}{N}`, v=>v.L*v.I/v.N),
  relation('L', ['Phi','N','I'], String.raw`\frac{Phi N}{I}`, v=>divide(v.Phi*v.N,v.I)),
  relation('I', ['Phi','N','L'], String.raw`\frac{Phi N}{L}`, v=>v.Phi*v.N/v.L),
  relation('N', ['L','I','Phi'], String.raw`\frac{L I}{Phi}`, v=>divide(v.L*v.I,v.Phi)),
  relation('W', ['L','I'], String.raw`\frac12 L I^2`, v=>0.5*(v.L*v.I)*v.I),
  relation('L', ['W','I'], String.raw`\frac{2W}{I^2}`, v=>divide(divide(v.W,v.I),v.I)*2),
  // Zero energy determines zero current. Otherwise flux orientation supplies the sign.
  relation('I', ['W','L'], String.raw`0`, v=>v.W===0 ? 0 : NaN, true),
  relation('I', ['W','L','Phi'], String.raw`\operatorname{sgn}(Phi)\sqrt{\frac{2W}{L}}`, v=>v.Phi===0 ? NaN : Math.sign(v.Phi)*Math.SQRT2*Math.sqrt(v.W)/Math.sqrt(v.L), true),
  relation('I', ['W','L','B'], String.raw`\operatorname{sgn}(B)\sqrt{\frac{2W}{L}}`, v=>v.B===0 ? NaN : Math.sign(v.B)*Math.SQRT2*Math.sqrt(v.W)/Math.sqrt(v.L), true),
  relation('dPhi', ['L','dI','N'], String.raw`\frac{L dI}{N}`, v=>v.L*v.dI/v.N),
  relation('dI', ['dPhi','N','L'], String.raw`\frac{dPhi N}{L}`, v=>v.dPhi*v.N/v.L),
  relation('L', ['dPhi','N','dI'], String.raw`\frac{dPhi N}{dI}`, v=>divide(v.dPhi*v.N,v.dI)),
  relation('N', ['L','dI','dPhi'], String.raw`\frac{L dI}{dPhi}`, v=>divide(v.L*v.dI,v.dPhi)),
  relation('Uind', ['L','dI','dt'], String.raw`-L\frac{dI}{dt}`, v=>-v.L*v.dI/v.dt),
  relation('dI', ['Uind','dt','L'], String.raw`-\frac{Uind dt}{L}`, v=>-v.Uind*v.dt/v.L),
  relation('L', ['Uind','dt','dI'], String.raw`-\frac{Uind dt}{dI}`, v=>divide(-v.Uind*v.dt,v.dI)),
  relation('dt', ['L','dI','Uind'], String.raw`-\frac{L dI}{Uind}`, v=>divide(-v.L*v.dI,v.Uind)),
  relation('Uind', ['N','dPhi','dt'], String.raw`-N\frac{dPhi}{dt}`, v=>-v.N*v.dPhi/v.dt),
  relation('dPhi', ['Uind','dt','N'], String.raw`-\frac{Uind dt}{N}`, v=>-v.Uind*v.dt/v.N),
  relation('N', ['Uind','dt','dPhi'], String.raw`-\frac{Uind dt}{dPhi}`, v=>divide(-v.Uind*v.dt,v.dPhi)),
  relation('dt', ['N','dPhi','Uind'], String.raw`-\frac{N dPhi}{Uind}`, v=>divide(-v.N*v.dPhi,v.Uind)),
  relation('Umot', ['B','lm','v'], 'B lm v', v=>v.B*v.lm*v.v),
  relation('B', ['Umot','lm','v'], String.raw`\frac{Umot}{lm v}`, v=>divide(v.Umot/v.lm,v.v)),
  relation('lm', ['Umot','B','v'], String.raw`\frac{Umot}{B v}`, v=>divide(divide(v.Umot,v.B),v.v)),
  relation('v', ['Umot','B','lm'], String.raw`\frac{Umot}{B lm}`, v=>divide(v.Umot,v.B)/v.lm)
];
export function solveInductor(given: Values): ElectricalResult {
  const result = resolve(given, inductorDomains, coilRelations);
  if (result.status === 'invalid' || result.status === 'no-solution') return result;
  const values = result.status === 'success' ? result.values : given;
  const conflicts = new Set<string>();
  // Positive L, N, A and Δt constrain signs even when their values are unknown.
  for (const [a, b, orientation] of [
    ['Phi', 'B', 1], ['Phi', 'I', 1], ['dPhi', 'dI', 1],
    ['Uind', 'dI', -1], ['Uind', 'dPhi', -1]
  ] as const) {
    if (values[a] !== undefined && values[b] !== undefined && Math.sign(values[a]) !== orientation * Math.sign(values[b])) {
      conflicts.add(a); conflicts.add(b);
    }
  }
  for (const key of ['I', 'Phi', 'B']) {
    if (values.W !== undefined && values[key] !== undefined && (values.W === 0) !== (values[key] === 0)) {
      conflicts.add('W'); conflicts.add(key);
    }
  }
  if (values.Umot !== undefined && ((values.Umot !== 0 && (values.B === 0 || values.v === 0))
    || (values.B !== undefined && values.v !== undefined && Math.sign(values.Umot) !== Math.sign(values.B) * Math.sign(values.v)))) {
    for (const key of ['Umot', 'B', 'v']) if (values[key] !== undefined) conflicts.add(key);
  }
  return conflicts.size ? { status: 'no-solution', fields: [...conflicts] } : result;
}

export const rcAcDomains: Record<string, Domain> = {
  phi: 'powerAngle', I: 'nonnegative', R: 'positive', Xc: 'positive', Z: 'positive',
  C: 'positive', P: 'nonnegative', Qc: 'signed', S: 'nonnegative',
  UR: 'nonnegative', UC: 'nonnegative', IR: 'nonnegative', IC: 'nonnegative', U: 'nonnegative', f: 'positive',
  cosPhi: 'unitInterval', sinPhi: 'signed'
};

const rcFrequencyRelations: Relation[] = [
  relation('Xc', ['f','C'], String.raw`\frac{1}{2\pi f C}`, v=>1/(2*Math.PI*v.f*v.C)),
  relation('f', ['Xc','C'], String.raw`\frac{1}{2\pi Xc C}`, v=>1/(2*Math.PI*v.Xc*v.C)),
  relation('C', ['Xc','f'], String.raw`\frac{1}{2\pi f Xc}`, v=>1/(2*Math.PI*v.f*v.Xc))
];
const rcPowerRelations: Relation[] = [
  ...product('U','I','Z'), ...product('S','U','I'),
  ...product('P','S','cosPhi'), ...product('Qc','S','sinPhi'),
  relation('S', ['P','Qc'], String.raw`\sqrt{P^2+Qc^2}`, v=>Math.hypot(v.P,v.Qc)),
  relation('P', ['S','Qc'], String.raw`\sqrt{S^2-Qc^2}`, v=>Math.sqrt(v.S*v.S-v.Qc*v.Qc), true),
  relation('Qc', ['S','P'], String.raw`-\sqrt{S^2-P^2}`, v=>-Math.sqrt(v.S*v.S-v.P*v.P), true),
  relation('phi', ['sinPhi','cosPhi'], String.raw`\operatorname{atan2}(sinPhi,cosPhi)`, v=>Math.atan2(v.sinPhi,v.cosPhi)),
  relation('cosPhi', ['phi'], String.raw`\cos(phi)`, v=>Math.cos(v.phi)),
  relation('sinPhi', ['phi'], String.raw`\sin(phi)`, v=>Math.sin(v.phi)),
  relation('phi', ['cosPhi','sinPhi'], String.raw`\operatorname{atan2}(sinPhi,cosPhi)`, v=>Math.atan2(v.sinPhi,v.cosPhi))
];

function rcSeriesRelations(): Relation[] {
  return [...rcFrequencyRelations, ...rcPowerRelations,
    relation('Z', ['R','Xc'], String.raw`\sqrt{R^2+Xc^2}`, v=>Math.hypot(v.R,v.Xc)),
    relation('R', ['Z','Xc'], String.raw`\sqrt{Z^2-Xc^2}`, v=>Math.sqrt(v.Z*v.Z-v.Xc*v.Xc), true),
    relation('Xc', ['Z','R'], String.raw`\sqrt{Z^2-R^2}`, v=>Math.sqrt(v.Z*v.Z-v.R*v.R), true),
    relation('phi', ['R','Xc'], String.raw`-\operatorname{atan2}(Xc,R)`, v=>-Math.atan2(v.Xc,v.R)),
    relation('cosPhi', ['R','Z'], String.raw`\frac{R}{Z}`, v=>v.R/v.Z),
    relation('sinPhi', ['Xc','Z'], String.raw`-\frac{Xc}{Z}`, v=>-v.Xc/v.Z),
    ...product('UR','I','R'), ...product('UC','I','Xc'),
    relation('U', ['UR','UC'], String.raw`\sqrt{UR^2+UC^2}`, v=>Math.hypot(v.UR,v.UC)),
    relation('UR', ['U','UC'], String.raw`\sqrt{U^2-UC^2}`, v=>Math.sqrt(v.U*v.U-v.UC*v.UC), true),
    relation('UC', ['U','UR'], String.raw`\sqrt{U^2-UR^2}`, v=>Math.sqrt(v.U*v.U-v.UR*v.UR), true),
    relation('P', ['I','R'], String.raw`I^2 R`, v=>v.I*v.I*v.R),
    relation('Qc', ['I','Xc'], String.raw`-I^2 Xc`, v=>-v.I*v.I*v.Xc)
  ];
}

function rcParallelRelations(): Relation[] {
  return [...rcFrequencyRelations, ...rcPowerRelations,
    relation('Z', ['R','Xc'], String.raw`\frac{R Xc}{\sqrt{R^2+Xc^2}}`, v=>v.R*v.Xc/Math.hypot(v.R,v.Xc)),
    relation('R', ['Z','cosPhi'], String.raw`\frac{Z}{cosPhi}`, v=>v.Z/v.cosPhi),
    relation('Xc', ['Z','sinPhi'], String.raw`-\frac{Z}{sinPhi}`, v=>-v.Z/v.sinPhi),
    relation('phi', ['R','Xc'], String.raw`-\operatorname{atan2}(R,Xc)`, v=>-Math.atan2(v.R,v.Xc)),
    relation('cosPhi', ['Z','R'], String.raw`\frac{Z}{R}`, v=>v.Z/v.R),
    relation('sinPhi', ['Z','Xc'], String.raw`-\frac{Z}{Xc}`, v=>-v.Z/v.Xc),
    ...product('U','IR','R'), ...product('U','IC','Xc'),
    relation('I', ['IR','IC'], String.raw`\sqrt{IR^2+IC^2}`, v=>Math.hypot(v.IR,v.IC)),
    relation('IR', ['I','IC'], String.raw`\sqrt{I^2-IC^2}`, v=>Math.sqrt(v.I*v.I-v.IC*v.IC), true),
    relation('IC', ['I','IR'], String.raw`\sqrt{I^2-IR^2}`, v=>Math.sqrt(v.I*v.I-v.IR*v.IR), true),
    relation('IR', ['I','cosPhi'], String.raw`I cosPhi`, v=>v.I*v.cosPhi),
    relation('IC', ['I','sinPhi'], String.raw`-I sinPhi`, v=>-v.I*v.sinPhi),
    ...product('P','U','IR'),
    relation('Qc', ['U','IC'], String.raw`-U IC`, v=>-v.U*v.IC),
    relation('U', ['Qc','IC'], String.raw`-\frac{Qc}{IC}`, v=>-v.Qc/v.IC),
    relation('IC', ['Qc','U'], String.raw`-\frac{Qc}{U}`, v=>-v.Qc/v.U),
    relation('P', ['U','R'], String.raw`\frac{U^2}{R}`, v=>v.U*v.U/v.R),
    relation('R', ['U','P'], String.raw`\frac{U^2}{P}`, v=>v.U*v.U/v.P),
    relation('U', ['P','R'], String.raw`\sqrt{P R}`, v=>Math.sqrt(v.P*v.R)),
    relation('Qc', ['U','Xc'], String.raw`-\frac{U^2}{Xc}`, v=>-v.U*v.U/v.Xc),
    relation('Xc', ['U','Qc'], String.raw`-\frac{U^2}{Qc}`, v=>-v.U*v.U/v.Qc),
    relation('U', ['Qc','Xc'], String.raw`\sqrt{-Qc Xc}`, v=>Math.sqrt(-v.Qc*v.Xc))
  ];
}

/** Ideal sinusoidal RC circuit. Capacitive phase, reactive factor and reactive power are negative. */
export function solveRcAc(given: Values, parallel = false): ElectricalResult {
  const invalid = Object.keys(given).filter(key => !(key in rcAcDomains)
    || !inDomain(given[key], rcAcDomains[key])
    || (key === 'Qc' && given[key] > 0)
    || (key === 'sinPhi' && (given[key] < -1 || given[key] > 0))
    || (key === 'phi' && given[key] > 0));
  if (invalid.length) return { status: 'invalid', fields: invalid };
  return resolve(given, rcAcDomains, parallel ? rcParallelRelations() : rcSeriesRelations());
}

export const rcTransientDomains: Record<string, Domain> = {
  I: 'nonnegative', it: 'signed', tau: 'positive', R: 'positive', C: 'positive',
  U: 'nonnegative', ut: 'nonnegative', t: 'nonnegative'
};
const rcTransientBase: Relation[] = [
  ...product('tau','R','C'), ...product('U','I','R')
];
function rcTransientRelations(discharging: boolean): Relation[] {
  const factor = (v: Values) => Math.exp(-v.t/v.tau);
  return [...rcTransientBase,
    relation('ut', ['U','t','tau'], discharging ? String.raw`Ue^{-t/tau}` : String.raw`U(1-e^{-t/tau})`, v=>discharging ? v.U*factor(v) : v.U*(-Math.expm1(-v.t/v.tau))),
    relation('it', ['I','t','tau'], discharging ? String.raw`-Ie^{-t/tau}` : String.raw`Ie^{-t/tau}`, v=>(discharging?-1:1)*v.I*factor(v)),
    relation('U', ['ut','t','tau'], discharging ? String.raw`\frac{ut}{e^{-t/tau}}` : String.raw`\frac{ut}{1-e^{-t/tau}}`, v=>v.ut/(discharging ? factor(v) : -Math.expm1(-v.t/v.tau))),
    relation('I', ['it','t','tau'], discharging ? String.raw`\frac{-it}{e^{-t/tau}}` : String.raw`\frac{it}{e^{-t/tau}}`, v=>(discharging?-v.it:v.it)/factor(v)),
    relation('t', ['ut','U','tau'], discharging ? String.raw`-tau\ln\frac{ut}{U}` : String.raw`-tau\ln(1-\frac{ut}{U})`, v=>-v.tau*Math.log(discharging ? v.ut/v.U : 1-v.ut/v.U), true),
    relation('t', ['it','I','tau'], discharging ? String.raw`-tau\ln\frac{-it}{I}` : String.raw`-tau\ln\frac{it}{I}`, v=>-v.tau*Math.log((discharging?-v.it:v.it)/v.I), true),
    relation('tau', ['ut','U','t'], discharging ? String.raw`-\frac{t}{\ln(ut/U)}` : String.raw`-\frac{t}{\ln(1-ut/U)}`, v=>-v.t/Math.log(discharging ? v.ut/v.U : 1-v.ut/v.U), true),
    relation('tau', ['it','I','t'], discharging ? String.raw`-\frac{t}{\ln(-it/I)}` : String.raw`-\frac{t}{\ln(it/I)}`, v=>-v.t/Math.log((discharging?-v.it:v.it)/v.I), true),
    ...(discharging ? [
      relation('ut', ['R','it'], String.raw`-R it`, v=>-v.R*v.it),
      relation('it', ['ut','R'], String.raw`-\frac{ut}{R}`, v=>-v.ut/v.R),
      relation('R', ['ut','it'], String.raw`-\frac{ut}{it}`, v=>-v.ut/v.it)
    ] : [
      relation('ut', ['U','R','it'], String.raw`U-Rit`, v=>v.U-v.R*v.it, true),
      relation('it', ['U','ut','R'], String.raw`\frac{U-ut}{R}`, v=>(v.U-v.ut)/v.R),
      relation('R', ['U','ut','it'], String.raw`\frac{U-ut}{it}`, v=>(v.U-v.ut)/v.it, true)
    ])
  ];
}
/** Ideal first-order RC step response with explicit forward and inverse relations. */
export function solveRcTransient(given: Values, discharging = false): ElectricalResult {
  const invalid = Object.keys(given).filter(key => !(key in rcTransientDomains)
    || !inDomain(given[key], rcTransientDomains[key])
    || (key === 'it' && (discharging ? given[key] > 0 : given[key] < 0)));
  if (invalid.length) return { status: 'invalid', fields: invalid };
  return resolve(given, rcTransientDomains, rcTransientRelations(discharging));
}

export const rlTransientDomains: Record<string, Domain> = {
  I:'nonnegative', it:'nonnegative', tau:'positive', R:'positive', L:'positive', U:'nonnegative', ut:'signed', t:'nonnegative'
};
function rlTransientRelations(discharging:boolean): Relation[] {
  const decay=(v:Values)=>Math.exp(-v.t/v.tau);
  const rising=(v:Values)=>-Math.expm1(-v.t/v.tau);
  return [
    relation('tau',['L','R'],String.raw`\frac{L}{R}`,v=>v.L/v.R),...product('L','tau','R'),...product('U','I','R'),
    relation('ut',['U','t','tau'],discharging?String.raw`-Ue^{-t/tau}`:String.raw`Ue^{-t/tau}`,v=>(discharging?-1:1)*v.U*decay(v)),
    relation('it',['I','t','tau'],discharging?String.raw`Ie^{-t/tau}`:String.raw`I(1-e^{-t/tau})`,v=>v.I*(discharging?decay(v):rising(v))),
    relation('t',['U','ut','tau'],String.raw`-tau\ln\frac{|ut|}{U}`,v=>-v.tau*Math.log(Math.abs(v.ut)/v.U),true),
    relation('t',['I','it','tau'],discharging?String.raw`-tau\ln\frac{it}{I}`:String.raw`-tau\ln(1-\frac{it}{I})`,v=>-v.tau*Math.log(discharging?v.it/v.I:1-v.it/v.I),true),
    relation('tau',['U','ut','t'],String.raw`-\frac{t}{\ln(|ut|/U)}`,v=>-v.t/Math.log(Math.abs(v.ut)/v.U),true),
    relation('tau',['I','it','t'],discharging?String.raw`-\frac{t}{\ln(it/I)}`:String.raw`-\frac{t}{\ln(1-it/I)}`,v=>-v.t/Math.log(discharging?v.it/v.I:1-v.it/v.I),true),
    relation('U',['ut','t','tau'],String.raw`\frac{|ut|}{e^{-t/tau}}`,v=>Math.abs(v.ut)/decay(v)),
    relation('I',['it','t','tau'],discharging?String.raw`\frac{it}{e^{-t/tau}}`:String.raw`\frac{it}{1-e^{-t/tau}}`,v=>v.it/(discharging?decay(v):rising(v)))
  ];
}
export function solveRlTransient(given:Values,discharging=false):ElectricalResult {
  const invalid=Object.keys(given).filter(key=>!(key in rlTransientDomains)||!inDomain(given[key],rlTransientDomains[key])||(key==='ut'&&(discharging?given[key]>0:given[key]<0)));
  if(invalid.length)return {status:'invalid',fields:invalid};
  return resolve(given,rlTransientDomains,rlTransientRelations(discharging));
}

export const capacitorCalculationDomains: Record<string, Domain> = {
  I: 'signed', F: 'signed', E: 'signed', er: 'positive', A: 'positive', d: 'positive',
  s: 'positive', C: 'positive', U: 'signed', W: 'nonnegative', Q: 'signed', t: 'nonnegative'
};
const capacitorCalculationRelations: Relation[] = [
  ...product('Q','C','U'), ...product('Q','I','t'), ...product('F','Q','E'), ...product('U','E','s'),
  relation('W', ['C','U'], String.raw`\frac12 C U^2`, v=>0.5*v.C*v.U*v.U),
  relation('C', ['W','U'], String.raw`\frac{2W}{U^2}`, v=>2*v.W/v.U/v.U),
  relation('U', ['W','C'], String.raw`\sqrt{\frac{2W}{C}}`, v=>Math.sqrt(2*v.W/v.C), true),
  relation('W', ['Q','U'], String.raw`\frac12 Q U`, v=>0.5*v.Q*v.U),
  relation('U', ['W','Q'], String.raw`\frac{2W}{Q}`, v=>2*v.W/v.Q),
  relation('Q', ['W','U'], String.raw`\frac{2W}{U}`, v=>2*v.W/v.U),
  relation('C', ['er','A','s'], String.raw`\frac{\epsilon_0 er A}{s}`, v=>EPS0*v.er*v.A/v.s),
  relation('er', ['C','A','s'], String.raw`\frac{C s}{\epsilon_0 A}`, v=>v.C*v.s/EPS0/v.A),
  relation('A', ['C','er','s'], String.raw`\frac{C s}{\epsilon_0 er}`, v=>v.C*v.s/EPS0/v.er),
  relation('s', ['C','er','A'], String.raw`\frac{\epsilon_0 er A}{C}`, v=>EPS0*v.er*v.A/v.C),
  relation('A', ['d'], String.raw`\frac{\pi d^2}{4}`, v=>Math.PI*v.d*v.d/4),
  relation('d', ['A'], String.raw`\sqrt{\frac{4A}{\pi}}`, v=>Math.sqrt(4*v.A/Math.PI))
];
/** Coupled ideal-capacitor calculations, with every supported inverse implemented explicitly. */
export function solveCapacitorCalculations(given: Values): ElectricalResult {
  return resolve(given, capacitorCalculationDomains, capacitorCalculationRelations);
}

export const rlAcDomains: Record<string, Domain> = {
  phi:'powerAngle', I:'nonnegative', R:'positive', Xl:'positive', Z:'positive', L:'positive', P:'nonnegative', Ql:'nonnegative', S:'nonnegative',
  UR:'nonnegative', UL:'nonnegative', IR:'nonnegative', IL:'nonnegative', U:'nonnegative', f:'positive', cosPhi:'unitInterval', sinPhi:'unitInterval'
};
const rlFrequencyRelations: Relation[] = [
  relation('Xl',['f','L'],String.raw`2\pi fL`,v=>2*Math.PI*v.f*v.L),
  relation('f',['Xl','L'],String.raw`\frac{Xl}{2\pi L}`,v=>v.Xl/(2*Math.PI*v.L)),
  relation('L',['Xl','f'],String.raw`\frac{Xl}{2\pi f}`,v=>v.Xl/(2*Math.PI*v.f))
];
const rlPowerRelations: Relation[] = [
  ...product('U','I','Z'),...product('S','U','I'),...product('P','S','cosPhi'),...product('Ql','S','sinPhi'),
  relation('S',['P','Ql'],String.raw`\sqrt{P^2+Ql^2}`,v=>Math.hypot(v.P,v.Ql)),
  relation('phi',['sinPhi','cosPhi'],String.raw`\operatorname{atan2}(sinPhi,cosPhi)`,v=>Math.atan2(v.sinPhi,v.cosPhi)),
  relation('cosPhi',['phi'],String.raw`\cos(phi)`,v=>Math.cos(v.phi)),relation('sinPhi',['phi'],String.raw`\sin(phi)`,v=>Math.sin(v.phi))
];
const rlSeriesRelations: Relation[] = [...rlFrequencyRelations,...rlPowerRelations,
  relation('Z',['R','Xl'],String.raw`\sqrt{R^2+Xl^2}`,v=>Math.hypot(v.R,v.Xl)),
  relation('R',['Z','Xl'],String.raw`\sqrt{Z^2-Xl^2}`,v=>Math.sqrt(v.Z*v.Z-v.Xl*v.Xl),true),
  relation('Xl',['Z','R'],String.raw`\sqrt{Z^2-R^2}`,v=>Math.sqrt(v.Z*v.Z-v.R*v.R),true),
  relation('phi',['R','Xl'],String.raw`\operatorname{atan2}(Xl,R)`,v=>Math.atan2(v.Xl,v.R)),
  relation('cosPhi',['R','Z'],String.raw`\frac{R}{Z}`,v=>v.R/v.Z),relation('sinPhi',['Xl','Z'],String.raw`\frac{Xl}{Z}`,v=>v.Xl/v.Z),
  ...product('UR','I','R'),...product('UL','I','Xl'),relation('U',['UR','UL'],String.raw`\sqrt{UR^2+UL^2}`,v=>Math.hypot(v.UR,v.UL)),
  relation('P',['I','R'],String.raw`I^2R`,v=>v.I*v.I*v.R),relation('Ql',['I','Xl'],String.raw`I^2Xl`,v=>v.I*v.I*v.Xl)
];
const rlParallelRelations: Relation[] = [...rlFrequencyRelations,...rlPowerRelations,
  relation('Z',['R','Xl'],String.raw`\frac{R Xl}{\sqrt{R^2+Xl^2}}`,v=>v.R*v.Xl/Math.hypot(v.R,v.Xl)),
  relation('R',['Z','cosPhi'],String.raw`\frac{Z}{cosPhi}`,v=>v.Z/v.cosPhi),relation('Xl',['Z','sinPhi'],String.raw`\frac{Z}{sinPhi}`,v=>v.Z/v.sinPhi),
  relation('phi',['R','Xl'],String.raw`\operatorname{atan2}(R,Xl)`,v=>Math.atan2(v.R,v.Xl)),
  relation('cosPhi',['Z','R'],String.raw`\frac{Z}{R}`,v=>v.Z/v.R),relation('sinPhi',['Z','Xl'],String.raw`\frac{Z}{Xl}`,v=>v.Z/v.Xl),
  ...product('U','IR','R'),...product('U','IL','Xl'),relation('I',['IR','IL'],String.raw`\sqrt{IR^2+IL^2}`,v=>Math.hypot(v.IR,v.IL)),
  ...product('P','U','IR'),...product('Ql','U','IL'),relation('P',['U','R'],String.raw`\frac{U^2}{R}`,v=>v.U*v.U/v.R),relation('Ql',['U','Xl'],String.raw`\frac{U^2}{Xl}`,v=>v.U*v.U/v.Xl)
];
export function solveRlAc(given: Values, parallel=false): ElectricalResult {
  return resolve(given,rlAcDomains,parallel?rlParallelRelations:rlSeriesRelations);
}

export const sineDomains:Record<string,Domain>={u:'signed',Up:'nonnegative',Upp:'nonnegative',Urms:'nonnegative',f:'positive',t:'nonnegative',T:'positive',phi:'signed'};
export const amplitudeDomains:Record<string,Domain>={Up:'nonnegative',Upp:'nonnegative',Urms:'nonnegative'};
export const pwmDomains:Record<string,Domain>={Up:'nonnegative',Urms:'nonnegative',f:'positive',ton:'nonnegative',T:'positive',d:'unitInterval'};
const amplitudeRelations=(factor:number):Relation[]=>[
  relation('Upp',['Up'],'2Up',v=>2*v.Up),relation('Up',['Upp'],String.raw`\frac{Upp}{2}`,v=>v.Upp/2),
  relation('Urms',['Up'],String.raw`\frac{Up}{\sqrt{${factor}}}`,v=>v.Up/Math.sqrt(factor)),relation('Up',['Urms'],String.raw`Urms\sqrt{${factor}}`,v=>v.Urms*Math.sqrt(factor))
];
const periodRelations:Relation[]=[relation('T',['f'],String.raw`\frac{1}{f}`,v=>1/v.f),relation('f',['T'],String.raw`\frac{1}{T}`,v=>1/v.T)];
export function solveAmplitude(given:Values,factor:number):ElectricalResult{return resolve(given,amplitudeDomains,amplitudeRelations(factor));}
export function solveSine(given:Values):ElectricalResult{return resolve(given,sineDomains,[...amplitudeRelations(2),...periodRelations,
  relation('u',['Up','f','t','phi'],String.raw`Up\sin(2\pi ft+phi)`,v=>v.Up*Math.sin(2*Math.PI*v.f*v.t+v.phi)),
  relation('Up',['u','f','t','phi'],String.raw`\frac{u}{\sin(2\pi ft+phi)}`,v=>v.u/Math.sin(2*Math.PI*v.f*v.t+v.phi)),
  relation('phi',['u','Up','f','t'],String.raw`\arcsin(u/Up)-2\pi ft`,v=>Math.asin(v.u/v.Up)-2*Math.PI*v.f*v.t,true)
]);}
export function solvePwm(given:Values):ElectricalResult{return resolve(given,pwmDomains,[...periodRelations,...product('ton','T','d'),
  relation('Urms',['Up','d'],String.raw`Up\sqrt{d}`,v=>v.Up*Math.sqrt(v.d)),relation('Up',['Urms','d'],String.raw`\frac{Urms}{\sqrt{d}}`,v=>v.Urms/Math.sqrt(v.d)),
  relation('d',['Urms','Up'],String.raw`(Urms/Up)^2`,v=>(v.Urms/v.Up)**2)
]);}

export const filterDomains:Record<string,Domain>={phi:'signed',R:'positive',Xc:'positive',Xl:'positive',attenuation:'nonnegative',C:'positive',L:'positive',Uin:'nonnegative',Uc:'nonnegative',Uout:'nonnegative',fc:'positive',f:'positive',gain:'unitInterval',x:'positive'};
export function solveFilter(given:Values, highPass:boolean, rc:boolean):ElectricalResult {
  if(given.phi!==undefined && (highPass ? given.phi<=0||given.phi>=Math.PI/2 : given.phi>=0||given.phi<=-Math.PI/2))return {status:'invalid',fields:['phi']};
  if(given.Uin!==undefined&&given.Uout!==undefined&&given.Uout>given.Uin)return {status:'invalid',fields:['Uout']};
  if(given.Uin!==undefined&&given.Uc!==undefined&&given.Uc>given.Uin)return {status:'invalid',fields:['Uc']};
  const relations:Relation[]=[...product('f','x','fc'),
    relation('gain',['x'],highPass?String.raw`\frac{x}{\sqrt{1+x^2}}`:String.raw`\frac{1}{\sqrt{1+x^2}}`,v=>highPass?v.x/Math.hypot(1,v.x):1/Math.hypot(1,v.x)),
    relation('x',['gain'],highPass?String.raw`\frac{gain}{\sqrt{1-gain^2}}`:String.raw`\sqrt{\frac{1}{gain^2}-1}`,v=>highPass?v.gain/Math.sqrt(1-v.gain*v.gain):Math.sqrt(1/(v.gain*v.gain)-1)),
    relation('phi',['x'],highPass?String.raw`\arctan(1/x)`:String.raw`-\arctan(x)`,v=>highPass?Math.atan(1/v.x):-Math.atan(v.x)),
    relation('x',['phi'],highPass?String.raw`\frac{1}{\tan(phi)}`:String.raw`\tan(-phi)`,v=>highPass?1/Math.tan(v.phi):Math.tan(-v.phi)),
    relation('attenuation',['gain'],String.raw`-20\log_{10}(gain)`,v=>-20*Math.log10(v.gain)),
    relation('gain',['attenuation'],String.raw`10^{-attenuation/20}`,v=>10**(-v.attenuation/20)),...product('Uout','gain','Uin')];
  if(rc)relations.push(
    relation('fc',['R','C'],String.raw`\frac{1}{2\pi RC}`,v=>1/(2*Math.PI*v.R*v.C)),relation('R',['fc','C'],String.raw`\frac{1}{2\pi fcC}`,v=>1/(2*Math.PI*v.fc*v.C)),relation('C',['fc','R'],String.raw`\frac{1}{2\pi fcR}`,v=>1/(2*Math.PI*v.fc*v.R)),
    relation('Xc',['f','C'],String.raw`\frac{1}{2\pi fC}`,v=>1/(2*Math.PI*v.f*v.C)),relation('f',['Xc','C'],String.raw`\frac{1}{2\pi XcC}`,v=>1/(2*Math.PI*v.Xc*v.C)),relation('C',['Xc','f'],String.raw`\frac{1}{2\pi fXc}`,v=>1/(2*Math.PI*v.f*v.Xc)),...product('R','x','Xc'));
  else relations.push(
    relation('fc',['R','L'],String.raw`\frac{R}{2\pi L}`,v=>v.R/(2*Math.PI*v.L)),relation('R',['fc','L'],String.raw`2\pi fcL`,v=>2*Math.PI*v.fc*v.L),relation('L',['fc','R'],String.raw`\frac{R}{2\pi fc}`,v=>v.R/(2*Math.PI*v.fc)),
    relation('Xl',['f','L'],String.raw`2\pi fL`,v=>2*Math.PI*v.f*v.L),relation('f',['Xl','L'],String.raw`\frac{Xl}{2\pi L}`,v=>v.Xl/(2*Math.PI*v.L)),relation('L',['Xl','f'],String.raw`\frac{Xl}{2\pi f}`,v=>v.Xl/(2*Math.PI*v.f)),...product('Xl','x','R'));
  if(highPass&&rc)relations.push(
    relation('Uc',['Uin','x'],String.raw`\frac{Uin}{\sqrt{1+x^2}}`,v=>v.Uin/Math.hypot(1,v.x)),relation('Uin',['Uc','x'],String.raw`Uc\sqrt{1+x^2}`,v=>v.Uc*Math.hypot(1,v.x)),relation('x',['Uin','Uc'],String.raw`\sqrt{(Uin/Uc)^2-1}`,v=>Math.sqrt((v.Uin/v.Uc)**2-1)),
    relation('Uin',['Uc','Uout'],String.raw`\sqrt{Uc^2+Uout^2}`,v=>Math.hypot(v.Uc,v.Uout)),relation('Uc',['Uin','Uout'],String.raw`\sqrt{Uin^2-Uout^2}`,v=>Math.sqrt(v.Uin*v.Uin-v.Uout*v.Uout)),relation('Uout',['Uin','Uc'],String.raw`\sqrt{Uin^2-Uc^2}`,v=>Math.sqrt(v.Uin*v.Uin-v.Uc*v.Uc)));
  const result=resolve(given,filterDomains,relations);
  if(result.status!=='success')return result;
  const {x:ignored,...outputs}=result.outputs;
  const steps=result.steps?.filter(step=>step.target!=='x');
  return {...result,outputs,steps};
}

export const resonatorDomains:Record<string,Domain>={
  R:'positive',L:'positive',C:'positive',f:'positive',f0:'positive',Xl:'positive',Xc:'positive',
  Qfactor:'positive',bw:'positive',Z:'positive',Y:'positive',phi:'powerAngle',
  U:'nonnegative',UR:'nonnegative',UL:'nonnegative',UC:'nonnegative',
  I:'nonnegative',IR:'nonnegative',IL:'nonnegative',IC:'nonnegative'
};
/** Ideal RLC resonator. When f is omitted, no off-resonance phasor relation is assumed. */
export function solveResonator(given:Values,parallel=false):ElectricalResult {
  const common:Relation[]=[
    relation('f0',['L','C'],String.raw`\frac{1}{2\pi\sqrt{LC}}`,v=>1/(2*Math.PI*Math.sqrt(v.L*v.C))),
    relation('L',['f0','C'],String.raw`\frac{1}{(2\pi f_0)^2C}`,v=>1/(2*Math.PI*v.f0)**2/v.C),
    relation('C',['f0','L'],String.raw`\frac{1}{(2\pi f_0)^2L}`,v=>1/(2*Math.PI*v.f0)**2/v.L),
    relation('Xl',['f','L'],String.raw`2\pi fL`,v=>2*Math.PI*v.f*v.L),
    relation('f',['Xl','L'],String.raw`\frac{X_L}{2\pi L}`,v=>v.Xl/(2*Math.PI*v.L)),
    relation('L',['Xl','f'],String.raw`\frac{X_L}{2\pi f}`,v=>v.Xl/(2*Math.PI*v.f)),
    relation('Xc',['f','C'],String.raw`\frac{1}{2\pi fC}`,v=>1/(2*Math.PI*v.f*v.C)),
    relation('f',['Xc','C'],String.raw`\frac{1}{2\pi X_CC}`,v=>1/(2*Math.PI*v.Xc*v.C)),
    relation('C',['Xc','f'],String.raw`\frac{1}{2\pi fX_C}`,v=>1/(2*Math.PI*v.f*v.Xc)),
    ...product('f0','Qfactor','bw')
  ];
  const specific:Relation[]=parallel?[
    relation('Qfactor',['R','L','C'],String.raw`R\sqrt{\frac{C}{L}}`,v=>v.R*Math.sqrt(v.C/v.L)),
    relation('R',['Qfactor','L','C'],String.raw`Q\sqrt{\frac{L}{C}}`,v=>v.Qfactor*Math.sqrt(v.L/v.C)),
    relation('bw',['R','C'],String.raw`\frac{1}{2\pi RC}`,v=>1/(2*Math.PI*v.R*v.C)),
    relation('Y',['R','Xl','Xc'],String.raw`\sqrt{R^{-2}+(X_C^{-1}-X_L^{-1})^2}`,v=>Math.hypot(1/v.R,1/v.Xc-1/v.Xl)),
    relation('Z',['Y'],String.raw`\frac{1}{Y}`,v=>1/v.Y),relation('Y',['Z'],String.raw`\frac{1}{Z}`,v=>1/v.Z),
    relation('phi',['R','Xl','Xc'],String.raw`-\operatorname{atan2}(X_C^{-1}-X_L^{-1},R^{-1})`,v=>-Math.atan2(1/v.Xc-1/v.Xl,1/v.R)),
    ...product('I','U','Y'),...product('U','IR','R'),...product('U','IL','Xl'),...product('U','IC','Xc'),
    relation('I',['IR','IL','IC'],String.raw`\sqrt{I_R^2+(I_L-I_C)^2}`,v=>Math.hypot(v.IR,v.IL-v.IC))
  ]:[
    relation('Qfactor',['R','L','C'],String.raw`\frac{1}{R}\sqrt{\frac{L}{C}}`,v=>Math.sqrt(v.L/v.C)/v.R),
    relation('R',['Qfactor','L','C'],String.raw`\frac{1}{Q}\sqrt{\frac{L}{C}}`,v=>Math.sqrt(v.L/v.C)/v.Qfactor),
    relation('bw',['R','L'],String.raw`\frac{R}{2\pi L}`,v=>v.R/(2*Math.PI*v.L)),
    relation('Z',['R','Xl','Xc'],String.raw`\sqrt{R^2+(X_L-X_C)^2}`,v=>Math.hypot(v.R,v.Xl-v.Xc)),
    relation('phi',['R','Xl','Xc'],String.raw`\operatorname{atan2}(X_L-X_C,R)`,v=>Math.atan2(v.Xl-v.Xc,v.R)),
    ...product('U','I','Z'),...product('UR','I','R'),...product('UL','I','Xl'),...product('UC','I','Xc'),
    relation('U',['UR','UL','UC'],String.raw`\sqrt{U_R^2+(U_L-U_C)^2}`,v=>Math.hypot(v.UR,v.UL-v.UC))
  ];
  const result=resolve(given,resonatorDomains,[...common,...specific]);
  if(result.status!=='success')return result;
  const {Y:ignored,...outputs}=result.outputs;
  return {...result,outputs,steps:result.steps?.filter(step=>step.target!=='Y')};
}

export const gainDomains:Record<string,Domain>={I1:'positive',I2:'positive',g:'signed',a:'signed',P1:'positive',P2:'positive',U1:'positive',U2:'positive',V:'positive',D:'positive'};
/** Voltage/current gain model with equal real reference impedances. */
export function solveGain(given:Values):ElectricalResult {
  const relations:Relation[]=[
    ...product('U2','U1','V'),...product('I2','I1','V'),...product('P1','U1','I1'),...product('P2','U2','I2'),
    relation('D',['V'],String.raw`\frac{1}{V}`,v=>1/v.V),relation('V',['D'],String.raw`\frac{1}{D}`,v=>1/v.D),
    relation('g',['V'],String.raw`20\log_{10}(V)`,v=>20*Math.log10(v.V)),
    relation('V',['g'],String.raw`10^{g/20}`,v=>10**(v.g/20)),
    relation('a',['g'],String.raw`-g`,v=>-v.g),relation('g',['a'],String.raw`-a`,v=>-v.a),
    relation('P2',['P1','V'],String.raw`P_1V^2`,v=>v.P1*v.V*v.V),
    relation('P1',['P2','V'],String.raw`\frac{P_2}{V^2}`,v=>v.P2/v.V/v.V),
    relation('V',['P1','P2'],String.raw`\sqrt{\frac{P_2}{P_1}}`,v=>Math.sqrt(v.P2/v.P1))
  ];
  const result=resolve(given,gainDomains,relations);
  if(result.status!=='success')return result;
  return result;
}
