/** Constant acceleration on a signed straight-line axis; elapsed t >= 0.
 * Position is a coordinate, not distance travelled. SI throughout.
 */
export type MotionState = { s0: number; v0: number; a: number };
export type AcceleratedField = 's0' | 's' | 'v0' | 'a' | 't';
export const acceleratedFields = ['s0','s','v0','a','t'] as const;
export interface MotionScenario {
  values: Record<string,number>;
  motion: MotionState;
  duration: number;
  finalPosition: number;
  finalVelocity: number;
  horizontalVelocity: number | null;
}
export type KinematicsResult =
  | {status:'incomplete'|'no-solution'|'underdetermined'}
  | {status:'invalid';code:'domain'|'numerical'|'too-many';fields:string[]}
  | {status:'success';target:AcceleratedField|null;assumed:string[];scenarios:MotionScenario[]};
export function motionAt(state:MotionState,t:number):{position:number;velocity:number} {
  return {position:state.s0+t*(state.v0+0.5*state.a*t),velocity:state.v0+state.a*t};
}
/** Stable real roots of a t² + b t + c = 0, then restricted to t >= 0.
 * Coefficients are normalized in their SI numeric representation to prevent
 * discriminant overflow. Clamp only negative discriminant roundoff bounded by
 * 8 eps × (b² + |4ac|). No small acceleration is silently replaced by zero.
 */
export function nonnegativeMotionTimes(a:number,b:number,c:number):number[]|'no-solution'|'underdetermined'|'numerical' {
  if(![a,b,c].every(Number.isFinite))return 'numerical';
  if(a===0){if(b===0)return c===0?'underdetermined':'no-solution';const t=-c/b;return !Number.isFinite(t)?'numerical':t>=0?[t===0?0:t]:'no-solution';}
  const scale=Math.max(Math.abs(a),Math.abs(b),Math.abs(c));
  const A=a/scale,B=b/scale,C=c/scale;
  if(A===0||(b!==0&&B===0)||(c!==0&&C===0))return 'numerical';
  const square=B*B,product=4*A*C;
  if((B!==0&&square===0)||(A!==0&&C!==0&&product===0))return 'numerical';
  let discriminant=square-product;
  if(discriminant<0&&-discriminant<=8*Number.EPSILON*(square+Math.abs(product)))discriminant=0;
  if(discriminant<0)return 'no-solution';
  let candidates:number[];
  if(discriminant===0)candidates=[-B/(2*A)];
  else {const q=-0.5*(B+(B>=0?1:-1)*Math.sqrt(discriminant));candidates=[q/A,C/q];}
  if(candidates.some(Number.isNaN))return 'numerical';
  const roots=[...new Set(candidates.filter(t=>t>=0).map(t=>t===0?0:t))].sort((x,y)=>x-y);
  return roots.some(t=>!Number.isFinite(t)||(t===0&&c!==0))?'numerical':roots.length?roots:'no-solution';
}
export function finiteScenario(scenario:MotionScenario):boolean {
  if(!Object.values(scenario.values).every(Number.isFinite)||!Number.isFinite(scenario.duration)||scenario.duration<0)return false;
  const turningTime=scenario.motion.a!==0?-scenario.motion.v0/scenario.motion.a:0;
  const sampleTimes=[0,scenario.duration,...(turningTime>0&&turningTime<scenario.duration?[turningTime]:[])];
  return sampleTimes.every(t=>Object.values(motionAt(scenario.motion,t)).every(Number.isFinite));
}
export function solveAcceleratedMotion(input:Partial<Record<AcceleratedField,number>>):KinematicsResult {
  const known=acceleratedFields.filter(field=>input[field]!==undefined);
  const invalid=known.filter(field=>!Number.isFinite(input[field])||(field==='t'&&input[field]!<0));
  if(invalid.length)return {status:'invalid',code:'domain',fields:invalid};
  if(known.length===5)return {status:'invalid',code:'too-many',fields:[]};
  const values={...input};
  const assumed=known.length===3&&input.s0===undefined;
  if(assumed)values.s0=0;
  const missing=acceleratedFields.filter(field=>values[field]===undefined);
  if(missing.length!==1)return {status:'incomplete'};
  const target=missing[0];
  let solutions:number[];
  const {s0,s,v0,a,t}=values;
  if(target==='t'){
    if(a!==0&&0.5*(a!)===0)return {status:'invalid',code:'numerical',fields:[]};
    const roots=nonnegativeMotionTimes(0.5*a!,v0!,s0!-s!);
    if(typeof roots==='string')return roots==='numerical'?{status:'invalid',code:'numerical',fields:[]}:{status:roots};
    solutions=roots;
  }else if(target==='s')solutions=[motionAt({s0:s0!,v0:v0!,a:a!},t!).position];
  else if(target==='s0')solutions=[s!-t!*(v0!+0.5*a!*t!)];
  else {
    if(t===0)return {status:s===s0?'underdetermined':'no-solution'};
    solutions=[target==='v0'?(s!-s0!)/t!-0.5*a!*t!:2*((s!-s0!)/t!-v0!)/t!];
  }
  const scenarios:MotionScenario[]=solutions.map(value=>{
    const resolved={...values,[target]:value} as Record<AcceleratedField,number>;
    const motion={s0:resolved.s0,v0:resolved.v0,a:resolved.a};
    const endpoint=motionAt(motion,resolved.t);
    return {values:{...resolved,v: endpoint.velocity,ds:resolved.s-resolved.s0},motion,duration:resolved.t,finalPosition:resolved.s,finalVelocity:endpoint.velocity,horizontalVelocity:null};
  });
  if(scenarios.some(scenario=>!finiteScenario(scenario)))return {status:'invalid',code:'numerical',fields:[]};
  return {status:'success',target,assumed:assumed?['s0']:[],scenarios};
}
