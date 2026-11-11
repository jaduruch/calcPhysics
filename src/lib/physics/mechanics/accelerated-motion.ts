/** Constant acceleration on a signed straight-line axis; elapsed t >= 0.
 * Position is a coordinate, not distance travelled. SI throughout.
 */
export type MotionState = { s0: number; v0: number; a: number };
export type AcceleratedField = 's0' | 's' | 'v0' | 'a' | 't' | 'v';
export type AcceleratedMethod = 'position' | 'velocity' | 'average' | 'energy';
export interface AcceleratedStep { field: AcceleratedField; method: AcceleratedMethod }
const positionFields = ['s0','s','v0','a','t'] as const;
export const acceleratedFields = [...positionFields,'v'] as const;
export interface MotionScenario {
  values: Record<string,number>;
  motion: MotionState;
  duration: number;
  finalPosition: number;
  finalVelocity: number;
  horizontalVelocity: number | null;
  steps?: readonly AcceleratedStep[];
}
export type KinematicsResult =
  | {status:'incomplete'|'no-solution'|'underdetermined'}
  | {status:'invalid';code:'domain'|'numerical'|'too-many'|'conflict';fields:string[]}
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
function solvePositionMotion(input:Partial<Record<AcceleratedField,number>>):KinematicsResult {
  const known=positionFields.filter(field=>input[field]!==undefined);
  const invalid=known.filter(field=>!Number.isFinite(input[field])||(field==='t'&&input[field]!<0));
  if(invalid.length)return {status:'invalid',code:'domain',fields:invalid};
  if(known.length===5)return {status:'invalid',code:'too-many',fields:[]};
  const values={...input};
  const assumed:AcceleratedField[]=[];
  if(known.length===2&&input.s0===undefined&&input.v0===undefined){
    values.s0=0;values.v0=0;assumed.push('s0','v0');
  }else if(known.length===3&&input.s0===undefined){
    values.s0=0;assumed.push('s0');
  }
  const missing=positionFields.filter(field=>values[field]===undefined);
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
    const resolved={...values,[target]:value} as Record<typeof positionFields[number],number>;
    const motion={s0:resolved.s0,v0:resolved.v0,a:resolved.a};
    const endpoint=motionAt(motion,resolved.t);
    return {values:{...resolved,v: endpoint.velocity,ds:resolved.s-resolved.s0},motion,duration:resolved.t,finalPosition:resolved.s,finalVelocity:endpoint.velocity,horizontalVelocity:null};
  });
  if(scenarios.some(scenario=>!finiteScenario(scenario)))return {status:'invalid',code:'numerical',fields:[]};
  return {status:'success',target,assumed,scenarios};
}

type AcceleratedValues = Partial<Record<AcceleratedField,number>>;
type RelationAttempt = {field:AcceleratedField; values:number[]; method:AcceleratedMethod}
  | {status:'underdetermined'|'no-solution'|'numerical'};
const CONSISTENCY_TOLERANCE = 1e-10;
function residual(terms:number[]):'valid'|'conflict'|'numerical' {
  if(!terms.every(Number.isFinite))return 'numerical';
  const scale=Math.max(...terms.map(Math.abs));
  return scale===0||Math.abs(terms.reduce((sum,term)=>sum+term/scale,0))<=CONSISTENCY_TOLERANCE?'valid':'conflict';
}
function validateRelations(v:AcceleratedValues):'valid'|'conflict'|'numerical' {
  const {s0,s,v0,a,t,v:final}=v;
  if(final!==undefined&&v0!==undefined&&a!==undefined&&t!==undefined){
    const status=residual([final,-v0,-a*t]);if(status!=='valid')return status;
  }
  if(s0!==undefined&&s!==undefined&&v0!==undefined&&a!==undefined&&t!==undefined){
    const status=residual([s,-s0,-v0*t,-(0.5*a*t)*t]);if(status!=='valid')return status;
  }
  if(s0!==undefined&&s!==undefined&&v0!==undefined&&final!==undefined&&t!==undefined){
    const status=residual([s,-s0,-(v0/2+final/2)*t]);if(status!=='valid')return status;
  }
  return 'valid';
}
function linearQuotient(field:AcceleratedField,numerator:number,denominator:number,method:AcceleratedMethod):RelationAttempt {
  if(![numerator,denominator].every(Number.isFinite))return {status:'numerical'};
  if(denominator===0)return {status:numerator===0?'underdetermined':'no-solution'};
  return {field,values:[numerator/denominator],method};
}
/** Evaluate sqrt(x² + sign * y²) without squaring large unscaled values. */
function energyRoot(velocity:number,a:number,displacement:number,sign:1|-1):number|'no-solution'|'numerical' {
  const x=Math.abs(velocity),y=Math.SQRT2*Math.sqrt(Math.abs(a))*Math.sqrt(Math.abs(displacement));
  if(!Number.isFinite(y))return 'numerical';
  const scale=Math.max(x,y);if(scale===0)return 0;
  const square=(x/scale)**2,term=(y/scale)**2;
  const direction=Math.sign(a)*Math.sign(displacement)*sign;
  let radicand=square+direction*term;
  if(radicand<0&&-radicand<=8*Number.EPSILON*(square+term))radicand=0;
  if(radicand<0)return 'no-solution';
  const root=scale*Math.sqrt(radicand);
  return Number.isFinite(root)?root:'numerical';
}
function relationAttempts(values:AcceleratedValues):RelationAttempt[] {
  const attempts:RelationAttempt[]=[];
  const missing=(fields:readonly AcceleratedField[])=>fields.filter(field=>values[field]===undefined);
  const {s0,s,v0,a,t,v}=values;
  // v1 = v0 + a*t
  const velocityMissing=missing(['v0','v','a','t']);
  if(velocityMissing.length===1){
    const field=velocityMissing[0];
    if(field==='v')attempts.push({field,values:[v0!+a!*t!],method:'velocity'});
    else if(field==='v0')attempts.push({field,values:[v!-a!*t!],method:'velocity'});
    else attempts.push(linearQuotient(field,v!-v0!,field==='a'?t!:a!,'velocity'));
  }
  // s = s0 + v0*t + 1/2*a*t²: reuse the stable quadratic inversion.
  if(missing(positionFields).length===1){
    const input=Object.fromEntries(positionFields.filter(field=>values[field]!==undefined).map(field=>[field,values[field]]));
    const result=solvePositionMotion(input);
    if(result.status==='success')attempts.push({field:result.target!,values:result.scenarios.map(item=>item.values[result.target!]),method:'position'});
    else if(result.status==='invalid')attempts.push({status:'numerical'});
    else if(result.status==='no-solution'||result.status==='underdetermined')attempts.push({status:result.status});
  }
  // s-s0 = (v0+v1)*t/2
  const averageMissing=missing(['s0','s','v0','v','t']);
  if(averageMissing.length===1){
    const field=averageMissing[0];
    if(field==='s'||field==='s0')attempts.push({field,values:[field==='s'?s0!+(v0!/2+v!/2)*t!:s!-(v0!/2+v!/2)*t!],method:'average'});
    else if(field==='t')attempts.push(linearQuotient(field,s!-s0!,v0!/2+v!/2,'average'));
    else if(t===0)attempts.push({status:s===s0?'underdetermined':'no-solution'});
    else attempts.push({field,values:[2*((s!-s0!)/t!)-(field==='v'?v0!:v!)],method:'average'});
  }
  // v1²-v0² = 2*a*(s-s0); both signs are candidates until t>=0 is checked.
  const energyMissing=missing(['s0','s','v0','v','a']);
  if(energyMissing.length===1){
    const field=energyMissing[0];
    if(field==='v'||field==='v0'){
      const root=energyRoot(field==='v'?v0!:v!,a!,s!-s0!,field==='v'?1:-1);
      attempts.push(typeof root==='string'?{status:root}:{field,values:root===0?[0]:[root,-root],method:'energy'});
    }else {
      const numerator=(v!-v0!)*(v!/2+v0!/2);
      if(field==='a')attempts.push(linearQuotient(field,numerator,s!-s0!,'energy'));
      else {
        const delta=linearQuotient(field,numerator,a!,'energy');
        attempts.push('status' in delta?delta:{...delta,values:delta.values.map(d=>field==='s'?s0!+d:s!-d)});
      }
    }
  }
  return attempts;
}
/** Constant acceleration, six quantities and two independent equations.
 * Blank s0 may assume zero with three supplied quantities; with two supplied
 * quantities and both s0/v0 blank, both initial values assume zero.
 * Every other missing value is explicitly calculated. Redundant inputs are
 * checked with a relative residual of 1e-10, not treated as measurement error.
 * Source: Formelbuch p.49; s on that page is the displacement s-s0 here.
 */
export function solveAcceleratedMotion(input:AcceleratedValues):KinematicsResult {
  const known=acceleratedFields.filter(field=>input[field]!==undefined);
  const invalid=known.filter(field=>!Number.isFinite(input[field])||(field==='t'&&input[field]!<0));
  if(invalid.length)return {status:'invalid',code:'domain',fields:invalid};
  const values={...input},assumed:AcceleratedField[]=[];
  if(known.length===2&&input.s0===undefined&&input.v0===undefined){values.s0=0;values.v0=0;assumed.push('s0','v0');}
  else if(known.length===3&&input.s0===undefined){values.s0=0;assumed.push('s0');}
  if(acceleratedFields.filter(field=>values[field]!==undefined).length<4)return {status:'incomplete'};
  const initialStatus=validateRelations(values);
  if(initialStatus!=='valid')return {status:'invalid',code:initialStatus==='conflict'?'conflict':'numerical',fields:[]};
  const calculated=acceleratedFields.filter(field=>values[field]===undefined);
  const target=calculated.find(field=>field!=='v')??calculated[0]??null;
  const queue:{values:AcceleratedValues;steps:AcceleratedStep[]}[]=[{values,steps:[]}];
  const scenarios:MotionScenario[]=[];
  let numerical=false,underdetermined=false;
  while(queue.length){
    const state=queue.shift()!;
    const validation=validateRelations(state.values);
    if(validation!=='valid'){numerical ||= validation==='numerical';continue;}
    if(acceleratedFields.every(field=>state.values[field]!==undefined)){
      const r=state.values as Record<AcceleratedField,number>;
      const scenario:MotionScenario={values:{...r,ds:r.s-r.s0},motion:{s0:r.s0,v0:r.v0,a:r.a},duration:r.t,finalPosition:r.s,finalVelocity:r.v,horizontalVelocity:null,steps:state.steps};
      if(finiteScenario(scenario))scenarios.push(scenario);else numerical=true;
      continue;
    }
    const attempts=relationAttempts(state.values);
    numerical ||= attempts.some(item=>'status' in item&&item.status==='numerical');
    const attempt=attempts.find(item=>!('status' in item));
    if(!attempt||'status' in attempt){
      numerical ||= attempts.some(item=>'status' in item&&item.status==='numerical');
      underdetermined ||= attempts.length===0||attempts.every(item=>'status' in item&&item.status==='underdetermined');
      continue;
    }
    for(const value of attempt.values){
      if(!Number.isFinite(value)){numerical=true;continue;}
      if(attempt.field==='t'&&value<0)continue;
      queue.push({values:{...state.values,[attempt.field]:value===0?0:value},steps:[...state.steps,{field:attempt.field,method:attempt.method}]});
    }
  }
  scenarios.sort((a,b)=>a.duration-b.duration);
  if(!scenarios.length)return numerical?{status:'invalid',code:'numerical',fields:[]}:underdetermined?{status:'underdetermined'}:known.length>=5?{status:'invalid',code:'conflict',fields:[]}:{status:'no-solution'};
  return {status:'success',target,assumed,scenarios};
}
