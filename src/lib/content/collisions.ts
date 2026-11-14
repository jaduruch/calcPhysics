import {momentumFields} from './momentum.ts';import type {ResourceField} from './resource-catalog.ts';import type {ModelDefinition} from './model-types.ts';import {unitGroups,unitNames} from '../physics/units.ts';
export const collisionFields:ResourceField[]=[...momentumFields,
 {id:'e',name:'coefficient of restitution',symbol:'e',kind:'dimensionless'},
 {id:'E0',name:'total kinetic energy before',symbol:'E_{kin,0}',kind:'energy'},
 {id:'E1',name:'total kinetic energy after',symbol:'E_{kin,1}',kind:'energy'},
 {id:'loss',name:'kinetic energy converted to internal energy',symbol:'E_{loss}',kind:'energy'}
];
export const elasticAssumption='Central nonrelativistic collision of two bodies with constant positive masses and no net external impulse. All velocities are signed components on one common axis in the same inertial frame. Momentum and kinetic energy are conserved. The collision branch reverses the relative velocity; passing through without interaction is not treated as a collision. The second body is not assumed to be initially at rest.';
export const inelasticAssumption='Central nonrelativistic collision with constant positive masses and no net external impulse. Momentum is conserved; lost kinetic energy becomes internal energy. Enter the coefficient of restitution e, or enough measurements to determine it. For 0 < e < 1 the collision is partially inelastic; e = 0 gives equal final velocities and the perfectly inelastic limit. e = 1 is the elastic boundary. No energy-releasing collisions, fragmentation or transverse motion are included.';
export const collisionModels:ModelDefinition[]=[true,false].map(elastic=>({id:elastic?'elastic-collision':'inelastic-collision',topicId:'momentum',calculator:'resource',title:elastic?'Elastic Collision':'Inelastic Collision',
 variables:collisionFields.filter(f=>!elastic||f.id!=='e').map(f=>({name:f.name,symbol:f.symbol,unit:unitGroups[f.kind].si,unitName:unitNames[f.kind]??unitGroups[f.kind].si})),
 searchTerms:['collision','restitution','impact','kinetic energy','recoil'],
 formulas:[
 {label:'Momentum balance',expression:String.raw`m_1v_1+m_2v_2=m_1v'_1+m_2v'_2=p_{tot}`},
 {label:'Individual momenta and changes',expression:String.raw`p_i=m_iv_i,\quad p'_i=m_iv'_i,\quad\Delta p_i=p'_i-p_i,\quad\Delta p_1=-\Delta p_2`},
 {label:'Relative velocities',expression:elastic?String.raw`v'_2-v'_1=v_1-v_2`:String.raw`v'_2-v'_1=e(v_1-v_2),\quad 0\le e\le1`},
 {label:'Final velocity of body 1',expression:elastic?String.raw`v'_1=\frac{(m_1-m_2)v_1+2m_2v_2}{m_1+m_2}`:String.raw`v'_1=\frac{(m_1-em_2)v_1+(1+e)m_2v_2}{m_1+m_2}`},
 {label:'Final velocity of body 2',expression:elastic?String.raw`v'_2=\frac{2m_1v_1+(m_2-m_1)v_2}{m_1+m_2}`:String.raw`v'_2=\frac{(1+e)m_1v_1+(m_2-em_1)v_2}{m_1+m_2}`},
 {label:'Kinetic energy before',expression:String.raw`E_{kin,0}=\frac12m_1v_1^2+\frac12m_2v_2^2`},
 {label:'Kinetic energy after',expression:String.raw`E_{kin,1}=\frac12m_1{v'_1}^2+\frac12m_2{v'_2}^2`},
 {label:'Energy converted to internal energy',expression:elastic?String.raw`E_{loss}=E_{kin,0}-E_{kin,1}=0`:String.raw`E_{loss}=E_{kin,0}-E_{kin,1}=\frac{m_1m_2}{2(m_1+m_2)}(1-e^2)(v_1-v_2)^2`},
 ...(!elastic?[{label:'Perfectly inelastic limit',expression:String.raw`e=0\quad\Rightarrow\quad v'_1=v'_2=\frac{m_1v_1+m_2v_2}{m_1+m_2}`}]:[])
 ],notes:[{text:elastic?elasticAssumption:inelasticAssumption},{text:'Energy measurements can leave two signed velocity branches. Every compatible discrete solution is shown; incomplete measurements do not define a unique collision. Equal initial velocities mean no relative approach, so restitution cannot be inferred from the velocity ratio. Diagram positions and sizes are schematic.'}]
}));
