/** Newtonian bound two-body motion; a is the semi-major axis of relative separation. */
import {ModelFailure,divide,type ResourcePhysics} from '../resources/solver.ts';
export const GRAVITATIONAL_CONSTANT=6.67430e-11;
function positiveExp(value:number):number{const result=Math.exp(value);if(!Number.isFinite(result)||result===0)throw new ModelFailure('numerical');return result;}
export function ellipseGeometry(a:number,e:number){
 if(!Number.isFinite(a)||a<=0||!Number.isFinite(e)||e<0||e>=1)throw new ModelFailure('no-solution');
 const b=a*Math.sqrt((1-e)*(1+e)),c=a*e,p=(a*(1-e))*(1+e),rp=a*(1-e),ra=a*(1+e),area=Math.PI*a*b;
 if(![b,c,p,rp,ra,area].every(Number.isFinite)||b===0||p===0||rp===0||area===0)throw new ModelFailure('numerical');
 return {a,b,e,c,p,rp,ra,area};
}
export function orbitalPeriod(a:number,totalMass:number):number{return positiveExp(Math.log(2*Math.PI)+1.5*Math.log(a)-.5*(Math.log(GRAVITATIONAL_CONSTANT)+Math.log(totalMass)));}
export function orbitalAxis(period:number,totalMass:number):number{return positiveExp((2*(Math.log(period)-Math.log(2*Math.PI))+Math.log(GRAVITATIONAL_CONSTANT)+Math.log(totalMass))/3);}
export function orbitalMass(a:number,period:number):number{return positiveExp(2*Math.log(2*Math.PI)+3*Math.log(a)-Math.log(GRAVITATIONAL_CONSTANT)-2*Math.log(period));}
/** Solve E-e sin E = M by a monotone bracket, including high eccentricity.
 * Mean anomaly advances uniformly with time; eccentric anomaly does not.
 */
export function eccentricAnomaly(mean:number,e:number):number{
 if(!Number.isFinite(mean)||!Number.isFinite(e)||e<0||e>=1)throw new ModelFailure('no-solution');
 const turn=2*Math.PI,remainder=mean%turn,m=remainder<0?remainder+turn:remainder;
 if(e===0||m===0)return m;
 let lo=0,hi=Math.min(turn,m/(1-e));
 const meanAt=(E:number)=>{const square=E*E;const difference=E<.1?E*square*(1/6-square/120+square*square/5040-square**3/362880+square**4/39916800):E-Math.sin(E);return (1-e)*E+e*difference;};
 for(let i=0;i<64;i++){const mid=(lo+hi)/2;if(meanAt(mid)<m)lo=mid;else hi=mid;}
 return (lo+hi)/2;
}
/** Same orientation as the supplied Desmos model: periapsis lies on -x. */
export function ellipsePoint(e:number,fraction:number){
 return ellipsePointAtE(e,eccentricAnomaly(2*Math.PI*fraction,e));
}
export function ellipsePointAtE(e:number,E:number){
 if(!Number.isFinite(e)||e<0||e>=1||!Number.isFinite(E))throw new ModelFailure('no-solution');
 const x=e-Math.cos(E),y=Math.sqrt((1-e)*(1+e))*Math.sin(E),r=1-e*Math.cos(E);
 return {x,y,z:r,E,r};
}
export function sweptArea(a:number,e:number,meanInterval:number):number{return ellipseGeometry(a,e).area*meanInterval/(2*Math.PI);}
export const keplerPhysics:Record<string,ResourcePhysics>={
 'kepler-ellipse':{domains:{a:'positive',b:'positive',e:'eccentricity'},primary:['a','b','e'],inverse:{a:v=>divide(v.b,Math.sqrt((1-v.e)*(1+v.e))),b:v=>v.a*Math.sqrt((1-v.e)*(1+v.e)),e:v=>{const q=divide(v.b,v.a);if(q>1)throw new ModelFailure('no-solution');return Math.sqrt((1-q)*(1+q));}},balance:v=>[v.b/v.a,Math.sqrt((1-v.e)*(1+v.e))],valid:v=>v.b<=v.a,derive:v=>ellipseGeometry(v.a,v.e)},
 'kepler-areas':{domains:{A1:'positive',t1:'positive',A2:'positive',t2:'positive'},primary:['A1','t1','A2','t2'],inverse:{A1:v=>v.A2*divide(v.t1,v.t2),t1:v=>v.t2*divide(v.A1,v.A2),A2:v=>v.A1*divide(v.t2,v.t1),t2:v=>v.t1*divide(v.A2,v.A1)},derive:v=>({rate:divide(v.A1,v.t1)})},
 'kepler-period':{domains:{T:'positive',a:'positive',M:'positive'},primary:['T','a','M'],inverse:{T:v=>orbitalPeriod(v.a,v.M),a:v=>orbitalAxis(v.T,v.M),M:v=>orbitalMass(v.a,v.T)}}
};
