import {inResourceDomain,divide,product,ModelFailure,type Domain,type Values} from '../resources/solver.ts';
export interface MomentumRule {target:string;inputs:string[];formula:string;calculate:(v:Values)=>number;when?:(v:Values)=>boolean}
const rule=(target:string,inputs:string[],formula:string,calculate:MomentumRule['calculate']):MomentumRule=>({target,inputs,formula,calculate});
export const momentumDomains:Record<string,Domain>={m1:'positive',m2:'positive',v1:'real',v2:'real',w1:'real',w2:'real',p1:'real',p2:'real',q1:'real',q2:'real',P:'real',dp1:'real',dp2:'real'};
export const rocketDomains:Record<string,Domain>={M0:'positive',M:'positive',dm:'nonnegative',u:'positive',v0:'real',v:'real',dv:'nonnegative',ratio:'atLeastOne',flow:'nonnegative',F:'nonnegative',a:'nonnegative',vg:'real'};
export const momentumRules:MomentumRule[]=[];
for(const [p,m,v] of [['p1','m1','v1'],['p2','m2','v2'],['q1','m1','w1'],['q2','m2','w2']])momentumRules.push(
 rule(p,[m,v],`[[${m}]]\\cdot[[${v}]]`,x=>product(x[m],x[v])),
 rule(m,[p,v],`\\frac{[[${p}]]}{[[${v}]]}`,x=>divide(x[p],x[v])),
 rule(v,[p,m],`\\frac{[[${p}]]}{[[${m}]]}`,x=>divide(x[p],x[m]))
);
function sumRules(total:string,left:string,right:string):MomentumRule[]{return [
 rule(total,[left,right],`[[${left}]]+[[${right}]]`,v=>v[left]+v[right]),
 rule(left,[total,right],`[[${total}]]-[[${right}]]`,v=>v[total]-v[right]),
 rule(right,[total,left],`[[${total}]]-[[${left}]]`,v=>v[total]-v[left])
];}
momentumRules.push(...sumRules('P','p1','p2'),...sumRules('P','q1','q2'),...sumRules('q1','p1','dp1'),...sumRules('q2','p2','dp2'),
 rule('dp1',['dp2'],String.raw`-[[dp2]]`,v=>-v.dp2),rule('dp2',['dp1'],String.raw`-[[dp1]]`,v=>-v.dp1),
 rule('m1',['dp1','w1','v1'],String.raw`\frac{[[dp1]]}{[[w1]]-[[v1]]}`,v=>divide(v.dp1,v.w1-v.v1)),
 rule('m2',['dp2','w2','v2'],String.raw`\frac{[[dp2]]}{[[w2]]-[[v2]]}`,v=>divide(v.dp2,v.w2-v.v2)),
 rule('m1',['m2','v1','v2','w1','w2'],String.raw`\frac{[[m2]]\cdot([[w2]]-[[v2]])}{[[v1]]-[[w1]]}`,v=>product(v.m2,divide(v.w2-v.v2,v.v1-v.w1))),
 rule('m2',['m1','v1','v2','w1','w2'],String.raw`\frac{[[m1]]\cdot([[v1]]-[[w1]])}{[[w2]]-[[v2]]}`,v=>product(v.m1,divide(v.v1-v.w1,v.w2-v.v2)))
);
export const rocketRules:MomentumRule[]=[
 ...sumRules('M0','M','dm'),...sumRules('v','v0','dv'),
 rule('ratio',['M0','M'],String.raw`\frac{[[M0]]}{[[M]]}`,v=>divide(v.M0,v.M)),
 rule('M0',['ratio','M'],String.raw`[[ratio]]\cdot[[M]]`,v=>product(v.ratio,v.M)),
 rule('M',['M0','ratio'],String.raw`\frac{[[M0]]}{[[ratio]]}`,v=>divide(v.M0,v.ratio)),
 rule('M',['dm','ratio'],String.raw`\frac{[[dm]]}{[[ratio]]-1}`,v=>divide(v.dm,v.ratio-1)),
 rule('dm',['M','ratio'],String.raw`[[M]]\cdot([[ratio]]-1)`,v=>product(v.M,v.ratio-1)),
 rule('ratio',['dm','M'],String.raw`1+\frac{[[dm]]}{[[M]]}`,v=>1+divide(v.dm,v.M)),
 rule('dv',['u','M','dm'],String.raw`[[u]]\cdot\ln\left(1+\frac{[[dm]]}{[[M]]}\right)`,v=>product(v.u,Math.log1p(divide(v.dm,v.M)))),
 rule('u',['dv','M','dm'],String.raw`\frac{[[dv]]}{\ln\left(1+\frac{[[dm]]}{[[M]]}\right)}`,v=>divide(v.dv,Math.log1p(divide(v.dm,v.M)))),
 rule('dv',['u','ratio'],String.raw`[[u]]\cdot\ln[[ratio]]`,v=>product(v.u,Math.log(v.ratio))),
 rule('u',['dv','ratio'],String.raw`\frac{[[dv]]}{\ln[[ratio]]}`,v=>divide(v.dv,Math.log(v.ratio))),
 rule('ratio',['dv','u'],String.raw`\exp\left(\frac{[[dv]]}{[[u]]}\right)`,v=>Math.exp(divide(v.dv,v.u))),
 rule('dm',['M','dv','u'],String.raw`[[M]]\cdot\left[\exp\left(\frac{[[dv]]}{[[u]]}\right)-1\right]`,v=>product(v.M,Math.expm1(divide(v.dv,v.u)))),
 rule('M',['dm','dv','u'],String.raw`\frac{[[dm]]}{\exp\left(\frac{[[dv]]}{[[u]]}\right)-1}`,v=>divide(v.dm,Math.expm1(divide(v.dv,v.u)))),
 rule('F',['u','flow'],String.raw`[[u]]\cdot[[flow]]`,v=>product(v.u,v.flow)),
 rule('u',['F','flow'],String.raw`\frac{[[F]]}{[[flow]]}`,v=>divide(v.F,v.flow)),
 rule('flow',['F','u'],String.raw`\frac{[[F]]}{[[u]]}`,v=>divide(v.F,v.u)),
 rule('F',['M','a'],String.raw`[[M]]\cdot[[a]]`,v=>product(v.M,v.a)),
 rule('M',['F','a'],String.raw`\frac{[[F]]}{[[a]]}`,v=>divide(v.F,v.a)),
 rule('a',['F','M'],String.raw`\frac{[[F]]}{[[M]]}`,v=>divide(v.F,v.M)),
 rule('vg',['v','u'],String.raw`[[v]]-[[u]]`,v=>v.v-v.u),
 rule('v',['vg','u'],String.raw`[[vg]]+[[u]]`,v=>v.vg+v.u),
 rule('u',['v','vg'],String.raw`[[v]]-[[vg]]`,v=>v.v-v.vg)
];
// Degenerate cases are determinate only where positivity removes the ambiguity.
for(const [p,v] of [['p1','v1'],['p2','v2'],['q1','w1'],['q2','w2']]){
 momentumRules.unshift({...rule(p,[v],'0',()=>0),when:x=>x[v]===0},{...rule(v,[p],'0',()=>0),when:x=>x[p]===0});
}
for(const [target,source,answer] of [['dv','dm',0],['ratio','dm',1],['dv','ratio',0],['dm','ratio',0],['ratio','dv',1],['dm','dv',0],['flow','F',0],['F','flow',0],['F','a',0],['a','F',0]] as const){
 rocketRules.unshift({...rule(target,[source],String(answer),()=>answer),when:v=>v[source]===(source==='ratio'?1:0)});
}
export interface MomentumResult {values:Values;steps:{target:string;formula:string;inputs:string[];snapshot:Values}[];conflicts:string[];invalid:string[];underdetermined:string[];numerical:boolean;noSolution:boolean}
/** Only explicit inverse rules; each successful pass adds a previously unknown value. */
export function solveMomentum(model:'rocket'|'momentum',input:Values,blocked:readonly string[]=[]):MomentumResult{
 return solveMomentumRelations(model==='rocket'?rocketDomains:momentumDomains,model==='rocket'?rocketRules:momentumRules,input,blocked);
}
export function solveMomentumRelations(domains:Record<string,Domain>,rules:readonly MomentumRule[],input:Values,blocked:readonly string[]=[]):MomentumResult{
 const invalid=Object.keys(input).filter(k=>!domains[k]||!inResourceDomain(input[k],domains[k]));
 const values:Values=Object.fromEntries(Object.entries(input).filter(([k])=>!invalid.includes(k)&&!blocked.includes(k)));
 const steps:MomentumResult['steps']=[],conflicts=new Set<string>(),underdetermined=new Set<string>();let numerical=false,noSolution=false;
 const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(Math.abs(a),Math.abs(b),Number.MIN_VALUE);
 for(let pass=0;pass<Object.keys(domains).length;pass++){
  let changed=false;
  for(const r of rules){
   if((r.when&&!r.when(values))||invalid.includes(r.target)||blocked.includes(r.target)||r.inputs.some(k=>values[k]===undefined||conflicts.has(k)))continue;
   // Near q = 1, inverse checks amplify rounding of q; the forward/log1p checks remain available.
   if(values[r.target]!==undefined&&r.inputs.includes('ratio')&&['M','u'].includes(r.target)&&values.ratio-1<1e-7)continue;
   let answer:number;
   try{answer=r.calculate(values);}catch(e){if(!(e instanceof ModelFailure))throw e;if(e.code==='underdetermined'){if(values[r.target]===undefined)underdetermined.add(r.target);}else if(e.code==='numerical')numerical=true;else {noSolution=true;for(const k of r.inputs)conflicts.add(k);}continue;}
   if(!Number.isFinite(answer)){numerical=true;continue;}
   if(!inResourceDomain(answer,domains[r.target])){noSolution=true;for(const k of [...r.inputs,r.target])conflicts.add(k);continue;}
   if(values[r.target]!==undefined){if(!close(answer,values[r.target])&&Math.abs(answer-values[r.target])>1e-12*Math.max(...r.inputs.map(k=>Math.abs(values[k])),Number.MIN_VALUE))for(const k of [...r.inputs,r.target])conflicts.add(k);continue;}
   values[r.target]=answer;steps.push({target:r.target,formula:r.formula,inputs:r.inputs,snapshot:{...values}});changed=true;
  }
  if(!changed)break;
 }
 // Invalidate only calculations that actually used a conflicting quantity.
 for(let pass=0;pass<steps.length;pass++)for(const s of steps)if(s.inputs.some(k=>conflicts.has(k)))conflicts.add(s.target);
 for(const key of conflicts)delete values[key];
 return {values,steps:steps.filter(s=>values[s.target]!==undefined),conflicts:[...conflicts],invalid,underdetermined:[...underdetermined].filter(k=>values[k]===undefined&&!conflicts.has(k)),numerical,noSolution};
}
