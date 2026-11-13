/** One explicit relation network for geometry, sliding and uniform raising. */
import { resourcePhysics } from '../resources/models.ts';
import { solveResourceModel, inResourceDomain, type ResourcePhysics, type Values } from '../resources/solver.ts';
import { solveInclinedPlane } from './inclined-plane.ts';
export interface InclineRelation { physics:ResourcePhysics; map:Record<string,string>; formulas:Record<string,string> }

export const inclineMappings:Record<string,Record<string,string>>={
 'book-slope-geometry':{h:'height',s:'length',alpha:'angle'},
 'book-normal-force':{Fn:'normal',Fg:'weight',alpha:'angle'},
 'book-slope-component':{F:'parallel',m:'mass',g:'gravity',alpha:'angle'},
 'book-slope-raising':{F:'raising',Fg:'weight',mu:'friction',alpha:'angle'},
 'book-slope-lowering':{F:'net',Fg:'weight',mu:'friction',alpha:'angle'},
 'book-slope-acceleration':{a:'acceleration',g:'gravity',mu:'friction',alpha:'angle'}
};
export const inclineRelations:InclineRelation[]=Object.entries(inclineMappings).map(([id,map])=>({physics:resourcePhysics[id],map,formulas:{}}));
function relation(keys:string[],formulas:string[],inverse:((v:Values)=>number)[],domains:ResourcePhysics['domains']) {
 inclineRelations.push({map:Object.fromEntries(keys.map(k=>[k,k])),physics:{domains,primary:keys,inverse:Object.fromEntries(keys.map((k,i)=>[k,inverse[i]]))},formulas:Object.fromEntries(keys.map((k,i)=>[k,formulas[i]]))});
}
relation(['weight','mass','gravity'],[String.raw`[[mass]]\cdot[[gravity]]`,String.raw`\frac{[[weight]]}{[[gravity]]}`,String.raw`\frac{[[weight]]}{[[mass]]}`],[v=>v.mass*v.gravity,v=>v.weight/v.gravity,v=>v.weight/v.mass],{weight:'positive',mass:'positive',gravity:'positive'});
relation(['frictionForce','friction','normal'],[String.raw`[[friction]]\cdot[[normal]]`,String.raw`\frac{[[frictionForce]]}{[[normal]]}`,String.raw`\frac{[[frictionForce]]}{[[friction]]}`],[v=>v.friction*v.normal,v=>v.frictionForce/v.normal,v=>v.frictionForce/v.friction],{frictionForce:'nonnegative',friction:'nonnegative',normal:'nonnegative'});
relation(['net','parallel','frictionForce'],[String.raw`[[parallel]]-[[frictionForce]]`,String.raw`[[net]]+[[frictionForce]]`,String.raw`[[parallel]]-[[net]]`],[v=>v.parallel-v.frictionForce,v=>v.net+v.frictionForce,v=>v.parallel-v.net],{net:'real',parallel:'nonnegative',frictionForce:'nonnegative'});
relation(['net','mass','acceleration'],[String.raw`[[mass]]\cdot[[acceleration]]`,String.raw`\frac{[[net]]}{[[acceleration]]}`,String.raw`\frac{[[net]]}{[[mass]]}`],[v=>v.mass*v.acceleration,v=>v.net/v.acceleration,v=>v.net/v.mass],{net:'real',mass:'positive',acceleration:'real'});
relation(['endVelocity','acceleration','length'],[String.raw`\sqrt{2\cdot[[acceleration]]\cdot[[length]]}`,String.raw`\frac{[[endVelocity]]^2}{2\cdot[[length]]}`,String.raw`\frac{[[endVelocity]]^2}{2\cdot[[acceleration]]}`],[v=>Math.sqrt(2*v.acceleration*v.length),v=>v.endVelocity*v.endVelocity/(2*v.length),v=>v.endVelocity*v.endVelocity/(2*v.acceleration)],{endVelocity:'nonnegative',acceleration:'nonnegative',length:'positive'});
relation(['endVelocity','gravity','height'],[String.raw`\sqrt{2\cdot[[gravity]]\cdot[[height]]}`,String.raw`\frac{[[endVelocity]]^2}{2\cdot[[height]]}`,String.raw`\frac{[[endVelocity]]^2}{2\cdot[[gravity]]}`],[v=>Math.SQRT2*Math.sqrt(v.gravity)*Math.sqrt(v.height),v=>v.endVelocity*v.endVelocity/(2*v.height),v=>v.endVelocity*v.endVelocity/(2*v.gravity)],{endVelocity:'nonnegative',gravity:'positive',height:'nonnegative'});
export const inclineDomains:ResourcePhysics['domains']={mass:'positive',angle:'quadrant',length:'positive',height:'nonnegative',endVelocity:'nonnegative',friction:'nonnegative',gravity:'positive',weight:'positive',normal:'nonnegative',parallel:'nonnegative',frictionForce:'nonnegative',net:'real',raising:'real',acceleration:'real'};
export interface CombinedInclineBranch {values:Values;steps:{target:string;formula:string;source?:number}[];assumed:string[]}
export function solveCombinedIncline(input:Values,blocked:readonly string[]=[],recover=true):{branches:CombinedInclineBranch[];conflict:boolean;invalid:string[];conflictFields:string[]} {
 const invalid=Object.keys(input).filter(k=>!inResourceDomain(input[k],inclineDomains[k]));
 if(invalid.length)return {branches:[] as CombinedInclineBranch[],conflict:false,invalid,conflictFields:[] as string[]};
 let branches:CombinedInclineBranch[]=[{values:{...input},steps:[],assumed:[]}];
 let conflict=false;const conflictFields=new Set<string>();
 function propagate(){
  for(let pass=0;pass<Object.keys(inclineDomains).length;pass++){
   let changed=false;
   for(const relation of inclineRelations){
    const next:CombinedInclineBranch[]=[];
    for(const branch of branches){
     if(relation.map.endVelocity&&relation.map.height&&branch.values.friction!==0){next.push(branch);continue;}
     const keys=Object.keys(relation.map),missing=keys.filter(k=>branch.values[relation.map[k]]===undefined);
     if(missing.length>1||missing.some(k=>blocked.includes(relation.map[k]))){next.push(branch);continue;}
     // Negative acceleration means braking: the from-rest speed relation is inapplicable.
     if(relation.map.endVelocity&&branch.values.acceleration<0){if(branch.values.endVelocity!==undefined){conflict=true;for(const key of ['endVelocity','acceleration','length'])conflictFields.add(key);}else next.push(branch);continue;}
     const local=Object.fromEntries(keys.filter(k=>branch.values[relation.map[k]]!==undefined).map(k=>[k,branch.values[relation.map[k]]]));
     const result=solveResourceModel(relation.physics,local);
     if(result.status==='success'){
      if(!missing.length){next.push(branch);continue;}
      const target=relation.map[missing[0]];
      for(const solution of result.solutions??[result.values])next.push({values:{...branch.values,[target]:solution[missing[0]]},steps:[...branch.steps,{target,formula:relation.formulas[target]??'',source:inclineRelations.indexOf(relation)}],assumed:[...branch.assumed]});
      changed=true;
     }else if(result.status==='conflict'||result.status==='no-solution'){conflict=true;for(const key of Object.values(relation.map))conflictFields.add(key);}
     else next.push(branch);
    }
    branches=next;
   }
   // Existing stable speed/geometry solver also handles mass-independent inverse energy paths.
   for(const branch of branches){
    if(branch.values.gravity===undefined||branch.values.friction===undefined)continue;
    const local=Object.fromEntries(['angle','length','height','endVelocity','gravity','friction'].filter(k=>branch.values[k]!==undefined).map(k=>[k,branch.values[k]]));
    const result=solveInclinedPlane(local);
    if(result.status==='success')for(const step of result.steps){if(branch.values[step.field]===undefined&&!blocked.includes(step.field)){
     const formulas={height:String.raw`\frac{[[endVelocity]]^2}{2\cdot[[gravity]]}`,length:String.raw`\frac{[[endVelocity]]^2}{2\cdot[[gravity]]\cdot(\sin[[angle]]-[[friction]]\cdot\cos[[angle]])}`,angle:String.raw`\arctan[[friction]]+\arcsin\frac{[[endVelocity]]^2}{2\cdot[[gravity]]\cdot[[length]]\cdot\sqrt{1+[[friction]]^2}}`};
     // Geometry paths have already been resolved by the explicit geometry relation.
     if(step.method==='geometry')continue;
     branch.values[step.field]=result[step.field]!;branch.steps.push({target:step.field,formula:step.method==='speed-height'?String.raw`\sqrt{[[height]]^2+\left(\frac{[[height]]-\frac{[[endVelocity]]^2}{2\cdot[[gravity]]}}{[[friction]]}\right)^2}`:formulas[step.field]});changed=true;
    }}
   }
   if(!changed)break;
  }
 }
 propagate();
 for(const key of ['friction','gravity']){
  for(const b of branches)if(b.values[key]===undefined&&!blocked.includes(key)){b.values[key]=key==='friction'?0:9.81;b.assumed.push(key);}
  propagate();
 }
 if(conflict&&branches.length===0&&recover){
  const bad=[...conflictFields];
  const partial=solveCombinedIncline(Object.fromEntries(Object.entries(input).filter(([key])=>!bad.includes(key))),[...blocked,...bad],false);
  return {...partial,conflict:true,conflictFields:bad};
 }
 return {branches,conflict:conflict&&branches.length===0,invalid,conflictFields:conflict&&branches.length===0?[...conflictFields]:[]};
}
