import {divide,product,type ResourcePhysics} from './solver.ts';
import type {CombinedRelation} from './combined.ts';
/** Explicit joined inverses where chaining individual source relations is insufficient. */
export function combinedExtraRelations(id:string):CombinedRelation[] {
 const make=(id:string,physics:ResourcePhysics,formulas:Record<string,string>):CombinedRelation=>({id,physics,formulas,keys:{}});
 if(id==='book-thin-lens')return [
  make('signed-lens-focal-object',{domains:{mag:'nonzero',f:'nonzero',g:'positive'},primary:['mag','f','g'],inverse:{mag:v=>divide(v.f,v.f-v.g),f:v=>divide(product(v.mag,v.g),v.mag-1),g:v=>product(v.f,1-divide(1,v.mag))}},
   {mag:'\\frac{[[f]]}{[[f]]-[[g]]}',f:'\\frac{[[mag]]\\cdot[[g]]}{[[mag]]-1}',g:'[[f]]\\cdot\\left(1-\\frac1{[[mag]]}\\right)'}),
  make('signed-lens-focal-image',{domains:{mag:'nonzero',f:'nonzero',b:'nonzero'},primary:['mag','f','b'],inverse:{mag:v=>1-divide(v.b,v.f),f:v=>divide(v.b,1-v.mag),b:v=>product(v.f,1-v.mag)}},
   {mag:'1-\\frac{[[b]]}{[[f]]}',f:'\\frac{[[b]]}{1-[[mag]]}',b:'[[f]]\\cdot(1-[[mag]])'})
 ];
 if(id==='book-image-extension')return [make('bellows-image-distance',{
  domains:{V:'atLeastOne',b:'positive',f:'positive'},primary:['V','b','f'],
  inverse:{V:v=>divide(v.b,v.f)**2,b:v=>product(v.f,Math.sqrt(v.V)),f:v=>divide(v.b,Math.sqrt(v.V))}
 },{V:'\\left(\\frac{[[b]]}{[[f]]}\\right)^2',b:'[[f]]\\cdot\\sqrt{[[V]]}',f:'\\frac{[[b]]}{\\sqrt{[[V]]}}'})];
 return [];
}
export interface CombinedDirectRule {source:string;target:string;formula:string;when?:number;copy?:string}
export function combinedDirectRules(id:string):CombinedDirectRule[] {
 const zero=(source:string,targets:string[])=>targets.map(target=>({source,target,formula:'0'}));
 if(id==='book-free-fall-height')return [...zero('h',['v','t']),...zero('v',['h','t']),...zero('t',['h','v'])];
 if(id==='book-angular-velocity')return [...zero('t',['phi']),...['t','alpha'].flatMap(source=>[{source,target:'w1',copy:'w0',formula:'[[w0]]'},{source,target:'w0',copy:'w1',formula:'[[w1]]'}])];
 if(id==='book-angular-acceleration-rest')return [...zero('t',['omega','phi','N']),...zero('alpha',['omega','phi','N'])];
 const expansion:Record<string,[string,string]>={'linear-expansion':['alpha','dl'],'area-expansion':['alpha','dA'],'solid-volume-expansion':['alpha','dV'],'liquid-volume-expansion':['beta','dV']};
 if(expansion[id])return [...zero('dT',[expansion[id][1]]),...zero(expansion[id][0],[expansion[id][1]])];
 if(id==='heat-capacity')return [...zero('dT',['Q']),...zero('Q',['dT'])];
 if(id==='book-potential-energy')return [...zero('h',['E']),...zero('E',['h'])];
 if(id==='book-kinetic-energy')return [...zero('v',['E']),...zero('E',['v'])];
 return [];
}
