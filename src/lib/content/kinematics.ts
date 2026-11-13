import {obliqueFields} from './oblique-throw.ts';
import type {ModelDefinition} from './model-types.ts';
import type {QuantityKind} from '../physics/units.ts';
import {kinematicsUi as text,calculatorUi,obliqueUi} from '../i18n/en.ts';
export type KinematicsModelId='accelerated-motion'|'vertical-throw'|'horizontal-throw'|'oblique-throw';
export interface KinematicField {id:string;symbol:string;name:string;kind:QuantityKind;defaultValue?:number}
export const kinematicFields:Record<KinematicsModelId,readonly KinematicField[]>={
 'accelerated-motion':[
  {id:'s0',symbol:'s₀',name:calculatorUi.initialPosition,kind:'length'},
  {id:'s',symbol:'s',name:calculatorUi.position,kind:'length'},
  {id:'v0',symbol:'v₀',name:text.initialVelocity,kind:'velocity'},
  {id:'v',symbol:'v₁',name:text.velocity,kind:'velocity'},
  {id:'a',symbol:'a',name:text.acceleration,kind:'acceleration'},
  {id:'t',symbol:'t',name:calculatorUi.time,kind:'time'}
 ],
 'vertical-throw':[
  {id:'y0',symbol:'y₀',name:text.launchHeight,kind:'length',defaultValue:0},
  {id:'v0',symbol:'v₀',name:text.initialVerticalVelocity,kind:'velocity'},
  {id:'g',symbol:'g',name:text.gravity,kind:'acceleration',defaultValue:9.81}
 ],
 'oblique-throw':[
  {id:'y0',symbol:'y₀',name:text.launchHeight,kind:'length',defaultValue:0},
  {id:'v0',symbol:'v₀',name:text.launchSpeed,kind:'velocity'},
  {id:'alpha',symbol:'α',name:text.launchAngle,kind:'angle'},
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
 variables:[{name:'initial position',symbol:'s₀',unit:'m',unitName:'meter'},{name:'position',symbol:'s',unit:'m',unitName:'meter'},{name:'initial velocity',symbol:'v₀',unit:'m/s',unitName:'meters per second'},{name:'final velocity',symbol:'v₁',unit:'m/s',unitName:'meters per second'},{name:'constant acceleration',symbol:'a',unit:'m/s²',unitName:'meters per second squared'},{name:'elapsed time',symbol:'t',unit:'s',unitName:'second'}],
 formulas:[
  {label:'Acceleration',expression:String.raw`a=\dot v=\ddot s=\mathrm{constant}`},
  {label:'Displacement',expression:String.raw`\Delta s=s-s_0`},
  {label:'Position',expression:String.raw`s=s_0+v_0t+\frac12at^2`},
  {label:'Without initial velocity: displacement',expression:String.raw`\Delta s=\frac{v_1t}{2}=\frac{at^2}{2}=\frac{v_1^2}{2a}`},
  {label:'Without initial velocity: final velocity',expression:String.raw`v_1=\frac{2\Delta s}{t}=\pm\sqrt{2a\Delta s}=at`},
  {label:'Without initial velocity: time',expression:String.raw`t=\frac{2\Delta s}{v_1}=\sqrt{\frac{2\Delta s}{a}}=\frac{v_1}{a}`},
  {label:'Without initial velocity: acceleration',expression:String.raw`a=\frac{v_1}{t}=\frac{2\Delta s}{t^2}=\frac{v_1^2}{2\Delta s}`},
  {label:'With initial velocity: displacement',expression:String.raw`\Delta s=\frac{v_0+v_1}{2}t=v_0t+\frac12at^2`},
  {label:'With initial velocity: final velocity',expression:String.raw`v_1=v_0+at,\quad v_1=\pm\sqrt{v_0^2+2a\Delta s}`},
  {label:'Initial velocity',expression:String.raw`v_0=v_1-at,\quad v_0=\pm\sqrt{v_1^2-2a\Delta s}`},
  {label:'With initial velocity: time',expression:String.raw`t=\frac{2\Delta s}{v_0+v_1}=\frac{v_1-v_0}{a}`},
  {label:'Quadratic time equation',expression:String.raw`t=\frac{-v_0\pm\sqrt{v_0^2+2a\Delta s}}{a},\quad t\geq0`},
  {label:'With initial velocity: acceleration',expression:String.raw`a=\frac{v_1-v_0}{t}=\frac{v_1^2-v_0^2}{2\Delta s}`},
  {label:'Integration',expression:String.raw`\Delta s=\int_0^t(v_0+a\tau)\,\mathrm d\tau`}
 ],
 notes:[{text:text.acceleratedAssumptions},{text:text.acceleratedInputHint},{text:'Formula coverage: Formelbuch, page 49. The book’s s denotes displacement, written Δs = s − s₀ here. v₁ is the final signed velocity. The formulas without initial velocity require v₀ = 0. Every displayed quotient requires a non-zero denominator; zero and degenerate cases are handled separately. Square roots require a non-negative radicand. Both velocity signs are considered and retained only when they satisfy the other inputs and t ≥ 0. Requires algebra, square roots and quadratic equations; the integral connects velocity to displacement.'}],references:[reference]},
 {id:'vertical-throw',topicId:'kinematics',calculator:'kinematics',title:'Vertical Throw',
 variables:[{name:'launch height above ground',symbol:'y₀',unit:'m',unitName:'meter'},{name:'initial vertical velocity (up is positive)',symbol:'v₀',unit:'m/s',unitName:'meters per second'},{name:'gravitational acceleration magnitude',symbol:'g',unit:'m/s²',unitName:'meters per second squared'}],
 formulas:[{label:'Height',expression:String.raw`y(t)=y_0+v_0t-\frac12gt^2`},{label:'Vertical velocity',expression:String.raw`v_y(t)=v_0-gt`},{label:'Time to ground',expression:String.raw`t_f=\frac{v_0+\sqrt{v_0^2+2gy_0}}{g}`},{label:'Highest point after launch',expression:String.raw`t_{peak}=\max(0,v_0/g),\quad y_{peak}=y_0+v_0t_{peak}-\frac12gt_{peak}^2`},{label:'Impact velocity',expression:String.raw`v_{impact}=-\sqrt{v_0^2+2gy_0}`}],
 notes:[{text:text.projectileAssumptions},{text:text.verticalConvention},{text:'Requires quadratic equations. Flight ends at the first future contact with y = 0. An upward launch from ground level returns after 2v₀/g; the launch instant is not counted as the landing. At ground level with v₀ ≤ 0 the flight duration is zero. A downward launch reaches its maximum height at launch, not at a fictitious earlier apex. Blank y₀ assumes 0 m, blank g assumes 9.81 m/s².'}],references:[reference]},
 {id:'horizontal-throw',topicId:'kinematics',calculator:'kinematics',title:'Horizontal Throw',
 variables:[{name:'launch height',symbol:'h',unit:'m',unitName:'meter'},{name:'signed horizontal velocity',symbol:'vₓ',unit:'m/s',unitName:'meters per second'},{name:'gravitational acceleration magnitude',symbol:'g',unit:'m/s²',unitName:'meters per second squared'}],
 formulas:[{label:'Horizontal coordinate',expression:String.raw`x(t)=v_xt`},{label:'Height',expression:String.raw`y(t)=h-\frac12gt^2`},{label:'Flight time',expression:String.raw`t_f=\sqrt{\frac{2h}{g}}`},{label:'Horizontal displacement',expression:String.raw`R=v_xt_f`},{label:'Trajectory (vₓ ≠ 0)',expression:String.raw`y(x)=h-\frac{g}{2v_x^2}x^2`},{label:'Impact speed',expression:String.raw`v_{impact}=\sqrt{v_x^2+(gt_f)^2}`}],
 notes:[{text:text.projectileAssumptions},{text:text.horizontalConvention},{text:'Requires algebra and square roots. Horizontal and vertical motions are independent. The initial vertical velocity is exactly zero; this is a horizontal launch, not an arbitrary oblique throw. At vₓ = 0 the trajectory is a vertical drop, and at h = 0 the flight duration and horizontal displacement are zero. Blank g assumes 9.81 m/s².'}],references:[{title:'OpenStax — Projectile Motion',url:'https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion'}]},
 {id:'oblique-throw',topicId:'kinematics',calculator:'kinematics',title:'Projectile Motion',searchTerms:['Oblique Throw','Schiefer Wurf'],
 variables:obliqueFields.map(field=>({name:field.name,symbol:field.symbol,unit:field.kind==='time'?'s':field.kind==='angle'?'rad':field.kind==='velocity'?'m/s':field.kind==='acceleration'?'m/s²':'m',unitName:field.kind==='time'?'second':field.kind==='angle'?'radian':field.kind==='velocity'?'meters per second':field.kind==='acceleration'?'meters per second squared':'meter'})),
 formulas:[
  {label:'Velocity components',expression:String.raw`v_x=v_0\cos\alpha,\quad v_{y0}=v_0\sin\alpha`},
  {label:'Horizontal coordinate',expression:String.raw`x(t)=v_xt`},
  {label:'Height',expression:String.raw`y(t)=y_0+v_{y0}t-\frac12gt^2`},
  {label:'Vertical velocity',expression:String.raw`v_y(t)=v_{y0}-gt`},
  {label:'Time to ground',expression:String.raw`t_f=\frac{v_{y0}+\sqrt{v_{y0}^2+2gy_0}}{g}`},
  {label:'Horizontal displacement',expression:String.raw`R=v_xt_f`},
  {label:'Highest point after launch',expression:String.raw`t_{peak}=v_{y0}/g,\quad y_{peak}=y_0+v_{y0}t_{peak}-\frac12gt_{peak}^2\quad(\alpha\ge0)`},
  {label:'Trajectory (vₓ ≠ 0)',expression:String.raw`y(x)=y_0+\frac{v_{y0}}{v_x}x-\frac{g}{2v_x^2}x^2`},
  {label:'Impact speed',expression:String.raw`v_{impact}=\sqrt{v_x^2+v_{y,impact}^2},\quad v_{y,impact}=-\sqrt{v_{y0}^2+2gy_0}`},
  {label:'Maximum rise above launch',expression:String.raw`h=y_{peak}-y_0=\frac{v_{y0}^2}{2g}\quad(\alpha\ge0)`},
  {label:'Equal-height range and flight time',expression:String.raw`R=\frac{v_0^2\sin(2\alpha)}{g},\qquad t_f=\frac{2v_0\sin\alpha}{g}\quad(y_0=0,\ v_{y0}>0)`}
 ],
 notes:[{text:text.projectileAssumptions},{text:text.obliqueConvention},{text:obliqueUi.theory}],
 references:[{title:'OpenStax — Projectile Motion',url:'https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion'}]}
];
