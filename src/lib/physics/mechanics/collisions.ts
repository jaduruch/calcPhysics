import {momentumDomains,momentumRules,solveMomentumRelations,type MomentumRule,type MomentumResult} from './momentum.ts';
import {divide,product,ModelFailure,type Values,type Domain} from '../resources/solver.ts';
const coefficient=(n:number)=>Math.abs(n)<1e-12?0:Math.abs(n-1)<1e-12?1:n;
const root=(value:number)=>{if(value<0)throw new ModelFailure('no-solution');return Math.sqrt(value);};
const r=(target:string,inputs:string[],formula:string,calculate:MomentumRule['calculate']):MomentumRule=>({target,inputs,formula,calculate});
export const collisionDomains:Record<string,Domain>={...momentumDomains,e:'unitInterval',E0:'nonnegative',E1:'nonnegative',loss:'nonnegative'};
const rules:MomentumRule[]=[...momentumRules,
 r('e',['v1','v2','w1','w2'],String.raw`\frac{[[w2]]-[[w1]]}{[[v1]]-[[v2]]}`,v=>coefficient(divide(v.w2-v.w1,v.v1-v.v2))),
 r('w1',['e','v1','v2','w2'],String.raw`[[w2]]-[[e]]\cdot([[v1]]-[[v2]])`,v=>v.w2-v.e*(v.v1-v.v2)),
 r('w2',['e','v1','v2','w1'],String.raw`[[w1]]+[[e]]\cdot([[v1]]-[[v2]])`,v=>v.w1+v.e*(v.v1-v.v2)),
 r('v1',['e','v2','w1','w2'],String.raw`[[v2]]+\frac{[[w2]]-[[w1]]}{[[e]]}`,v=>v.v2+divide(v.w2-v.w1,v.e)),
 r('v2',['e','v1','w1','w2'],String.raw`[[v1]]-\frac{[[w2]]-[[w1]]}{[[e]]}`,v=>v.v1-divide(v.w2-v.w1,v.e)),
 r('w1',['m1','m2','v1','v2','e'],String.raw`\frac{([[m1]]-[[e]]\cdot[[m2]])\cdot[[v1]]+(1+[[e]])\cdot[[m2]]\cdot[[v2]]}{[[m1]]+[[m2]]}`,v=>(v.m1-v.e*v.m2)/(v.m1+v.m2)*v.v1+(1+v.e)*v.m2/(v.m1+v.m2)*v.v2),
 r('w2',['m1','m2','v1','v2','e'],String.raw`\frac{(1+[[e]])\cdot[[m1]]\cdot[[v1]]+([[m2]]-[[e]]\cdot[[m1]])\cdot[[v2]]}{[[m1]]+[[m2]]}`,v=>(1+v.e)*v.m1/(v.m1+v.m2)*v.v1+(v.m2-v.e*v.m1)/(v.m1+v.m2)*v.v2),
 r('v1',['m1','m2','w1','w2','e'],String.raw`\frac{([[e]]\cdot[[m1]]-[[m2]])\cdot[[w1]]+(1+[[e]])\cdot[[m2]]\cdot[[w2]]}{[[e]]\cdot([[m1]]+[[m2]])}`,v=>divide((v.e*v.m1-v.m2)*v.w1+(1+v.e)*v.m2*v.w2,v.e*(v.m1+v.m2))),
 r('v2',['m1','m2','w1','w2','e'],String.raw`\frac{(1+[[e]])\cdot[[m1]]\cdot[[w1]]+([[e]]\cdot[[m2]]-[[m1]])\cdot[[w2]]}{[[e]]\cdot([[m1]]+[[m2]])}`,v=>divide((1+v.e)*v.m1*v.w1+(v.e*v.m2-v.m1)*v.w2,v.e*(v.m1+v.m2))),
 r('loss',['E0','E1'],String.raw`[[E0]]-[[E1]]`,v=>Math.abs(v.E0-v.E1)<=1e-12*Math.max(v.E0,v.E1)?0:v.E0-v.E1),
 r('E0',['loss','E1'],String.raw`[[loss]]+[[E1]]`,v=>v.loss+v.E1),
 r('E1',['E0','loss'],String.raw`[[E0]]-[[loss]]`,v=>v.E0-v.loss),
 r('loss',['m1','m2','v1','v2','e'],String.raw`\frac{[[m1]]\cdot[[m2]]}{2([[m1]]+[[m2]])}\cdot(1-[[e]]^2)\cdot([[v1]]-[[v2]])^2`,v=>product(.5*v.m1/(v.m1+v.m2)*v.m2,1-v.e*v.e,(v.v1-v.v2)**2)),
 r('e',['m1','m2','v1','v2','loss'],String.raw`\sqrt{1-\frac{2\cdot[[loss]]\cdot([[m1]]+[[m2]])}{[[m1]]\cdot[[m2]]\cdot([[v1]]-[[v2]])^2}}`,v=>root(1-divide(2*v.loss*(v.m1+v.m2),v.m1*v.m2*(v.v1-v.v2)**2)))
];
for(const [out,A,B] of [['w1','m1','m2'],['w2','m2','m1']]){
 const incoming=out==='w1'?'v1':'v2',other=out==='w1'?'v2':'v1';
 rules.push(
 r(incoming,[out,other,'m1','m2','e'],`\\frac{([[m1]]+[[m2]])\\cdot[[${out}]]-(1+[[e]])\\cdot[[${B}]]\\cdot[[${other}]]}{[[${A}]]-[[e]]\\cdot[[${B}]]}`,v=>divide((v.m1+v.m2)*v[out]-(1+v.e)*v[B]*v[other],v[A]-v.e*v[B])),
 r(other,[out,incoming,'m1','m2','e'],`\\frac{([[m1]]+[[m2]])\\cdot[[${out}]]-([[${A}]]-[[e]]\\cdot[[${B}]])\\cdot[[${incoming}]]}{(1+[[e]])\\cdot[[${B}]]}`,v=>divide((v.m1+v.m2)*v[out]-(v[A]-v.e*v[B])*v[incoming],(1+v.e)*v[B]))
 );
}
for(const rule of rules){
 if(rule.target==='e'&&rule.inputs.includes('loss'))rule.when=v=>v.e===undefined;
 if(['v1','v2'].includes(rule.target)&&rule.inputs.includes('e')&&rule.inputs.includes('w1')&&rule.inputs.includes('w2'))rule.when=v=>v.e!==0;
 if(rule.target==='v1'&&rule.inputs.includes('w1')&&rule.inputs.includes('v2')&&rule.inputs.includes('m1'))rule.when=v=>v.m1-v.e*v.m2!==0;
 if(rule.target==='v2'&&rule.inputs.includes('w2')&&rule.inputs.includes('v1')&&rule.inputs.includes('m1'))rule.when=v=>v.m2-v.e*v.m1!==0;
}
for(const [E,v1,v2] of [['E0','v1','v2'],['E1','w1','w2']]){
 rules.push(r(E,['m1','m2',v1,v2],`\\frac{[[m1]]\\cdot[[${v1}]]^2+[[m2]]\\cdot[[${v2}]]^2}{2}`,v=>(product(v.m1,v[v1],v[v1])+product(v.m2,v[v2],v[v2]))/2));
 for(const [m,other,u,w] of [['m1','m2',v1,v2],['m2','m1',v2,v1]])rules.push(r(m,[E,other,u,w],`\\frac{2\\cdot[[${E}]]-[[${other}]]\\cdot[[${w}]]^2}{[[${u}]]^2}`,v=>divide(2*v[E]-v[other]*v[w]**2,v[u]**2)));
}
rules.unshift({...r('w2',['w1','e'],'[[w1]]',v=>v.w1),when:v=>v.e===0},{...r('w1',['w2','e'],'[[w2]]',v=>v.w2),when:v=>v.e===0},{...r('loss',['e'],'0',()=>0),when:v=>v.e===1});
for(const [energy,first,second] of [['E0','v1','v2'],['E1','w1','w2']])for(const velocity of [first,second])rules.unshift({...r(velocity,[energy],'0',()=>0),when:v=>v[energy]===0});
for(const target of ['loss','E1'])rules.unshift({...r(target,['E0'],'0',()=>0),when:v=>v.E0===0});
export interface CollisionResult {solutions:MomentumResult[];fallback:MomentumResult;ambiguous:boolean}
/** Branches are only the explicit ± roots of a kinetic-energy measurement. */
export function solveCollision(elastic:boolean,input:Values,blocked:readonly string[]=[]):CollisionResult{
 const base={...input,...(elastic?{e:1}:{})};
 const queue:{input:Values;branches:MomentumResult['steps']}[]=[{input:base,branches:[]}],solutions:MomentumResult[]=[];
 let fallback=solveMomentumRelations(collisionDomains,rules,base,blocked),ambiguous=false;
 for(let index=0;index<queue.length&&index<64;index++){
  const state=queue[index],s=solveMomentumRelations(collisionDomains,rules,state.input,blocked);
  let branch=false;
  if(!s.conflicts.length&&!s.numerical){
   const addBranch=(target:string,inputs:string[],formula:string,centre:number,square:number)=>{
    if(!Number.isFinite(square)||!Number.isFinite(centre)){s.numerical=true;return;}
    if(square<0){s.noSolution=true;s.conflicts.push(...inputs);return;}
    const magnitude=Math.sqrt(square);
    for(const sign of magnitude===0?[1]:[1,-1]){const value=centre+sign*magnitude;
     queue.push({input:{...state.input,[target]:value},branches:[...state.branches,{target,inputs,snapshot:{...s.values,[target]:value},formula:formula.replace('SIGN',sign<0?'-':'+')}]});
    }
    branch=true;
   };
   for(const [E,u,w,m,other] of [['E0','v1','v2','m1','m2'],['E0','v2','v1','m2','m1'],['E1','w1','w2','m1','m2'],['E1','w2','w1','m2','m1']]){
    if(s.values[u]!==undefined||blocked.includes(u)||s.invalid.includes(u)||[E,w,m,other].some(k=>s.values[k]===undefined))continue;
    const v=s.values,square=(2*v[E]-v[other]*v[w]**2)/v[m];
    addBranch(u,[E,w,m,other],`SIGN\\sqrt{\\frac{2\\cdot[[${E}]]-[[${other}]]\\cdot[[${w}]]^2}{[[${m}]]}}`,0,square);break;
   }
   if(!branch&&!s.noSolution&&!s.numerical)for(const [E,u] of [['E0','v1'],['E1','w1']]){
    const v=s.values;if(v[u]!==undefined||blocked.includes(u)||s.invalid.includes(u)||[E,'P','m1','m2'].some(k=>v[k]===undefined))continue;
    const mass=v.m1+v.m2,centre=v.P/mass,excess=2*v[E]-v.P*centre;
    const square=v.m2/mass*excess/v.m1;
    addBranch(u,[E,'P','m1','m2'],`\\frac{[[P]]}{[[m1]]+[[m2]]}SIGN\\sqrt{\\frac{[[m2]]}{[[m1]]([[m1]]+[[m2]])}\\left(2\\cdot[[${E}]]-\\frac{[[P]]^2}{[[m1]]+[[m2]]}\\right)}`,centre,square);break;
   }
   if(!branch&&!s.noSolution&&!s.numerical){
    const v=s.values;
    if(['loss','e','m1','m2'].every(k=>v[k]!==undefined)&&v.e<1){
     const mass=v.m1+v.m2,relativeSquare=2*v.loss*mass/(v.m1*v.m2*(1-v.e*v.e));
     for(const [target,other] of [['v1','v2'],['v2','v1']]){
      if(v[target]!==undefined||blocked.includes(target)||s.invalid.includes(target)||v[other]===undefined)continue;
      addBranch(target,['loss','e','m1','m2',other],`[[${other}]]SIGN\\sqrt{\\frac{2\\cdot[[loss]]([[m1]]+[[m2]])}{[[m1]]\\cdot[[m2]](1-[[e]]^2)}}`,v[other],relativeSquare);break;
     }
    }
   }
  }
  if(branch)continue;
  if(s.noSolution){for(const key of s.conflicts)delete s.values[key];}
  s.steps=[...state.branches,...s.steps].filter(step=>s.values[step.target]!==undefined);
  if(!s.conflicts.length&&!s.noSolution){
   if(!solutions.some(a=>Object.keys(s.values).every(k=>Math.abs(s.values[k]-a.values[k])<=1e-9*Math.max(1,Math.abs(s.values[k])))))solutions.push(s);
  }else if(!solutions.length)fallback=s;
 }
 if(queue.length>64)ambiguous=true;
 return {solutions,fallback,ambiguous};
}
