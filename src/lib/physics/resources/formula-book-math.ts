/** Domain-aware elementary inverses; no symbolic equation evaluation. */
import { divide, ModelFailure } from './solver.ts';
import { nonnegativeMotionTimes } from '../mechanics/accelerated-motion.ts';
export function root(value:number,degree:number):number {
 if(!Number.isFinite(value))throw new ModelFailure('numerical');
 if(value<0)throw new ModelFailure('no-solution');
 const answer=degree===2?Math.sqrt(value):value**(1/degree);
 if(value!==0&&answer===0)throw new ModelFailure('numerical');
 return answer;
}
export function signedRoot(value:number):number[] {const r=root(value,2);return r===0?[0]:[-r,r];}
export function quadratic(a:number,b:number,c:number):number[] {
 const roots=nonnegativeMotionTimes(a,b,c);
 if(typeof roots==='string')throw new ModelFailure(roots);
 return roots;
}
function unitArgument(value:number):number {
 if(!Number.isFinite(value))throw new ModelFailure('numerical');
 if(value < -1-8*Number.EPSILON || value>1+8*Number.EPSILON)throw new ModelFailure('no-solution');
 return Math.max(-1,Math.min(1,value));
}
export const asin=(value:number):number=>Math.asin(unitArgument(value));
export const acos=(value:number):number=>Math.acos(unitArgument(value));
/** Preserve the exact zero of cos(π/2), important for degenerate inverse cases. */
export const cosine=(angle:number):number=>angle===Math.PI/2?0:Math.cos(angle);
export function inclineAngles(ratio:number,friction:number,sign:1|-1):number[] {
 const phase=Math.atan(sign*friction),angle=asin(ratio/Math.hypot(1,friction));
 return [angle-phase,Math.PI-angle-phase];
}
export function rangeAngles(range:number,g:number,speed:number):number[] {
 const angle=asin(divide(range*g,speed*speed));
 return [angle/2,Math.PI/2-angle/2];
}
export function trajectoryAngles(x:number,y:number,speed:number,g:number):number[] {
 if(x===0)throw new ModelFailure(y===0?'underdetermined':'no-solution');
 // Solve for nonnegative tan(α), using the same stable quadratic routine as time inversion.
 const k=divide(g*x*x,2*speed*speed);
 return quadratic(k,-x,y+k).map(Math.atan);
}
export function positiveExp(exponent:number):number {
 const value=Math.exp(exponent);
 if(value===0||!Number.isFinite(value))throw new ModelFailure('numerical');
 return value;
}
