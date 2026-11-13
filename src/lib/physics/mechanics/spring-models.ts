import {inResourceDomain,type Domain,type Values} from '../resources/solver.ts';
export interface SpringRule {target:string;inputs:readonly string[];formula:string;calculate:(v:Values)=>number}
const rule=(target:string,inputs:string[],formula:string,calculate:SpringRule['calculate']):SpringRule=>({target,inputs,formula,calculate});
export const springOscillatorRules:SpringRule[]=[
 rule('omega',['k','m'],String.raw`\sqrt{\frac{[[k]]}{[[m]]}}`,v=>Math.sqrt(v.k)/Math.sqrt(v.m)),
 rule('k',['omega','m'],String.raw`[[m]]\cdot[[omega]]^2`,v=>v.m*v.omega*v.omega),
 rule('m',['omega','k'],String.raw`\frac{[[k]]}{[[omega]]^2}`,v=>(v.k/v.omega)/v.omega),
 rule('T',['omega'],String.raw`\frac{2\pi}{[[omega]]}`,v=>2*Math.PI/v.omega),
 rule('omega',['T'],String.raw`\frac{2\pi}{[[T]]}`,v=>2*Math.PI/v.T),
 rule('f',['T'],String.raw`\frac{1}{[[T]]}`,v=>1/v.T),
 rule('T',['f'],String.raw`\frac{1}{[[f]]}`,v=>1/v.f),
 rule('omega',['f'],String.raw`2\pi\cdot[[f]]`,v=>2*Math.PI*v.f),
 rule('f',['omega'],String.raw`\frac{[[omega]]}{2\pi}`,v=>v.omega/(2*Math.PI))
];
export interface SpringSolution {values:Values;steps:{target:string;formula:string}[];conflicts:string[];invalid:string[];numerical:boolean}
/** Finite monotone propagation: each successful rule adds a previously unknown quantity. */
export function solveSpringRelations(input:Values,domains:Record<string,Domain>,rules:readonly SpringRule[],blocked:readonly string[]=[]):SpringSolution {
 const invalid=Object.keys(input).filter(key=>!domains[key]||!inResourceDomain(input[key],domains[key]));
 const values:Values=Object.fromEntries(Object.entries(input).filter(([key])=>!invalid.includes(key)&&!blocked.includes(key)));
 const steps:SpringSolution['steps']=[],conflicts=new Set<string>();let numerical=false;
 for(let pass=0;pass<Object.keys(domains).length;pass++){
  let changed=false;
  for(const r of rules){
   if(blocked.includes(r.target)||invalid.includes(r.target)||r.inputs.some(key=>values[key]===undefined||conflicts.has(key)))continue;
   const answer=r.calculate(values);
   if(!Number.isFinite(answer)){if(!Number.isNaN(answer))numerical=true;continue;}
   if(!inResourceDomain(answer,domains[r.target])){if(answer===0&&domains[r.target]==='positive')numerical=true;continue;}
   if(values[r.target]!==undefined){if(Math.abs(answer-values[r.target])>1e-9*Math.max(Math.abs(answer),Math.abs(values[r.target]),Number.MIN_VALUE)){conflicts.add(r.target);for(const key of r.inputs)conflicts.add(key);}continue;}
   values[r.target]=answer;steps.push({target:r.target,formula:r.formula});changed=true;
  }
  if(!changed)break;
 }
 // Suppress stale results in the dependency closure of inconsistent relations.
 let affected=true;while(affected){affected=false;for(const r of rules)if(r.inputs.some(key=>conflicts.has(key))&&values[r.target]!==undefined&&!conflicts.has(r.target)){conflicts.add(r.target);affected=true;}}
 for(const key of conflicts)delete values[key];
 return {values,steps:steps.filter(step=>values[step.target]!==undefined),conflicts:[...conflicts],invalid,numerical};
}
export const springOscillatorDomains:Record<string,Domain>={m:'positive',k:'positive',omega:'positive',T:'positive',f:'positive'};
export const solveSpringOscillator=(input:Values,blocked:readonly string[]=[])=>solveSpringRelations(input,springOscillatorDomains,springOscillatorRules,blocked);

const circularRules:SpringRule[]=[
 ...springOscillatorRules.filter(r=>!r.inputs.includes('k')&&!r.inputs.includes('m')&&r.target!=='k'&&r.target!=='m'),
 rule('x',['L','l'],String.raw`[[L]]-[[l]]`,v=>v.L-v.l),
 rule('L',['l','x'],String.raw`[[l]]+[[x]]`,v=>v.l+v.x),
 rule('l',['L','x'],String.raw`[[L]]-[[x]]`,v=>v.L-v.x),
 rule('Fs',['k','x'],String.raw`[[k]]\cdot[[x]]`,v=>v.k*v.x),
 rule('k',['Fs','x'],String.raw`\frac{[[Fs]]}{[[x]]}`,v=>v.Fs/v.x),
 rule('x',['Fs','k'],String.raw`\frac{[[Fs]]}{[[k]]}`,v=>v.Fs/v.k),
 rule('Fg',['m','g'],String.raw`[[m]]\cdot[[g]]`,v=>v.m*v.g),
 rule('m',['Fg','g'],String.raw`\frac{[[Fg]]}{[[g]]}`,v=>v.Fg/v.g),
 rule('g',['Fg','m'],String.raw`\frac{[[Fg]]}{[[m]]}`,v=>v.Fg/v.m),
 rule('Fg',['Fs','alpha'],String.raw`[[Fs]]\cdot\cos[[alpha]]`,v=>v.Fs*Math.cos(v.alpha)),
 rule('Fs',['Fg','alpha'],String.raw`\frac{[[Fg]]}{\cos[[alpha]]}`,v=>v.Fg/Math.cos(v.alpha)),
 rule('alpha',['Fg','Fs'],String.raw`\arccos\frac{[[Fg]]}{[[Fs]]}`,v=>Math.acos(v.Fg/v.Fs)),
 rule('R',['L','alpha'],String.raw`[[L]]\cdot\sin[[alpha]]`,v=>v.L*Math.sin(v.alpha)),
 rule('L',['R','alpha'],String.raw`\frac{[[R]]}{\sin[[alpha]]}`,v=>v.R/Math.sin(v.alpha)),
 rule('alpha',['R','L'],String.raw`\arcsin\frac{[[R]]}{[[L]]}`,v=>Math.asin(v.R/v.L)),
 rule('Fc',['Fs','alpha'],String.raw`[[Fs]]\cdot\sin[[alpha]]`,v=>v.Fs*Math.sin(v.alpha)),
 rule('Fs',['Fc','alpha'],String.raw`\frac{[[Fc]]}{\sin[[alpha]]}`,v=>v.Fc/Math.sin(v.alpha)),
 rule('alpha',['Fc','Fs'],String.raw`\arcsin\frac{[[Fc]]}{[[Fs]]}`,v=>Math.asin(v.Fc/v.Fs)),
 rule('Fs',['Fc','Fg'],String.raw`\sqrt{[[Fc]]^2+[[Fg]]^2}`,v=>Math.hypot(v.Fc,v.Fg)),
 rule('Fc',['Fs','Fg'],String.raw`\sqrt{[[Fs]]^2-[[Fg]]^2}`,v=>Math.sqrt((v.Fs-v.Fg)*(v.Fs+v.Fg))),
 rule('Fg',['Fs','Fc'],String.raw`\sqrt{[[Fs]]^2-[[Fc]]^2}`,v=>Math.sqrt((v.Fs-v.Fc)*(v.Fs+v.Fc))),
 rule('alpha',['Fc','Fg'],String.raw`\arctan\frac{[[Fc]]}{[[Fg]]}`,v=>Math.atan(v.Fc/v.Fg)),
 rule('Fc',['Fg','alpha'],String.raw`[[Fg]]\cdot\tan[[alpha]]`,v=>v.Fg*Math.tan(v.alpha)),
 rule('Fg',['Fc','alpha'],String.raw`\frac{[[Fc]]}{\tan[[alpha]]}`,v=>v.Fc/Math.tan(v.alpha)),
 rule('Fs',['m','omega','L'],String.raw`[[m]]\cdot[[omega]]^2\cdot[[L]]`,v=>v.m*v.omega*v.omega*v.L),
 rule('m',['Fs','omega','L'],String.raw`\frac{[[Fs]]}{[[omega]]^2\cdot[[L]]}`,v=>v.Fs/v.omega/v.omega/v.L),
 rule('L',['Fs','m','omega'],String.raw`\frac{[[Fs]]}{[[m]]\cdot[[omega]]^2}`,v=>v.Fs/v.m/v.omega/v.omega),
 rule('omega',['Fs','m','L'],String.raw`\sqrt{\frac{[[Fs]]}{[[m]]\cdot[[L]]}}`,v=>Math.sqrt(v.Fs/v.m/v.L)),
 rule('L',['k','l','m','omega'],String.raw`\frac{[[k]]\cdot[[l]]}{[[k]]-[[m]]\cdot[[omega]]^2}`,v=>v.k*v.l/(v.k-v.m*v.omega*v.omega)),
 rule('k',['m','omega','L','l'],String.raw`\frac{[[m]]\cdot[[omega]]^2\cdot[[L]]}{[[L]]-[[l]]}`,v=>v.m*v.omega*v.omega*v.L/(v.L-v.l)),
 rule('l',['L','m','omega','k'],String.raw`[[L]]\cdot\left(1-\frac{[[m]]\cdot[[omega]]^2}{[[k]]}\right)`,v=>v.L*(1-v.m*v.omega*v.omega/v.k)),
 rule('v',['omega','R'],String.raw`[[omega]]\cdot[[R]]`,v=>v.omega*v.R),
 rule('omega',['v','R'],String.raw`\frac{[[v]]}{[[R]]}`,v=>v.v/v.R),
 rule('R',['v','omega'],String.raw`\frac{[[v]]}{[[omega]]}`,v=>v.v/v.omega),
 rule('Fc',['m','omega','R'],String.raw`[[m]]\cdot[[omega]]^2\cdot[[R]]`,v=>v.m*v.omega*v.omega*v.R),
 rule('m',['Fc','omega','R'],String.raw`\frac{[[Fc]]}{[[omega]]^2\cdot[[R]]}`,v=>v.Fc/v.omega/v.omega/v.R),
 rule('omega',['Fc','m','R'],String.raw`\sqrt{\frac{[[Fc]]}{[[m]]\cdot[[R]]}}`,v=>Math.sqrt(v.Fc/v.m/v.R)),
 rule('R',['Fc','m','omega'],String.raw`\frac{[[Fc]]}{[[m]]\cdot[[omega]]^2}`,v=>v.Fc/v.m/v.omega/v.omega),
 rule('L',['g','omega','alpha'],String.raw`\frac{[[g]]}{[[omega]]^2\cdot\cos[[alpha]]}`,v=>v.g/v.omega/v.omega/Math.cos(v.alpha)),
 rule('g',['L','omega','alpha'],String.raw`[[omega]]^2\cdot[[L]]\cdot\cos[[alpha]]`,v=>v.omega*v.omega*v.L*Math.cos(v.alpha)),
 rule('omega',['g','L','alpha'],String.raw`\sqrt{\frac{[[g]]}{[[L]]\cdot\cos[[alpha]]}}`,v=>Math.sqrt(v.g/v.L/Math.cos(v.alpha))),
 rule('alpha',['g','L','omega'],String.raw`\arccos\frac{[[g]]}{[[omega]]^2\cdot[[L]]}`,v=>Math.acos(v.g/v.omega/v.omega/v.L))
];
export const circularSpringRules= circularRules;
export const circularSpringDomains:Record<string,Domain>={m:'positive',k:'positive',l:'positive',L:'positive',x:'positive',Fs:'positive',Fg:'positive',Fc:'positive',alpha:'acute',R:'positive',omega:'positive',T:'positive',f:'positive',v:'positive',g:'positive'};
export function solveCircularSpring(input:Values,blocked:readonly string[]=[]){
 let result=solveSpringRelations(input,circularSpringDomains,circularRules,blocked);
 const assumed=result.values.g===undefined&&!blocked.includes('g');
 if(assumed)result=solveSpringRelations({...input,g:9.81},circularSpringDomains,circularRules,blocked);
 const v=result.values;
 const noOrbit=(v.g!==undefined&&v.L!==undefined&&v.omega!==undefined&&v.g>=v.omega*v.omega*v.L)||(v.L!==undefined&&v.l!==undefined&&v.L<=v.l)||(v.Fs!==undefined&&v.Fg!==undefined&&v.Fs<=v.Fg)||(v.k!==undefined&&v.m!==undefined&&v.omega!==undefined&&v.k<=v.m*v.omega*v.omega);
 if(noOrbit){for(const key of ['alpha','R','omega','T','f','v'])delete v[key];result.steps=result.steps.filter(s=>v[s.target]!==undefined);}
 return {...result,assumed,noOrbit};
}
