import type { ResourceResult } from '../physics/resources/solver.ts';
export interface PulleyScene {
 count:number;schematic:boolean;compact:boolean;rope:string;
 fixed:{x:number;y:number}[];moving:{x:number;y:number}[];
 segments:{x:number;top:number;bottom:number}[];
 loadX:number;freeX:number;beamLeft:number;beamRight:number;barLeft:number;barRight:number;
}
/** Reeve a single ideal rope. Each moving semicircle supplies two supporting
 * segments; odd n additionally anchors one rope end to the moving block.
 * Fixed guide pulleys only turn the free pulling end downward.
 */
export function pulleyScene(result:ResourceResult|null,enteredCount?:number):PulleyScene {
 const valid=result?.status==='success'&&Number.isSafeInteger(result.values.n)&&result.values.n>0;
 const count=valid?result.values.n:enteredCount!==undefined&&Number.isSafeInteger(enteredCount)&&enteredCount>0?enteredCount:4,compact=count>8,n=compact?4:count;
 const start=260-22*(n-1),fixed:PulleyScene['fixed']=[],moving:PulleyScene['moving']=[],segments:PulleyScene['segments']=[];
 const low=220,high=90,r=22,freeX=start+44*n;
 let rope='';
 if(n===1){
  fixed.push({x:start+r,y:high});segments.push({x:start,top:high,bottom:265});
  rope=`M${start} 265 V${high} A${r} ${r} 0 0 1 ${freeX} ${high} V280`;
 }else{
  const odd=n%2===1;
  rope=`M${start} ${odd?255:40}`;
  for(let i=0;i<n;i++){
   const x=start+44*i,down=(i%2===0)!==odd;
   segments.push({x,top:!odd&&i===0?40:high,bottom:odd&&i===0?255:low});
   if(down){moving.push({x:x+r,y:low});rope+=` V${low} A${r} ${r} 0 0 0 ${x+44} ${low}`;}
   else{fixed.push({x:x+r,y:high});rope+=` V${high} A${r} ${r} 0 0 1 ${x+44} ${high}`;}
  }
  rope+=' V280';
 }
 return {count,schematic:!valid,compact,rope,fixed,moving,segments,loadX:start+22*(n-1),freeX,beamLeft:start-25,beamRight:freeX+25,barLeft:start-8,barRight:start+44*(n-1)+8};
}
