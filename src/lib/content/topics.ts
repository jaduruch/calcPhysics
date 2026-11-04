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
  seo?: { title: string; description: string };
}
export const topics: readonly Topic[] = [
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
  { id: 'mechanics', parentId: null, path: '/mechanics', title: 'Mechanics', seo: { title: 'Mechanics: Motion & Force Calculators | calcPhysics', description: 'Explore kinematics and dynamics with uniform motion and inclined plane calculators. Follow unit conversions, force calculations and clear physics formulas.' }, description: 'Calculate motion and forces with mechanics models for uniform motion and inclined planes. Explore kinematics and dynamics with unit conversions, formulas and diagrams.', symbol: '01', published: true },
  { id: 'thermodynamics', parentId: null, path: '/thermodynamics', title: 'Thermodynamics', description: 'Explore heat, temperature and energy, starting with the pressure, volume and temperature of ideal gases.', symbol: '02', published: true },
  { id: 'ideal-gases', parentId: 'thermodynamics', path: '/thermodynamics/ideal-gases', title: 'Ideal Gases', description: 'Use the ideal gas law to calculate absolute pressure, volume, amount of substance or temperature. Follow SI conversions and calculation steps for a gas in thermodynamic equilibrium.', symbol: '02.1', published: true, seo: { title: 'Ideal Gas Law Calculator & Theory | calcPhysics', description: 'Calculate pressure, volume, amount of substance or temperature with pV = nRT. Convert pressure and volume units and follow the ideal gas law calculation steps.' } },
  { id: 'electromagnetism', parentId: null, path: '/electromagnetism', title: 'Electricity & Magnetism', description: 'Explore DC and AC circuits, transformers, magnetic fields, capacitors, inductors, resonance, filters and three-phase systems. Calculate with SI units, formulas and circuit diagrams.', symbol: '03', published: true },
  { id: 'waves', parentId: null, path: '/oscillations-and-waves', title: 'Oscillations & Waves', description: 'Explore wave propagation and frequency shifts, starting with the acoustic Doppler effect for moving sources and observers.', symbol: '04', published: true },
  { id: 'doppler-effect', parentId: 'waves', path: '/oscillations-and-waves/doppler-effect', title: 'Doppler Effect', description: 'Calculate emitted or observed sound frequency and source or observer velocity. Follow SI conversions and explore wavefronts for collinear subsonic motion in a stationary medium.', symbol: '04.1', published: true, seo: { title: 'Doppler Effect Calculator & Sound Wavefronts | calcPhysics', description: 'Calculate acoustic Doppler shifts, emitted or observed frequency and source or observer velocity. Includes formulas, SI conversions and animated sound wavefronts.' } },
  { id: 'optics', parentId: null, path: '/optics', title: 'Optics', description: 'Explore light at optical interfaces, starting with refraction, the critical angle and total internal reflection.', symbol: '05', published: true },
  { id: 'total-internal-reflection', parentId: 'optics', path: '/optics/total-internal-reflection', title: 'Total Internal Reflection', description: 'Calculate the critical angle from refractive indices, test an incidence angle and follow reflected and refracted rays across an optical interface.', symbol: '05.1', published: true, seo: { title: 'Total Internal Reflection & Critical Angle Calculator | calcPhysics', description: 'Calculate the critical angle, distinguish refraction from total internal reflection and visualize ray paths with Snell’s law and step-by-step formulas.' } },
  { id: 'modern-physics', parentId: null, path: '/modern-physics', title: 'Modern Physics', description: 'Explore quantum phenomena, starting with single-qubit states, quantum gates and the Bloch sphere.', symbol: '06', published: true },
  { id: 'quantum', parentId: 'modern-physics', path: '/modern-physics/quantum', title: 'Quantum', description: 'Simulate a single qubit with quantum gates, explore complex amplitudes and measurement probabilities, and follow state rotations on an interactive 3D Bloch sphere.', symbol: '06.1', published: true, seo: { title: 'Qubit Simulator & 3D Bloch Sphere | calcPhysics', description: 'Explore X, Y, Z, square-root, Hadamard, rotation and U gates with a single-qubit simulator, state amplitudes, probabilities and an animated 3D Bloch sphere.' } },
  { id: 'kinematics', parentId: 'mechanics', path: '/mechanics/kinematics', title: 'Kinematics', seo: { title: 'Uniform Motion Calculator & Kinematics Theory | calcPhysics', description: 'Calculate position, initial position, velocity or time for uniform motion. Use SI prefixes, convert units and follow formulas with position-time and velocity-time diagrams.' }, description: 'Use the uniform motion calculator to find position, initial position, constant velocity or elapsed time. Follow unit conversions and calculation steps, and compare position–time and velocity–time diagrams. This model describes straight-line motion with zero acceleration.', symbol: '01.1', published: true },
  { id: 'dynamics', parentId: 'mechanics', path: '/mechanics/dynamics', title: 'Dynamics', description: 'Use the inclined plane calculator to find slope geometry, force components, acceleration and end speed from rest. Include optional kinetic friction for downhill sliding. Static friction and the onset of sliding are not modelled.', symbol: '01.2', published: true, seo: { title: 'Inclined Plane Calculator & Dynamics Theory | calcPhysics', description: 'Calculate weight, normal force, downhill force, kinetic friction and acceleration on an inclined plane. Includes SI conversions, formulas and a force diagram.' } }
];
export const models: readonly ModelDefinition[] = [
  ...electricalModels,
  qubitModel,
  dopplerModel,
  totalReflectionModel,
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
      { name: 'mass', symbol: 'm', unit: 'kg', unitName: 'kilogram' },
      { name: 'plane length', symbol: 'L', unit: 'm', unitName: 'meter' },
      { name: 'height difference', symbol: 'h', unit: 'm', unitName: 'meter' },
      { name: 'end speed (start from rest)', symbol: 'v', subscript: 'end', unit: 'm/s', unitName: 'meters per second' },
      { name: 'inclination angle', symbol: 'α', unit: 'rad', unitName: 'radian (or degrees)' },
      { name: 'kinetic friction coefficient', symbol: 'μₖ', unit: '1', unitName: 'dimensionless' },
      { name: 'gravitational acceleration', symbol: 'g', unit: 'm/s²', unitName: 'meters per second squared' }
    ],
    formulas: [
      { label: 'Geometry', expression: String.raw`h = L \sin\alpha` },
      { label: 'End speed from rest', expression: String.raw`v_{end} = \sqrt{2aL}` },
      { label: 'Weight', expression: String.raw`F_g = m g` },
      { label: 'Normal force', expression: String.raw`F_N = m g \cos(\alpha)` },
      { label: 'Downhill force', expression: String.raw`F_{\parallel} = m g \sin(\alpha)` },
      { label: 'Friction', expression: String.raw`F_f = \mu_k F_N` },
      { label: 'Net force', expression: String.raw`F_{net} = F_{\parallel} - F_f` },
      { label: 'Acceleration', expression: String.raw`a = g(\sin(\alpha) - \mu_k\cos(\alpha))` }
    ],
    notes: [{ text: inclinedPlaneUi.assumptions }, { text: inclinedPlaneUi.braking }],
    references: [{ title: inclinedPlaneUi.source, url: 'https://openstax.org/books/university-physics-volume-1/pages/6-2-friction' }]
  }
];
export function childrenOf(parentId: string | null) { return topics.filter(topic => topic.parentId === parentId); }
