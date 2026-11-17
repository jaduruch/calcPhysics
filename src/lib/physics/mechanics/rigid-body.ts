/** Fixed, explicit rigid-body relations. No expression parser or symbolic algebra. */
export type RigidMode = 'energy' | 'momentum' | 'inertia';
export type Shape = 'general' | 'ring' | 'cylinder' | 'tube' | 'sphere' | 'shell' | 'cone' | 'rod' | 'cuboid';
export type Values = Record<string, number>;
export interface Relation { keys: string[]; formulas: Record<string,string>; inverse: Record<string,(v:Values)=>number[]>; balance:(v:Values)=>[number,number] }
export interface Step {target:string; formula:string; snapshot:Values; sources:string[]}
export interface Branch {values:Values; steps:Step[]; conflicts:string[]; impossible:string[]; singular:string[]; numerical:string[]}
const root=(x:number)=>x<0?[]:x===0?[0]:[-Math.sqrt(x),Math.sqrt(x)];
const one=(x:number)=>[x];
// Zero denominators distinguish an impossible equation from infinitely many solutions.
function quotient(n:number,d:number):number[] {if(d===0)return n===0?[NaN]:[];return [n/d];}
function squareRootRatio(n:number,d:number):number[] {if(d===0)return n===0?[NaN]:[];return root(n/d);}
const relation=(keys:string[],formulas:Record<string,string>,inverse:Relation['inverse'],balance:Relation['balance']):Relation=>({keys,formulas,inverse,balance});
const rotation=relation(['Er','I','w'],{Er:'\\frac12\\cdot [[I]]\\cdot [[w]]^2',I:'\\frac{2\\cdot[[Er]]}{[[w]]^2}',w:'\\pm\\sqrt{\\frac{2\\cdot[[Er]]}{[[I]]}}'}, {Er:v=>one(.5*v.I*v.w*v.w),I:v=>quotient(2*v.Er,v.w*v.w),w:v=>squareRootRatio(2*v.Er,v.I)},v=>[v.Er,.5*v.I*v.w*v.w]);
const translation=relation(['Et','m','v'],{Et:'\\frac12\\cdot [[m]]\\cdot [[v]]^2',m:'\\frac{2\\cdot[[Et]]}{[[v]]^2}',v:'\\pm\\sqrt{\\frac{2\\cdot[[Et]]}{[[m]]}}'}, {Et:v=>one(.5*v.m*v.v*v.v),m:v=>quotient(2*v.Et,v.v*v.v),v:v=>squareRootRatio(2*v.Et,v.m)},v=>[v.Et,.5*v.m*v.v*v.v]);
const total=relation(['E','Et','Er'],{E:'[[Et]]+[[Er]]',Et:'[[E]]-[[Er]]',Er:'[[E]]-[[Et]]'}, {E:v=>one(v.Et+v.Er),Et:v=>one(v.E-v.Er),Er:v=>one(v.E-v.Et)},v=>[v.E,v.Et+v.Er]);
function linearProduct(a:string,b:string,c:string):Relation {return relation([a,b,c],{[a]:`[[${b}]]\\cdot[[${c}]]`,[b]:`\\frac{[[${a}]]}{[[${c}]]}`,[c]:`\\frac{[[${a}]]}{[[${b}]]}`},{[a]:v=>one(v[b]*v[c]),[b]:v=>quotient(v[a],v[c]),[c]:v=>quotient(v[a],v[b])},v=>[v[a],v[b]*v[c]]);}
const steiner=relation(['IA','I0','m','d'],{IA:'[[I0]]+[[m]]\\cdot[[d]]^2',I0:'[[IA]]-[[m]]\\cdot[[d]]^2',m:'\\frac{[[IA]]-[[I0]]}{[[d]]^2}',d:'\\sqrt{\\frac{[[IA]]-[[I0]]}{[[m]]}}'}, {IA:v=>one(v.I0+v.m*v.d*v.d),I0:v=>one(v.IA-v.m*v.d*v.d),m:v=>quotient(v.IA-v.I0,v.d*v.d),d:v=>squareRootRatio(v.IA-v.I0,v.m).filter(x=>!(x<0))},v=>[v.IA,v.I0+v.m*v.d*v.d]);
export function shapeRelation(shape:Shape):Relation|null {
 if(shape==='general')return null;
 if(shape==='tube'||shape==='cuboid') {
  const [a,b,k]=shape==='tube'?['R','r',.5] as const:['a','b',1/12] as const;
  const coefficient=shape==='tube'?'\\frac12':'\\frac1{12}';
  return relation(['I0','m',a,b],{I0:`${coefficient}\\cdot[[m]]\\cdot([[${a}]]^2+[[${b}]]^2)`,m:`\\frac{[[I0]]}{${coefficient}\\cdot([[${a}]]^2+[[${b}]]^2)}`,[a]:`\\sqrt{\\frac{[[I0]]}{${coefficient}\\cdot[[m]]}-[[${b}]]^2}`,[b]:`\\sqrt{\\frac{[[I0]]}{${coefficient}\\cdot[[m]]}-[[${a}]]^2}`}, {I0:v=>one(k*v.m*(v[a]*v[a]+v[b]*v[b])),m:v=>quotient(v.I0,k*(v[a]*v[a]+v[b]*v[b])),[a]:v=>root(v.I0/(k*v.m)-v[b]*v[b]).filter(x=>x>=0),[b]:v=>root(v.I0/(k*v.m)-v[a]*v[a]).filter(x=>x>=0)},v=>[v.I0,k*v.m*(v[a]*v[a]+v[b]*v[b])]);
 }
 const k={ring:1,cylinder:.5,sphere:2/5,shell:2/3,cone:3/10,rod:1/12}[shape];
 const c={ring:'1',cylinder:'\\frac12',sphere:'\\frac25',shell:'\\frac23',cone:'\\frac3{10}',rod:'\\frac1{12}'}[shape];
 const x=shape==='rod'?'l':'R';
 return relation(['I0','m',x],{I0:`${c}\\cdot[[m]]\\cdot[[${x}]]^2`,m:`\\frac{[[I0]]}{${c}\\cdot[[${x}]]^2}`,[x]:`\\sqrt{\\frac{[[I0]]}{${c}\\cdot[[m]]}}`},{I0:v=>one(k*v.m*v[x]*v[x]),m:v=>quotient(v.I0,k*v[x]*v[x]),[x]:v=>squareRootRatio(v.I0,k*v.m).filter(x=>!(x<0))},v=>[v.I0,k*v.m*v[x]*v[x]]);
}
export function rigidRelations(mode:RigidMode,shape:Shape='general'):Relation[] {return mode==='energy'?[rotation,translation,total]:mode==='momentum'?[linearProduct('L','I','w'),linearProduct('M','I','alpha')]:[...(shapeRelation(shape)?[shapeRelation(shape)!]:[]),steiner];}
export function rigidDomain(key:string,value:number):boolean {return Number.isFinite(value)&&(['m','I','I0','IA','R','l','a','b'].includes(key)?value>0:['Er','Et','E','d','r'].includes(key)?value>=0:true);}
const near=(a:number,b:number)=>a===b||Math.abs(a-b)<=1e-10*Math.max(Math.abs(a),Math.abs(b),Number.MIN_VALUE);
/** Each pass resolves at least one missing quantity. Branches are explicit algebraic roots. */
export function solveRigid(mode:RigidMode,input:Values,shape:Shape='general',invalid:readonly string[]=[]):Branch[] {
 const relations=rigidRelations(mode,shape),bad=new Set([...invalid,...Object.keys(input).filter(k=>!rigidDomain(k,input[k]))]);
 const initial:Values=Object.fromEntries(Object.entries(input).filter(([k])=>!bad.has(k)));
 let branches:Branch[]=[{values:initial,steps:[],conflicts:[],impossible:[],singular:[],numerical:[]}];
 const size=new Set(relations.flatMap(r=>r.keys)).size;
 for(let pass=0;pass<size;pass++) {
  let changed=false;
  branches=branches.flatMap(branch=>{
   const blocked=new Set([...bad,...branch.conflicts,...branch.impossible,...branch.numerical]);
   // Positivity makes these exact zero cases determinate without the missing scale.
   const zeros: [string,string,string][] = mode==='energy'?
    [['w','Er','\\left.\\frac12 I\\omega^2\\right|_{\\omega=[[w]]}'],['v','Et','\\left.\\frac12 mv_S^2\\right|_{v_S=[[v]]}'],['Er','w','\\pm\\sqrt{2\\cdot[[Er]]/I}'],['Et','v','\\pm\\sqrt{2\\cdot[[Et]]/m}'],['E','Er','[[E]]'],['E','Et','[[E]]']]:
    mode==='momentum'?[['L','w','[[L]]/I'],['M','alpha','[[M]]/I'],['w','L','I\\cdot[[w]]'],['alpha','M','I\\cdot[[alpha]]']]:[];
   for(const [source,target,formula] of zeros)if(branch.values[source]===0&&branch.values[target]===undefined&&!blocked.has(source)&&!blocked.has(target)){
    branch.steps.push({target,formula,snapshot:{...branch.values},sources:[source]});branch.values[target]=0;changed=true;
   }
   if(mode==='inertia') {
    const add=(target:string,value:number,formula:string,sources:string[])=>{
     if(branch.values[target]===undefined&&!blocked.has(target)&&!sources.some(k=>blocked.has(k))){branch.steps.push({target,formula,snapshot:{...branch.values},sources});branch.values[target]=value;changed=true;}
    };
    const body=shapeRelation(shape),dimensions=body?.keys.filter(k=>k!=='m'&&k!=='I0')??[];
    if(body&&branch.values.m===undefined&&branch.values.IA!==undefined&&branch.values.d!==undefined&&dimensions.every(k=>branch.values[k]!==undefined)){
     const factor=body.inverse.I0({...branch.values,m:1})[0];
     const mass=branch.values.IA/(factor+branch.values.d**2);
     if(rigidDomain('m',mass))add('m',mass,`\\frac{[[IA]]}{${body.formulas.I0.replace('[[m]]','1')}+[[d]]^2}`,['IA','d',...dimensions]);
    }
    if(branch.values.d===0){if(branch.values.I0!==undefined)add('IA',branch.values.I0,'[[I0]]',['I0','d']);if(branch.values.IA!==undefined)add('I0',branch.values.IA,'[[IA]]',['IA','d']);}
    if(branch.values.I0!==undefined&&branch.values.IA===branch.values.I0)add('d',0,'0',['I0','IA']);
   }
   for(const r of relations) {
    if(r.keys.some(k=>blocked.has(k)))continue;
    const missing=r.keys.filter(k=>branch.values[k]===undefined);
    if(missing.length!==1)continue;
    const target=missing[0],answers=r.inverse[target](branch.values);
    if(answers.some(Number.isNaN)){branch.singular.push(target);continue;}
    if(answers.some(x=>!Number.isFinite(x))){branch.numerical.push(...r.keys);continue;}
    const candidates=answers.filter(x=>rigidDomain(target,x));
    if(!candidates.length){branch.impossible.push(...r.keys);continue;}
    changed=true;
    return candidates.map(answer=>({ ...branch,values:{...branch.values,[target]:answer},steps:[...branch.steps,{target,formula:r.formulas[target].replace('\\pm',answer<0?'-':''),snapshot:{...branch.values},sources:r.keys.filter(k=>k!==target)}],conflicts:[...branch.conflicts],impossible:[...branch.impossible],singular:[...branch.singular],numerical:[...branch.numerical]}));
   }
   return [branch];
  });
  if(!changed)break;
 }
 for(const branch of branches) {
  for(const r of relations)if(r.keys.every(k=>branch.values[k]!==undefined)&&!r.keys.some(k=>bad.has(k))) {
   const [a,b]=r.balance(branch.values);
   if(!Number.isFinite(a)||!Number.isFinite(b))branch.numerical.push(...r.keys);
   else if(!near(a,b))branch.conflicts.push(...r.keys);
  }
  if(mode==='inertia'&&shape==='tube'&&branch.values.r!==undefined&&branch.values.R!==undefined&&branch.values.r>=branch.values.R)branch.impossible.push('r','R','I0');
  const blocked=new Set([...branch.conflicts,...branch.impossible,...branch.numerical]);
  // Remove every dependent result; preserve unrelated energy or torque results.
  for(const step of branch.steps)if(blocked.has(step.target)||step.sources.some(k=>blocked.has(k)))blocked.add(step.target);
  branch.singular=[...new Set(branch.singular)].filter(k=>branch.values[k]===undefined);
  branch.steps=branch.steps.filter(s=>!blocked.has(s.target)&&!s.sources.some(k=>blocked.has(k)));
  branch.values=Object.fromEntries(Object.entries(branch.values).filter(([k])=>!blocked.has(k)));
  branch.conflicts=[...new Set(branch.conflicts)];branch.impossible=[...new Set(branch.impossible)];branch.numerical=[...new Set(branch.numerical)];
 }
 const good=branches.filter(b=>!b.conflicts.length&&!b.impossible.length&&!b.numerical.length);
 return good.length?good:branches;
}
