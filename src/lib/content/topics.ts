export interface Topic {
  id: string;
  parentId: string | null;
  path: string;
  title: string;
  description: string;
  symbol: string;
  published: boolean;
  seo?: { title: string; description: string };
}
export const topics: readonly Topic[] = [
  { id: 'mechanics', parentId: null, path: '/mechanics', title: 'Mechanics', seo: { title: 'Mechanics: Kinematics & Motion Calculators | calcPhysics', description: 'Explore mechanics with kinematics theory and a uniform motion calculator. Calculate position, velocity and time with unit conversions and motion diagrams.' }, description: 'Motion, forces and the laws that connect them.', symbol: '01', published: true },
  { id: 'thermodynamics', parentId: null, path: '/thermodynamics', title: 'Thermodynamics', description: 'Heat, temperature and the transfer of energy.', symbol: '02', published: false },
  { id: 'electromagnetism', parentId: null, path: '/electromagnetism', title: 'Electricity & Magnetism', description: 'Charges, circuits, electric and magnetic fields.', symbol: '03', published: false },
  { id: 'waves', parentId: null, path: '/oscillations-and-waves', title: 'Oscillations & Waves', description: 'Periodic motion, wave propagation and resonance.', symbol: '04', published: false },
  { id: 'optics', parentId: null, path: '/optics', title: 'Optics', description: 'Light, reflection, refraction and optical systems.', symbol: '05', published: false },
  { id: 'modern-physics', parentId: null, path: '/modern-physics', title: 'Modern Physics', description: 'Quantum phenomena, relativity and atomic physics.', symbol: '06', published: false },
  { id: 'kinematics', parentId: 'mechanics', path: '/mechanics/kinematics', title: 'Kinematics', seo: { title: 'Uniform Motion Calculator & Kinematics Theory | calcPhysics', description: 'Calculate position, initial position, velocity or time for uniform motion. Use SI prefixes, convert units and follow formulas with position-time and velocity-time diagrams.' }, description: 'Describe how objects move through position, velocity and acceleration.', symbol: '01.1', published: true }
];
export const models = [
  {
    id: 'uniform-motion', title: 'Uniform Motion',
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
  }
] as const;
export function childrenOf(parentId: string | null) { return topics.filter(topic => topic.parentId === parentId); }
