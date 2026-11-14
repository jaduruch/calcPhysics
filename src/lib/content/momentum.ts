import type {ResourceField} from './resource-catalog.ts';
import type {ModelDefinition} from './model-types.ts';
import {unitGroups,unitNames} from '../physics/units.ts';
export const momentumFields:ResourceField[]=[
 {id:'m1',name:'mass of body 1',symbol:'m_1',kind:'mass'},{id:'m2',name:'mass of body 2',symbol:'m_2',kind:'mass'},
 {id:'v1',name:'velocity of body 1 before',symbol:'v_1',kind:'velocity'},{id:'v2',name:'velocity of body 2 before',symbol:'v_2',kind:'velocity'},
 {id:'w1',name:'velocity of body 1 after',symbol:"v'_1",kind:'velocity'},{id:'w2',name:'velocity of body 2 after',symbol:"v'_2",kind:'velocity'},
 {id:'p1',name:'momentum of body 1 before',symbol:'p_1',kind:'momentum'},{id:'p2',name:'momentum of body 2 before',symbol:'p_2',kind:'momentum'},
 {id:'q1',name:'momentum of body 1 after',symbol:"p'_1",kind:'momentum'},{id:'q2',name:'momentum of body 2 after',symbol:"p'_2",kind:'momentum'},
 {id:'dp1',name:'momentum change of body 1',symbol:String.raw`\Delta p_1`,kind:'momentum'},{id:'dp2',name:'momentum change of body 2',symbol:String.raw`\Delta p_2`,kind:'momentum'},
 {id:'P',name:'conserved total momentum',symbol:'p_{tot}',kind:'momentum'}
];
export const rocketFields:ResourceField[]=[
 {id:'M0',name:'initial rocket mass including propellant',symbol:'M_0',kind:'mass'},
 {id:'M',name:'current rocket mass including remaining propellant',symbol:'M',kind:'mass'},
 {id:'dm',name:'total expelled propellant mass',symbol:'m',kind:'mass'},
 {id:'u',name:'exhaust speed relative to the rocket',symbol:'u',kind:'velocity'},
 {id:'v0',name:'initial rocket velocity',symbol:'v_0',kind:'velocity'},
 {id:'v',name:'current rocket velocity',symbol:'v',kind:'velocity'},
 {id:'dv',name:'rocket velocity gain',symbol:String.raw`\Delta v`,kind:'velocity'},
 {id:'ratio',name:'initial to current mass ratio',symbol:'q',kind:'dimensionless'},
 {id:'flow',name:'instantaneous expelled mass flow rate',symbol:String.raw`\dot{m}`,kind:'massFlow'},
 {id:'F',name:'instantaneous thrust',symbol:'F',kind:'force'},
 {id:'a',name:'instantaneous rocket acceleration',symbol:'a',kind:'acceleration'},
 {id:'vg',name:'fresh exhaust velocity in the observer frame',symbol:'v_{gas}',kind:'velocity'}
];
export const momentumAssumption='Isolated two-body system with constant positive masses and no net external impulse. Signed velocities and momenta refer to one common inertial frame and one axis. The balance applies separately to each spatial component. Momentum conservation alone does not determine both final velocities and does not imply conservation of kinetic energy.';
export const rocketAssumption='Ideal nonrelativistic rocket, straight thrust direction, no external forces, gravity, drag or pressure-thrust correction. Exhaust speed u > 0 is constant relative to the rocket; positive direction is the thrust direction. M₀ ≥ M > 0 includes all remaining propellant, and m = M₀ − M ≥ 0 is already expelled mass. No initial velocity or mass flow is assumed. Thrust and acceleration use the instantaneous mass flow; no constant flow history or burn duration is assumed.';
const variables=(fields:ResourceField[])=>fields.map(f=>({name:f.name,symbol:f.symbol,unit:unitGroups[f.kind].si,unitName:unitNames[f.kind]??unitGroups[f.kind].si}));
export const momentumModels:ModelDefinition[]=[
 {id:'momentum-balance',topicId:'momentum',calculator:'resource',title:'Momentum Conservation',variables:variables(momentumFields),searchTerms:['recoil','collision','linear momentum'],formulas:[
 {label:'Linear momentum',expression:String.raw`\vec p=m\vec v`},
 {label:'Isolated system',expression:String.raw`\frac{d\vec p_{tot}}{dt}=\sum\vec F_{ext}=0\quad\Rightarrow\quad\vec p_{tot}=\mathrm{constant}`},
 {label:'Two-body balance',expression:String.raw`m_1v_1+m_2v_2=m_1v'_1+m_2v'_2=p_{tot}`},
 {label:'Equal and opposite momentum changes',expression:String.raw`\Delta p_1=p'_1-p_1=-(p'_2-p_2)=-\Delta p_2`}
 ],notes:[{text:momentumAssumption},{text:'For recoil from rest, enter both initial velocities as zero. Negative values indicate motion in the negative axis direction. An elastic collision additionally requires kinetic-energy conservation; this calculator does not assume elasticity.'}]},
 {id:'rocket-equation',topicId:'momentum',calculator:'resource',title:'Rocket Equation',variables:variables(rocketFields),searchTerms:['Tsiolkovsky','rocket propulsion','delta v','exhaust','thrust'],formulas:[
 {label:'Closed rocket and exhaust system',expression:String.raw`Mv\approx(M-dm)(v+dv)+dm(v-u)`},
 {label:'Differential momentum balance',expression:String.raw`M\,dv=u\,dm=-u\,dM`},
 {label:'Integrated rocket equation',expression:String.raw`\Delta v=v-v_0=-u\int_{M_0}^{M}\frac{dM'}{M'}=u\ln\frac{M_0}{M}`},
 {label:'Mass bookkeeping',expression:String.raw`M=M_0-m,\qquad q=\frac{M_0}{M}=\exp\left(\frac{\Delta v}{u}\right)`},
 {label:'Thrust and acceleration',expression:String.raw`F=u\dot m,\qquad \dot m=-\dot M\geq0,\qquad a=\frac{F}{M}`},
 {label:'Fresh exhaust in the observer frame',expression:String.raw`v_{gas}=v-u`},
 {label:'Velocity gain exceeds exhaust speed',expression:String.raw`\Delta v>u\iff q>\mathrm e`}
 ],notes:[{text:rocketAssumption},{text:'The rocket is an open subsystem: its own momentum is not conserved. Rocket plus all expelled gas is the closed system. The exhaust always moves backwards relative to the rocket, but freshly expelled gas can move forwards in the observer frame when v > u. The condition q > e gives Δv > u; it gives v > u only when v₀ = 0.'},{text:'Derivation: expand the momentum balance over an infinitesimal mass loss, discard the second-order product dm dv, and use dm = −dM. Integrating with constant u gives the logarithm. At zero mass loss, Δv = 0 and the exhaust speed cannot be inferred from the velocity gain.'}]}
];
