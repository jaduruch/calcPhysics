import {ModelFailure,inResourceDomain,solveResourceModel,type ResourcePhysics,type Domain,type Values} from './solver.ts';
export interface CombinedRelation {unavailable?:{field:string;value:number;targets:string[]};id:string; physics:ResourcePhysics; keys:Record<string,string>; formulas:Record<string,string>}
export interface CombinedStep {source?:string;sourceTarget?:string;local?:Values;target:string;formula:string;values:Values;dependencies:string[]}
export interface CombinedBranch {values:Values;steps:CombinedStep[];conflicts:string[];impossible:string[];singular:string[];numerical:string[]}
export function combinedDomains(relations:readonly CombinedRelation[]):Record<string,Domain[]> {
 const domains:Record<string,Domain[]>={};for(const r of relations)for(const [k,d]of Object.entries(r.physics.domains)){const id=r.keys[k]??k;(domains[id]??=[]).push(d);}return domains;
}
const equal=(a:number,b:number)=>a===b||Math.abs(a-b)<=1e-10*Math.max(Math.abs(a),Math.abs(b),Number.MIN_VALUE);
/** Only registered explicit inverses are called. Every pass adds a previously missing quantity. */
export function solveCombined(relations:readonly CombinedRelation[],input:Values,invalid:readonly string[]=[],zeros:readonly {source:string;target:string;formula:string;when?:number;copy?:string}[]=[]):CombinedBranch[] {
 const domains=combinedDomains(relations),bad=new Set([...invalid,...Object.keys(input).filter(k=>domains[k]?.some(d=>!inResourceDomain(input[k],d)))]);
 let branches:CombinedBranch[]=[{values:Object.fromEntries(Object.entries(input).filter(([k])=>!bad.has(k))),steps:[],conflicts:[],impossible:[],singular:[],numerical:[]}];
 for(let pass=0;pass<Object.keys(domains).length;pass++){
  let changed=false;
  branches=branches.flatMap(branch=>{
   for(const zero of zeros)if(branch.values[zero.source]===(zero.when??0)&&branch.values[zero.target]===undefined&&!bad.has(zero.source)&&!bad.has(zero.target)&&(!zero.copy||branch.values[zero.copy]!==undefined&&!bad.has(zero.copy))){
    branch.steps.push({target:zero.target,formula:zero.formula,values:{...branch.values},dependencies:[zero.source,...(zero.copy?[zero.copy]:[])]});branch.values[zero.target]=zero.copy?branch.values[zero.copy]:0;changed=true;
   }
   for(const r of relations){
    if(r.unavailable&&branch.values[r.keys[r.unavailable.field]??r.unavailable.field]===r.unavailable.value){branch.impossible.push(...r.unavailable.targets);continue;}
    const keys=Object.keys(r.physics.domains),mapped=keys.map(k=>r.keys[k]??k);
    if(mapped.some(k=>bad.has(k)))continue;
    const local:Values={};for(const k of keys){const v=branch.values[r.keys[k]??k];if(v!==undefined)local[k]=v;}
    if(keys.filter(k=>local[k]===undefined).length!==1)continue;
    const result=solveResourceModel({...r.physics,defaults:undefined},local);
    if(result.status==='underdetermined'){branch.singular.push(...mapped.filter(k=>branch.values[k]===undefined));continue;}
    if(result.status==='no-solution'){branch.impossible.push(...mapped);continue;}
    if(result.status==='numerical'){branch.numerical.push(...mapped);continue;}
    if(result.status!=='success'||!result.target)continue;
    const target=r.keys[result.target]??result.target;
    const candidates=(result.solutions??[result.values]).filter(v=>domains[target].every(d=>inResourceDomain(v[result.target!],d)));
    if(!candidates.length){branch.impossible.push(...mapped);continue;}
    changed=true;
    return candidates.map(v=>({...branch,values:{...branch.values,[target]:v[result.target!]},steps:[...branch.steps,{source:r.id,sourceTarget:result.target!,local:v,target,formula:r.formulas[result.target!],values:{...branch.values},dependencies:mapped.filter(k=>k!==target)}],conflicts:[...branch.conflicts],impossible:[...branch.impossible],singular:[...branch.singular],numerical:[...branch.numerical]}));
   }
   return [branch];
  });
  if(!changed)break;
 }
 for(const branch of branches){
  for(const r of relations){if(r.unavailable&&branch.values[r.keys[r.unavailable.field]??r.unavailable.field]===r.unavailable.value){branch.impossible.push(...r.unavailable.targets);continue;}const keys=Object.keys(r.physics.domains),mapped=keys.map(k=>r.keys[k]??k);if(mapped.some(k=>bad.has(k)||branch.values[k]===undefined))continue;
   const local=Object.fromEntries(keys.map(k=>[k,branch.values[r.keys[k]??k]]));
   const result=solveResourceModel({...r.physics,defaults:undefined},local);
   if(result.status==='conflict'||result.status==='no-solution'||result.status==='invalid')branch.conflicts.push(...mapped);
   if(result.status==='numerical')branch.numerical.push(...mapped);
  }
  const blocked=new Set([...branch.conflicts,...branch.impossible,...branch.numerical]);
  for(const step of branch.steps)if(blocked.has(step.target)||step.dependencies.some(k=>blocked.has(k)))blocked.add(step.target);
  branch.values=Object.fromEntries(Object.entries(branch.values).filter(([k])=>!blocked.has(k)));
  branch.steps=branch.steps.filter(s=>!blocked.has(s.target)&&!s.dependencies.some(k=>blocked.has(k)));
  for(const key of ['conflicts','impossible','numerical','singular'] as const)branch[key]=[...new Set(branch[key])].filter(k=>key!=='singular'||branch.values[k]===undefined);
 }
 const valid=branches.filter(b=>!b.conflicts.length&&!b.impossible.length&&!b.numerical.length);
 const results=valid.length?valid:branches;
 return results.filter((b,i)=>results.findIndex(other=>Object.keys(b.values).length===Object.keys(other.values).length&&Object.keys(b.values).every(k=>equal(b.values[k],other.values[k])))===i);
}
/** Closed first-quadrant endpoints, evaluated exactly instead of cos(π/2) roundoff. */
export function inclusiveComponentPhysics(physics:ResourcePhysics,axis:'x'|'y'):ResourcePhysics {
 const key=axis==='x'?'vx':'vy';
 const factor=(a:number)=>axis==='x'?(a===Math.PI/2?0:Math.cos(a)):(a===0?0:Math.sin(a));
 return {...physics,domains:{...physics.domains,alpha:'quadrant'},inverse:{...physics.inverse,
  [key]:v=>v.v0*factor(v.alpha),v0:v=>{const f=factor(v.alpha);if(f===0)throw new ModelFailure(v[key]===0?'underdetermined':'no-solution');return v[key]/f;}
 }};
}
