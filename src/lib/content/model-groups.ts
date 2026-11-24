import {combinedSpecs,combinedDefinition} from './combined-models.ts';
import {unitGroups,unitNames} from '../physics/units.ts';
import {resourceFormula} from '../calculators/resource-equations.ts';
import type { ModelDefinition } from './model-types.ts';
/** Explicit calculator families, preserved source aliases and genuine binary configurations. */
const legacyGroups: readonly { topic: string; title: string; members: readonly string[]; integrated?: boolean }[] = [
  {"topic": "kinematics", "title": "Free Fall", "members": ["book-free-fall-height", "book-free-fall-speed", "book-average-fall-speed", "book-free-fall-speed-time"]},
  {"topic": "kinematics", "title": "Projectile Motion", "integrated": true, "members": ["oblique-throw", "book-oblique-flight-time", "book-oblique-range", "book-oblique-apex-height", "book-oblique-trajectory", "book-oblique-vertical-velocity", "book-oblique-apex-time", "vertical-throw", "book-vertical-position", "book-vertical-velocity", "book-projectile-energy", "book-maximum-height", "book-vertical-apex-time", "horizontal-throw", "book-horizontal-trajectory", "book-falling-direction", "book-horizontal-speed-time", "book-falling-direction-depth"]},
  {"topic": "kinematics", "title": "Velocity Components", "members": ["book-speed-components", "book-launch-cos", "book-launch-sin"]},
  {"topic": "dynamics", "title": "Inclined Plane", "integrated": true, "members": ["inclined-plane", "book-slope-geometry", "book-normal-force", "book-slope-component", "book-slope-raising", "book-slope-lowering", "book-slope-acceleration"]},
  {"topic": "dynamics", "title": "Ideal Pulleys", "members": ["book-pulley-force", "book-pulley-distance"]},
  {"topic": "rotation", "title": "Rotation, Frequency & Period", "members": ["book-revolutions", "book-angular-frequency", "book-rotation-period", "book-angular-period", "book-rotation-count"]},
  {"topic": "rotation", "title": "Angular & Tangential Motion", "members": ["book-angular-motion", "book-arc-length", "book-tangential-speed", "book-angular-path", "book-tangential-period", "book-tangential-frequency"]},
  {"topic": "rotation", "title": "Constant Angular Acceleration", "members": ["book-angular-velocity", "book-angular-average", "book-angular-displacement", "book-angular-energy"]},
  {"topic": "rotation", "title": "Angular Acceleration from Rest", "members": ["book-angular-acceleration-rest", "book-angular-rest-position", "book-angular-rest-average", "book-angular-rest-energy-angle", "book-angular-rest-energy-revolutions"]},
  {"topic": "work-energy", "title": "Work & Friction", "members": ["book-work-force", "book-friction-work", "book-horizontal-friction-work", "book-acceleration-distance-work"]},
  {"topic": "work-energy", "title": "Potential Energy", "members": ["book-potential-energy", "book-weight-energy", "book-incline-work"]},
  {"topic": "work-energy", "title": "Kinetic Energy & Acceleration", "members": ["book-kinetic-energy", "book-kinetic-weight", "book-acceleration-work"]},
  {"topic": "work-energy", "title": "Power", "members": ["book-power-time", "book-mechanical-power", "book-rotational-power", "book-electrical-power", "book-power-force-distance"]},
  {"topic": "fluid-statics", "title": "Pressure & Reference Pressure", "members": ["contact-pressure", "book-static-pressure", "book-gauge-pressure", "book-underpressure"]},
  {"topic": "fluid-statics", "title": "Hydrostatic Pressure", "members": ["hydrostatic-pressure", "book-hydrostatic", "book-hydrostatic-mass"]},
  {"topic": "fluid-statics", "title": "Density & Buoyancy", "members": ["mass-density", "book-buoyancy", "book-net-buoyancy"]},
  {"topic": "fluid-statics", "title": "Surface Tension", "members": ["book-surface-energy", "book-surface-force"]},
  {"topic": "fluid-flow", "title": "Volume Flow & Continuity", "members": ["volume-flow", "continuity", "book-volume-rate", "book-flow-speed"]},
  {"topic": "fluid-flow", "title": "Pressure & Flow Energy", "members": ["book-dynamic-pressure", "book-bernoulli"]},
  {"topic": "fluid-flow", "title": "Viscous Flow", "members": ["book-reynolds", "book-poiseuille"]},
  {"topic": "fluid-flow", "title": "Drag Forces", "members": ["book-stokes-radius", "book-stokes-diameter", "book-drag"]},
  {"topic": "ideal-gases", "title": "Ideal Gas Equation", "members": ["ideal-gas", "book-mass-gas"]},
  {"topic": "ideal-gases", "title": "Gas State Changes", "members": ["boyle-law", "book-combined-gas", "book-isobaric-gas", "book-isochoric-gas"]},
  {"topic": "thermal-expansion", "title": "Linear Expansion", "members": ["linear-expansion", "book-total-length-expansion", "book-additive-length-expansion"]},
  {"topic": "thermal-expansion", "title": "Area Expansion", "members": ["area-expansion", "book-total-area-expansion", "book-additive-area-expansion"]},
  {"topic": "thermal-expansion", "title": "Volume Expansion & Density", "members": ["solid-volume-expansion", "liquid-volume-expansion", "expanded-density", "book-total-volume-expansion", "book-additive-volume-expansion", "book-expansion-coefficients"]},
  {"topic": "heat-and-calorimetry", "title": "Heat & Heat Capacity", "members": ["heat-capacity", "sensible-heat", "book-heat-capacity-quantity"]},
  {"topic": "heat-and-calorimetry", "title": "Thermal Mixing", "members": ["thermal-mixing", "book-thermal-mixing", "book-equal-heat-mixing"]},
  {"topic": "fuels-and-heating", "title": "Fuel Energy", "members": ["fuel-energy", "fuel-volume"]},
  {"topic": "heat-transfer", "title": "Heat Transfer Rate & Transport", "members": ["book-heat-rate", "book-advected-heat", "book-solar-projection"]},
  {"topic": "heat-transfer", "title": "Thermal Conduction", "members": ["thermal-resistance", "book-conduction-rate", "book-conduction-heat", "book-layer-conductance"]},
  {"topic": "heat-transfer", "title": "Surface & Overall Heat Transfer", "members": ["book-convection-heat", "book-overall-heat", "book-overall-coefficient"]},
  {"topic": "optical-imaging", "title": "Focal Length & Optical Power", "members": ["mirror-focus", "lens-power"]},
  {"topic": "optical-imaging", "title": "Lens Imaging & Magnification", "members": ["book-thin-lens", "book-image-magnification", "book-image-size", "book-real-image-ratio", "book-magnification-focal-image", "book-magnification-focal-object", "book-real-magnification-distance", "book-image-focal-sizes"]},
  {"topic": "optical-imaging", "title": "Lens Extension & Exposure", "members": ["book-image-extension", "book-extension-magnification", "book-bellows-factor"]},
  {"topic": "refraction", "title": "Refraction & Phase Speed", "members": ["optical-medium", "snell-refraction", "book-snell", "book-speed-refraction"]},
  {"topic": "refraction", "title": "Critical Angle", "members": ["book-critical-index", "book-critical-speed"]},
  {"topic": "sound-sources", "title": "Vibrating Strings", "members": ["string-speed", "string-fundamental"]},
  {"topic": "sound-sources", "title": "Open & Closed Pipes", "members": ["open-pipe", "closed-pipe"]},
  {"topic": "sound-levels", "title": "Sound Level & Intensity", "members": ["sound-pressure-level", "sound-intensity"]},
  {"topic": "photometry", "title": "Luminous Flux, Energy & Solid Angle", "members": ["book-luminous-flux", "book-luminous-energy", "book-solid-angle"]},
  {"topic": "photometry", "title": "Illuminance", "members": ["book-illuminance-area", "book-inverse-square-light", "book-oblique-illuminance", "book-light-distance-comparison"]},
  {"topic": "photometry", "title": "Luminance", "members": ["book-luminance-area", "book-luminance-solid"]},
  {"topic": "fiber-optics", "title": "Optical Power & Transmission", "members": ["book-fiber-ratio", "book-fiber-db", "book-fiber-dbm"]},
  {"topic": "alternating-current", "title": "Waveforms & RMS", "members": ["sine-signal", "triangle-rms", "square-rms", "pwm"]},
  {"topic": "resonant-circuits", "title": "RLC Resonator", "members": ["series-rlc", "parallel-rlc"]},
  {"topic": "filters", "title": "RC Filters", "members": ["rc-high-pass", "rc-low-pass"]},
  {"topic": "filters", "title": "RL Filters", "members": ["rl-high-pass", "rl-low-pass"]},
  {"topic": "three-phase", "title": "Star & Delta Connections", "members": ["star-system", "delta-system"]},
];

const combinedMembers=new Set(combinedSpecs.flatMap(s=>s.members));
export const modelGroups = [
 ...legacyGroups.map(g=>({...g,members:g.members.filter(id=>!combinedMembers.has(id))})).filter(g=>g.members.length>1),
 ...combinedSpecs.map(s=>({topic:legacyGroups.find(g=>g.members.includes(s.members[0]))!.topic,title:s.title,members:s.members,integrated:true}))
];
const binaryVariants=new Set(['series-rlc','rc-high-pass','rl-high-pass','star-system','open-pipe']);

export function groupTopicModels(models: readonly ModelDefinition[]): ModelDefinition[] {
  const applicable = modelGroups.filter(group => group.members.some(id => models.some(model => model.id === id)));
  const byMember = new Map(applicable.flatMap(group => group.members.map(id => [id, group] as const)));
  const emitted = new Set<string>();
  return models.flatMap(model => {
    const group = byMember.get(model.id);
    if (!group) return [model];
    if (emitted.has(group.members[0])) return [];
    emitted.add(group.members[0]);
    const members = group.members.map(id => models.find(item => item.id === id)).filter((item): item is ModelDefinition => !!item);
    if (members.length < 2) return members;
    const combined=combinedDefinition(members[0].id);
    if(combined) return [{...members[0],title:combined.title,combinedId:combined.id,integratedModels:members,
      variables:combined.fields.map(f=>({name:f.name,symbol:f.symbol,unit:unitGroups[f.kind].si,unitName:unitNames[f.kind]??unitGroups[f.kind].si})),
      formulas:combined.relations.flatMap(r=>Object.entries(r.formulas).map(([key,formula])=>{const f=combined.fields.find(f=>f.id===(r.keys[key]??key))!;return {label:f.name,expression:`${f.symbol}=${resourceFormula(formula,combined.fields)}`};})),
      notes:combined.id==='book-speed-components'?combined.assumptions.map(text=>({text})):members.flatMap(m=>m.notes??[]).filter((n,i,a)=>a.findIndex(x=>x.text===n.text&&x.expression===n.expression)===i),
      references:members.flatMap(m=>m.references??[]).filter((r,i,a)=>a.findIndex(x=>x.url===r.url)===i)}];
    if (group.integrated) return [{...members[0],integratedModels:members}];
    if(members.length!==2||!binaryVariants.has(members[0].id))return members;
    return [{ ...members[0], title: group.title, variants: members.map(member => ({ model: member, label: member.title })) }];
  });
}

/** A stable original model ID also addresses variants inside a grouped card. */
export function linkedModelIndex(model: ModelDefinition, hash: string): number | null {
  let target: string;
  try { target = decodeURIComponent(hash.replace(/^#/, '')); } catch { return null; }
  if(model.integratedModels?.some(source=>`model-${source.id}`===target))return 0;
  const variants = model.variants?.map(variant => variant.model) ?? [model];
  const index = variants.findIndex(variant => `model-${variant.id}` === target);
  return index < 0 ? null : index;
}
