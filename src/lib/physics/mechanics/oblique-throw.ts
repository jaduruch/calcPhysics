import { nonnegativeMotionTimes, type MotionScenario } from './accelerated-motion.ts';
import { solveVerticalThrow, DEFAULT_PROJECTILE_GRAVITY } from './projectiles.ts';
import { divide, product, ModelFailure } from '../resources/solver.ts';
import { signedRoot, root, asin, acos } from '../resources/formula-book-math.ts';

export const obliqueDomains = {
  y0:'nonnegative',v0:'nonnegative',alpha:'angle',vx:'real',vy0:'real',g:'positive',
  flight:'nonnegative',range:'real',peakTime:'nonnegative',rise:'nonnegative',peakHeight:'nonnegative',
  t:'nonnegative',x:'real',y:'nonnegative',vy:'real',vyImpact:'nonpositive',speedImpact:'nonnegative'
} as const;
export type ObliqueField = keyof typeof obliqueDomains;
export const obliqueApexFields:readonly ObliqueField[]=['peakTime','rise','peakHeight'];
export function obliqueApexUnavailable(values:Partial<Record<ObliqueField,number>>):boolean {
  return values.alpha!==undefined&&values.alpha<0 || values.vy0!==undefined&&values.vy0<0;
}
type Values = Record<string,number>;
export interface ObliqueStep { target: ObliqueField; formula: string; coefficient?: {value:number;formula:string} }
export interface ObliqueBranch { values: Values; steps: ObliqueStep[]; assumed: ObliqueField[]; scenario?: MotionScenario }
export type ObliqueResult = {status:'success';branches:ObliqueBranch[]}
 | {status:'incomplete'|'no-solution'|'numerical'} | {status:'invalid';fields:ObliqueField[]};
export function inObliqueDomain(key:ObliqueField,value:number):boolean {
  const domain=obliqueDomains[key];
  return Number.isFinite(value) && (domain==='nonnegative'?value>=0:domain==='positive'?value>0:domain==='nonpositive'?value<=0:domain==='angle'?Math.abs(value)<=Math.PI:true);
}
const sin=(a:number)=>a===0||Math.abs(a)===Math.PI?0:a===Math.PI/2?1:a===-Math.PI/2?-1:Math.sin(a);
const cos=(a:number)=>Math.abs(a)===Math.PI/2?0:a===0?1:Math.abs(a)===Math.PI?-1:Math.cos(a);
const unique=(values:readonly number[])=>values.filter((v,i)=>values.findIndex(other=>Math.abs(v-other)<=32*Number.EPSILON*Math.max(Math.abs(v),Math.abs(other),Number.MIN_VALUE))===i);
const unknown=():never=>{throw new ModelFailure('underdetermined');};
const positive=(v:number)=>v>0?v:unknown();
const times=(a:number,b:number,c:number)=>{const result=nonnegativeMotionTimes(a,b,c);if(typeof result==='string')throw new ModelFailure(result);return result;};
const heightRise=(v:number,g:number)=>v>0?v*(v/g)/2:0;
const safeDifference=(a:number,b:number)=>Math.abs(a-b)<=16*Number.EPSILON*Math.max(Math.abs(a),Math.abs(b))?0:a-b;
function angleSines(value:number):number[] {
  const a=asin(value),other=a>=0?Math.PI-a:-Math.PI-a;
  return unique([a,other]);
}
const pointCoefficient=(x:number,v0:number,g:number)=>(g/2)*(x/v0)*(x/v0);
/** Solve the ballistic point equation in tan(alpha), including leftward launches. */
function pointAngles(x:number,dy:number,v0:number,g:number):number[] {
  if(x===0)return dy===0?unknown():[Math.PI/2,-Math.PI/2];
  const k=pointCoefficient(x,v0,g);
  if(!Number.isFinite(k)||k===0)throw new ModelFailure('numerical');
  const scale=Math.max(Math.abs(k),Math.abs(x),Math.abs(dy));
  const a=k/scale,b=-x/scale,c=(dy+k)/scale;
  let d=b*b-4*a*c;
  if(d<0&&d>=-16*Number.EPSILON*(b*b+Math.abs(4*a*c)))d=0;
  if(d<0)throw new ModelFailure('no-solution');
  const q=-.5*(b+(b>=0?1:-1)*Math.sqrt(d));
  const slopes=d===0?[-b/(2*a)]:[q/a,c/q];
  return unique(slopes.map(slope=>{const angle=Math.atan(slope);return x>0?angle:angle<=0?angle+Math.PI:angle-Math.PI;}));
}
interface Rule {target:ObliqueField;inputs:readonly ObliqueField[];formula:string;calculate:(v:Values)=>number|readonly number[]}
const r=(target:ObliqueField,inputs:readonly ObliqueField[],formula:string,calculate:Rule['calculate']):Rule=>({target,inputs,formula,calculate});
const rules:readonly Rule[]=[
  r('vx',['v0','alpha'],String.raw`[[v0]]\cdot\cos[[alpha]]`,v=>product(v.v0,cos(v.alpha))),
  r('vy0',['v0','alpha'],String.raw`[[v0]]\cdot\sin[[alpha]]`,v=>product(v.v0,sin(v.alpha))),
  r('v0',['vx','vy0'],String.raw`\sqrt{[[vx]]^2+[[vy0]]^2}`,v=>Math.hypot(v.vx,v.vy0)),
  r('alpha',['vx','vy0'],String.raw`\operatorname{atan2}([[vy0]],[[vx]])`,v=>v.vx===0&&v.vy0===0?unknown():Math.atan2(v.vy0,v.vx)),
  r('v0',['vx','alpha'],String.raw`\frac{[[vx]]}{\cos[[alpha]]}`,v=>divide(v.vx,cos(v.alpha))),
  r('v0',['vy0','alpha'],String.raw`\frac{[[vy0]]}{\sin[[alpha]]}`,v=>divide(v.vy0,sin(v.alpha))),
  r('alpha',['v0','vx'],String.raw`\pm\arccos\frac{[[vx]]}{[[v0]]}`,v=>{const a=acos(divide(v.vx,v.v0));return unique([a,-a]);}),
  r('alpha',['v0','vy0'],String.raw`\arcsin\frac{[[vy0]]}{[[v0]]}`,v=>angleSines(divide(v.vy0,v.v0))),
  r('vx',['v0','vy0'],String.raw`\pm\sqrt{[[v0]]^2-[[vy0]]^2}`,v=>signedRoot(safeDifference(v.v0*v.v0,v.vy0*v.vy0))),
  r('vy0',['v0','vx'],String.raw`\pm\sqrt{[[v0]]^2-[[vx]]^2}`,v=>signedRoot(safeDifference(v.v0*v.v0,v.vx*v.vx))),
  r('vx',['v0'],'0',v=>v.v0===0?0:unknown()),r('vy0',['v0'],'0',v=>v.v0===0?0:unknown()),
  r('vx',['alpha'],'0',v=>cos(v.alpha)===0?0:unknown()),r('vy0',['alpha'],'0',v=>sin(v.alpha)===0?0:unknown()),
  r('flight',['y0','vy0','g'],String.raw`\frac{[[vy0]]+\sqrt{[[vy0]]^2+2\cdot[[g]]\cdot[[y0]]}}{[[g]]}`,v=>{
    const result=solveVerticalThrow({y0:v.y0,v0:v.vy0,g:v.g},{includePeak:false});
    if(result.status!=='success')throw new ModelFailure('numerical');return result.scenarios[0].duration;
  }),
  r('v0',['flight','y0','g','alpha'],String.raw`\frac{[[g]]\cdot[[flight]]}{2\sin[[alpha]]}`,v=>v.y0===0&&sin(v.alpha)>0?divide(v.g*v.flight,2*sin(v.alpha)):unknown()),
  r('vy0',['flight','y0','g'],String.raw`\frac{[[g]]\cdot[[flight]]}{2}-\frac{[[y0]]}{[[flight]]}`,v=>v.g*v.flight/2-divide(v.y0,v.flight)),
  r('y0',['flight','vy0','g'],String.raw`\frac12[[g]]\cdot[[flight]]^2-[[vy0]]\cdot[[flight]]`,v=>safeDifference(v.g*v.flight*v.flight/2,v.vy0*v.flight)),
  r('g',['flight','vy0','y0'],String.raw`\frac{2\cdot([[y0]]+[[vy0]]\cdot[[flight]])}{[[flight]]^2}`,v=>divide(2*(v.y0+v.vy0*v.flight),v.flight*v.flight)),
  r('range',['vx','flight'],String.raw`[[vx]]\cdot[[flight]]`,v=>product(v.vx,v.flight)),
  r('vx',['range','flight'],String.raw`\frac{[[range]]}{[[flight]]}`,v=>divide(v.range,v.flight)),
  r('flight',['range','vx'],String.raw`\frac{[[range]]}{[[vx]]}`,v=>divide(v.range,v.vx)),
  r('peakTime',['vy0','g'],String.raw`\frac{[[vy0]]}{[[g]]}`,v=>v.vy0/v.g),
  r('v0',['peakTime','g','alpha'],String.raw`\frac{[[g]]\cdot[[peakTime]]}{\sin[[alpha]]}`,v=>sin(v.alpha)>0?divide(v.g*v.peakTime,sin(v.alpha)):unknown()),
  r('vy0',['peakTime','g'],String.raw`[[g]]\cdot[[peakTime]]`,v=>v.g*positive(v.peakTime)),
  r('g',['peakTime','vy0'],String.raw`\frac{[[vy0]]}{[[peakTime]]}`,v=>divide(v.vy0,positive(v.peakTime))),
  r('rise',['vy0','g'],String.raw`\frac{[[vy0]]^2}{2\cdot[[g]]}`,v=>heightRise(v.vy0,v.g)),
  r('v0',['rise','g','alpha'],String.raw`\frac{\sqrt{2\cdot[[g]]\cdot[[rise]]}}{\sin[[alpha]]}`,v=>sin(v.alpha)>0?divide(Math.SQRT2*Math.sqrt(v.g)*Math.sqrt(v.rise),sin(v.alpha)):unknown()),
  r('vy0',['rise','g'],String.raw`\sqrt{2\cdot[[g]]\cdot[[rise]]}`,v=>Math.SQRT2*Math.sqrt(v.g)*Math.sqrt(positive(v.rise))),
  r('g',['rise','vy0'],String.raw`\frac{[[vy0]]^2}{2\cdot[[rise]]}`,v=>divide(v.vy0*v.vy0,2*positive(v.rise))),
  r('peakHeight',['y0','rise'],String.raw`[[y0]]+[[rise]]`,v=>v.y0+v.rise),
  r('rise',['peakHeight','y0'],String.raw`[[peakHeight]]-[[y0]]`,v=>safeDifference(v.peakHeight,v.y0)),
  r('y0',['peakHeight','rise'],String.raw`[[peakHeight]]-[[rise]]`,v=>safeDifference(v.peakHeight,v.rise)),
  r('rise',['peakTime','g'],String.raw`\frac12[[g]]\cdot[[peakTime]]^2`,v=>v.g*v.peakTime*v.peakTime/2),
  r('g',['rise','peakTime'],String.raw`\frac{2\cdot[[rise]]}{[[peakTime]]^2}`,v=>divide(2*v.rise,v.peakTime*v.peakTime)),
  r('peakTime',['rise','g'],String.raw`\sqrt{\frac{2\cdot[[rise]]}{[[g]]}}`,v=>Math.SQRT2*Math.sqrt(v.rise)/Math.sqrt(v.g)),
  r('x',['vx','t'],String.raw`[[vx]]\cdot[[t]]`,v=>product(v.vx,v.t)),
  r('vx',['x','t'],String.raw`\frac{[[x]]}{[[t]]}`,v=>divide(v.x,v.t)),
  r('t',['x','vx'],String.raw`\frac{[[x]]}{[[vx]]}`,v=>divide(v.x,v.vx)),
  r('vy',['vy0','g','t'],String.raw`[[vy0]]-[[g]]\cdot[[t]]`,v=>safeDifference(v.vy0,v.g*v.t)),
  r('vy0',['vy','g','t'],String.raw`[[vy]]+[[g]]\cdot[[t]]`,v=>v.vy+v.g*v.t),
  r('t',['vy0','vy','g'],String.raw`\frac{[[vy0]]-[[vy]]}{[[g]]}`,v=>(v.vy0-v.vy)/v.g),
  r('g',['vy0','vy','t'],String.raw`\frac{[[vy0]]-[[vy]]}{[[t]]}`,v=>divide(v.vy0-v.vy,v.t)),
  r('y',['y0','vy0','g','t'],String.raw`[[y0]]+[[vy0]]\cdot[[t]]-\frac12[[g]]\cdot[[t]]^2`,v=>safeDifference(v.y0+v.vy0*v.t,v.g*v.t*v.t/2)),
  r('y0',['y','vy0','g','t'],String.raw`[[y]]-[[vy0]]\cdot[[t]]+\frac12[[g]]\cdot[[t]]^2`,v=>safeDifference(v.y+v.g*v.t*v.t/2,v.vy0*v.t)),
  r('vy0',['y','y0','g','t'],String.raw`\frac{[[y]]-[[y0]]}{[[t]]}+\frac12[[g]]\cdot[[t]]`,v=>divide(v.y-v.y0,v.t)+v.g*v.t/2),
  r('g',['y','y0','vy0','t'],String.raw`\frac{2\cdot([[y0]]+[[vy0]]\cdot[[t]]-[[y]])}{[[t]]^2}`,v=>divide(2*(v.y0+v.vy0*v.t-v.y),v.t*v.t)),
  r('t',['y','y0','vy0','g'],String.raw`\frac{[[vy0]]\pm\sqrt{[[vy0]]^2+2\cdot[[g]]\cdot([[y0]]-[[y]])}}{[[g]]}`,v=>times(-v.g/2,v.vy0,v.y0-v.y)),
  r('vy0',['vy','y','y0','g'],String.raw`\pm\sqrt{[[vy]]^2+2\cdot[[g]]\cdot([[y]]-[[y0]])}`,v=>signedRoot(v.vy*v.vy+2*v.g*(v.y-v.y0))),
  r('vy',['vy0','y','y0','g'],String.raw`\pm\sqrt{[[vy0]]^2+2\cdot[[g]]\cdot([[y0]]-[[y]])}`,v=>signedRoot(v.vy0*v.vy0+2*v.g*(v.y0-v.y))),
  r('y0',['vy','vy0','y','g'],String.raw`[[y]]+\frac{[[vy]]^2-[[vy0]]^2}{2\cdot[[g]]}`,v=>v.y+(v.vy-v.vy0)*(v.vy+v.vy0)/(2*v.g)),
  r('y',['vy','vy0','y0','g'],String.raw`[[y0]]+\frac{[[vy0]]^2-[[vy]]^2}{2\cdot[[g]]}`,v=>v.y0+(v.vy0-v.vy)*(v.vy0+v.vy)/(2*v.g)),
  r('g',['vy','vy0','y','y0'],String.raw`\frac{[[vy0]]^2-[[vy]]^2}{2\cdot([[y]]-[[y0]])}`,v=>divide((v.vy0-v.vy)*(v.vy0+v.vy),2*(v.y-v.y0))),
  r('vy0',['vyImpact','y0','g'],String.raw`\pm\sqrt{[[vyImpact]]^2-2\cdot[[g]]\cdot[[y0]]}`,v=>signedRoot(safeDifference(v.vyImpact*v.vyImpact,2*v.g*v.y0))),
  r('g',['vyImpact','vy0','y0'],String.raw`\frac{[[vyImpact]]^2-[[vy0]]^2}{2\cdot[[y0]]}`,v=>divide((v.vyImpact-v.vy0)*(v.vyImpact+v.vy0),2*v.y0)),
  r('vyImpact',['vy0','g','flight'],String.raw`[[vy0]]-[[g]]\cdot[[flight]]`,v=>safeDifference(v.vy0,v.g*v.flight)),
  r('vy0',['vyImpact','g','flight'],String.raw`[[vyImpact]]+[[g]]\cdot[[flight]]`,v=>v.vyImpact+v.g*v.flight),
  r('flight',['vy0','vyImpact','g'],String.raw`\frac{[[vy0]]-[[vyImpact]]}{[[g]]}`,v=>(v.vy0-v.vyImpact)/v.g),
  r('g',['vy0','vyImpact','flight'],String.raw`\frac{[[vy0]]-[[vyImpact]]}{[[flight]]}`,v=>divide(v.vy0-v.vyImpact,v.flight)),
  r('speedImpact',['vx','vyImpact'],String.raw`\sqrt{[[vx]]^2+[[vyImpact]]^2}`,v=>Math.hypot(v.vx,v.vyImpact)),
  r('vyImpact',['speedImpact','vx'],String.raw`-\sqrt{[[speedImpact]]^2-[[vx]]^2}`,v=>-root(safeDifference(v.speedImpact*v.speedImpact,v.vx*v.vx),2)),
  r('vx',['speedImpact','vyImpact'],String.raw`\pm\sqrt{[[speedImpact]]^2-[[vyImpact]]^2}`,v=>signedRoot(safeDifference(v.speedImpact*v.speedImpact,v.vyImpact*v.vyImpact))),
  r('speedImpact',['v0','y0','g'],String.raw`\sqrt{[[v0]]^2+2\cdot[[g]]\cdot[[y0]]}`,v=>Math.hypot(v.v0,Math.SQRT2*Math.sqrt(v.g)*Math.sqrt(v.y0))),
  r('v0',['speedImpact','y0','g'],String.raw`\sqrt{[[speedImpact]]^2-2\cdot[[g]]\cdot[[y0]]}`,v=>root(safeDifference(v.speedImpact*v.speedImpact,2*v.g*v.y0),2)),
  r('y0',['speedImpact','v0','g'],String.raw`\frac{[[speedImpact]]^2-[[v0]]^2}{2\cdot[[g]]}`,v=>divide((v.speedImpact-v.v0)*(v.speedImpact+v.v0),2*v.g)),
  r('g',['speedImpact','v0','y0'],String.raw`\frac{[[speedImpact]]^2-[[v0]]^2}{2\cdot[[y0]]}`,v=>divide((v.speedImpact-v.v0)*(v.speedImpact+v.v0),2*v.y0)),
  r('alpha',['v0','x','y','y0','g'],String.raw`\arctan\!\left(\frac{[[x]]\pm\sqrt{[[x]]^2-4K([[y]]-[[y0]]+K)}}{2K}\right),\quad K=\frac{[[g]]\cdot[[x]]^2}{2\cdot[[v0]]^2}`,v=>pointAngles(v.x,v.y-v.y0,positive(v.v0),v.g)),
  r('alpha',['v0','range','y0','g'],String.raw`\arctan\!\left(\frac{[[range]]\pm\sqrt{[[range]]^2-4K(K-[[y0]])}}{2K}\right),\quad K=\frac{[[g]]\cdot[[range]]^2}{2\cdot[[v0]]^2}`,v=>v.range===0?unknown():pointAngles(v.range,-v.y0,positive(v.v0),v.g)),
  r('v0',['alpha','x','y','y0','g'],String.raw`\sqrt{\frac{[[g]]\cdot[[x]]^2}{2\cdot\cos^2[[alpha]]\cdot([[x]]\tan[[alpha]]-[[y]]+[[y0]])}}`,v=>root(divide(v.g*v.x*v.x,2*cos(v.alpha)**2*(v.x*Math.tan(v.alpha)-v.y+v.y0)),2)),
  r('v0',['alpha','range','y0','g'],String.raw`\sqrt{\frac{[[g]]\cdot[[range]]^2}{2\cdot\cos^2[[alpha]]\cdot([[range]]\tan[[alpha]]+[[y0]])}}`,v=>v.y0===0&&v.range===0&&sin(v.alpha)>0&&cos(v.alpha)!==0?0:root(divide(v.g*v.range*v.range,2*cos(v.alpha)**2*(v.range*Math.tan(v.alpha)+v.y0)),2))
];

/** Validate original equations, rather than unstable inverse quotients at zero. */
function consistent(v:Values):boolean {
  const has=(...keys:string[])=>keys.every(key=>v[key]!==undefined);
  const eq=(a:number,b:number,scale=0)=>{
    if(!Number.isFinite(a)||!Number.isFinite(b))throw new ModelFailure('numerical');
    return a===b||Math.abs(a-b)<=1e-9*Math.max(Math.abs(a),Math.abs(b),Math.abs(scale),Number.MIN_VALUE);
  };
  if(has('v0','alpha','vx')&&!eq(v.vx,v.v0*cos(v.alpha)))return false;
  if(has('v0','alpha','vy0')&&!eq(v.vy0,v.v0*sin(v.alpha)))return false;
  if(has('v0','vx','vy0')&&!eq(v.v0,Math.hypot(v.vx,v.vy0)))return false;
  if(has('x','vx','t')&&!eq(v.x,v.vx*v.t))return false;
  if(has('y','y0','vy0','g','t')&&!eq(v.y+v.g*v.t*v.t/2,v.y0+v.vy0*v.t,Math.max(Math.abs(v.y0),Math.abs(v.vy0*v.t))))return false;
  if(has('vy','vy0','g','t')&&!eq(v.vy+v.g*v.t,v.vy0))return false;
  if(has('y0','vy0','g','flight')&&!eq(v.g*v.flight*v.flight/2,v.y0+v.vy0*v.flight,Math.max(Math.abs(v.y0),Math.abs(v.vy0*v.flight))))return false;
  if(has('range','vx','flight')&&!eq(v.range,v.vx*v.flight))return false;
  if(has('peakTime','vy0','g')&&!eq(v.peakTime,Math.max(0,v.vy0/v.g)))return false;
  if(has('rise','vy0','g')&&!eq(v.rise,heightRise(v.vy0,v.g)))return false;
  if(has('peakHeight','y0','rise')&&!eq(v.peakHeight,v.y0+v.rise))return false;
  if(has('vyImpact','vy0','g','flight')&&!eq(v.vyImpact+v.g*v.flight,v.vy0))return false;
  if(has('speedImpact','vx','vyImpact')&&!eq(v.speedImpact,Math.hypot(v.vx,v.vyImpact)))return false;
  if(has('speedImpact','v0','y0','g')&&!eq(v.speedImpact,Math.hypot(v.v0,Math.SQRT2*Math.sqrt(v.g)*Math.sqrt(v.y0))))return false;
  if(has('t','flight')&&v.t>v.flight&&!eq(v.t,v.flight))return false;
  if(has('flight','y0','vy0')&&v.flight===0&&(v.y0>0||v.vy0>0))return false;
  return true;
}

/** Each branch only gains fields, so propagation terminates after at most 17 additions. */
export function solveObliqueModel(input:Partial<Record<ObliqueField,number>>,options:{blocked?:readonly ObliqueField[]}={}):ObliqueResult {
  const blocked=new Set(options.blocked??[]);
  const explicitNoApex=obliqueApexUnavailable(input);
  const fields=Object.keys(obliqueDomains) as ObliqueField[];
  if(explicitNoApex)for(const key of obliqueApexFields)blocked.add(key);
  const invalid=fields.filter(key=>!blocked.has(key)&&input[key]!==undefined&&!inObliqueDomain(key,input[key]!));
  if(invalid.length)return {status:'invalid',fields:invalid};
  let numerical=false;
  const expand=(seed:ObliqueBranch):ObliqueBranch[]=>{
    const pending=[seed],finished:ObliqueBranch[]=[];
    while(pending.length){
      const branch=pending.pop()!;let added=false,rejected=false;
      try {
        const omitApex=obliqueApexUnavailable(branch.values);
        if(omitApex){
          if(!explicitNoApex&&obliqueApexFields.some(key=>input[key]!==undefined))continue;
          for(const key of obliqueApexFields)delete branch.values[key];
          branch.steps=branch.steps.filter(step=>!obliqueApexFields.includes(step.target));
        }
        if(!consistent(branch.values))continue;
        for(const rule of rules){
          if(omitApex&&(obliqueApexFields.includes(rule.target)||rule.inputs.some(key=>obliqueApexFields.includes(key))))continue;
          if(blocked.has(rule.target)||branch.values[rule.target]!==undefined||!rule.inputs.every(key=>branch.values[key]!==undefined))continue;
          let candidates:readonly number[];
          try {const answer=rule.calculate(branch.values);candidates=typeof answer==='number'?[answer]:answer;}
          catch(error){if(error instanceof ModelFailure&&error.code==='underdetermined')continue;throw error;}
          if(candidates.some(value=>!Number.isFinite(value)))throw new ModelFailure('numerical');
          candidates=unique(candidates).filter(value=>inObliqueDomain(rule.target,value));
          if(!candidates.length){rejected=true;break;}
          for(const value of candidates){
            const step:ObliqueStep={target:rule.target,formula:rule.formula};
            if(rule.target==='alpha'&&rule.formula.includes('K=')){
              const x=branch.values[rule.inputs.includes('x')?'x':'range'];
              if(x!==0)step.coefficient={value:pointCoefficient(x,branch.values.v0,branch.values.g),formula:rule.formula.split(String.raw`,\quad K=`)[1]};
            }
            pending.push({values:{...branch.values,[rule.target]:value===0?0:value},steps:[...branch.steps,step],assumed:[...branch.assumed]});
          }
          added=true;break;
        }
      }catch(error){if(!(error instanceof ModelFailure))throw error;if(error.code==='numerical')numerical=true;rejected=true;}
      if(!added&&!rejected)finished.push(branch);
    }
    return finished;
  };
  const initial=Object.fromEntries(Object.entries(input).filter(([key])=>!blocked.has(key as ObliqueField)));
  let branches=expand({values:initial,steps:[],assumed:[]});
  // Infer defaults whenever possible first. The launch height convention precedes terrestrial gravity.
  for(const [key,value] of [['y0',0],['g',DEFAULT_PROJECTILE_GRAVITY]] as const){
    if(blocked.has(key))continue;
    branches=branches.flatMap(branch=>branch.values[key]!==undefined?[branch]:expand({...branch,values:{...branch.values,[key]:value},assumed:[...branch.assumed,key]}));
  }
  if(!branches.length)return {status:numerical?'numerical':'no-solution'};
  branches=branches.filter((branch,index)=>branches.findIndex(other=>fields.every(key=>branch.values[key]===other.values[key]))===index);
  for(const branch of branches){
    const v=branch.values;
    if(['y0','g','vx','vy0'].every(key=>v[key]!==undefined)){
      const vertical=solveVerticalThrow({y0:v.y0,v0:v.vy0,g:v.g},{includePeak:false});
      if(vertical.status!=='success')return {status:'numerical'};
      const base=vertical.scenarios[0];
      branch.scenario={...base,horizontalVelocity:v.vx,values:{...base.values,...v}};
    }
  }
  return branches.some(branch=>branch.steps.length>0||branch.scenario!==undefined)?{status:'success',branches}:{status:'incomplete'};
}
