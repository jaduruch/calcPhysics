import type { Values } from '../physics/resources/solver.ts';
/** Choose the symbolic branch represented by an already validated solution.
 * This adapter never calculates a new solution or modifies solver values.
 */
export function formulaBookRule(id:string,target:string,template:string,v:Values):string {
 if(id==='book-angular-displacement'&&target==='t') {
  if(v.alpha===0)return String.raw`\frac{[[phi]]}{[[w0]]}`;
  return template.replace(String.raw`\pm`,v.alpha*v.t+v.w0<0?'-':'+');
 }
 if(id.startsWith('book-angular-rest-energy-')&&target==='omega')return template.replace(String.raw`\pm`,v.omega<0?'-':'');
 if(id==='book-angular-energy'&&(target==='w0'||target==='w1'))return template.replace(String.raw`\pm`,v[target]<0?'-':'');
 if(id==='book-vertical-position'&&target==='t')return template.replace(String.raw`\pm`,v.g*v.t-v.u<0?'-':'+');
 if(id==='book-oblique-trajectory') {
  if(target==='x')return template.replace(String.raw`\pm`,v.g*v.x-v.v0*v.v0*Math.sin(v.alpha)*Math.cos(v.alpha)<0?'-':'+');
  if(target==='alpha')return template.replace(String.raw`\pm`,v.g*v.x*Math.tan(v.alpha)-v.v0*v.v0<0?'-':'+');
 }
 if(id==='book-oblique-range'&&target==='alpha') {
  const angle=String.raw`\arcsin\!\left(\frac{[[R]]\cdot[[g]]}{[[v0]]^2}\right)`;
  return v.alpha<=Math.PI/4?String.raw`\frac12`+angle:String.raw`\frac{\pi}{2}-\frac12`+angle;
 }
 if((id==='book-slope-raising'||id==='book-slope-lowering')&&target==='alpha') {
  const sign=id==='book-slope-raising'?'':'-';
  const arc=String.raw`\arcsin\!\left(\frac{[[F]]}{[[Fg]]\sqrt{1+[[mu]]^2}}\right)`;
  const phase=String.raw`\arctan\!\left(`+sign+String.raw`[[mu]]\right)`;
  return v.alpha+Math.atan((sign?-1:1)*v.mu)<=Math.PI/2?arc+'-'+phase:String.raw`\pi-`+arc+'-'+phase;
 }
 return template;
}
