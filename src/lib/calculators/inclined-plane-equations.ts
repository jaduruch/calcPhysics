import type { InclineResult } from '../physics/mechanics/inclined-plane.ts';
import { getUnit, defaultInputUnit, unitGroups, type QuantityKind } from '../physics/units.ts';
import { quantityLatex, prefixes, type ParsedQuantity } from './quantities.ts';
import { resourceFormula, resourceQuantity } from './resource-equations.ts';
import type { ResourceField } from '../content/resource-catalog.ts';
export const inclineFields=['mass','angle','length','height','endVelocity','friction','gravity'] as const;
export type InclineField=(typeof inclineFields)[number];
export const inclineKinds:Record<InclineField,QuantityKind>={mass:'mass',angle:'angle',friction:'dimensionless',gravity:'acceleration',length:'length',height:'length',endVelocity:'velocity'};
export const inclineDefaults=Object.fromEntries(inclineFields.map(key=>[key,defaultInputUnit(inclineKinds[key])])) as Record<InclineField,string>;
const symbols={mass:'m',angle:String.raw`\alpha`,friction:String.raw`\mu_k`,gravity:'g',length:'L',height:'h',endVelocity:String.raw`v_{end}`};
const fields:ResourceField[]=[...inclineFields.map(id=>({id,name:id,kind:inclineKinds[id],symbol:symbols[id]})),...(['weight','normal','parallel','frictionForce','net','acceleration'] as const).map(id=>({id,name:id,kind:id==='acceleration'?'acceleration' as const:'force' as const,symbol:({weight:'F_g',normal:'F_N',parallel:String.raw`F_{\parallel}`,frictionForce:'F_f',net:'F_{net}',acceleration:'a'})[id]}))];
export function inclineEquations(result:InclineResult):string[]{
 if(result.status!=='success')return [];
 const values=Object.fromEntries(Object.entries(result).filter((entry):entry is [string,number]=>typeof entry[1]==='number'));
 if(result.enteredEndVelocity!==undefined)values.endVelocity=result.enteredEndVelocity;
 const equation=(id:string,formula:string)=>{const f=fields.find(f=>f.id===id)!;return `${f.symbol}=${resourceFormula(formula,fields)}=${resourceFormula(formula,fields,values)}\\approx ${resourceQuantity(values[id],f.kind)}`;};
 const expressions:string[]=[];
 for(const step of result.steps){
  const formula=step.method==='geometry'?({height:String.raw`[[length]]\cdot\sin[[angle]]`,length:String.raw`\frac{[[height]]}{\sin[[angle]]}`,angle:String.raw`\arcsin\!\left(\frac{[[height]]}{[[length]]}\right)`})[step.field]:step.method==='energy'?String.raw`\frac{[[endVelocity]]^2}{2\cdot[[gravity]]}`:step.method==='speed-angle'?String.raw`\frac{[[endVelocity]]^2}{2\cdot[[gravity]]\cdot(\sin[[angle]]-[[friction]]\cdot\cos[[angle]])}`:step.method==='speed-length'?String.raw`\arctan[[friction]]+\arcsin\!\left(\frac{[[endVelocity]]^2}{2\cdot[[gravity]]\cdot[[length]]\cdot\sqrt{1+[[friction]]^2}}\right)`:String.raw`\sqrt{[[height]]^2+\left(\frac{[[height]]-\frac{[[endVelocity]]^2}{2\cdot[[gravity]]}}{[[friction]]}\right)^2}`;
  // Entered speed is retained for the inverse rechenweg; never substituted from display values.
  expressions.push(equation(step.field,formula));
 }
 if(result.weight!==undefined)expressions.push(equation('weight',String.raw`[[mass]]\cdot[[gravity]]`));
 if(result.normal!==undefined)expressions.push(equation('normal',String.raw`[[mass]]\cdot[[gravity]]\cdot\cos[[angle]]`));
 if(result.parallel!==undefined)expressions.push(equation('parallel',String.raw`[[mass]]\cdot[[gravity]]\cdot\sin[[angle]]`));
 if(result.frictionForce!==undefined)expressions.push(equation('frictionForce',String.raw`[[friction]]\cdot[[normal]]`));
 if(result.net!==undefined)expressions.push(equation('net',String.raw`[[parallel]]-[[frictionForce]]`));
 if(result.acceleration!==undefined)expressions.push(equation('acceleration',String.raw`[[gravity]]\cdot(\sin[[angle]]-[[friction]]\cdot\cos[[angle]])`));
 if(result.velocityCalculated)expressions.push(equation('endVelocity',result.acceleration!==undefined&&result.length!==undefined?String.raw`\sqrt{2\cdot[[acceleration]]\cdot[[length]]}`:String.raw`\sqrt{2\cdot[[gravity]]\cdot[[height]]}`));
 return expressions;
}
export function inclineConversions(result:InclineResult,parsed:Record<InclineField,ParsedQuantity>,units:Record<InclineField,string>):string[]{
 if(result.status!=='success')return [];
 return inclineFields.flatMap(field=>{const input=parsed[field];if(!input||input.status!=='valid'||units[field]===unitGroups[inclineKinds[field]].si)return [];
 const exact=(value:number)=>String(value).replace(/e\+?(-?\d+)/i,String.raw`\times 10^{$1}`);
 const unit=getUnit(inclineKinds[field],units[field]),factor='factorLatex' in unit?unit.factorLatex:exact(unit.factor);
 return [`${symbols[field]}=${quantityLatex(Number(input.number),units[field],false)}${input.prefix?`\\cdot ${exact(prefixes.find(prefix=>prefix.symbol===input.prefix)!.factor)}`:''}\\cdot\\frac{${factor}\\,\\mathrm{${unitGroups[inclineKinds[field]].si}}}{1\\,\\mathrm{${units[field]}}}\\approx ${resourceQuantity(input.value,inclineKinds[field])}`];});
}
