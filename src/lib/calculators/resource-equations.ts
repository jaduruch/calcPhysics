import { formulaBookRule } from './formula-book-equations.ts';
import { quantityLatex } from './quantities.ts';
import { fromSI, getUnit, unitGroups, type QuantityKind } from '../physics/units.ts';
import type { ResourceDefinition, ResourceField } from '../content/resource-catalog.ts';
import type { ResourceResult, Values } from '../physics/resources/solver.ts';
export function resourceDisplaySymbol(symbol:string):string {
  const greek:Record<string,string>={rho:'ρ',alpha:'α',beta:'β',lambda:'λ',Delta:'Δ',delta:'δ',theta:'θ',ell:'ℓ',perp:'⊥',omega:'ω',varphi:'φ',mu:'μ',gamma:'γ',eta:'η',Phi:'Φ',Omega:'Ω'};
  return symbol.replace(/\\dot\s*([A-Za-z])/g,'$1̇').replace(/\\mathrm\{([^}]+)\}/g,'$1').replace(/\\([a-zA-Z]+)/g,(_,key:string)=>greek[key]??`\\${key}`).replace(/_([012vkpGNR])(?![A-Za-z0-9])/g,(_,key:string)=>({'0':'₀','1':'₁','2':'₂',v:'ᵥ',k:'ₖ',p:'ₚ',G:'ᵍ',N:'ₙ',R:'ᵣ'}[key]!));
}
export function resourceQuantity(value: number, kind: QuantityKind, unit = unitGroups[kind].si as string): string {
  const converted = fromSI(value, kind, unit);
  const dimensionless = kind === 'dimensionless';
  if (kind === 'mass' && unit === 'kg' && Math.abs(value) < Number.MAX_VALUE/1000) return quantityLatex(value*1000,'g');
  const engineering = !['dimensionless','temperature','density','area','volume','angle','expansionCoefficient','opticalPower','decibel','powerLevel','solidAngle'].includes(kind) && unit === unitGroups[kind].si;
  return quantityLatex(converted,dimensionless?'':unit,engineering);
}
export function resourceFormula(template: string, fields: readonly ResourceField[], values?: Values): string {
  return template.replace(/\[\[(\w+)\]\]/g,(token,key:string,offset:number) => {
    const field=fields.find(item=>item.id===key);
    if (!field) throw new Error(`Unknown formula field ${key}`);
    if (!values) return ` ${field.symbol} `;
    const quantity=resourceQuantity(values[key],field.kind);
    const before=template.slice(0,offset),after=template.slice(offset+token.length);
    const bracket=values[key]<0 || after.startsWith('^') || /\\(?:sin|cos|tan|arcsin|arccos|arctan)(?:\^2)?$/.test(before);
    return ` ${bracket?`\\left(${quantity}\\right)`:quantity} `;
  });
}
export function resourceEquations(definition: ResourceDefinition, result: Extract<ResourceResult,{status:'success'}>, units: Record<string,string>) {
  const fields=definition.fields;
  const formulaFields=[...fields,...definition.outputs];
  const values={...result.values,...result.outputs};
  const equation=(key:string,template:string,kind:QuantityKind,symbol:string,unit:string,value:number) => `${symbol}=${resourceFormula(template,formulaFields)}=${resourceFormula(template,formulaFields,values)}\\approx ${resourceQuantity(value,kind,unit)}`;
  const equations: {id:string;label:string;expression:string}[]=[];
  if(result.target) {
    const field=fields.find(item=>item.id===result.target)!;
    equations.push({id:field.id,label:field.name,expression:equation(field.id,formulaBookRule(definition.id,field.id,definition.rules[field.id],result.values),field.kind,field.symbol,units[field.id]??unitGroups[field.kind].si,result.values[field.id])});
  }
  for(const output of definition.outputs) {
    if(result.outputs[output.id]===undefined) continue;
    const coordinateInput=fields.find(field=>field.kind===output.kind&&(field.kind==='temperature'||field.kind==='angle'));
    const unit=output.unit??(coordinateInput?units[coordinateInput.id]:undefined)??unitGroups[output.kind].si;
    equations.push({id:output.id,label:output.name,expression:equation(output.id,output.formula,output.kind,output.symbol,unit,result.outputs[output.id])});
  }
  const conversions=fields.flatMap(field=>{
    if(field.id===result.target || result.assumed.includes(field.id))return [];
    const selected=units[field.id]??unitGroups[field.kind].si;
    if(selected===unitGroups[field.kind].si)return [];
    const unit=getUnit(field.kind,selected),original=fromSI(result.values[field.id],field.kind,selected);
    const originalNumber=quantityLatex(original,'',false);
    if('offset' in unit) {
      const factor='factorLatex' in unit?unit.factorLatex:selected==='°F'?String.raw`\frac{5}{9}`:'1';
      return [`${field.symbol}=\\left(${originalNumber}+${unit.offset}\\right)\\cdot${factor}\\,\\mathrm{K}\\approx ${resourceQuantity(result.values[field.id],field.kind)}`];
    }
    const factor='factorLatex' in unit?unit.factorLatex:unit.factor.toString();
    return [`${field.symbol}=${quantityLatex(original,selected,false)}\\cdot\\frac{${factor}\\,\\mathrm{${unitGroups[field.kind].si}}}{1\\,\\mathrm{${selected}}}\\approx ${resourceQuantity(result.values[field.id],field.kind)}`];
  });
  return {equations,conversions};
}
