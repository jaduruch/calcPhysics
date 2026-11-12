/** Downhill sliding, uniform gravity and kinetic friction; no static-friction prediction.
 * Geometry and speed are independent of mass. Speed refers to the end of L, from rest.
 */
export type InclineInput = { mass?:number; angle?:number; friction?:number; gravity?:number; length?:number; height?:number; endVelocity?:number };
export type InclineStep = {field:'angle'|'length'|'height';method:'geometry'|'energy'|'speed-angle'|'speed-length'|'speed-height'};
export type InclineResult =
 | {status:'incomplete'}
 | {status:'invalid';code:'domain'|'non-finite'|'geometry'|'speed';fields:(keyof InclineInput)[]}
 | {status:'success';mass?:number;angle?:number;friction:number;gravity:number;length?:number;height?:number;
    geometryTarget?:'angle'|'length'|'height';steps:InclineStep[];endVelocity?:number;velocityCalculated:boolean;enteredEndVelocity?:number;
    motion?:'reachable'|'stationary'|'no-start';weight?:number;normal?:number;parallel?:number;frictionForce?:number;net?:number;acceleration?:number};
export function solveInclinedPlane(input:InclineInput):InclineResult {
 const invalid=(Object.keys(input) as (keyof InclineInput)[]).filter(key=>input[key]!==undefined&&!Number.isFinite(input[key]));
 if(invalid.length)return {status:'invalid',code:'non-finite',fields:invalid};
 const {mass,friction=0,gravity=9.81}=input;
 let {angle,length,height}=input;
 const steps:InclineStep[]=[];
 let geometryTarget:'angle'|'length'|'height'|undefined;
 const fail=(code:'geometry'|'speed'|'non-finite',fields:(keyof InclineInput)[]=[]):InclineResult=>({status:'invalid',code,fields});
 const fields:(keyof InclineInput)[]=[];
 if(mass!==undefined&&mass<=0)fields.push('mass');
 if(angle!==undefined&&(angle<0||angle>Math.PI/2))fields.push('angle');
 if(length!==undefined&&length<=0)fields.push('length');
 if(height!==undefined&&height<0)fields.push('height');
 if(input.endVelocity!==undefined&&input.endVelocity<0)fields.push('endVelocity');
 if(friction<0)fields.push('friction');if(gravity<=0)fields.push('gravity');
 if(fields.length)return {status:'invalid',code:'domain',fields};
 const sin=(x:number)=>x===Math.PI/2?1:Math.sin(x);
 const cos=(x:number)=>x===Math.PI/2?0:Math.cos(x);
 const factor=(x:number)=>x===Math.PI/2?1:x===0?(friction===0?0:-friction):Math.hypot(1,friction)*Math.sin(x-Math.atan(friction));
 const close=(x:number,y:number)=>Math.abs(x-y)<=1e-10*Math.max(Math.abs(x),Math.abs(y),Number.MIN_VALUE);
 const energyHeight=input.endVelocity===undefined?undefined:(input.endVelocity/Math.SQRT2/Math.sqrt(gravity))**2;
 if(energyHeight!==undefined&&(!Number.isFinite(energyHeight)||(input.endVelocity!==0&&energyHeight===0)))return fail('non-finite',['endVelocity']);
 for(let pass=0;pass<4;pass++){
  if(length!==undefined&&height!==undefined&&height>length)return fail('geometry',['length','height']);
  if(angle===undefined&&length!==undefined&&height!==undefined){angle=Math.asin(height/length);steps.push({field:'angle',method:'geometry'});geometryTarget??='angle';}
  if(angle!==undefined&&length!==undefined&&height===undefined){height=length*sin(angle);steps.push({field:'height',method:'geometry'});geometryTarget??='height';}
  if(angle!==undefined&&height!==undefined&&length===undefined&&angle>0){length=height/sin(angle);if(length<=0)return fail('geometry',['angle','height']);steps.push({field:'length',method:'geometry'});geometryTarget??='length';}
  if(energyHeight===undefined)continue;
  if(friction===0&&height===undefined){height=energyHeight;steps.push({field:'height',method:'energy'});}
  if(angle===undefined&&length!==undefined){
   const ratio=energyHeight/length/Math.hypot(1,friction);
   if(ratio>1+8*Number.EPSILON)return fail('speed',['endVelocity','length']);
   angle=Math.atan(friction)+Math.asin(Math.min(1,ratio));
   if(angle>Math.PI/2+8*Number.EPSILON)return fail('speed',['endVelocity','length']);
   angle=Math.min(Math.PI/2,angle);steps.push({field:'angle',method:'speed-length'});
  }
  if(angle!==undefined&&length===undefined){
   const slopeFactor=factor(angle);
   if(slopeFactor<=0&&energyHeight>0)return fail('speed',['endVelocity','angle','friction']);
   if(slopeFactor>0){length=energyHeight/slopeFactor;if(length<=0)return fail('speed',['endVelocity','angle']);steps.push({field:'length',method:'speed-angle'});}
  }
  if(angle===undefined&&length===undefined&&height!==undefined&&friction>0){
   let horizontal=(height-energyHeight)/friction;
   if(horizontal<0&&!close(height,energyHeight))return fail('speed',['endVelocity','height']);
   horizontal=Math.max(0,horizontal);length=Math.hypot(height,horizontal);
   if(length<=0)return fail('speed',['endVelocity','height']);steps.push({field:'length',method:'speed-height'});
  }
 }
 if([angle,length,height].some(value=>value!==undefined&&!Number.isFinite(value)))return fail('non-finite');
 if(angle===0&&height!==undefined&&height>0)return fail('geometry',['angle','height']);
 if(angle!==undefined&&length!==undefined&&height!==undefined&&Math.abs(height/length-sin(angle))>1e-12)return fail('geometry',['angle','length','height']);
 const acceleration=angle===undefined?undefined:gravity*factor(angle);
 const weight=mass===undefined?undefined:mass*gravity;
 const normal=weight===undefined||angle===undefined?undefined:weight*cos(angle);
 const parallel=weight===undefined||angle===undefined?undefined:weight*sin(angle);
 const frictionForce=normal===undefined?undefined:friction*normal;
 const net=parallel===undefined||frictionForce===undefined?undefined:parallel-frictionForce;
 if([acceleration,weight,normal,parallel,frictionForce,net].some(value=>value!==undefined&&!Number.isFinite(value))||(mass!==undefined&&weight===0))return fail('non-finite');
 let endVelocity:number|undefined;
 let motion:'reachable'|'stationary'|'no-start'|undefined;
 if(acceleration!==undefined&&length!==undefined){
  if(acceleration>0){endVelocity=Math.SQRT2*Math.sqrt(acceleration)*Math.sqrt(length);motion='reachable';}
  else if(acceleration===0&&friction===0){endVelocity=0;motion='stationary';}
  else motion='no-start';
 }else if(friction===0&&height!==undefined){endVelocity=Math.SQRT2*Math.sqrt(gravity)*Math.sqrt(height);motion=endVelocity===0?'stationary':'reachable';}
 if(endVelocity!==undefined&&!Number.isFinite(endVelocity))return fail('non-finite');
 if(input.endVelocity!==undefined&&((endVelocity!==undefined&&!close(input.endVelocity,endVelocity))||(motion==='no-start'&&input.endVelocity>0)))return fail('speed',['endVelocity','angle','length','height','friction']);
 if(angle===undefined&&height===undefined&&weight===undefined)return {status:'incomplete'};
 return {status:'success',mass,angle,length,height,friction,gravity,geometryTarget,steps,acceleration,weight,normal,parallel,frictionForce,net,endVelocity:endVelocity??input.endVelocity,enteredEndVelocity:input.endVelocity,motion,velocityCalculated:input.endVelocity===undefined&&endVelocity!==undefined};
}
