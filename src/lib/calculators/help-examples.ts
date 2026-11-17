import {parseQuantityInUnit,type ParsedQuantity} from './quantities.ts';
import {uniformMotionEquation,uniformMotionConversions,defaultMotionUnits} from './uniform-motion-equation.ts';
import {fromSI} from '../physics/units.ts';
import {solveUniformMotion,type Field,type Values} from '../physics/mechanics/uniform-motion.ts';
/** The guide uses the same inverse solver and adapters as Uniform Motion. No separate demo physics. */
export function helpMotion(raw:Record<string,string>,units:Record<string,string>){
 const fields=['s','v','t'] as const,kinds={s:'length',v:'velocity',t:'time'} as const;
 const selected={...defaultMotionUnits,...units};
 const parsed:Record<Field,ParsedQuantity>={s0:{status:'empty'},s:{status:'empty'},v:{status:'empty'},t:{status:'empty'}};
 for(const key of fields)parsed[key]=parseQuantityInUnit(raw[key]??'',kinds[key],selected[key]);
 const invalid=fields.filter(key=>parsed[key].status==='invalid'||key==='t'&&parsed.t.status==='valid'&&parsed.t.value<0);
 if(invalid.length)return {invalid,result:null,equation:'',conversions:[]};
 const input:Values={};for(const key of fields){const p=parsed[key];if(p.status==='valid')input[key]=p.value;}
 let result=solveUniformMotion(fields.every(k=>input[k]!==undefined)?{...input,s0:0}:input);
 if(result.status==='success'&&result.field!=='s0'){const display=fromSI(result.value,kinds[result.field],selected[result.field]);if(!Number.isFinite(display)||(result.value!==0&&display===0))result={status:'invalid',code:'non-finite'};}
 return {invalid,result,equation:uniformMotionEquation(result,parsed,selected),conversions:uniformMotionConversions(result,parsed,selected)};
}
