import {ellipsePoint,ellipsePointAtE} from '../physics/mechanics/kepler.ts';
export interface OrbitPoint{x:number;y:number;z:number}
export interface OrbitCamera{yaw:number;elevation:number}
export const defaultOrbitCamera:OrbitCamera={yaw:-.55,elevation:.55};
/** Normalised geometry matching Elipse3d: x²+y²=z², z=e x+p.
 * x,y,z are divided by a, so p/a=1-e². The orbital ellipse is the xy projection.
 */
export function orbitGeometry(e:number,phase:number,areaRatio:readonly[number,number]=[1,1]){
 const orbit=Array.from({length:193},(_,i)=>ellipsePointAtE(e,2*Math.PI*i/192));
 const cone=[...[-2,-1.5,-1,-.5,.5,1,1.5,2].map(z=>Array.from({length:65},(_,i)=>({x:Math.abs(z)*Math.cos(2*Math.PI*i/64),y:Math.abs(z)*Math.sin(2*Math.PI*i/64),z}))),...Array.from({length:12},(_,i)=>[-2,0,2].map(z=>({x:Math.abs(z)*Math.cos(2*Math.PI*i/12),y:Math.abs(z)*Math.sin(2*Math.PI*i/12),z})))];
 const plane=[[-2.1,-1.4],[2.1,-1.4],[2.1,1.4],[-2.1,1.4]].map(([x,y])=>({x,y,z:e*x+(1-e)*(1+e)}));
 const max=Math.max(...areaRatio),spans=areaRatio.map(value=>.12*value/max);
 const sectors=spans.map((span,index)=>[{x:0,y:0,z:0},...Array.from({length:65},(_,i)=>{const p=ellipsePoint(e,index*.5+span*i/64);return {...p,z:0};}),{x:0,y:0,z:0}]);
 return {orbit,cone,plane,sectors,position:ellipsePoint(e,phase),secondFocus:{x:2*e,y:0,z:0},spans};
}
export function orbitProjection(camera:OrbitCamera,section:boolean){
 const angle=section?camera:{yaw:0,elevation:Math.PI/2};
 const raw=(p:OrbitPoint)=>({x:Math.cos(angle.yaw)*p.x-Math.sin(angle.yaw)*p.y,y:Math.sin(angle.elevation)*(Math.sin(angle.yaw)*p.x+Math.cos(angle.yaw)*p.y)+Math.cos(angle.elevation)*p.z});
 // Fixed extents keep camera rotation and input changes visually stable.
 const scale=section?78:132,origin={x:320,y:section?245:230};
 return (p:OrbitPoint)=>{const q=raw(p);return {x:origin.x+scale*q.x,y:origin.y-scale*q.y};};
}
