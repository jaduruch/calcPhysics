export const ui = {
  siReferenceLink: 'Explore SI units and constants',
  homeTitle: 'Physics calculators and theory',
  homeDescription: 'Calculate uniform motion and inclined plane forces with unit conversions, step-by-step formulas and diagrams. Explore the assumptions and theory behind each model, from learning physics to everyday engineering.',
  home: 'Home', subjects: 'Explore physics', subjectLabel: 'Subject overview',
  subtopics: 'Subtopics', models: 'Theory & calculation models',
  planned: 'Coming soon', open: 'Explore', theme: 'Appearance',
  toggleDarkMode: 'Dark mode', switchToLight: 'Switch to light mode', switchToDark: 'Switch to dark mode',
  skip: 'Skip to content', theory: 'Theory', calculate: 'Calculate',
  modelNotice: 'Expand a model to explore it. Use the info button to show its formula and assumptions.',
  variables: 'Variables', keyFormulas: 'Key Formulas',
  velocityDerivative: 'Velocity v(t) is the first time derivative of position s(t). A dot above s denotes differentiation with respect to time. For uniform motion, this derivative is constant.',
  showTheory: 'Show theory', hideTheory: 'Hide theory', modelAssumptions: 'Model assumptions',
  calculatorPending: 'The calculator and visualizations for this model are not available yet.',
  footer: 'Physics, made clear.', footerDetail: 'Understand the model. Work with the numbers.'
} as const;

export const calculatorUi = {
  initialPosition: 'Initial position', position: 'Position', velocity: 'Velocity', time: 'Time',
  invalidNumber: 'Enter a number with an optional prefix: p, n, u, m, c, d, k, M, G or T. Example: 1.5k. Prefixes are case-sensitive.',
  'non-finite': 'These values exceed the supported numerical range.',
  'negative-time': 'Elapsed time must be zero or positive.',
  'too-many': 'Leave one field empty to calculate its value.',
  noSolution: 'No solution exists for these values with a non-negative elapsed time.',
  underdetermined: 'These values do not determine a unique result (division by zero).',
  unitConversion: 'Convert to SI units',
  unitFor: 'Unit for', calculated: 'Calculated', assumed: 'Assumed: 0',
  precision: 'Type prefixes directly: 1.5k, 250m or 20u. Results: 3 significant figures.',
  reset: 'Reset', assumption: 'Initial position assumed: s₀ = 0 m.', working: 'Calculation steps'
} as const;

export const chartUi = {
  title: 'Motion diagrams',
  positionDescription: 'Position over time. The slope of the line represents velocity.',
  velocityDescription: 'Constant velocity over time. The signed area under the line represents displacement.',
  zeroInterval: 'The time interval is zero; only the initial point is shown.',
  empty: 'Schematic curve without a numerical scale. Calculated values appear once a calculation is possible.'
} as const;

export const inclinedPlaneUi = {
  length: 'Plane length', height: 'Height difference',
  geometryInvalid: 'Inconsistent geometry. Use h = L sin α, with L > 0 and 0 ≤ h ≤ L. Clear a value to calculate it.',
  noStart: 'No end speed from rest: this model does not predict downhill motion with these friction and slope values. Static friction is not modelled.',
  mass: 'Mass', angle: 'Inclination angle', friction: 'Kinetic friction coefficient', gravity: 'Gravitational acceleration',
  assumptions: 'Rigid body on a straight plane, no air resistance or applied forces. Positive direction is downhill. With friction, the body is already sliding downhill; kinetic friction acts uphill. Static friction and the onset of motion are not modelled.',
  braking: 'A negative acceleration means a downhill-moving body slows down. It does not predict motion uphill or determine whether a body starts sliding from rest.',
  defaults: 'Blank μₖ assumes no friction (0). Blank g uses 9.81 m/s². End speed uses v₀ = 0 and constant acceleration along L; with friction it assumes downhill sliding begins. Two of L, h and α determine the third.',
  invalid: 'Enter valid numbers. Mass, plane length and g must be positive, height must be non-negative, μₖ must be non-negative, and the angle must be between 0 and π/2 rad (0–90°).',
  range: 'These values exceed the supported numerical range.',
  angleHighlight: 'The angle is highlighted because its input field is focused.',
  lengthHighlight: 'The full slope length L is highlighted because its input field is focused.',
  heightHighlight: 'The vertical height difference h is highlighted because its input field is focused.',
  sketch: 'Inclined plane — force diagram', schematic: 'Schematic preview: the entered angle and friction determine the geometry and force ratios. Force magnitudes appear once the calculation is valid.',
  sketchDescription: 'Weight acts vertically downwards, normal force perpendicular to the surface, downhill weight component along the plane, and kinetic friction uphill. Arrows show the force directions; weight and its downhill component are not additional independent forces.',
  diagramNote: 'The angle is drawn to scale. Force arrow lengths are proportional on one shared, automatically fitted scale. The downhill component is shown dashed to distinguish it from weight.',
  source: 'Theory reference: OpenStax, University Physics, Friction and the Inclined Plane.'
} as const;
