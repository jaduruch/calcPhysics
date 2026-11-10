import { resourceDefinitions } from './resource-catalog.ts';
import { resourcePhysics } from '../physics/resources/models.ts';
import { unitGroups, unitNames } from '../physics/units.ts';
import { resourceFormula, resourceDisplaySymbol } from '../calculators/resource-equations.ts';
import type { ModelDefinition } from './model-types.ts';
const references:Record<string,string>={
 'fluid-statics':'https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure',
 'fluid-flow':'https://openstax.org/books/university-physics-volume-1/pages/14-5-fluid-dynamics',
 'ideal-gases':'https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas',
 'temperature':'https://openstax.org/books/university-physics-volume-2/pages/1-2-thermometers-and-temperature-scales',
 'thermal-expansion':'https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion',
 'heat-and-calorimetry':'https://openstax.org/books/university-physics-volume-2/pages/1-4-heat-transfer-specific-heat-and-calorimetry',
 'fuels-and-heating':'https://openstax.org/books/university-physics-volume-2/pages/1-4-heat-transfer-specific-heat-and-calorimetry',
 'heat-transfer':'https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer',
 'optical-imaging':'https://openstax.org/books/university-physics-volume-3/pages/2-summary',
 'refraction':'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction',
 'parallel-plates':'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction',
 'prisms':'https://openstax.org/books/university-physics-volume-3/pages/1-5-dispersion',
 'wave-propagation':'https://openstax.org/books/university-physics-volume-1/pages/16-summary',
 'sound-sources':'https://openstax.org/books/university-physics-volume-1/pages/17-4-normal-modes-of-a-standing-sound-wave',
 'interference':'https://openstax.org/books/university-physics-volume-1/pages/17-6-beats',
 'sound-levels':'https://openstax.org/books/university-physics-volume-1/pages/17-3-sound-intensity'
};
const domains={positive:'> 0',nonnegative:'≥ 0',real:'finite real',nonzero:'≠ 0',incidence:'0 ≤ angle < π/2 rad',acute:'0 < angle < π/2 rad',index:'≥ 1'};
export const resourceModels:readonly ModelDefinition[]=resourceDefinitions.map(definition=>{
 const physics=resourcePhysics[definition.id];
 const expressions=[...Object.entries(definition.rules).map(([key,formula])=>({label:definition.fields.find(field=>field.id===key)!.name,expression:`${definition.fields.find(field=>field.id===key)!.symbol}=${resourceFormula(formula,definition.fields)}`})),...definition.outputs.map(output=>({label:output.name,expression:`${output.symbol}=${resourceFormula(output.formula,[...definition.fields,...definition.outputs])}`}))];
 return {id:definition.id,topicId:definition.topic,calculator:'resource',title:definition.title,
 variables:[...definition.fields,...definition.outputs].map(field=>{
 const unit:string='unit' in field&&typeof field.unit==='string'?field.unit:unitGroups[field.kind].si;
 return {name:field.name,symbol:resourceDisplaySymbol(field.symbol),unit,unitName:unit==='°C'?'degrees Celsius':unit==='°F'?'degrees Fahrenheit':unitNames[field.kind]??unit};
 }),
 formulas:expressions,
 notes:[{text:definition.assumption},{text:'Prerequisites: algebra and SI unit conversion'+(['parallel-plate','prism-deviation'].includes(definition.id)?', including trigonometry and inverse sine.':'.')},{text:'Input domains: '+definition.fields.map(field=>`${field.name}: ${domains[physics.domains[field.id]]}`).join('; ')+'.'}],
 references:[{title:'OpenStax — physics reference',url:definition.reference??references[definition.topic]}]};
});
