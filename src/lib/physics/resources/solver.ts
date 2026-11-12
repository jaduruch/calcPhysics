/** Explicit model rules, not symbolic equation parsing or a general CAS. */
export type Values = Record<string, number>;
export type Domain = 'positive' | 'nonnegative' | 'real' | 'nonzero' | 'incidence' | 'acute' | 'index' | 'quadrant' | 'solidAngle' | 'unitInterval' | 'positiveInteger' | 'atLeastOne' | 'criticalAngle' | 'eccentricity';
export interface ResourcePhysics {
  domains: Record<string, Domain>;
  primary?: readonly string[];
  defaults?: Values;
  inverse?: Record<string, (v: Values) => number | readonly number[]>;
  derive?: (v: Values) => Values;
  balance?: (v: Values) => readonly [number, number];
  valid?: (v: Values) => boolean;
}
export type ResourceResult =
  | { status: 'incomplete' | 'conflict' | 'underdetermined' | 'no-solution' | 'numerical' }
  | { status: 'invalid'; fields: string[] }
  | { status: 'success'; values: Values; outputs: Values; target: string | null; assumed: string[]; solutions?: Values[] };
export function inResourceDomain(value: number, domain: Domain): boolean {
  return Number.isFinite(value) && (domain === 'positive' ? value > 0 : domain === 'nonnegative' ? value >= 0 : domain === 'nonzero' ? value !== 0 : domain === 'incidence' ? value >= 0 && value < Math.PI / 2 : domain === 'acute' ? value > 0 && value < Math.PI / 2 : domain === 'index' || domain === 'atLeastOne' ? value >= 1 : domain === 'quadrant' ? value >= 0 && value <= Math.PI/2 : domain === 'criticalAngle' ? value > 0 && value < Math.PI/2 : domain === 'solidAngle' ? value >= 0 && value <= 4*Math.PI : domain === 'eccentricity' ? value >= 0 && value < 1 : domain === 'unitInterval' ? value >= 0 && value <= 1 : domain === 'positiveInteger' ? Number.isSafeInteger(value) && value > 0 : true);
}
export class ModelFailure extends Error {
 code: 'underdetermined' | 'no-solution' | 'numerical';
 constructor(code: 'underdetermined' | 'no-solution' | 'numerical') { super(code); this.code=code; }
}
export function product(...factors:number[]):number {
 const value=factors.reduce((result,factor)=>result*factor,1);
 if(!Number.isFinite(value)||(value===0&&factors.every(factor=>factor!==0)))throw new ModelFailure('numerical');
 return value;
}
export function divide(numerator: number, denominator: number): number {
  if (denominator === 0) throw new ModelFailure(numerator === 0 ? 'underdetermined' : 'no-solution');
  const result = numerator / denominator;
  if (numerator !== 0 && result === 0) throw new ModelFailure('numerical');
  return result;
}
export function solveResourceModel(physics: ResourcePhysics, input: Partial<Values>): ResourceResult {
  const fields = Object.keys(physics.domains);
  const values:Values={...physics.defaults};
  for(const key of fields)if(input[key]!==undefined)values[key]=input[key]!;
  const invalid = fields.filter(key => values[key] !== undefined && !inResourceDomain(values[key], physics.domains[key]));
  if (invalid.length) return { status: 'invalid', fields: invalid };
  const assumed = Object.keys(physics.defaults ?? {}).filter(key => input[key] === undefined);
  const missing = fields.filter(key => values[key] === undefined);
  let target: string | null = null;
  let solutions: Values[] | undefined;
  const balanced=(resolved:Values)=>{
    if(!physics.balance)return true;
    const [left,right]=physics.balance(resolved);
    if(![left,right].every(Number.isFinite))throw new ModelFailure('numerical');
    const scale=Math.max(Math.abs(left),Math.abs(right),Number.MIN_VALUE);
    return Math.abs(left/scale-right/scale)<=1e-10;
  };
  try {
    if (physics.primary && physics.inverse) {
      const unknown = physics.primary.filter(key => values[key] === undefined);
      if (unknown.length > 1 || missing.some(key => !physics.primary!.includes(key))) return { status: 'incomplete' };
      if (unknown.length === 1) {
        target = unknown[0];
        const answer=physics.inverse[target](values);
        const candidates=typeof answer==='number'?[answer]:[...answer];
        if(candidates.some(value=>!Number.isFinite(value)))return {status:'numerical'};
        const distinct=candidates.filter((value,index)=>candidates.findIndex(other=>Math.abs(value-other)<=32*Number.EPSILON*Math.max(Math.abs(value),Math.abs(other),Number.MIN_VALUE))===index);
        solutions=distinct.filter(value=>inResourceDomain(value,physics.domains[target!])).map(value=>({...values,[target!]:value})).filter(resolved=>(!physics.valid||physics.valid(resolved))&&balanced(resolved));
        if(!solutions.length)return {status:'no-solution'};
        Object.assign(values,solutions[0]);
      } else {
        if(physics.balance){if(!balanced(values))return {status:'conflict'};}
        else {
          const first=physics.primary[0],answer=physics.inverse[first](values);
          const candidates=typeof answer==='number'?[answer]:answer;
          if(!candidates.every(Number.isFinite))return {status:'numerical'};
          if(!candidates.some(expected=>Math.abs(values[first]-expected)<=1e-10*Math.max(Math.abs(values[first]),Math.abs(expected),Number.MIN_VALUE)))return {status:'conflict'};
        }
      }
    } else if (missing.length) return { status: 'incomplete' };
    if (physics.valid && !physics.valid(values)) return { status: 'no-solution' };
    const outputs = physics.derive?.(values) ?? {};
    if (!Object.values(outputs).every(Number.isFinite)) return { status: 'numerical' };
    return { status: 'success', values, outputs, target, assumed, ...(solutions && solutions.length>1 ? {solutions} : {}) };
  } catch (error) {
    if (error instanceof ModelFailure) return { status: error.code };
    throw error;
  }
}
