import { obliqueFields } from '../content/oblique-throw.ts';
import type { ObliqueBranch, ObliqueField } from '../physics/mechanics/oblique-throw.ts';
import { resourceFormula, resourceQuantity } from './resource-equations.ts';
import { fromSI, getUnit, defaultInputUnit, unitGroups } from '../physics/units.ts';
import { quantityLatex } from './quantities.ts';
const fields=obliqueFields.map(field=>({...field,symbol:field.latex}));
export function obliqueEquations(branch:ObliqueBranch,units:Record<string,string>) {
 return branch.steps.flatMap(step=>{
  const equations:{id:string;label:string;expression:string}[]=[];
  const field=fields.find(field=>field.id===step.target)!;
  let formula=step.formula;
  const v=branch.values,answer=v[step.target];
  const localFields=step.coefficient?[...fields,{id:'coefficient',name:'trajectory coefficient',kind:'length' as const,symbol:'K'}]:fields;
  const localValues=step.coefficient?{...v,coefficient:step.coefficient.value}:v;
  if(step.coefficient)equations.push({id:'coefficient',label:'trajectory coefficient',expression:`K=${resourceFormula(step.coefficient.formula,fields)}=${resourceFormula(step.coefficient.formula,fields,v)}\\approx ${resourceQuantity(step.coefficient.value,'length')}`});
  if(step.target==='v0'&&formula.includes('[[range]]')&&v.range===0&&v.y0===0)formula=String.raw`\sqrt{\frac{[[g]]\cdot[[range]]}{\sin(2\cdot[[alpha]])}}`;
  if(step.target==='alpha'&&formula.startsWith(String.raw`\arcsin`)){
   const principal=Math.asin(Math.max(-1,Math.min(1,v.vy0/v.v0)));
   if(Math.abs(answer-principal)>1e-10)formula=(answer>=0?String.raw`\pi-`:String.raw`-\pi-`)+formula;
  }
  if(formula.includes(String.raw`\pm`)){
   let plus=answer>=0;
   if(step.target==='t')plus=answer>=v.vy0/v.g;
   if(step.target==='alpha'&&formula.includes('K=')){
    const fromPoint=step.formula.includes('[[x]]'),x=fromPoint?v.x:v.range,dy=fromPoint?v.y-v.y0:-v.y0,k=step.coefficient?.value??0;
    plus=Math.abs(Math.tan(answer)-(x+Math.sqrt(Math.max(0,x*x-4*k*(dy+k))))/(2*k))<1e-8;
   }
   formula=formula.replaceAll(String.raw`\pm`,plus?'+':'-');
  }
  if(step.target==='alpha'&&formula.includes('K=')){
   const semicolon=formula.indexOf(String.raw`,\quad K=`);
   const anglePart=formula.slice(0,semicolon);
   const principal=Math.atan(Math.tan(answer));
   const adjustment=answer-principal>1?String.raw`+\pi`:answer-principal < -1?String.raw`-\pi`:'';
   formula=(anglePart+adjustment).replaceAll('4K(',String.raw`4\cdot[[coefficient]]\cdot(`).replaceAll('2K',String.raw`2\cdot[[coefficient]]`).replaceAll('K','[[coefficient]]');
   if((step.formula.includes('[[x]]')?v.x:v.range)===0)formula=answer>0?String.raw`\frac{\pi}{2}`:String.raw`-\frac{\pi}{2}`;
  }
  // Omit only the origin explicitly assumed to be zero; manual zeroes remain visible.
  if(branch.assumed.includes('y0')){
   if(step.target==='speedImpact'&&formula.includes('[[y0]]')&&v.v0!==undefined)formula='[[v0]]';
   else if(step.target==='flight'&&formula.includes('[[y0]]')&&v.vy0!==undefined&&v.g!==undefined)formula=v.vy0>0?String.raw`\frac{2\cdot[[vy0]]}{[[g]]}`:'0';
   else formula=formula.replaceAll('+[[y0]]','').replaceAll('-[[y0]]','').replaceAll('[[y0]]+','');
  }
  const expression=`${field.latex}=${resourceFormula(formula,localFields)}=${resourceFormula(formula,localFields,localValues)}\\approx ${resourceQuantity(answer,field.kind,units[field.id]??defaultInputUnit(field.kind))}`;
  equations.push({id:step.target,label:field.name,expression});
  return equations;
 });
}
export function obliqueConversions(input:Partial<Record<ObliqueField,number>>,units:Record<string,string>) {
 return fields.flatMap(field=>{
  const value=input[field.id],selected=units[field.id]??defaultInputUnit(field.kind),si=unitGroups[field.kind].si;
  if(value===undefined||selected===si)return [];
  const unit=getUnit(field.kind,selected),factor='factorLatex' in unit?unit.factorLatex:String(unit.factor);
  return [`${field.latex}=${quantityLatex(fromSI(value,field.kind,selected),selected,false)}\\cdot\\frac{${factor}\\,\\mathrm{${si}}}{1\\,\\mathrm{${selected}}}\\approx ${resourceQuantity(value,field.kind)}`];
 });
}
