export const ui = {
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
