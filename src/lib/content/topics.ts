import {disclaimer} from './disclaimer.ts';
import {about} from './about.ts';
import {calculatorHelp} from './calculator-help.ts';
import {springOscillatorModel,circularSpringModel} from './spring-models.ts';
import { kinematicModels } from './kinematics.ts';
import { resourceModels } from './resource-models.ts';
import { totalReflectionModel } from './optics.ts';
import { dopplerModel } from './waves.ts';
import { qubitModel } from './quantum.ts';
import { electricalModels } from './electricity.ts';
import type { ModelDefinition } from './model-types.ts';
import { ui, inclinedPlaneUi } from '../i18n/en.ts';

export interface Topic {
  id: string;
  parentId: string | null;
  path: string;
  title: string;
  description: string;
  navigationTitle?: string;
  references?: readonly { title: string; url: string }[];
  symbol: string;
  published: boolean;
  kind?: 'guide' | 'info';
  seo?: { title: string; description: string };
}
export const topics: readonly Topic[] = [
  {id:'disclaimer',parentId:null,path:'/disclaimer',title:disclaimer.title,description:disclaimer.description,symbol:'i',published:true,kind:'info',seo:{title:'Disclaimer | calcPhysics',description:disclaimer.description}},
  {id:'about',parentId:null,path:'/about',title:about.title,description:about.description,symbol:'i',published:true,kind:'info',seo:{title:'About calcPhysics',description:about.description}},
  {id:'calculator-help',parentId:null,path:'/calculator-help',title:calculatorHelp.title,navigationTitle:'Input help',description:calculatorHelp.description,symbol:'?',published:true,kind:'guide',seo:{title:'Calculator Input Help | calcPhysics',description:calculatorHelp.description}},
  {id:'hookes-law',parentId:'mechanics',path:'/mechanics/hookes-law',title:'Hooke’s Law',description:'Calculate spring restoring force, spring constant and signed extension or compression with Hooke’s law.',symbol:'01.8',published:true},
  {id:'keplers-laws',parentId:'mechanics',path:'/mechanics/keplers-laws',title:'Kepler’s Laws',description:'Explore elliptical orbits, equal swept areas and orbital periods with inverse calculators and a rotating 3D cone-section model.',symbol:'01.7',published:true},
  {id:'rotation',parentId:'mechanics',path:'/mechanics/rotation',title:'Rotation',description:'Angular displacement, circular motion, constant angular acceleration and inverse relations.',symbol:'01.5',published:true},
  {id:'work-energy',parentId:'mechanics',path:'/mechanics/work-and-energy',title:'Work, Energy & Power',description:'Work, kinetic and potential energy, frictional dissipation and translational, rotational and electrical power.',symbol:'01.6',published:true},
  {id:'photometry',parentId:'optics',path:'/optics/photometry',title:'Light & Photometry',description:'Luminous intensity, flux, energy, illuminance, luminance and solid angles.',symbol:'05.6',published:true},
  {id:'fiber-optics',parentId:'optics',path:'/optics/fiber-optics',title:'Fiber Optics',description:'Optical power transmission ratios, signed decibel gain and absolute power levels in dBm.',symbol:'05.7',published:true},
  {"id": "fluid-statics", "parentId": "mechanics", "path": "/mechanics/fluid-statics", "title": "Fluid Statics", "description": "Pressure, hydraulic force transmission, hydrostatic pressure and density.", "symbol": "01.3", "published": true},
  {"id": "fluid-flow", "parentId": "mechanics", "path": "/mechanics/fluid-flow", "title": "Fluid Flow", "description": "Transported volume and the continuity equation for steady incompressible flow.", "symbol": "01.4", "published": true},
  {"id": "temperature", "parentId": "thermodynamics", "path": "/thermodynamics/temperature", "title": "Temperature", "description": "Kelvin, Celsius, Fahrenheit, Rankine and Réaumur temperature scales and temperature intervals.", "symbol": "02.2", "published": true},
  {"id": "thermal-expansion", "parentId": "thermodynamics", "path": "/thermodynamics/thermal-expansion", "title": "Thermal Expansion", "description": "Linear, area and volume expansion, and density changes at fixed mass.", "symbol": "02.3", "published": true},
  {"id": "heat-and-calorimetry", "parentId": "thermodynamics", "path": "/thermodynamics/heat-and-calorimetry", "title": "Heat & Calorimetry", "description": "Heat capacity, sensible heat and thermal equilibrium of two bodies.", "symbol": "02.4", "published": true},
  {"id": "fuels-and-heating", "parentId": "thermodynamics", "path": "/thermodynamics/fuels-and-heating", "title": "Fuels & Heating", "description": "Mass-specific heating value and the energy released by fuel mass or volume.", "symbol": "02.5", "published": true},
  {"id": "heat-transfer", "parentId": "thermodynamics", "path": "/thermodynamics/heat-transfer", "title": "Heat Transfer", "description": "Temperature differences and steady heat flow through thermal resistance.", "symbol": "02.6", "published": true},
  {"id": "optical-imaging", "parentId": "optics", "path": "/optics/optical-imaging", "title": "Mirrors & Lenses", "description": "Signed focal length, spherical mirror curvature and thin-lens optical power.", "symbol": "05.2", "published": true},
  {"id": "refraction", "parentId": "optics", "path": "/optics/refraction", "title": "Refraction", "description": "Refractive index, phase speed and Snell’s law at a transparent interface.", "symbol": "05.3", "published": true},
  {"id": "parallel-plates", "parentId": "optics", "path": "/optics/parallel-plates", "title": "Parallel Plates", "description": "Refraction through a parallel-sided plate, lateral displacement and apparent depth.", "symbol": "05.4", "published": true},
  {"id": "prisms", "parentId": "optics", "path": "/optics/prisms", "title": "Prisms", "description": "Refraction at two prism faces, emergence, deviation and internal reflection.", "symbol": "05.5", "published": true},
  {"id": "wave-propagation", "parentId": "waves", "path": "/oscillations-and-waves/wave-propagation", "title": "Wave Propagation", "description": "Wave speed, wavelength, frequency and period in a uniform medium.", "symbol": "04.2", "published": true},
  {"id": "sound-sources", "parentId": "waves", "path": "/oscillations-and-waves/sound-sources", "title": "Sound Sources", "description": "Wave speed on a taut string and fundamental resonances of strings and pipes.", "symbol": "04.3", "published": true},
  {"id": "interference", "parentId": "waves", "path": "/oscillations-and-waves/interference", "title": "Interference & Beats", "description": "Two-tone superposition, mean frequency, amplitude envelope and audible beats.", "symbol": "04.4", "published": true},
  {"id": "sound-levels", "parentId": "waves", "path": "/oscillations-and-waves/sound-levels", "title": "Sound Levels", "description": "RMS sound pressure level and the relation between sound power, intensity and area.", "symbol": "04.5", "published": true},
  {"id": "direct-current", "parentId": "electromagnetism", "path": "/electromagnetism/direct-current", "title": "Direct Current", "description": "Ohm’s law, electrical power, loaded and unloaded voltage dividers, resistor networks and star–delta conversion.", "symbol": "03.1", "published": true},
  {"id": "alternating-current", "parentId": "electromagnetism", "path": "/electromagnetism/alternating-current", "title": "Alternating Current", "description": "Calculate and visualize sine, triangle, rectangle and pulse-width-modulated voltage waveforms.", "symbol": "03.2", "published": true},
  {"id": "magnetism", "parentId": "electromagnetism", "path": "/electromagnetism/magnetism", "title": "Magnetism", "description": "Linear magnetic circuits, flux, field strength, reluctance and Faraday’s law.", "symbol": "03.3", "published": true},
  {"id": "capacitors", "parentId": "electromagnetism", "path": "/electromagnetism/capacitors", "title": "Capacitors", "description": "Charge, stored energy, plate geometry, electric fields, AC circuits and RC transients.", "symbol": "03.4", "published": true},
  {"id": "inductors", "parentId": "electromagnetism", "path": "/electromagnetism/inductors", "title": "Inductors", "description": "Inductance, magnetic energy, transformers, induced EMF, AC circuits and RL transients.", "symbol": "03.5", "published": true},
  {"id": "resonant-circuits", "parentId": "electromagnetism", "path": "/electromagnetism/resonant-circuits", "title": "Resonant Circuits", "description": "Series and parallel RLC resonance, quality factor, bandwidth and frequency-dependent impedance.", "symbol": "03.6", "published": true},
  {"id": "gain-and-attenuation", "parentId": "electromagnetism", "path": "/electromagnetism/gain-and-attenuation", "title": "Gain & Attenuation", "description": "Voltage, current and power ratios expressed as gain and attenuation in decibels.", "symbol": "03.7", "published": true},
  {"id": "filters", "parentId": "electromagnetism", "path": "/electromagnetism/filters", "title": "Filters", "description": "Unloaded RC and RL high-pass and low-pass filters, cutoff frequency, gain and output phase.", "symbol": "03.8", "published": true},
  {"id": "three-phase", "parentId": "electromagnetism", "path": "/electromagnetism/three-phase", "title": "Three-Phase Systems", "description": "Balanced star and delta connections, three-phase power and generator phase voltages separated by 120 electrical degrees.", "symbol": "03.9", "published": true},
  { id: 'si-reference', parentId: null, path: '/si-units-and-constants', title: 'SI Units & Physical Constants', navigationTitle: 'Units', description: 'Explore the seven SI base units, all 22 derived units with special names, useful unit relationships and key physical constants.', symbol: 'SI', published: true, seo: { title: 'SI Units, Derived Units & Physical Constants | calcPhysics', description: 'Reference tables for SI base units, all 22 named derived units, unit equations and physical constants, with exact definitions and measurement uncertainties.' } },
  { id: 'mechanics', parentId: null, path: '/mechanics', title: 'Mechanics', seo: { title: 'Mechanics: Motion, Forces & Fluids | calcPhysics', description: 'Explore motion, forces, fluid statics and steady flow with physics calculators, SI conversions and clear calculation steps.' }, description: 'Calculate motion, forces, pressure and fluid flow. Explore kinematics, dynamics, fluid statics and continuity with unit conversions, formulas and models.', symbol: '01', published: true },
  { id: 'thermodynamics', parentId: null, path: '/thermodynamics', title: 'Thermodynamics', description: 'Explore temperature scales, thermal expansion, heat capacity, mixing, heating values, heat transfer and ideal-gas processes.', symbol: '02', published: true },
  { id: 'ideal-gases', parentId: 'thermodynamics', path: '/thermodynamics/ideal-gases', title: 'Ideal Gases', description: 'Use the ideal gas law to calculate absolute pressure, volume, amount of substance or temperature. Follow SI conversions and calculation steps for a gas in thermodynamic equilibrium.', symbol: '02.1', published: true, seo: { title: 'Ideal Gas Law Calculator & Theory | calcPhysics', description: 'Calculate pressure, volume, amount of substance or temperature with pV = nRT. Convert pressure and volume units and follow the ideal gas law calculation steps.' } },
  { id: 'electromagnetism', parentId: null, path: '/electromagnetism', title: 'Electricity & Magnetism', description: 'Explore DC and AC circuits, transformers, magnetic fields, capacitors, inductors, resonance, filters and three-phase systems. Calculate with SI units, formulas and circuit diagrams.', symbol: '03', published: true },
  { id: 'waves', parentId: null, path: '/oscillations-and-waves', title: 'Oscillations & Waves', description: 'Explore travelling waves, strings, pipe resonances, interference, beats, sound levels and the acoustic Doppler effect.', symbol: '04', published: true },
  { id: 'doppler-effect', parentId: 'waves', path: '/oscillations-and-waves/doppler-effect', title: 'Doppler Effect', description: 'Calculate emitted or observed sound frequency and source or observer velocity. Follow SI conversions and explore wavefronts for collinear subsonic motion in a stationary medium.', symbol: '04.1', published: true, seo: { title: 'Doppler Effect Calculator & Sound Wavefronts | calcPhysics', description: 'Calculate acoustic Doppler shifts, emitted or observed frequency and source or observer velocity. Includes formulas, SI conversions and animated sound wavefronts.' } },
  { id: 'optics', parentId: null, path: '/optics', title: 'Optics', description: 'Explore refractive index, mirrors and lenses, transparent plates, prisms and total internal reflection with physics calculators.', symbol: '05', published: true },
  { id: 'total-internal-reflection', parentId: 'optics', path: '/optics/total-internal-reflection', title: 'Total Internal Reflection', description: 'Calculate the critical angle from refractive indices, test an incidence angle and follow reflected and refracted rays across an optical interface.', symbol: '05.1', published: true, seo: { title: 'Total Internal Reflection & Critical Angle Calculator | calcPhysics', description: 'Calculate the critical angle, distinguish refraction from total internal reflection and visualize ray paths with Snell’s law and step-by-step formulas.' } },
  { id: 'modern-physics', parentId: null, path: '/modern-physics', title: 'Modern Physics', description: 'Explore quantum phenomena, starting with single-qubit states, quantum gates and the Bloch sphere.', symbol: '06', published: true },
  { id: 'quantum', parentId: 'modern-physics', path: '/modern-physics/quantum', title: 'Quantum', description: 'Simulate a single qubit with quantum gates, explore complex amplitudes and measurement probabilities, and follow state rotations on an interactive 3D Bloch sphere.', symbol: '06.1', published: true, seo: { title: 'Qubit Simulator & 3D Bloch Sphere | calcPhysics', description: 'Explore X, Y, Z, square-root, Hadamard, rotation and U gates with a single-qubit simulator, state amplitudes, probabilities and an animated 3D Bloch sphere.' } },
  { id: 'kinematics', parentId: 'mechanics', path: '/mechanics/kinematics', title: 'Kinematics', seo: { title: 'Uniform Motion Calculator, Acceleration & Throws | calcPhysics', description: 'Calculate uniform and accelerated motion, vertical, horizontal and oblique throws with SI conversions, calculation steps and motion diagrams.' }, description: 'Explore uniform and uniformly accelerated motion, vertical, horizontal and oblique throws. Calculate positions, velocities, flight times and trajectories with unit conversions and motion diagrams.', symbol: '01.1', published: true },
  { id: 'dynamics', parentId: 'mechanics', path: '/mechanics/dynamics', title: 'Dynamics', description: 'Calculate forces, gravity, kinetic friction and ideal pulleys. On an inclined plane, solve geometry, acceleration and speed without mass; add mass for force components.', symbol: '01.2', published: true, seo: { title: 'Inclined Plane Calculator & Dynamics Theory | calcPhysics', description: 'Calculate weight, normal force, downhill force, kinetic friction and acceleration on an inclined plane. Includes SI conversions, formulas and a force diagram.' } }
];
export const models: readonly ModelDefinition[] = [
  ...electricalModels,
  ...resourceModels.filter(model=>!model.id.startsWith('book-')),
  springOscillatorModel,circularSpringModel,
  qubitModel,
  dopplerModel,
  totalReflectionModel,
  { ...totalReflectionModel, id: 'snell-refraction', topicId: 'refraction', title: 'Snell’s Law' },
  {
    id: 'ideal-gas', topicId: 'ideal-gases', calculator: 'ideal-gas', title: 'Ideal Gas Law',
    variables: [
      { name: 'absolute pressure', symbol: 'p', unit: 'Pa', unitName: 'pascal' },
      { name: 'volume', symbol: 'V', unit: 'm³', unitName: 'cubic meter' },
      { name: 'amount of substance', symbol: 'n', unit: 'mol', unitName: 'mole' },
      { name: 'absolute temperature', symbol: 'T', unit: 'K', unitName: 'kelvin' }
    ],
    formulas: [
      { label: 'Equation of state', expression: String.raw`p V = n R T` },
      { label: 'Molar gas constant (exact)', expression: String.raw`R = N_A k_B = 8.31446261815324\,\mathrm{J\,mol^{-1}\,K^{-1}}` }
    ],
    notes: [{ text: 'Requires algebra and SI unit conversion. The gas is in thermodynamic equilibrium. Particles have negligible volume and no intermolecular interactions. Real gases approach this model at low density, away from condensation.' }, { text: 'Use absolute pressure, not gauge pressure, and temperature in kelvin. All four quantities must be strictly positive. The equation describes a state; it does not specify a heating or expansion process.' }],
    references: [{ title: 'OpenStax — Molecular Model of an Ideal Gas', url: 'https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas' }]
  },
  {
    id: 'uniform-motion', topicId: 'kinematics', calculator: 'uniform-motion', title: 'Uniform Motion',
    notes: [{ text: ui.velocityDerivative, expression: String.raw`v(t) = \dot{s}(t) = \mathrm{constant}` }],
    variables: [
      { name: 'position', symbol: 's', unit: 'm', unitName: 'meter' },
      { name: 'initial position', symbol: 's₀', unit: 'm', unitName: 'meter' },
      { name: 'velocity', symbol: 'v', unit: 'm/s', unitName: 'meters per second' },
      { name: 'time', symbol: 't', unit: 's', unitName: 'seconds' }
    ],
    formulas: [
      { label: 'Position', expression: String.raw`s = s_0 + v \cdot t` },
      { label: 'Velocity', expression: String.raw`v = \frac{\Delta s}{\Delta t} = \text{constant}` },
      { label: 'Acceleration', expression: String.raw`a = 0` }
    ]
  },
  {
    id: 'inclined-plane', topicId: 'dynamics', calculator: 'inclined-plane', title: 'Inclined Plane',
    variables: [
      ...[
        {name:'weight magnitude',symbol:'F_G',unit:'N'},
        {name:'normal force magnitude',symbol:'F_N',unit:'N'},
        {name:'downhill gravity component',symbol:String.raw`F_{\parallel}`,unit:'N'},
        {name:'kinetic friction force',symbol:'F_f',unit:'N'},
        {name:'net force',symbol:'F_{net}',unit:'N'},
        {name:'required uphill force for uniform raising',symbol:'F_{up}',unit:'N'},
        {name:'constant acceleration',symbol:'a',unit:'m/s²'}
      ].map(field=>({...field,unitName:field.unit==='N'?'newton':'meters per second squared'})),
      { name: 'mass', symbol: 'm', unit: 'kg', unitName: 'kilogram' },
      { name: 'plane length', symbol: 'L', unit: 'm', unitName: 'meter' },
      { name: 'height difference', symbol: 'h', unit: 'm', unitName: 'meter' },
      { name: 'end speed (input or calculated, start from rest)', symbol: 'v', subscript: 'end', unit: 'm/s', unitName: 'meters per second' },
      { name: 'inclination angle', symbol: 'α', unit: 'rad', unitName: 'radian (or degrees)' },
      { name: 'kinetic friction coefficient', symbol: 'μₖ', unit: '1', unitName: 'dimensionless' },
      { name: 'gravitational acceleration', symbol: 'g', unit: 'm/s²', unitName: 'meters per second squared' }
    ],
    formulas: [
      {label:'Raising Force Along a Rough Incline',expression:String.raw`F_{up}=F_G(\sin\alpha+\mu_k\cos\alpha)`},
      { label: 'Geometry', expression: String.raw`h = L \sin\alpha` },
      { label: 'End speed from rest', expression: String.raw`v_{end}=\sqrt{2aL},\quad v_{end}=\sqrt{2gh}\ (\mu_k=0)` },
      {label:'Height from speed (no friction)',expression:String.raw`h=\frac{v_{end}^2}{2g}`},
      {label:'Length from speed',expression:String.raw`L=\frac{v_{end}^2}{2g(\sin\alpha-\mu_k\cos\alpha)}`},
      {label:'Angle from speed and length',expression:String.raw`\alpha=\arctan\mu_k+\arcsin\!\left(\frac{v_{end}^2}{2gL\sqrt{1+\mu_k^2}}\right)`},
      { label: 'Weight', expression: String.raw`F_g = m g` },
      { label: 'Normal force', expression: String.raw`F_N = m g \cos(\alpha)` },
      { label: 'Downhill force', expression: String.raw`F_{\parallel} = m g \sin(\alpha)` },
      { label: 'Friction', expression: String.raw`F_f = \mu_k F_N` },
      { label: 'Net force', expression: String.raw`F_{net} = F_{\parallel} - F_f` },
      { label: 'Acceleration', expression: String.raw`a = g(\sin(\alpha) - \mu_k\cos(\alpha))` }
    ],
    notes: [{text:inclinedPlaneUi.defaults}, { text: inclinedPlaneUi.assumptions }, { text: inclinedPlaneUi.braking }],
    references: [{ title: inclinedPlaneUi.source, url: 'https://openstax.org/books/university-physics-volume-1/pages/6-2-friction' }]
  },
  ...kinematicModels,
  ...resourceModels.filter(model=>model.id.startsWith('book-'))
];
export function childrenOf(parentId: string | null) {
  const children = topics.filter(topic => topic.parentId === parentId && !topic.kind);
  return parentId === null ? children : children.sort((a, b) => a.symbol.localeCompare(b.symbol, 'en', { numeric: true }));
}
