import type {ModelDefinition} from './model-types.ts';
import {unitGroups,unitNames,type QuantityKind} from '../physics/units.ts';
import type {RigidMode,Shape} from '../physics/mechanics/rigid-body.ts';
export interface RigidField {id:string;name:string;symbol:string;kind:QuantityKind}
const f=(id:string,name:string,symbol:string,kind:QuantityKind):RigidField=>({id,name,symbol,kind});
export const rigidFields:Record<RigidMode,RigidField[]>={
 energy:[f('I','Moment of inertia','I','inertia'),f('w','Angular velocity','\\omega','angularVelocity'),f('Er','Rotational kinetic energy','E_{rot}','energy'),f('m','Mass','m','mass'),f('v','Center-of-mass velocity','v_S','velocity'),f('Et','Translational kinetic energy','E_{trans}','energy'),f('E','Total kinetic energy','E_{kin}','energy')],
 momentum:[f('I','Moment of inertia','I','inertia'),f('w','Angular velocity','\\omega','angularVelocity'),f('L','Axial angular momentum','L_z','angularMomentum'),f('alpha','Angular acceleration','\\alpha','angularAcceleration'),f('M','Net axial torque','M_z','torque')],
 inertia:[f('m','Mass','m','mass'),f('R','Outer radius','R','length'),f('r','Inner radius','r','length'),f('l','Rod length','l','length'),f('a','First transverse side','a','length'),f('b','Second transverse side','b','length'),f('I0','Centroidal moment of inertia','I_0','inertia'),f('d','Parallel-axis distance','d','length'),f('IA','Shifted moment of inertia','I_A','inertia')]
};
export const rigidShapes:readonly {id:Shape;label:string}[]=[{id:'general',label:'Known centroidal inertia'},{id:'ring',label:'Thin ring / thin-walled cylinder'},{id:'cylinder',label:'Solid cylinder / disk'},{id:'tube',label:'Thick-walled hollow cylinder'},{id:'sphere',label:'Solid sphere'},{id:'shell',label:'Thin spherical shell'},{id:'cone',label:'Solid cone'},{id:'rod',label:'Thin rod'},{id:'cuboid',label:'Cuboid / rectangular plate'}];
export function fieldsForRigid(mode:RigidMode,shape:Shape):RigidField[] {return rigidFields[mode].filter(f=>mode!=='inertia'||['m','I0','d','IA',...(shape==='general'?[]:shape==='rod'?['l']:shape==='cuboid'?['a','b']:shape==='tube'?['R','r']:['R'])].includes(f.id));}
export const rigidAssumptions:Record<RigidMode,string>={
 energy:'Rigid body with constant mass. I is measured about the rotation axis through the center of mass. Translation and rotation are independent; rolling without slipping is not assumed. Squared velocities allow both signs.',
 momentum:'Constant positive moment of inertia, rotation about a fixed principal axis. Lz, angular velocity, net torque and angular acceleration are signed axial components. General three-dimensional gyroscopic motion requires a tensor and is not calculated here.',
 inertia:'Homogeneous ideal bodies. Rings, cylinders, spheres and cones rotate about their central symmetry axis; rods about a perpendicular axis through their center; cuboids about the central axis perpendicular to sides a and b. The shifted axis must be parallel to that centroidal axis. Distances are nonnegative; 0 ≤ inner radius < outer radius. Thin shells and rods neglect wall thickness.'
};
const baseRigidModels:readonly ModelDefinition[]=(['energy','momentum','inertia'] as const).map(mode=>({
 id:`rigid-${mode}`,topicId:'rotation',calculator:'resource',title:{energy:'Rigid-Body Energy',momentum:'Angular Momentum & Torque',inertia:'Moments of Inertia & Parallel-Axis Theorem'}[mode],
 variables:rigidFields[mode].map(f=>({name:f.name,symbol:f.symbol,unit:unitGroups[f.kind].si,unitName:unitNames[f.kind]??unitGroups[f.kind].si})),
 formulas:mode==='energy'?[
 {label:'Rotational kinetic energy',expression:'E_{rot}=\\frac12 I\\omega^2,\\qquad I=\\int r_\\perp^2\\,dm'},
 {label:'Translational kinetic energy',expression:'E_{trans}=\\frac12 mv_S^2'},
 {label:'Total kinetic energy',expression:'E_{kin}=E_{trans}+E_{rot}=\\frac12mv_S^2+\\frac12I\\omega^2'}
 ]:mode==='momentum'?[
 {label:'Axial angular momentum',expression:'L_z=I\\omega'},
 {label:'Net axial torque',expression:'M_z=I\\alpha=\\dot L_z'},
 {label:'Orbital and intrinsic angular momentum',expression:'\\vec L=\\vec r_S\\times m\\vec v_S+\\vec L_S'},
 {label:'Torque and angular momentum',expression:'\\vec M=\\frac{d\\vec L}{dt}'}
 ]:[
 {label:'Moment of inertia',expression:'I=\\int r_\\perp^2\\,dm=\\rho\\int r_\\perp^2\\,dV'},
 {label:'Thin ring / thin-walled cylinder',expression:'I_0=mR^2'},
 {label:'Solid cylinder / disk',expression:'I_0=\\frac12mR^2'},
 {label:'Thick-walled hollow cylinder',expression:'I_0=\\frac12m(R^2+r^2)'},
 {label:'Solid sphere',expression:'I_0=\\frac25mR^2'},
 {label:'Thin spherical shell',expression:'I_0=\\frac23mR^2'},
 {label:'Solid cone',expression:'I_0=\\frac3{10}mR^2'},
 {label:'Thin rod',expression:'I_0=\\frac1{12}ml^2,\\qquad I_{end}=I_0+m(l/2)^2=\\frac13ml^2'},
 {label:'Cuboid / rectangular plate',expression:'I_0=\\frac1{12}m(a^2+b^2)'},
 {label:'Parallel-axis theorem',expression:'I_A=I_0+md^2'}
 ],
 notes:[{text:rigidAssumptions[mode]},...(mode==='momentum'?[{text:'A torque perpendicular to angular momentum changes its direction. The rotating-chair experiment illustrates this vector relation; the axial calculator assumes a fixed principal axis.'}]:[]),...(mode==='inertia'?[{text:'For a rod rotating about its end, enter d = l/2. The axis distance is a separate input; no axis displacement is assumed.'},{text:'The mixed term vanishes because the first mass moment about the center of mass is zero.',expression:'I_A=\\int(r_\\perp^{\\prime 2}+2\\vec d\\cdot\\vec r_\\perp^{\\prime}+d^2)\\,dm=I_0+md^2'}]:[])],
 references:[{title:'OpenStax — physics reference',url:`https://openstax.org/books/university-physics-volume-1/pages/${mode==='energy'?'10-4-moment-of-inertia-and-rotational-kinetic-energy':mode==='momentum'?'11-2-angular-momentum':'10-5-calculating-moments-of-inertia'}`}]
}));

/** Different body geometries are independent accordion cards, not a many-way selector. */
export const rigidModels:readonly ModelDefinition[]=baseRigidModels.flatMap(model=>model.id!=='rigid-inertia'?[model]:rigidShapes.map(shape=>({...model,
 id:shape.id==='general'?model.id:`rigid-inertia-${shape.id}`,
 title:shape.id==='general'?'Parallel-Axis Theorem':shape.label,
 variables:fieldsForRigid('inertia',shape.id).map(f=>({name:f.name,symbol:f.symbol,unit:unitGroups[f.kind].si,unitName:unitNames[f.kind]??unitGroups[f.kind].si})),
 formulas:model.formulas.filter(f=>f.label==='Moment of inertia'||f.label==='Parallel-axis theorem'||f.label===shape.label),
 notes:model.notes?.filter(n=>!n.text.startsWith('For a rod')||shape.id==='rod')
})));
