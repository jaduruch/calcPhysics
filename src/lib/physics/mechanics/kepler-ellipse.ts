import {meanAnomalyFromE} from './kepler.ts';
import {divide,ModelFailure,type Values,type Domain,inResourceDomain} from '../resources/solver.ts';
export const ellipseDomains:Record<string,Domain>={a:'positive',b:'positive',e:'eccentricity',c:'nonnegative',p:'positive',rp:'positive',ra:'positive',area:'positive',X:'real',Y:'real',x:'real',y:'real',z:'positive',r:'positive',phi:'real'};
export interface EllipseRule {target:string;inputs:readonly string[];formula:string;calculate:(v:Values)=>number|readonly number[]}
const rule=(target:string,inputs:string[],formula:string,calculate:EllipseRule['calculate']):EllipseRule=>({target,inputs,formula,calculate});
const unknown=():never=>{throw new ModelFailure('underdetermined');};
const root=(x:number)=>{if(x<0)throw new ModelFailure('no-solution');return Math.sqrt(x);};
const unitRoot=(x:number)=>root(x<0&&x>=-32*Number.EPSILON?0:x);
const difference=(a:number,b:number)=>Math.abs(a-b)<=8*Number.EPSILON*Math.max(Math.abs(a),Math.abs(b))?0:a-b;
const positive=(x:number)=>x>0?x:unknown();
const turn=2*Math.PI;
export const normalizedOrbitAngle=(x:number)=>{const y=x%turn;return y<0?y+turn:y===0?0:y;};
const sin=(x:number)=>{const y=normalizedOrbitAngle(x);return y===0||y===Math.PI?0:y===Math.PI/2?1:y===3*Math.PI/2?-1:Math.sin(y);};
const cos=(x:number)=>{const y=normalizedOrbitAngle(x);return y===Math.PI/2||y===3*Math.PI/2?0:y===0?1:y===Math.PI?-1:Math.cos(y);};
function acosBranches(x:number){if(x>1+1e-12||x< -1-1e-12)throw new ModelFailure('no-solution');const a=Math.acos(Math.abs(1-Math.abs(x))<=16*Number.EPSILON?Math.sign(x):Math.max(-1,Math.min(1,x)));return [a,normalizedOrbitAngle(-a)];}
const signed=(x:number)=>{const a=root(x);return a===0?[0]:[a,-a];};
const unitSigned=(x:number)=>{const a=unitRoot(x);return a===0?[0]:[a,-a];};
/** Invert A = π b (d²+b²)/(2d), d is either apsis distance. */
function minorFromAreaAndApsis(area:number,d:number){
 const logq=Math.log(area)-Math.log(Math.PI)-2*Math.log(d);
 const argument=logq+Math.log(3*Math.sqrt(3));
 const h=argument>350?argument+Math.LN2:Math.asinh(Math.exp(argument));
 return d*(2/Math.sqrt(3))*Math.sinh(h/3);
}
/** Fixed quadratic relation, stable roots; not a symbolic equation evaluator. */
function quadratic(a:number,b:number,c:number):number[]{
 const scale=Math.max(Math.abs(a),Math.abs(b),Math.abs(c));
 if(scale===0)return unknown();a/=scale;b/=scale;c/=scale;
 if(a===0)return b===0?unknown():[-c/b];
 let d=b*b-4*a*c;if(d<0&&d>=-32*Number.EPSILON*(b*b+Math.abs(4*a*c)))d=0;
 if(d<0)throw new ModelFailure('no-solution');
 if(d===0)return [-b/(2*a)];
 const q=-.5*(b+(b>=0?1:-1)*Math.sqrt(d));return [q/a,c/q];
}
function eccentricitiesFromAreaPoint(v:Values):number[]{
 const q=-v.x/v.r;if(Math.abs(q)>1+1e-12)throw new ModelFailure('no-solution');
 const f=(e:number)=>Math.log(v.r)+Math.log1p(-e*q)-.75*(Math.log1p(-e)+Math.log1p(e))-.5*(Math.log(v.area)-Math.log(Math.PI));
 const last=1-Number.EPSILON/2,critical=q>0?4*q/(3+Math.sqrt(9-8*q*q)):0;
 const stops=[0,...(critical>0&&critical<last?[critical]:[]),last],answers:number[]=[];
 for(let i=0;i<stops.length;i++){if(Math.abs(f(stops[i]))<1e-12)answers.push(stops[i]);if(i===stops.length-1)break;let lo=stops[i],hi=stops[i+1],fl=f(lo),fh=f(hi);if(fl*fh>=0)continue;for(let n=0;n<80;n++){const mid=lo+(hi-lo)/2,fm=f(mid);if(fm===0){lo=hi=mid;break;}if(Math.sign(fm)===Math.sign(fl)){lo=mid;fl=fm;}else hi=mid;}answers.push(lo+(hi-lo)/2);}
 if(!answers.length)throw new ModelFailure('no-solution');return answers;
}
function majorFromApsisAndCentrePoint(d:number,X:number,Y:number,peri:boolean):number{
 if(Y===0)return Math.abs(X);
 const f=(a:number)=>Math.hypot(X/a,Y/Math.sqrt(d)/Math.sqrt(2*a-d))-1;
 let lo=peri?d:d/2,hi=peri?Math.max(d,Math.abs(X),Y*(Y/d)+d):d;
 if(peri&&f(lo)<-1e-12||!peri&&f(hi)>1e-12)throw new ModelFailure('no-solution');
 if(peri){for(let n=0;n<64&&f(hi)>0;n++)hi*=2;}
 for(let n=0;n<100;n++){const mid=lo+(hi-lo)/2;if(f(mid)>0)lo=mid;else hi=mid;}
 return lo+(hi-lo)/2;
}
export const ellipseRules:readonly EllipseRule[]=[
 rule('b',['a','e'],String.raw`[[a]]\cdot\sqrt{1-[[e]]^2}`,v=>v.a*Math.sqrt((1-v.e)*(1+v.e))),
 rule('a',['b','e'],String.raw`\frac{[[b]]}{\sqrt{1-[[e]]^2}}`,v=>divide(v.b,Math.sqrt((1-v.e)*(1+v.e)))),
 rule('e',['a','b'],String.raw`\sqrt{1-\left(\frac{[[b]]}{[[a]]}\right)^2}`,v=>{if(v.c!==undefined)return unknown();const q=v.b/v.a;if(q>1+8*Number.EPSILON)throw new ModelFailure('no-solution');return Math.abs(1-q)<=8*Number.EPSILON?0:Math.sqrt((1-q)*(1+q));}),
 rule('c',['a','e'],String.raw`[[a]]\cdot[[e]]`,v=>v.a*v.e),
 rule('e',['a','c'],String.raw`\frac{[[c]]}{[[a]]}`,v=>v.c/v.a),
 rule('a',['c','e'],String.raw`\frac{[[c]]}{[[e]]}`,v=>divide(v.c,v.e)),
 rule('a',['b','c'],String.raw`\sqrt{[[b]]^2+[[c]]^2}`,v=>Math.hypot(v.b,v.c)),
 rule('b',['a','c'],String.raw`\sqrt{[[a]]^2-[[c]]^2}`,v=>Math.sqrt((v.a-v.c)*(v.a+v.c))),
 rule('c',['a','b'],String.raw`\sqrt{[[a]]^2-[[b]]^2}`,v=>Math.abs(v.a-v.b)<=8*Number.EPSILON*Math.max(v.a,v.b)?0:Math.sqrt((v.a-v.b)*(v.a+v.b))),
 rule('p',['a','e'],String.raw`[[a]]\cdot(1-[[e]]^2)`,v=>v.a*(1-v.e)*(1+v.e)),
 rule('a',['p','e'],String.raw`\frac{[[p]]}{1-[[e]]^2}`,v=>v.p/((1-v.e)*(1+v.e))),
 rule('e',['p','a'],String.raw`\sqrt{1-\frac{[[p]]}{[[a]]}}`,v=>Math.abs(1-v.p/v.a)<=8*Number.EPSILON?0:root(1-v.p/v.a)),
 rule('p',['a','b'],String.raw`\frac{[[b]]^2}{[[a]]}`,v=>v.b*(v.b/v.a)),
 rule('a',['p','b'],String.raw`\frac{[[b]]^2}{[[p]]}`,v=>v.b*(v.b/v.p)),
 rule('b',['p','a'],String.raw`\sqrt{[[p]]\cdot[[a]]}`,v=>Math.sqrt(v.p)*Math.sqrt(v.a)),
 rule('rp',['a','e'],String.raw`[[a]]\cdot(1-[[e]])`,v=>v.a*(1-v.e)),
 rule('a',['rp','e'],String.raw`\frac{[[rp]]}{1-[[e]]}`,v=>v.rp/(1-v.e)),
 rule('e',['rp','a'],String.raw`1-\frac{[[rp]]}{[[a]]}`,v=>difference(1,v.rp/v.a)),
 rule('ra',['a','e'],String.raw`[[a]]\cdot(1+[[e]])`,v=>v.a*(1+v.e)),
 rule('a',['ra','e'],String.raw`\frac{[[ra]]}{1+[[e]]}`,v=>v.ra/(1+v.e)),
 rule('e',['ra','a'],String.raw`\frac{[[ra]]}{[[a]]}-1`,v=>difference(v.ra/v.a,1)),
 rule('area',['a','b'],String.raw`\pi\cdot[[a]]\cdot[[b]]`,v=>Math.PI*v.a*v.b),
 rule('a',['area','b'],String.raw`\frac{[[area]]}{\pi\cdot[[b]]}`,v=>v.area/Math.PI/v.b),
 rule('b',['area','a'],String.raw`\frac{[[area]]}{\pi\cdot[[a]]}`,v=>v.area/Math.PI/v.a),
 rule('a',['area','e'],String.raw`\sqrt{\frac{[[area]]}{\pi\cdot\sqrt{1-[[e]]^2}}}`,v=>Math.sqrt(v.area/Math.PI)/Math.sqrt(Math.sqrt((1-v.e)*(1+v.e)))),
 rule('a',['c','p'],String.raw`\frac{[[p]]+\sqrt{[[p]]^2+4\cdot[[c]]^2}}{2}`,v=>v.p/2+Math.hypot(v.p/2,v.c)),
 rule('a',['c','rp'],String.raw`[[c]]+[[rp]]`,v=>v.c+v.rp),
 rule('c',['a','rp'],String.raw`[[a]]-[[rp]]`,v=>difference(v.a,v.rp)),
 rule('rp',['a','c'],String.raw`[[a]]-[[c]]`,v=>v.a-v.c),
 rule('a',['c','ra'],String.raw`[[ra]]-[[c]]`,v=>v.ra-v.c),
 rule('c',['a','ra'],String.raw`[[ra]]-[[a]]`,v=>difference(v.ra,v.a)),
 rule('ra',['a','c'],String.raw`[[a]]+[[c]]`,v=>v.a+v.c),
 rule('ra',['b','rp'],String.raw`\frac{[[b]]^2}{[[rp]]}`,v=>v.b*(v.b/v.rp)),
 rule('rp',['b','ra'],String.raw`\frac{[[b]]^2}{[[ra]]}`,v=>v.b*(v.b/v.ra)),
 rule('b',['rp','ra'],String.raw`\sqrt{[[rp]]\cdot[[ra]]}`,v=>Math.sqrt(v.rp)*Math.sqrt(v.ra)),
 rule('a',['rp','ra'],String.raw`\frac{[[rp]]+[[ra]]}{2}`,v=>v.rp/2+v.ra/2),
 rule('e',['p','rp'],String.raw`\frac{[[p]]}{[[rp]]}-1`,v=>difference(v.p/v.rp,1)),
 rule('e',['p','ra'],String.raw`1-\frac{[[p]]}{[[ra]]}`,v=>difference(1,v.p/v.ra)),
 rule('b',['p','area'],String.raw`\sqrt[3]{\frac{[[p]]\cdot[[area]]}{\pi}}`,v=>Math.exp((Math.log(v.p)+Math.log(v.area)-Math.log(Math.PI))/3)),
 rule('b',['c','area'],String.raw`\sqrt{\frac{2\cdot([[area]]/\pi)^2}{\sqrt{[[c]]^4+4\cdot([[area]]/\pi)^2}+[[c]]^2}}`,v=>{const q=v.area/Math.PI;return Math.SQRT2*q/Math.sqrt(Math.hypot(v.c*v.c,2*q)+v.c*v.c);}),
 ...(['rp','ra'] as const).map(key=>rule('b',[key,'area'],String.raw`\frac{2\cdot[[`+key+String.raw`]]}{\sqrt3}\cdot\sinh\!\left(\frac13\operatorname{arsinh}\frac{3\sqrt3\cdot[[area]]}{\pi\cdot[[`+key+String.raw`]]^2}\right)`,v=>minorFromAreaAndApsis(v.area,v[key]))),
 rule('e',['c'],'0',v=>v.c===0?0:unknown()),
 rule('c',['e'],'0',v=>v.e===0?0:unknown()),
 rule('e',['a','r','x'],String.raw`\frac{-[[x]]\pm\sqrt{[[x]]^2-4\cdot[[a]]\cdot([[r]]-[[a]])}}{2\cdot[[a]]}`,v=>quadratic(1,v.x/v.a,v.r/v.a-1)),
 rule('e',['b','r','x'],String.raw`\frac{-[[r]]\cdot[[x]]\pm\sqrt{([[r]]\cdot[[x]])^2-([[x]]^2+[[b]]^2)([[r]]^2-[[b]]^2)}}{[[x]]^2+[[b]]^2}`,v=>{const s=Math.max(v.b,v.r,Math.abs(v.x)),b=v.b/s,r=v.r/s,x=v.x/s;return quadratic(x*x+b*b,2*r*x,r*r-b*b);}),
 rule('a',['c','r','x'],String.raw`\frac{[[r]]+\sqrt{[[r]]^2+4\cdot[[c]]\cdot([[x]]+[[c]])}}2`,v=>{const s=Math.max(v.c,v.r,Math.abs(v.x));return s*(v.r/s+root((v.r/s)**2+4*(v.c/s)*((v.x+v.c)/s)))/2;}),
 rule('e',['rp','r','x'],String.raw`\frac{[[r]]-[[rp]]}{[[rp]]-[[x]]}`,v=>divide(v.r-v.rp,v.rp-v.x)),
 rule('e',['ra','r','x'],String.raw`\frac{[[ra]]-[[r]]}{[[x]]+[[ra]]}`,v=>divide(v.ra-v.r,v.x+v.ra)),
 rule('e',['area','r','x'],String.raw`\operatorname{root}_{\varepsilon\in[0,1)}\!\left(([[r]]+\varepsilon\cdot[[x]])^4-([[area]]/\pi)^2(1-\varepsilon^2)^3\right)`,eccentricitiesFromAreaPoint),
 rule('a',['e','X','Y'],String.raw`\sqrt{[[X]]^2+\frac{[[Y]]^2}{1-[[e]]^2}}`,v=>Math.hypot(v.X,v.Y/Math.sqrt((1-v.e)*(1+v.e)))),
 rule('a',['p','X','Y'],String.raw`\frac{[[Y]]^2}{2\cdot[[p]]}+\sqrt{\left(\frac{[[Y]]^2}{2\cdot[[p]]}\right)^2+[[X]]^2}`,v=>{const h=v.Y*(v.Y/v.p)/2;return h+Math.hypot(h,v.X);}),
 rule('a',['area','X','Y'],String.raw`\sqrt{\frac{([[area]]/\pi)^2\pm\sqrt{([[area]]/\pi)^4-4\cdot[[X]]^2\cdot[[Y]]^2\cdot([[area]]/\pi)^2}}{2\cdot[[Y]]^2}}`,v=>{if(v.Y===0)return Math.abs(v.X);const length=Math.sqrt(v.area/Math.PI),s=v.X/length,t=v.Y/length;return quadratic(t*t,-1,s*s).filter(u=>u>=1-1e-12).map(u=>length*Math.sqrt(Math.max(1,u)));}),
 ...(['rp','ra'] as const).map(key=>rule('a',[key,'X','Y'],String.raw`\operatorname{root}_{\eta`+(key==='rp'?String.raw`\ge [[rp]]` :String.raw`\in([[ra]]/2,[[ra]]]`)+String.raw`}\!\left(2\cdot[[`+key+String.raw`]]\cdot\eta^3-([[`+key+String.raw`]]^2+[[Y]]^2)\cdot\eta^2-2\cdot[[`+key+String.raw`]]\cdot[[X]]^2\cdot\eta+[[`+key+String.raw`]]^2\cdot[[X]]^2\right)`,v=>majorFromApsisAndCentrePoint(v[key],v.X,v.Y,key==='rp'))),
 rule('X',['x','c'],String.raw`[[x]]+[[c]]`,v=>v.x+v.c),
 rule('x',['X','c'],String.raw`[[X]]-[[c]]`,v=>v.X-v.c),
 rule('c',['x','X'],String.raw`[[X]]-[[x]]`,v=>v.X-v.x),
 rule('Y',['y'],String.raw`[[y]]`,v=>v.y),rule('y',['Y'],String.raw`[[Y]]`,v=>v.Y),
 rule('r',['x','y'],String.raw`\sqrt{[[x]]^2+[[y]]^2}`,v=>Math.hypot(v.x,v.y)),
 rule('z',['r'],String.raw`[[r]]`,v=>v.r),rule('r',['z'],String.raw`[[z]]`,v=>v.z),
 rule('x',['r','phi'],String.raw`[[r]]\cdot\cos[[phi]]`,v=>v.r*cos(v.phi)),
 rule('y',['r','phi'],String.raw`[[r]]\cdot\sin[[phi]]`,v=>v.r*sin(v.phi)),
 rule('r',['x','phi'],String.raw`\frac{[[x]]}{\cos[[phi]]}`,v=>divide(v.x,cos(v.phi))),
 rule('r',['y','phi'],String.raw`\frac{[[y]]}{\sin[[phi]]}`,v=>divide(v.y,sin(v.phi))),
 rule('phi',['x','y'],String.raw`\operatorname{atan2}([[y]],[[x]])\pmod{2\pi}`,v=>v.x===0&&v.y===0?unknown():normalizedOrbitAngle(Math.atan2(v.y,v.x))),
 rule('phi',['x','r'],String.raw`\arccos\!\left(\frac{[[x]]}{[[r]]}\right)`,v=>acosBranches(v.x/v.r)),
 rule('phi',['y','r'],String.raw`\arcsin\frac{[[y]]}{[[r]]}`,v=>{if(Math.abs(v.y)>v.r)throw new ModelFailure('no-solution');const a=Math.asin(v.y/v.r);return [normalizedOrbitAngle(a),normalizedOrbitAngle(Math.PI-a)];}),
 rule('x',['r','y'],String.raw`\pm\sqrt{[[r]]^2-[[y]]^2}`,v=>signed(difference(v.r,Math.abs(v.y))*(v.r+Math.abs(v.y)))),
 rule('y',['r','x'],String.raw`\pm\sqrt{[[r]]^2-[[x]]^2}`,v=>signed(difference(v.r,Math.abs(v.x))*(v.r+Math.abs(v.x)))),
 rule('r',['p','e','phi'],String.raw`\frac{[[p]]}{1+[[e]]\cdot\cos[[phi]]}`,v=>v.p/(1+v.e*cos(v.phi))),
 rule('p',['r','e','phi'],String.raw`[[r]]\cdot(1+[[e]]\cdot\cos[[phi]])`,v=>v.r*(1+v.e*cos(v.phi))),
 rule('e',['p','r','phi'],String.raw`\frac{[[p]]/[[r]]-1}{\cos[[phi]]}`,v=>divide(v.p/v.r-1,cos(v.phi))),
 rule('phi',['p','r','e'],String.raw`\arccos\frac{[[p]]/[[r]]-1}{[[e]]}`,v=>acosBranches(divide(v.p/v.r-1,v.e))),
 rule('r',['p','e'],String.raw`[[p]]`,v=>v.e===0?v.p:unknown()),
 rule('p',['r','e'],String.raw`[[r]]`,v=>v.e===0?v.r:unknown()),
 rule('z',['e','x','p'],String.raw`-[[e]]\cdot[[x]]+[[p]]`,v=>-v.e*v.x+v.p),
 rule('p',['z','e','x'],String.raw`[[z]]+[[e]]\cdot[[x]]`,v=>v.z+v.e*v.x),
 rule('e',['z','p','x'],String.raw`\frac{[[p]]-[[z]]}{[[x]]}`,v=>divide(v.p-v.z,v.x)),
 rule('x',['z','p','e'],String.raw`\frac{[[p]]-[[z]]}{[[e]]}`,v=>divide(v.p-v.z,v.e)),
 rule('p',['z','x'],String.raw`[[z]]`,v=>v.x===0?v.z:unknown()),
 rule('z',['p','x'],String.raw`[[p]]`,v=>v.x===0?v.p:unknown()),
 rule('X',['a','Y'],String.raw`\pm[[a]]`,v=>v.Y===0?[v.a,-v.a]:unknown()),
 rule('Y',['b','X'],String.raw`\pm[[b]]`,v=>v.X===0?[v.b,-v.b]:unknown()),
 rule('a',['X','Y'],String.raw`|[[X]]|`,v=>v.Y===0&&v.X!==0?Math.abs(v.X):unknown()),
 rule('b',['X','Y'],String.raw`|[[Y]]|`,v=>v.X===0&&v.Y!==0?Math.abs(v.Y):unknown()),
 rule('phi',['x'],String.raw`\frac\pi2`,v=>v.x===0?[Math.PI/2,3*Math.PI/2]:unknown()),
 rule('phi',['y'],'0',v=>v.y===0?[0,Math.PI]:unknown()),
 rule('X',['a','b','Y'],String.raw`\pm[[a]]\cdot\sqrt{1-\left(\frac{[[Y]]}{[[b]]}\right)^2}`,v=>unitSigned(1-(v.Y/v.b)**2).map(n=>v.a*n)),
 rule('Y',['a','b','X'],String.raw`\pm[[b]]\cdot\sqrt{1-\left(\frac{[[X]]}{[[a]]}\right)^2}`,v=>unitSigned(1-(v.X/v.a)**2).map(n=>v.b*n)),
 rule('a',['b','X','Y'],String.raw`\frac{|[[X]]|}{\sqrt{1-([[Y]]/[[b]])^2}}`,v=>divide(Math.abs(v.X),positive(unitRoot(1-(v.Y/v.b)**2)))),
 rule('b',['a','X','Y'],String.raw`\frac{|[[Y]]|}{\sqrt{1-([[X]]/[[a]])^2}}`,v=>divide(Math.abs(v.Y),positive(unitRoot(1-(v.X/v.a)**2))))
];
/** Convert true anomaly to the shared mean-anomaly phase without display rounding. */
export function orbitPhaseFromTrueAngle(e:number,phi:number):number {
 if(!Number.isFinite(e)||e<0||e>=1||!Number.isFinite(phi))throw new ModelFailure('no-solution');
 const E=normalizedOrbitAngle(Math.atan2(Math.sqrt((1-e)*(1+e))*sin(phi),e+cos(phi)));
 return normalizedOrbitAngle(meanAnomalyFromE(E,e))/turn;
}
export interface EllipseStep {target:string;formula:string;inputs:readonly string[]}
export interface EllipseBranch {values:Values;steps:EllipseStep[];phase?:number}
export interface EllipseSolution {branches:EllipseBranch[];invalid:string[];conflicts:string[];numerical:boolean}
const close=(x:number,y:number)=>Math.abs(x-y)<=1e-9*Math.max(Math.abs(x),Math.abs(y),Number.MIN_VALUE);
/** Finite branch propagation of explicit inverse equations, not a general CAS. */
export function solveKeplerEllipse(input:Values,blocked:readonly string[]=[],recover=true):EllipseSolution {
 const invalid=Object.keys(input).filter(key=>!ellipseDomains[key]||!inResourceDomain(input[key],ellipseDomains[key]));
 let branches:EllipseBranch[]=[{values:Object.fromEntries(Object.entries(input).filter(([key])=>!invalid.includes(key)&&!blocked.includes(key))),steps:[]}];
 for(const b of branches)if(b.values.phi!==undefined)b.values.phi=normalizedOrbitAngle(b.values.phi);
 const bad=new Set<string>();let numerical=false;
 for(let pass=0;pass<Object.keys(ellipseDomains).length;pass++){
  let changed=false;
  for(const r of ellipseRules){
   const next:EllipseBranch[]=[];
   for(const b of branches){
    if(b.values[r.target]!==undefined||blocked.includes(r.target)||invalid.includes(r.target)||r.inputs.some(key=>b.values[key]===undefined)){next.push(b);continue;}
    let candidates:readonly number[];
    try{const answer=r.calculate(b.values);candidates=typeof answer==='number'?[answer]:answer;}
    catch(error){if(error instanceof ModelFailure){if(error.code==='underdetermined'){next.push(b);continue;}if(error.code==='numerical')numerical=true;for(const key of [r.target,...r.inputs])bad.add(key);continue;}throw error;}
    if(candidates.some(n=>!Number.isFinite(n))){if(candidates.some(n=>!Number.isNaN(n))){numerical=true;next.push(b);}else for(const key of [r.target,...r.inputs])bad.add(key);continue;}
    if(r.target==='area'&&candidates.every(n=>n===0)){numerical=true;next.push(b);continue;}
    const distinct=candidates.filter((n,i)=>candidates.findIndex(other=>close(n,other))===i).filter(n=>inResourceDomain(n,ellipseDomains[r.target]));
    if(distinct.length){changed=true;for(const [index,n] of distinct.entries())next.push({values:{...b.values,[r.target]:n},steps:[...b.steps,{target:r.target,formula:distinct.length>1?r.formula.replace(String.raw`\operatorname{root}`,String.raw`\operatorname{root}^{(`+(index+1)+')}' ):r.formula,inputs:r.inputs}]});}
    else for(const key of [r.target,...r.inputs])bad.add(key);
   }
   branches=next;
  }
  if(!changed||!branches.length)break;
 }
 // Validate original relations, avoiding ill-conditioned inverse checks at a circular orbit or an axis crossing.
 const check=(b:EllipseBranch,keys:string[],evaluate:(v:Values)=>readonly[number,number,number?])=>{
  if(keys.some(k=>b.values[k]===undefined))return true;
  const [left,right,scale=0]=evaluate(b.values);
  const valid=Number.isFinite(left)&&Number.isFinite(right)&&Math.abs(left-right)<=1e-9*Math.max(Math.abs(left),Math.abs(right),scale,Number.MIN_VALUE);
  if(!valid)for(const key of keys)bad.add(key);return valid;
 };
 const limit=(b:EllipseBranch,keys:string[],valid:(v:Values)=>boolean)=>{if(keys.some(k=>b.values[k]===undefined)||valid(b.values))return true;for(const key of keys)bad.add(key);return false;};
 branches=branches.filter(b=>[
  limit(b,['a','r'],v=>v.r/v.a<2),
  limit(b,['rp','r'],v=>v.r/v.rp>=1-1e-9),
  limit(b,['ra','r'],v=>v.r/v.ra<=1+1e-9),
  check(b,['a','b','e'],v=>[v.b/v.a,Math.sqrt((1-v.e)*(1+v.e)),1]),
  check(b,['a','c','e'],v=>[v.c/v.a,v.e,1]),
  check(b,['a','p','e'],v=>[v.p/v.a,(1-v.e)*(1+v.e),1]),
  check(b,['a','rp','e'],v=>[v.rp/v.a,1-v.e,1]),
  check(b,['a','ra','e'],v=>[v.ra/v.a,1+v.e,1]),
  check(b,['a','b','area'],v=>[v.area/Math.PI/v.a,v.b,v.a]),
  check(b,['X','x','c'],v=>[v.X-v.c,v.x,v.c]),
  check(b,['Y','y'],v=>[v.Y,v.y]),
  check(b,['r','x','y'],v=>[Math.hypot(v.x,v.y),v.r]),
  check(b,['r','z'],v=>[v.r,v.z]),
  check(b,['r','phi','x'],v=>[v.x/v.r,cos(v.phi),1]),
  check(b,['r','phi','y'],v=>[v.y/v.r,sin(v.phi),1]),
  check(b,['r','p','e','phi'],v=>[v.r*(1+v.e*cos(v.phi)),v.p]),
  check(b,['z','e','x','p'],v=>[-v.e*v.x+v.p,v.z]),
  check(b,['X','Y','a','b'],v=>[Math.hypot(v.X/v.a,v.Y/v.b),1])
 ].every(Boolean));
 if(!branches.length&&bad.size&&recover){
  const shape=['a','b','e','c','p','rp','ra','area'];
  if([...bad].some(k=>!shape.includes(k))&&Object.keys(input).some(k=>shape.includes(k)&&!invalid.includes(k))){
   const geometry=solveKeplerEllipse(Object.fromEntries(Object.entries(input).filter(([key])=>shape.includes(key))),blocked,false);
   if(geometry.branches.length&&!geometry.conflicts.length)return {...geometry,invalid,conflicts:[...bad].filter(k=>!shape.includes(k)),numerical:numerical||geometry.numerical};
  }
  const conflicts=[...bad];const partial=solveKeplerEllipse(Object.fromEntries(Object.entries(input).filter(([key])=>!bad.has(key))),[...blocked,...conflicts],false);
  return {...partial,invalid:[...new Set([...invalid,...partial.invalid])],conflicts,numerical:numerical||partial.numerical};
 }
 for(const b of branches)if(b.values.e!==undefined&&b.values.phi!==undefined){b.phase=orbitPhaseFromTrueAngle(b.values.e,b.values.phi);}
 return {branches,invalid,conflicts:branches.length?[]:[...bad],numerical};
}
