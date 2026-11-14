import test from 'node:test';import assert from 'node:assert/strict';import katex from 'katex';
import {keplerPhysics,ellipseGeometry,orbitalPeriod,orbitalAxis,orbitalMass,eccentricAnomaly,ellipsePoint,ellipsePointAtE,sweptArea,GRAVITATIONAL_CONSTANT as G} from '../src/lib/physics/mechanics/kepler.ts';
import {keplerDefinitions} from '../src/lib/content/kepler.ts';
import {solveResourceModel} from '../src/lib/physics/resources/solver.ts';
import {resourceEquations} from '../src/lib/calculators/resource-equations.ts';
import {models,topics} from '../src/lib/content/topics.ts';
import {orbitGeometry,orbitProjection,defaultOrbitCamera} from '../src/lib/visualization/kepler.ts';
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const examples={'kepler-ellipse':{a:5,b:4,e:.6},'kepler-areas':{A1:6,t1:2,A2:12,t2:4},'kepler-period':{T:1,a:1,M:4*Math.PI*Math.PI/G}};
for(const d of keplerDefinitions)test(`${d.id}: reference, all inverses, numeric substitutions and theory`,()=>{
 const p=keplerPhysics[d.id],full=examples[d.id];assert.equal(solveResourceModel(p,full).status,'success');
 assert.equal(solveResourceModel(p,{}).status,'incomplete');
 for(const key of p.primary){const input={...full};delete input[key];const snapshot={...input};const r=solveResourceModel(p,input);assert.equal(r.status,'success',key);near(r.values[key],full[key]);assert.deepEqual(input,snapshot);
 for(const eq of resourceEquations(d,r,{}).equations)katex.renderToString(eq.expression,{throwOnError:true});
 for(const bad of [NaN,Infinity,-Infinity,-1])assert.equal(solveResourceModel(p,{...full,[key]:bad}).status,'invalid');
 }
 const model=models.find(model=>model.id===d.id);assert.ok(model);for(const eq of model.formulas)katex.renderToString(eq.expression,{throwOnError:true});
 assert.ok(topics.some(topic=>topic.id===d.topic&&topic.published));
});
test('ellipse geometry, circular limit and excluded parabolic/hyperbolic cases',()=>{
 const r=ellipseGeometry(5,.6);near(r.b,4);near(r.c,3);near(r.p,3.2);near(r.rp,2);near(r.ra,8);near(r.area,20*Math.PI);
 const circle=solveResourceModel(keplerPhysics['kepler-ellipse'],{a:5,b:5});assert.equal(circle.status,'success');assert.equal(circle.values.e,0);near(circle.outputs.area,25*Math.PI);
 assert.equal(solveResourceModel(keplerPhysics['kepler-ellipse'],{a:4,b:5}).status,'no-solution');
 for(const e of [1,1.4,-.1])assert.equal(solveResourceModel(keplerPhysics['kepler-ellipse'],{a:5,e}).status,'invalid');
 assert.equal(solveResourceModel(keplerPhysics['kepler-ellipse'],{a:5,b:4,e:.2}).status,'conflict');
 assert.equal(solveResourceModel(keplerPhysics['kepler-ellipse'],{a:1e308,e:.5}).status,'numerical');
});
test('Kepler equation: circular and highly eccentric roots, modulo and residual',()=>{
 for(const e of [0,.624,.99,.999999999])for(const m of [0,1e-8,.1,1,Math.PI,6.1]){const E=eccentricAnomaly(m,e);near(E-e*Math.sin(E),m,2e-12);}
 near(eccentricAnomaly(2*Math.PI+1,.6),eccentricAnomaly(1,.6));
 const peri=ellipsePoint(.6,0),apo=ellipsePoint(.6,.5);near(peri.r,.4);near(apo.r,1.6);near(peri.x,.4);near(apo.x,-1.6);
});
test('Desmos cone/plane intersection projects to the same focus-centred ellipse',()=>{
 for(const e of [0,.624,.99])for(let i=0;i<=100;i++){
  const p=ellipsePointAtE(e,2*Math.PI*i/100);near(p.x*p.x+p.y*p.y,p.z*p.z);near(p.z,-e*p.x+(1-e)*(1+e));
  near((p.x+e)**2+p.y*p.y/(1-e*e),1);near(Math.hypot(p.x,p.y)+Math.hypot(p.x+2*e,p.y),2);
 }
});
test('equal time intervals sweep equal areas and imply faster motion at periapsis',()=>{
 const e=.624,dt=.001,peri0=ellipsePoint(e,0),peri1=ellipsePoint(e,dt),apo0=ellipsePoint(e,.5),apo1=ellipsePoint(e,.5+dt);
 assert.ok(Math.hypot(peri1.x-peri0.x,peri1.y-peri0.y)>Math.hypot(apo1.x-apo0.x,apo1.y-apo0.y));
 near(sweptArea(5,e,.1),sweptArea(5,e,2*.05));
 const s=orbitGeometry(e,.2,[2,1]);near(s.spans[0]/s.spans[1],2);
 assert.equal(solveResourceModel(keplerPhysics['kepler-areas'],{A1:6,t1:2,A2:12,t2:2}).status,'conflict');
});
test('period scaling, inverse mass/axis and Earth–Sun reference',()=>{
 const a=149597870700,M=1.98847e30,T=orbitalPeriod(a,M);near(T/86400,365.2513758455,1e-8);
 near(orbitalAxis(T,M),a);near(orbitalMass(a,T),M);near(orbitalPeriod(4*a,M)/T,8);near(orbitalPeriod(a,4*M)/T,.5);
});
test('3D geometry stays finite for all eccentricities and supported camera extremes',()=>{
 for(const e of [0,.624,.999999])for(const camera of [defaultOrbitCamera,{yaw:0,elevation:1.35},{yaw:8,elevation:-1.35}]){
  const s=orbitGeometry(e,.5),project=orbitProjection(camera,true);
  for(const p of [...s.orbit,...s.plane,...s.cone.flat()]){const q=project(p);assert.ok(Number.isFinite(q.x)&&Number.isFinite(q.y));assert.ok(q.x>=0&&q.x<=640&&q.y>=0&&q.y<=470);}
 }
});

test('high-eccentricity phase near periapsis preserves small positive anomalies',()=>{
 const e=1-Number.EPSILON,m=1e-22,E=eccentricAnomaly(m,e),square=E*E;
 const independentMean=(1-e)*E+e*E*square*(1/6-square/120+square*square/5040);
 assert.ok(E>0);assert.ok(Math.abs(independentMean-m)<m*1e-12);
 const tiny=eccentricAnomaly(1e-100,.9);assert.ok(tiny>0);assert.ok(Math.abs(tiny-1e-99)<1e-111);
});

import {orbitTimeInterval,meanAnomalyFromE} from '../src/lib/physics/mechanics/kepler.ts';
test('time interval spans wrap-around and complete periods with uniform swept-area fractions',()=>{
 for(const e of [0,.533,.9,.999999])for(const phase of [0,.12,.99,1])for(const interval of [0,.12,.8,1]){
  const time=orbitTimeInterval(e,phase,interval);near(time.startPhase,phase-interval);near(time.areaFraction,interval);near(meanAnomalyFromE(time.E1,e),time.M1);near(meanAnomalyFromE(time.E0,e),time.M0);
  near(time.current.x,ellipsePoint(e,phase).x);near(time.start.y,ellipsePoint(e,phase-interval).y);
  assert.ok([time.E1,time.E0,time.phi1,time.phi0,...time.sector.flatMap(p=>[p.x,p.y,p.z])].every(Number.isFinite));
  assert.equal(time.sector.length,interval===0?0:130);
 }
 for(const interval of [-.1,1.1,Infinity])assert.throws(()=>orbitTimeInterval(.5,.2,interval));
});
test('updated positive-x construction matches the supplied graph and displays epsilon',()=>{
 const epsilon=.533,p=3.15,a=p/(1-epsilon*epsilon),b=a*Math.sqrt(1-epsilon*epsilon);
 const geometry=ellipseGeometry(a,epsilon);near(geometry.p,p);near(geometry.b,b);
 for(const phase of [0,.13,.5,.9]){const point=ellipsePoint(epsilon,phase);near(a*point.z,-epsilon*a*point.x+p);near(Math.hypot(a*point.x,a*point.y),a*point.r);}
 const model=models.find(m=>m.id==='kepler-ellipse');assert.equal(model.variables.find(v=>v.name==='orbital eccentricity').symbol,String.raw`\varepsilon`);
 assert.ok(model.formulas.some(f=>f.expression.includes(String.raw`z=-\varepsilon x+p`)));
});
