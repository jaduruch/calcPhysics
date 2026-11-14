import {ellipseFields} from '../content/kepler-ellipse.ts';
import type {EllipseBranch,EllipseStep} from '../physics/mechanics/kepler-ellipse.ts';
import {resourceFormula,resourceQuantity} from './resource-equations.ts';
import {unitGroups,getUnit,type QuantityKind} from '../physics/units.ts';
import {quantityLatex,prefixes,type ParsedQuantity} from './quantities.ts';
/** Select only the sign/quadrant already resolved by the solver. */
function formula(step:EllipseStep,v:EllipseBranch['values']){
 let f=step.formula;
 if(step.target==='phi'&&step.inputs.length===1)return step.inputs[0]==='x'?(v.phi>Math.PI?String.raw`\frac{3\pi}{2}`:String.raw`\frac\pi2`):(v.phi>0?String.raw`\pi`:'0');
 if(f.includes(String.raw`\pm`)){
  let minus=v[step.target]<0;
  if(step.target==='e'&&step.inputs.includes('a')&&step.inputs.includes('r'))minus=v.e<-v.x/(2*v.a);
  if(step.target==='e'&&step.inputs.includes('b')&&step.inputs.includes('r'))minus=v.e<-v.r*v.x/(v.x*v.x+v.b*v.b);
  if(step.target==='a'&&step.inputs.includes('area')&&step.inputs.includes('X')){
   if(v.Y===0)return String.raw`|[[X]]|`;
   const length=Math.sqrt(v.area/Math.PI);minus=(v.a/length)**2<1/(2*(v.Y/length)**2);
  }
  f=f.replace(String.raw`\pm`,minus?'-':'+');
 }
 if(step.target==='phi'&&f.startsWith(String.raw`\arccos`)&&v.phi>Math.PI)f=String.raw`2\pi-`+f;
 if(step.target==='phi'&&step.inputs.includes('y')&&step.inputs.includes('r')&&!step.inputs.includes('x')){
  const arc=String.raw`\arcsin\frac{[[y]]}{[[r]]}`;
  f=v.phi>Math.PI/2&&v.phi<3*Math.PI/2?String.raw`\pi-`+arc:v.y<0?String.raw`2\pi+`+arc:arc;
 }
 return f;
}
export function ellipseEquations(branch:EllipseBranch,units:Record<string,string>){return branch.steps.map(step=>{const field=ellipseFields.find(f=>f.id===step.target)!,expression=formula(step,branch.values);return `${field.symbol}=${resourceFormula(expression,ellipseFields)}=${resourceFormula(expression,ellipseFields,branch.values)}\\approx ${resourceQuantity(branch.values[field.id],field.kind,units[field.id]??unitGroups[field.kind].si)}`;});}
export function ellipseConversions(parsed:Record<string,ParsedQuantity>,units:Record<string,string>){return ellipseFields.flatMap(field=>{const p=parsed[field.id],selected=units[field.id]??unitGroups[field.kind].si;if(p.status!=='valid'||selected===unitGroups[field.kind].si)return [];const u=getUnit(field.kind as QuantityKind,selected);return [`${field.symbol}=${quantityLatex(Number(p.number),selected,false)}${p.prefix?`\\cdot ${prefixes.find(i=>i.symbol===p.prefix)!.factor}`:''}\\cdot\\frac{${'factorLatex' in u?u.factorLatex:u.factor}\\,\\mathrm{${unitGroups[field.kind].si}}}{1\\,\\mathrm{${selected}}}\\approx ${resourceQuantity(p.value,field.kind)}`];});}
