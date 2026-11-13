/** Restricted scalar arithmetic: no identifiers, functions, units or executable code.
 * Prefixes belong to individual numeric literals; units are applied by the caller once.
 * Power is right-associative and binds more tightly than a leading sign: -2^2 = -4.
 */
export function evaluateArithmetic(text:string,literal:(number:string,prefix:string)=>number):{value:number;hasPrefix:boolean}|null {
 if(text.length>4096)return null;
 let offset=0,depth=0,tokens=0,hasPrefix=false;
 const invalid=():never=>{throw new RangeError('Invalid arithmetic expression');};
 const spaces=()=>{while(/\s/.test(text[offset]??'')&&offset<text.length)offset++;};
 const take=(character:string)=>{spaces();if(text[offset]!==character)return false;offset++;if(++tokens>512)invalid();return true;};
 const finite=(value:number)=>Number.isFinite(value)?value:invalid();
 const nested=(fn:()=>number)=>{if(++depth>128)invalid();try{return fn();}finally{depth--;}};
 function primary():number {
  spaces();
  if(take('(')){const value=nested(sum);if(!take(')'))invalid();return value;}
  const match=text.slice(offset).match(/^(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?/);
  if(!match)invalid();
  offset+=match![0].length;if(++tokens>512)invalid();spaces();
  const suffix=/^[pnumcdkMGTµμ]/.test(text.slice(offset))?text[offset++].replace(/[µμ]/,'u'):'';
  hasPrefix ||= suffix!=='';
  return finite(literal(match![0].replace(',','.'),suffix));
 }
 function power():number {
  const base=primary();
  if(!take('^'))return base;
  const exponent=nested(unary);
  if(base===0&&exponent===0)invalid();
  const value=finite(base**exponent);
  return value===0&&base!==0?invalid():value;
 }
 function unary():number {return nested(()=>take('+')?unary():take('-')?-unary():power());}
 function product():number {
  let value=unary();
  while(true){
   if(take('*')){const rhs=unary(),next=finite(value*rhs);if(next===0&&value!==0&&rhs!==0)invalid();value=next;}
   else if(take('/')){const rhs=unary();if(rhs===0)invalid();const next=finite(value/rhs);if(next===0&&value!==0)invalid();value=next;}
   else return value;
  }
 }
 function sum():number {let value=product();while(true){if(take('+'))value=finite(value+product());else if(take('-'))value=finite(value-product());else return value;}}
 try {const value=sum();spaces();return offset===text.length?{value,hasPrefix}:null;}catch(error){if(error instanceof RangeError)return null;throw error;}
}
