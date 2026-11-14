import {orbitalPeriod,orbitalAxis,orbitalMass} from './kepler.ts';
import {divide,ModelFailure,type Values} from '../resources/solver.ts';
export const periodFields=['T','a','T2','a2','M','centralMass','companionMass','periodRatio','axisRatio'] as const;
export type PeriodField=typeof periodFields[number];
export interface PeriodStep {target:PeriodField;inputs:readonly PeriodField[];formula:string;substitution?:Values}
interface Rule extends PeriodStep {calculate:(v:Values)=>number}
const r=(target:PeriodField,inputs:PeriodField[],formula:string,calculate:Rule['calculate']):Rule=>({target,inputs,formula,calculate});
const finite=(v:number)=>{if(!Number.isFinite(v)||v<=0)throw new ModelFailure('numerical');return v;};
const scale=(v:number,ratio:number,power:number)=>finite(Math.exp(Math.log(v)+power*Math.log(ratio)));
const rules:readonly Rule[]=[
 r('T2',['T','a','a2'],String.raw`[[T]]\cdot\left(\frac{[[a2]]}{[[a]]}\right)^{3/2}`,v=>finite(Math.exp(Math.log(v.T)+1.5*(Math.log(v.a2)-Math.log(v.a))))),
 r('T',['T2','a','a2'],String.raw`[[T2]]\cdot\left(\frac{[[a]]}{[[a2]]}\right)^{3/2}`,v=>finite(Math.exp(Math.log(v.T2)+1.5*(Math.log(v.a)-Math.log(v.a2))))),
 r('a2',['a','T','T2'],String.raw`[[a]]\cdot\left(\frac{[[T2]]}{[[T]]}\right)^{2/3}`,v=>finite(Math.exp(Math.log(v.a)+(2/3)*(Math.log(v.T2)-Math.log(v.T))))),
 r('a',['a2','T','T2'],String.raw`[[a2]]\cdot\left(\frac{[[T]]}{[[T2]]}\right)^{2/3}`,v=>finite(Math.exp(Math.log(v.a2)+(2/3)*(Math.log(v.T)-Math.log(v.T2))))),
 r('T2',['T','axisRatio'],String.raw`[[T]]\cdot[[axisRatio]]^{3/2}`,v=>scale(v.T,v.axisRatio,1.5)),
 r('T',['T2','axisRatio'],String.raw`\frac{[[T2]]}{[[axisRatio]]^{3/2}}`,v=>scale(v.T2,v.axisRatio,-1.5)),
 r('a2',['a','periodRatio'],String.raw`[[a]]\cdot[[periodRatio]]^{2/3}`,v=>scale(v.a,v.periodRatio,2/3)),
 r('a',['a2','periodRatio'],String.raw`\frac{[[a2]]}{[[periodRatio]]^{2/3}}`,v=>scale(v.a2,v.periodRatio,-2/3)),

 r('periodRatio',['T','T2'],String.raw`\frac{[[T2]]}{[[T]]}`,v=>divide(v.T2,v.T)),
 r('axisRatio',['a','a2'],String.raw`\frac{[[a2]]}{[[a]]}`,v=>divide(v.a2,v.a)),
 r('periodRatio',['axisRatio'],String.raw`[[axisRatio]]^{3/2}`,v=>scale(1,v.axisRatio,1.5)),
 r('axisRatio',['periodRatio'],String.raw`[[periodRatio]]^{2/3}`,v=>scale(1,v.periodRatio,2/3)),
 r('T2',['T','periodRatio'],String.raw`[[T]]\cdot[[periodRatio]]`,v=>finite(v.T*v.periodRatio)),
 r('T',['T2','periodRatio'],String.raw`\frac{[[T2]]}{[[periodRatio]]}`,v=>divide(v.T2,v.periodRatio)),
 r('a2',['a','axisRatio'],String.raw`[[a]]\cdot[[axisRatio]]`,v=>finite(v.a*v.axisRatio)),
 r('a',['a2','axisRatio'],String.raw`\frac{[[a2]]}{[[axisRatio]]}`,v=>divide(v.a2,v.axisRatio)),
 ...([{T:'T',a:'a'},{T:'T2',a:'a2'}] as const).flatMap(keys=>[
  r(keys.T,[keys.a,'M'],String.raw`2\pi\sqrt{\frac{[[`+keys.a+String.raw`]]^3}{G\cdot[[M]]}}`,v=>orbitalPeriod(v[keys.a],v.M)),
  r(keys.a,[keys.T,'M'],String.raw`\sqrt[3]{\frac{G\cdot[[M]]\cdot[[`+keys.T+String.raw`]]^2}{4\pi^2}}`,v=>orbitalAxis(v[keys.T],v.M)),
  r('M',[keys.a,keys.T],String.raw`\frac{4\pi^2\cdot[[`+keys.a+String.raw`]]^3}{G\cdot[[`+keys.T+String.raw`]]^2}`,v=>orbitalMass(v[keys.a],v[keys.T]))
 ])
];
export interface PeriodSolution {values:Values;steps:PeriodStep[];invalid:PeriodField[];conflicts:PeriodField[];numerical:boolean}
const close=(x:number,y:number)=>Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=1e-9*Math.max(Math.abs(x),Math.abs(y),Number.MIN_VALUE);
/** Explicit finite relation network for two orbits sharing one total mass; no mass approximation is automatic. */
export function solveKeplerPeriod(input:Values,blocked:readonly string[]=[]):PeriodSolution {
 const invalid=periodFields.filter(k=>input[k]!==undefined&&(!Number.isFinite(input[k])||input[k]<=0));
 const raw=Object.fromEntries(Object.entries(input).filter(([k])=>periodFields.includes(k as PeriodField)&&!invalid.includes(k as PeriodField)&&!blocked.includes(k)));
 const core=(given:Values,skip:readonly string[]=[])=>{
  const values={...given},steps:PeriodStep[]=[],bad=new Set<PeriodField>();let numerical=false;
  for(let pass=0;pass<periodFields.length;pass++){
   let changed=false;
   for(const rule of rules){if(values[rule.target]!==undefined||skip.includes(rule.target)||blocked.includes(rule.target)||invalid.includes(rule.target)||rule.inputs.some(k=>values[k]===undefined))continue;
    try{const value=finite(rule.calculate(values));values[rule.target]=value;steps.push(rule);changed=true;}catch(error){if(error instanceof ModelFailure){numerical ||= error.code==='numerical';continue;}throw error;}
   }
   if(!changed)break;
  }
  for(const rule of rules){if(rule.inputs.some(k=>values[k]===undefined)||values[rule.target]===undefined)continue;try{if(!close(rule.calculate(values),values[rule.target]))for(const k of [rule.target,...rule.inputs])bad.add(k);}catch(error){if(error instanceof ModelFailure){numerical=true;}else throw error;}}
  return {values,steps,bad,numerical};
 };
 let given={...raw},massSum=false,massParameter=false,sumNumerical=false;
 if(given.M===undefined&&given.centralMass!==undefined&&given.companionMass!==undefined){const sum=given.centralMass+given.companionMass;if(Number.isFinite(sum)){given.M=sum;massParameter=blocked.includes('M')||invalid.includes('M');massSum=!massParameter;}else sumNumerical=true;}
 let resolved=core(given);
 // If a total derived from the individual masses conflicts with independent orbital data,
 // keep the latter and flag the mass relation rather than losing all comparison results.
 if(massSum&&resolved.bad.size){const orbital=core(raw);if(!orbital.bad.size){resolved=orbital;massSum=false;}}
 const conflicts=new Set<PeriodField>(resolved.bad);
 if(conflicts.size){
  const partial=core(Object.fromEntries(Object.entries(raw).filter(([k])=>!conflicts.has(k as PeriodField))),[...conflicts]);
  // Ratios and the mass-free comparison remain valid independently of a contradictory mass.
  const comparison=core(Object.fromEntries(Object.entries(raw).filter(([k])=>k!=='M'&&k!=='centralMass'&&k!=='companionMass')),['M']);
  if(!comparison.bad.size)for(const step of comparison.steps){
   partial.values[step.target]=comparison.values[step.target];
   partial.steps=partial.steps.filter(existing=>existing.target!==step.target);
   partial.steps.push({...step,substitution:{...comparison.values}});
  }
  resolved={...partial,numerical:resolved.numerical||partial.numerical};
 }
 if(massSum){
  if(resolved.values.M===undefined)resolved.values.M=given.M;
  if(close(resolved.values.M,given.M)){
   resolved.steps=resolved.steps.filter(step=>step.target!=='M');
   resolved.steps.unshift({target:'M',inputs:['centralMass','companionMass'],formula:String.raw`[[centralMass]]+[[companionMass]]`});
  }else massSum=false;
 }
 const values=resolved.values;
 if(values.M!==undefined){
  const central=raw.centralMass,companion=raw.companionMass;
  if(central!==undefined&&companion!==undefined&&!close(central+companion,values.M)){for(const k of ['M','centralMass','companionMass'] as const)conflicts.add(k);}
  else if(central!==undefined&&companion===undefined&&!blocked.includes('companionMass')&&!invalid.includes('companionMass')){
   if(values.M>central){values.companionMass=values.M-central;resolved.steps.push({target:'companionMass',inputs:['M','centralMass'],formula:String.raw`[[M]]-[[centralMass]]`});}
   else for(const k of ['M','centralMass','companionMass'] as const)conflicts.add(k);
  }else if(companion!==undefined&&central===undefined&&!blocked.includes('centralMass')&&!invalid.includes('centralMass')){
   if(values.M>companion){values.centralMass=values.M-companion;resolved.steps.push({target:'centralMass',inputs:['M','companionMass'],formula:String.raw`[[M]]-[[companionMass]]`});}
   else for(const k of ['M','centralMass','companionMass'] as const)conflicts.add(k);
  }
 }
 if(massParameter){
  delete values.M;
  resolved.steps=resolved.steps.filter(step=>step.target!=='M').map(step=>step.inputs.includes('M')?{...step,inputs:step.inputs.flatMap(key=>key==='M'?['centralMass','companionMass'] as const:[key]),formula:step.formula.replaceAll('[[M]]','([[centralMass]]+[[companionMass]])')}:step);
 }
 return {values,steps:resolved.steps,invalid,conflicts:[...conflicts],numerical:resolved.numerical||sumNumerical};
}
/** Dimensionless graph coordinates are computed from the same explicit comparison law. */
export function keplerPeriodComparison(values:Values){
 const ratio=values.axisRatio??(values.periodRatio!==undefined?scale(1,values.periodRatio,2/3):undefined);
 const max=Math.max(1,ratio??1);
 const point=(a:number)=>({x:a/max,y:(a/max)**1.5});
 const firstKnown=values.a!==undefined&&values.T!==undefined,secondKnown=values.a2!==undefined&&values.T2!==undefined;
 const massSum=values.centralMass!==undefined&&values.companionMass!==undefined&&values.M!==undefined&&close(values.centralMass+values.companionMass,values.M);
 return {known:ratio!==undefined||firstKnown||secondKnown,
  first:ratio!==undefined||firstKnown?point(1):undefined,second:ratio!==undefined?point(ratio):secondKnown?point(1):undefined,
  masses:massSum?[values.centralMass/values.M,values.companionMass/values.M]:undefined,
  curve:Array.from({length:65},(_,i)=>{const x=i/64;return {x,y:x**1.5};})};
}
