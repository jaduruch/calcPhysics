import {combinedDirectRules,combinedExtraRelations} from '../physics/resources/combined-extra.ts';
import {resourceDefinitions,type ResourceField} from './resource-catalog.ts';
import {resourcePhysics} from '../physics/resources/models.ts';
import {divide,product} from '../physics/resources/solver.ts';
import {inclusiveComponentPhysics,type CombinedRelation} from '../physics/resources/combined.ts';
export interface CombinedSpec {title:string;members:string[];maps?:Record<string,Record<string,string>>;sources?:string[]}
export const combinedSpecs:readonly CombinedSpec[]=[
 {title:'Mechanical Work',members:['book-work-force','book-acceleration-distance-work'],sources:['book-work-force','book-acceleration-distance-work','book-force']},
 {title:'Frictional Work',members:['book-friction-work','book-horizontal-friction-work']},
 {title:'Potential Energy',members:['book-potential-energy','book-weight-energy'],sources:['book-potential-energy','book-weight-energy','book-weight']},
 {title:'Kinetic Energy',members:['book-kinetic-energy','book-kinetic-weight'],sources:['book-kinetic-energy','book-kinetic-weight','book-weight']},
 {title:'Mechanical Power',members:['book-power-time','book-mechanical-power','book-power-force-distance'],sources:['book-power-time','book-mechanical-power','book-power-force-distance','book-work-force']},
 {title:'Solid Volume Expansion',members:['solid-volume-expansion','book-total-volume-expansion','book-additive-volume-expansion','book-expansion-coefficients'],maps:{'book-total-volume-expansion':{co:'beta',z0:'V0'},'book-additive-volume-expansion':{z0:'V0',dz:'dV'}}},
 {title:'Liquid Volume Expansion & Density',members:['liquid-volume-expansion','expanded-density'],sources:['liquid-volume-expansion','expanded-density','book-total-volume-expansion','book-additive-volume-expansion'],maps:{'book-total-volume-expansion':{co:'beta',z0:'V0'},'book-additive-volume-expansion':{z0:'V0',dz:'dV'}}},
 {title:'Thermal Conduction',members:['book-conduction-rate','book-conduction-heat','book-layer-conductance'],sources:['book-conduction-rate','book-conduction-heat','book-layer-conductance','book-heat-rate']},
 {title:'Overall Heat Transfer',members:['book-overall-heat','book-overall-coefficient']},

 {title:'Free Fall',members:['book-free-fall-height','book-free-fall-speed','book-average-fall-speed','book-free-fall-speed-time']},
 {title:'Velocity Components',members:['book-speed-components','book-launch-cos','book-launch-sin'],maps:{'book-launch-cos':{v0:'v'},'book-launch-sin':{v0:'v'}}},
 {title:'Ideal Pulleys',members:['book-pulley-force','book-pulley-distance']},
 {title:'Rotation, Frequency & Period',members:['book-angular-frequency','book-rotation-period','book-angular-period','book-rotation-count']},
 {title:'Angular & Tangential Motion',members:['book-angular-motion','book-arc-length','book-tangential-speed','book-angular-path']},
 {title:'Circular Speed & Period',members:['book-tangential-period','book-tangential-frequency'],sources:['book-tangential-period','book-tangential-frequency','book-rotation-period']},
 {title:'Constant Angular Acceleration',members:['book-angular-velocity','book-angular-average','book-angular-displacement','book-angular-energy']},
 {title:'Angular Acceleration from Rest',members:['book-angular-acceleration-rest','book-angular-rest-position','book-angular-rest-average','book-angular-rest-energy-angle','book-angular-rest-energy-revolutions']},
 {title:'Hydrostatic Pressure',members:['hydrostatic-pressure','book-hydrostatic','book-hydrostatic-mass']},
 {title:'Surface Tension',members:['book-surface-energy','book-surface-force']},
 {title:'Volume Flow & Continuity',members:['volume-flow','continuity','book-volume-rate','book-flow-speed'],maps:{continuity:{A1:'A',v1:'v'}}},
 {title:'Linear Expansion',members:['linear-expansion','book-total-length-expansion','book-additive-length-expansion'],maps:{'book-total-length-expansion':{z0:'l0',co:'alpha'},'book-additive-length-expansion':{z0:'l0',dz:'dl'}}},
 {title:'Area Expansion',members:['area-expansion','book-total-area-expansion','book-additive-area-expansion'],maps:{'book-total-area-expansion':{z0:'A0',co:'alpha'},'book-additive-area-expansion':{z0:'A0',dz:'dA'}}},
 {title:'Heat & Heat Capacity',members:['heat-capacity','sensible-heat','book-heat-capacity-quantity']},
 {title:'Thermal Mixing',members:['thermal-mixing','book-thermal-mixing'],sources:['book-thermal-mixing']},
 {title:'Fuel Energy',members:['fuel-energy','fuel-volume']},
 {title:'Thin-Lens Imaging',members:['book-thin-lens','book-image-magnification','book-image-size']},
 {title:'Real-Image Size Ratios',members:['book-real-image-ratio','book-magnification-focal-image','book-magnification-focal-object','book-real-magnification-distance','book-image-focal-sizes'],maps:{'book-real-image-ratio':{},'book-real-magnification-distance':{m:'ratio'},'book-magnification-focal-image':{m:'ratio'},'book-magnification-focal-object':{m:'ratio'}}},
 {title:'Lens Extension & Exposure',members:['book-image-extension','book-extension-magnification','book-bellows-factor']},
 {title:'Vibrating Strings',members:['string-speed','string-fundamental']},
 {title:'Luminous Flux, Energy & Solid Angle',members:['book-luminous-flux','book-luminous-energy','book-solid-angle']},
 {title:'Luminance',members:['book-luminance-area','book-luminance-solid']},
 {title:'Optical Power & Transmission',members:['book-fiber-ratio','book-fiber-db']}
];
export function combinedDefinition(id:string){
 const spec=combinedSpecs.find(s=>s.members[0]===id);if(!spec)return null;
 const fields:ResourceField[]=[],relations:CombinedRelation[]=[];
 for(const source of spec.sources??spec.members){
  const definition=resourceDefinitions.find(d=>d.id===source)!,keys=spec.maps?.[source]??{};
  const rename=(formula:string)=>formula.replace(/\[\[(\w+)\]\]/g,(_,key:string)=>`[[${keys[key]??key}]]`);
  for(const field of definition.fields){const key=keys[field.id]??field.id;if(!fields.some(f=>f.id===key))fields.push({...field,id:key});}
  relations.push({id:source,unavailable:source==='book-fiber-db'?{field:'P2',value:0,targets:['L']}:undefined,physics:source==='book-fiber-db'?{...resourcePhysics[source],domains:{...resourcePhysics[source].domains,P2:'nonnegative'}}:source==='book-launch-cos'?inclusiveComponentPhysics(resourcePhysics[source],'x'):source==='book-launch-sin'?inclusiveComponentPhysics(resourcePhysics[source],'y'):resourcePhysics[source],keys,formulas:Object.fromEntries(Object.entries(definition.rules).map(([key,value])=>[key,rename(value)]))});
 }
 relations.push(...combinedExtraRelations(id));
 if(id==='fuel-energy'){
  fields.splice(0,fields.length,...['Q','rho','V','m','H'].map(key=>fields.find(f=>f.id===key)!));
  relations.push({id:'fuel-density',keys:{},physics:{domains:{m:'nonnegative',rho:'positive',V:'nonnegative'},primary:['m','rho','V'],inverse:{m:v=>product(v.rho,v.V),rho:v=>divide(v.m,v.V),V:v=>divide(v.m,v.rho)},balance:v=>[v.m,product(v.rho,v.V)]},formulas:{m:'[[rho]]\\cdot[[V]]',rho:'\\frac{[[m]]}{[[V]]}',V:'\\frac{[[m]]}{[[rho]]}'}});
 }
 return {id,title:spec.title,fields,relations,members:spec.members,zeros:[...(id==='fuel-energy'?[{source:'m',target:'Q',formula:'\\left.mH\\right|_{m=[[m]]}'},{source:'Q',target:'m',formula:'\\left.Q/H\\right|_{Q=[[Q]]}'},{source:'m',target:'V',formula:'\\left.m/\\rho\\right|_{m=[[m]]}'},{source:'V',target:'m',formula:'\\left.\\rho V\\right|_{V=[[V]]}'}]:id==='book-speed-components'?[{source:'v',target:'vx',formula:'0'},{source:'v',target:'vy',formula:'0'},{source:'alpha',target:'vy',formula:'0'},{source:'alpha',when:Math.PI/2,target:'vx',formula:'0'}]:[]),...combinedDirectRules(id)],assumptions:id==='book-speed-components'?['Velocity components are magnitudes for 0 ≤ α ≤ π/2. Horizontal and vertical directions are included; zero speed does not determine the angle.']:[...new Set((spec.sources??spec.members).map(source=>resourceDefinitions.find(d=>d.id===source)!.assumption))]};
}
