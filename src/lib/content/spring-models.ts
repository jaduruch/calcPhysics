import type {ResourceField} from './resource-catalog.ts';
import type {ModelDefinition} from './model-types.ts';
import {springOscillatorRules} from '../physics/mechanics/spring-models.ts';
import {unitGroups,unitNames} from '../physics/units.ts';
import {resourceFormula} from '../calculators/resource-equations.ts';
export const springOscillatorFields:ResourceField[]=[
 {id:'m',name:'oscillating mass',symbol:'m',kind:'mass'},
 {id:'k',name:'spring constant',symbol:'k',kind:'springConstant'},
 {id:'T',name:'oscillation period',symbol:'T',kind:'time'},
 {id:'f',name:'oscillation frequency',symbol:'f',kind:'frequency'},
 {id:'omega',name:'angular frequency',symbol:String.raw`\omega`,kind:'angularVelocity'}
];
export const springOscillatorAssumption='Undamped linear oscillation of a point mass on a massless ideal spring, measured about equilibrium. The period is independent of amplitude. For a vertical spring, gravity shifts equilibrium but does not change the period. No spring mass, damping or nonlinear elasticity is included.';
export const springOscillatorModel:ModelDefinition={id:'spring-oscillator',topicId:'hookes-law',title:'Spring Oscillator',calculator:'resource',
 variables:springOscillatorFields.map(f=>({name:f.name,symbol:f.symbol,unit:unitGroups[f.kind].si,unitName:unitNames[f.kind]??unitGroups[f.kind].si})),
 formulas:springOscillatorRules.map(r=>({label:springOscillatorFields.find(f=>f.id===r.target)!.name,expression:`${springOscillatorFields.find(f=>f.id===r.target)!.symbol}=${resourceFormula(r.formula,springOscillatorFields)}`})),
 notes:[{text:springOscillatorAssumption},{text:'All quantities must be strictly positive. Supply mass and stiffness, or one timing quantity and either mass or stiffness. Timing quantities alone do not determine mass and stiffness separately.'}],
 references:[{title:'OpenStax — Simple Harmonic Motion',url:'https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion'}]
};

import {circularSpringRules} from '../physics/mechanics/spring-models.ts';
export const circularSpringFields:ResourceField[]=[
 {id:'m',name:'orbiting mass',symbol:'m',kind:'mass'}, {id:'k',name:'spring constant',symbol:'k',kind:'springConstant'},
 {id:'l',name:'unstretched spring length',symbol:'l_0',kind:'length'}, {id:'L',name:'rotating spring length',symbol:'L',kind:'length'},
 {id:'x',name:'spring extension during rotation',symbol:String.raw`\Delta L`,kind:'length'},
 {id:'omega',name:'angular speed magnitude',symbol:String.raw`|\omega|`,kind:'angularVelocity'},
 {id:'T',name:'orbital period',symbol:'T',kind:'time'}, {id:'f',name:'orbital frequency',symbol:'f',kind:'frequency'},
 {id:'alpha',name:'angle from the vertical',symbol:String.raw`\alpha`,kind:'angle'},
 {id:'R',name:'horizontal orbit radius',symbol:'R',kind:'length'}, {id:'v',name:'orbital speed',symbol:'v',kind:'velocity'},
 {id:'Fs',name:'spring tension magnitude',symbol:'F_s',kind:'force'}, {id:'Fg',name:'weight magnitude',symbol:'F_G',kind:'force'},
 {id:'Fc',name:'centripetal force magnitude',symbol:'F_c',kind:'force'}, {id:'g',name:'gravitational acceleration',symbol:'g',kind:'acceleration'}
];
export const circularSpringAssumption='Massless linear spring with a fixed upper end; a point mass moves uniformly in a horizontal circle. The angle is measured from the vertical. Spring tension balances weight vertically and supplies the centripetal force horizontally. All quantities are positive and 0 < α < 90°. A genuine circle requires spring tension greater than weight. The displayed angular speed is a magnitude; both rotation directions ±ω are possible. No damping or spring mass is included.';
export const circularSpringModel:ModelDefinition={id:'circular-spring-oscillator',topicId:'hookes-law',title:'Circling Spring Pendulum',calculator:'resource',
 variables:circularSpringFields.map(f=>({name:f.name,symbol:f.symbol,unit:unitGroups[f.kind].si,unitName:unitNames[f.kind]??unitGroups[f.kind].si})),
 formulas:circularSpringRules.map(r=>({label:circularSpringFields.find(f=>f.id===r.target)!.name,expression:`${circularSpringFields.find(f=>f.id===r.target)!.symbol}=${resourceFormula(r.formula,circularSpringFields)}`})),
 notes:[{text:circularSpringAssumption},{text:'Blank g assumes 9.81 m/s² only if gravity cannot be determined from the supplied values. No natural length, mass, stiffness or angle is assumed.'}],
 references:[{title:'OpenStax — Uniform Circular Motion',url:'https://openstax.org/books/university-physics-volume-1/pages/6-3-centripetal-force'}]
};
