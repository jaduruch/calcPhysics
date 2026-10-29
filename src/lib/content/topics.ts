export interface Topic {
  id: string;
  parentId: string | null;
  path: string;
  title: string;
  description: string;
  symbol: string;
  published: boolean;
}
export const topics: readonly Topic[] = [
  { id: 'mechanics', parentId: null, path: '/mechanics', title: 'Mechanics', description: 'Motion, forces and the laws that connect them.', symbol: '01', published: true },
  { id: 'thermodynamics', parentId: null, path: '/thermodynamics', title: 'Thermodynamics', description: 'Heat, temperature and the transfer of energy.', symbol: '02', published: false },
  { id: 'electromagnetism', parentId: null, path: '/electromagnetism', title: 'Electricity & Magnetism', description: 'Charges, circuits, electric and magnetic fields.', symbol: '03', published: false },
  { id: 'waves', parentId: null, path: '/oscillations-and-waves', title: 'Oscillations & Waves', description: 'Periodic motion, wave propagation and resonance.', symbol: '04', published: false },
  { id: 'optics', parentId: null, path: '/optics', title: 'Optics', description: 'Light, reflection, refraction and optical systems.', symbol: '05', published: false },
  { id: 'modern-physics', parentId: null, path: '/modern-physics', title: 'Modern Physics', description: 'Quantum phenomena, relativity and atomic physics.', symbol: '06', published: false },
  { id: 'kinematics', parentId: 'mechanics', path: '/mechanics/kinematics', title: 'Kinematics', description: 'Describe how objects move through position, velocity and acceleration.', symbol: '01.1', published: true }
];
export const models = [
  { id: 'uniform-motion', title: 'Uniform Motion', description: 'Straight-line motion with constant velocity.', formula: String.raw`\Delta x = v\,\Delta t`, assumption: 'Constant velocity · zero acceleration' },
  { id: 'uniform-acceleration', title: 'Uniformly Accelerated Motion', description: 'Position and velocity under constant acceleration.', formula: String.raw`x = x_0 + v_0t + \tfrac{1}{2}at^2`, assumption: 'Constant acceleration' },
  { id: 'free-fall', title: 'Free Fall', description: 'Vertical motion under the influence of gravity.', formula: String.raw`y = y_0 + v_0t - \tfrac{1}{2}gt^2`, assumption: 'Upward-positive axis · no air resistance · constant g' },
  { id: 'projectile-motion', title: 'Projectile Motion', description: 'Horizontal and vertical components of a trajectory.', formula: String.raw`x = x_0 + v_0\cos(\theta)\,t`, assumption: 'No air resistance · constant gravity' }
] as const;
export function childrenOf(parentId: string | null) { return topics.filter(topic => topic.parentId === parentId); }
