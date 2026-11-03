import type { ModelDefinition } from './model-types.ts';
import { ui, inclinedPlaneUi } from '../i18n/en.ts';

export interface Topic {
  id: string;
  parentId: string | null;
  path: string;
  title: string;
  description: string;
  navigationTitle?: string;
  symbol: string;
  published: boolean;
  seo?: { title: string; description: string };
}
export const topics: readonly Topic[] = [
  { id: 'si-reference', parentId: null, path: '/si-units-and-constants', title: 'SI Units & Physical Constants', navigationTitle: 'SI Reference', description: 'Explore the seven SI base units, all 22 derived units with special names, useful unit relationships and key physical constants.', symbol: 'SI', published: true, seo: { title: 'SI Units, Derived Units & Physical Constants | calcPhysics', description: 'Reference tables for SI base units, all 22 named derived units, unit equations and physical constants, with exact definitions and measurement uncertainties.' } },
  { id: 'mechanics', parentId: null, path: '/mechanics', title: 'Mechanics', seo: { title: 'Mechanics: Motion & Force Calculators | calcPhysics', description: 'Explore kinematics and dynamics with uniform motion and inclined plane calculators. Follow unit conversions, force calculations and clear physics formulas.' }, description: 'Calculate motion and forces with mechanics models for uniform motion and inclined planes. Explore kinematics and dynamics with unit conversions, formulas and diagrams.', symbol: '01', published: true },
  { id: 'thermodynamics', parentId: null, path: '/thermodynamics', title: 'Thermodynamics', description: 'Heat, temperature and the transfer of energy.', symbol: '02', published: false },
  { id: 'electromagnetism', parentId: null, path: '/electromagnetism', title: 'Electricity & Magnetism', description: 'Charges, circuits, electric and magnetic fields.', symbol: '03', published: false },
  { id: 'waves', parentId: null, path: '/oscillations-and-waves', title: 'Oscillations & Waves', description: 'Periodic motion, wave propagation and resonance.', symbol: '04', published: false },
  { id: 'optics', parentId: null, path: '/optics', title: 'Optics', description: 'Light, reflection, refraction and optical systems.', symbol: '05', published: false },
  { id: 'modern-physics', parentId: null, path: '/modern-physics', title: 'Modern Physics', description: 'Quantum phenomena, relativity and atomic physics.', symbol: '06', published: false },
  { id: 'kinematics', parentId: 'mechanics', path: '/mechanics/kinematics', title: 'Kinematics', seo: { title: 'Uniform Motion Calculator & Kinematics Theory | calcPhysics', description: 'Calculate position, initial position, velocity or time for uniform motion. Use SI prefixes, convert units and follow formulas with position-time and velocity-time diagrams.' }, description: 'Use the uniform motion calculator to find position, initial position, constant velocity or elapsed time. Follow unit conversions and calculation steps, and compare position–time and velocity–time diagrams. This model describes straight-line motion with zero acceleration.', symbol: '01.1', published: true },
  { id: 'dynamics', parentId: 'mechanics', path: '/mechanics/dynamics', title: 'Dynamics', description: 'Use the inclined plane calculator to find slope geometry, force components, acceleration and end speed from rest. Include optional kinetic friction for downhill sliding. Static friction and the onset of sliding are not modelled.', symbol: '01.2', published: true, seo: { title: 'Inclined Plane Calculator & Dynamics Theory | calcPhysics', description: 'Calculate weight, normal force, downhill force, kinetic friction and acceleration on an inclined plane. Includes SI conversions, formulas and a force diagram.' } }
];
export const models: readonly ModelDefinition[] = [
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
