import type {ModelDefinition} from './model-types.ts';
import type {QuantityKind} from '../physics/units.ts';
import {kinematicsUi as text,calculatorUi} from '../i18n/en.ts';
export type KinematicsModelId='accelerated-motion'|'vertical-throw'|'horizontal-throw';
export interface KinematicField {id:string;symbol:string;name:string;kind:QuantityKind;defaultValue?:number}
export const kinematicFields:Record<KinematicsModelId,readonly KinematicField[]>={
 'accelerated-motion':[
  {id:'s0',symbol:'s₀',name:calculatorUi.initialPosition,kind:'length'},
  {id:'s',symbol:'s',name:calculatorUi.position,kind:'length'},
  {id:'v0',symbol:'v₀',name:text.initialVelocity,kind:'velocity'},
  {id:'a',symbol:'a',name:text.acceleration,kind:'acceleration'},
  {id:'t',symbol:'t',name:calculatorUi.time,kind:'time'}
 ],
 'vertical-throw':[
  {id:'y0',symbol:'y₀',name:text.launchHeight,kind:'length',defaultValue:0},
  {id:'v0',symbol:'v₀',name:text.initialVerticalVelocity,kind:'velocity'},
  {id:'g',symbol:'g',name:text.gravity,kind:'acceleration',defaultValue:9.81}
 ],
 'horizontal-throw':[
  {id:'h',symbol:'h',name:text.launchHeight,kind:'length'},
  {id:'vx',symbol:'vₓ',name:text.horizontalVelocity,kind:'velocity'},
  {id:'g',symbol:'g',name:text.gravity,kind:'acceleration',defaultValue:9.81}
 ]
};
const reference={title:'OpenStax — Motion with Constant Acceleration',url:'https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration'};
export const kinematicModels:readonly ModelDefinition[]=[
 {id:'accelerated-motion',topicId:'kinematics',calculator:'kinematics',title:'Uniformly Accelerated Motion',
 variables:[{name:'initial position',symbol:'s₀',unit:'m',unitName:'meter'},{name:'position',symbol:'s',unit:'m',unitName:'meter'},{name:'initial velocity',symbol:'v₀',unit:'m/s',unitName:'meters per second'},{name:'constant acceleration',symbol:'a',unit:'m/s²',unitName:'meters per second squared'},{name:'elapsed time',symbol:'t',unit:'s',unitName:'second'}],
 formulas:[{label:'Acceleration',expression:String.raw`a=\dot v=\ddot s=\mathrm{constant}`},{label:'Velocity',expression:String.raw`v(t)=v_0+at`},{label:'Position',expression:String.raw`s(t)=s_0+v_0t+\frac12at^2`},{label:'Integration',expression:String.raw`s(t)-s_0=\int_0^t(v_0+a\tau)\,\mathrm d\tau`},{label:'Time equation',expression:String.raw`\frac12at^2+v_0t+(s_0-s)=0,\quad t\geq0`}],
 notes:[{text:text.acceleratedAssumptions},{text:'Requires algebra and quadratic equations; the integral connects velocity to displacement. Four known quantities determine the fifth. With three known quantities and a blank initial position, s₀ = 0 is explicitly assumed. A zero acceleration reduces to uniform motion. Time inversion may give two non-negative crossings of the same position; both are reported and either can be selected for the diagrams.'}],references:[reference]},
 {id:'vertical-throw',topicId:'kinematics',calculator:'kinematics',title:'Vertical Throw',
 variables:[{name:'launch height above ground',symbol:'y₀',unit:'m',unitName:'meter'},{name:'initial vertical velocity (up is positive)',symbol:'v₀',unit:'m/s',unitName:'meters per second'},{name:'gravitational acceleration magnitude',symbol:'g',unit:'m/s²',unitName:'meters per second squared'}],
 formulas:[{label:'Height',expression:String.raw`y(t)=y_0+v_0t-\frac12gt^2`},{label:'Vertical velocity',expression:String.raw`v_y(t)=v_0-gt`},{label:'Time to ground',expression:String.raw`t_f=\frac{v_0+\sqrt{v_0^2+2gy_0}}{g}`},{label:'Highest point after launch',expression:String.raw`t_{peak}=\max(0,v_0/g),\quad y_{peak}=y_0+v_0t_{peak}-\frac12gt_{peak}^2`},{label:'Impact velocity',expression:String.raw`v_{impact}=-\sqrt{v_0^2+2gy_0}`}],
 notes:[{text:text.projectileAssumptions},{text:text.verticalConvention},{text:'Requires quadratic equations. Flight ends at the first future contact with y = 0. An upward launch from ground level returns after 2v₀/g; the launch instant is not counted as the landing. At ground level with v₀ ≤ 0 the flight duration is zero. A downward launch reaches its maximum height at launch, not at a fictitious earlier apex. Blank y₀ assumes 0 m, blank g assumes 9.81 m/s².'}],references:[reference]},
 {id:'horizontal-throw',topicId:'kinematics',calculator:'kinematics',title:'Horizontal Throw',
 variables:[{name:'launch height',symbol:'h',unit:'m',unitName:'meter'},{name:'signed horizontal velocity',symbol:'vₓ',unit:'m/s',unitName:'meters per second'},{name:'gravitational acceleration magnitude',symbol:'g',unit:'m/s²',unitName:'meters per second squared'}],
 formulas:[{label:'Horizontal coordinate',expression:String.raw`x(t)=v_xt`},{label:'Height',expression:String.raw`y(t)=h-\frac12gt^2`},{label:'Flight time',expression:String.raw`t_f=\sqrt{\frac{2h}{g}}`},{label:'Horizontal displacement',expression:String.raw`R=v_xt_f`},{label:'Trajectory (vₓ ≠ 0)',expression:String.raw`y(x)=h-\frac{g}{2v_x^2}x^2`},{label:'Impact speed',expression:String.raw`v_{impact}=\sqrt{v_x^2+(gt_f)^2}`}],
 notes:[{text:text.projectileAssumptions},{text:text.horizontalConvention},{text:'Requires algebra and square roots. Horizontal and vertical motions are independent. The initial vertical velocity is exactly zero; this is a horizontal launch, not an arbitrary oblique throw. At vₓ = 0 the trajectory is a vertical drop, and at h = 0 the flight duration and horizontal displacement are zero. Blank g assumes 9.81 m/s².'}],references:[{title:'OpenStax — Projectile Motion',url:'https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion'}]}
];
