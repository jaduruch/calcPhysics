import {finiteScenario,type KinematicsResult,type MotionScenario} from './accelerated-motion.ts';
export const DEFAULT_PROJECTILE_GRAVITY=9.81;
/** Vertical +y points up, ground y=0. First future landing after launch;
 * for y0=0,v0<=0 the body starts in contact with ground and flight time is zero.
 * No drag, bounce, Earth curvature or variation of gravity.
 */
export function solveVerticalThrow(input:{y0?:number;v0?:number;g?:number}):KinematicsResult {
  const y0=input.y0??0,g=input.g??DEFAULT_PROJECTILE_GRAVITY,v0=input.v0;
  const invalid=(['y0','v0','g'] as const).filter(key=>{
    const value=key==='y0'?y0:key==='g'?g:v0;
    return value!==undefined&&(!Number.isFinite(value)||(key==='y0'&&value<0)||(key==='g'&&value<=0));
  });
  if(invalid.length)return {status:'invalid',code:'domain',fields:invalid};
  if(v0===undefined)return {status:'incomplete'};
  const impactMagnitude=Math.hypot(v0,Math.SQRT2*Math.sqrt(g)*Math.sqrt(y0));
  const flight=v0>0?v0/g+impactMagnitude/g:y0===0?0:y0/(impactMagnitude/2-v0/2);
  const peakTime=v0>0?v0/g:0;
  const peakHeight=y0+v0*peakTime/2;
  const impactVelocity=-impactMagnitude;
  const scenario:MotionScenario={values:{y0,v0,g,flight,peakTime,peakHeight,impactVelocity},motion:{s0:y0,v0,a:-g},duration:flight,finalPosition:0,finalVelocity:impactVelocity,horizontalVelocity:null};
  if(!finiteScenario(scenario)||(y0>0&&flight===0)||(v0>0&&peakTime===0))return {status:'invalid',code:'numerical',fields:[]};
  return {status:'success',target:null,assumed:[...(input.y0===undefined?['y0']:[]),...(input.g===undefined?['g']:[])],scenarios:[scenario]};
}
/** Horizontal launch: x0=0, y0=h>=0, initial vertical velocity zero.
 * Signed horizontal vx is allowed; range is the signed horizontal displacement.
 */
export function solveHorizontalThrow(input:{h?:number;vx?:number;g?:number}):KinematicsResult {
  const {h,vx}=input,g=input.g??DEFAULT_PROJECTILE_GRAVITY;
  const invalid=(['h','vx','g'] as const).filter(key=>{
    const value=key==='h'?h:key==='vx'?vx:g;
    return value!==undefined&&(!Number.isFinite(value)||(key==='h'&&value<0)||(key==='g'&&value<=0));
  });
  if(invalid.length)return {status:'invalid',code:'domain',fields:invalid};
  if(h===undefined||vx===undefined)return {status:'incomplete'};
  const flight=Math.SQRT2*Math.sqrt(h)/Math.sqrt(g);
  const range=vx*flight,vyImpact=-g*flight,speedImpact=Math.hypot(vx,vyImpact);
  const scenario:MotionScenario={values:{h,vx,g,flight,range,vyImpact,speedImpact},motion:{s0:h,v0:0,a:-g},duration:flight,finalPosition:0,finalVelocity:vyImpact,horizontalVelocity:vx};
  if(!finiteScenario(scenario)||(h>0&&flight===0))return {status:'invalid',code:'numerical',fields:[]};
  return {status:'success',target:null,assumed:input.g===undefined?['g']:[],scenarios:[scenario]};
}

/** Oblique launch in the x–y plane; x0=0, y0>=0, speed v0>=0.
 * Angle alpha is measured counterclockwise from +x, -pi <= alpha <= pi.
 * Reuses the vertical solver for the first ground contact, including downward
 * and vertical launches. Exact cardinal angles avoid spurious horizontal drift.
 * Reference: OpenStax University Physics 1, 4.3 Projectile Motion.
 */
export function solveObliqueThrow(input:{y0?:number;v0?:number;alpha?:number;g?:number}):KinematicsResult {
  const y0=input.y0??0,g=input.g??DEFAULT_PROJECTILE_GRAVITY,{v0,alpha}=input;
  const invalid=(['y0','v0','alpha','g'] as const).filter(key=>{
    const value=key==='y0'?y0:key==='g'?g:input[key];
    return value!==undefined&&(!Number.isFinite(value)||((key==='y0'||key==='v0')&&value<0)||(key==='g'&&value<=0)||(key==='alpha'&&Math.abs(value)>Math.PI));
  });
  if(invalid.length)return {status:'invalid',code:'domain',fields:invalid};
  if(v0===undefined||alpha===undefined)return {status:'incomplete'};
  const sine=alpha===0||Math.abs(alpha)===Math.PI?0:alpha===Math.PI/2?1:alpha===-Math.PI/2?-1:Math.sin(alpha);
  const cosine=Math.abs(alpha)===Math.PI/2?0:alpha===0?1:Math.abs(alpha)===Math.PI?-1:Math.cos(alpha);
  const vx=v0*cosine,vy0=v0*sine;
  if(v0>0&&((cosine!==0&&vx===0)||(sine!==0&&vy0===0)))return {status:'invalid',code:'numerical',fields:[]};
  const vertical=solveVerticalThrow({y0,v0:vy0,g});
  if(vertical.status!=='success')return vertical;
  const base=vertical.scenarios[0],range=base.duration===0?0:vx*base.duration,speedImpact=Math.hypot(vx,base.finalVelocity);
  const scenario:MotionScenario={...base,horizontalVelocity:vx,values:{...base.values,v0,alpha,vx,vy0,range,vyImpact:base.finalVelocity,speedImpact}};
  if(!finiteScenario(scenario)||(vx!==0&&base.duration>0&&range===0))return {status:'invalid',code:'numerical',fields:[]};
  return {status:'success',target:null,assumed:[...(input.y0===undefined?['y0']:[]),...(input.g===undefined?['g']:[])],scenarios:[scenario]};
}
