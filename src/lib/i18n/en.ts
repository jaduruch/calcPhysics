export const ui = {
  homeTitle: 'Physics calculators and theory',
  homeDescription: 'Explore mechanics, thermodynamics, electricity, waves, optics and quantum physics. Calculate with units, follow formulas and understand the assumptions behind each model.',
  mainNavigation: 'Main navigation', menu: 'Main menu',
  home: 'Home', subjects: 'Explore physics', subjectLabel: 'Subject overview',
  openReference: 'View reference', subtopics: 'Subtopics', models: 'Theory & calculation models',
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

export const electricalUi = {
  seriesResistorDiagram: 'Resistors in series', parallelResistorDiagram: 'Resistors in parallel',
  seriesResistorDescription: 'Resistances R1 to Rn are connected in one path between the two terminals. Their resistances add. A dashed resistor represents an empty initial field.',
  parallelResistorDescription: 'Resistances R1 to Rn form separate branches connected to the same two terminals. Their conductances add. A dashed resistor represents an empty initial field.',
  seriesCapacitorDiagram: 'Capacitors in series', parallelCapacitorDiagram: 'Capacitors in parallel',
  capacitorNetworkDescription: 'Ideal capacitors C1 to Cn connected between two terminals. In series their reciprocal capacitances add; in parallel their capacitances add. A dashed capacitor represents an empty field.',
  seriesInductorDiagram: 'Inductors in series', parallelInductorDiagram: 'Inductors in parallel',
  inductorNetworkDescription: 'Ideal inductors L1 to Ln without mutual magnetic coupling, connected between two terminals. In series their inductances add; in parallel their reciprocal inductances add. A dashed inductor represents an empty field.',
  inductorConnection: 'Inductor connection',
  capacitorConnection: 'Capacitor connection', rcConnection: 'RC connection',
  rlConnection: 'RL connection', seriesRlDiagram: 'Series RL circuit', parallelRlDiagram: 'Parallel RL circuit',
  rlDiagramDescription: 'Automatically generated AC circuit with resistor R and inductor L in the selected series or parallel connection.',
  rcProcess: 'RC process', charging: 'Charging', discharging: 'Discharging',
  rlProcess: 'RL process', stepResponse: 'Step response',
  rlStepDiagram: 'RL step-response circuit', rlDischargeDiagram: 'RL discharging circuit',
  rlTransientDescription: 'The automatic switch selects the ideal RL step response or the source-free discharge path through resistor R and inductor L.',
  automaticRlTransientHint: 'The RL circuit and switch position follow the selected process automatically.',
  rcChargeDiagram: 'RC charging circuit', rcDischargeDiagram: 'RC discharging circuit',
  rcChargeDescription: 'The automatic switch connects the DC source to resistor R and capacitor C for charging.',
  rcDischargeDescription: 'The automatic switch disconnects the DC source and closes the discharge path through resistor R and capacitor C.',
  automaticRcTransientHint: 'The circuit and switch position follow the selected charging or discharging process automatically.',
  seriesRcDiagram: 'Series RC circuit', parallelRcDiagram: 'Parallel RC circuit',
  seriesRcDescription: 'An automatically generated AC circuit with resistor R and capacitor C in one current path.',
  parallelRcDescription: 'An automatically generated AC circuit with resistor R and capacitor C on separate branches across the same voltage.',
  automaticRcDiagramHint: 'The circuit is generated from the selected connection. Select an input to highlight the corresponding quantity.',
  resistorConnection: 'Resistor connection', series: 'Series', parallel: 'Parallel',
  starDeltaConversion: 'Network conversion', deltaToStar: 'Delta → Star', starToDelta: 'Star → Delta',
  starDeltaDiagrams: 'Delta and star resistance networks', deltaNetwork: 'Delta network', starNetwork: 'Star network',
  dividerLoad: 'Load connected to the voltage divider', unloaded: 'Unloaded', loaded: 'Loaded',
  dividerDiagram: 'Unloaded voltage divider', loadedDividerDiagram: 'Loaded voltage divider',
  dividerDescription: 'A DC source supplies series resistors R1 and R2. The output voltage is measured across R2. Supply current I flows through both resistors.',
  loadedDividerDescription: 'A DC source supplies R1 in series with the parallel combination of R2 and load resistor RL. Supply current I splits into IR2 and IL at the output node.',
  ohmDiagram: 'DC circuit: voltage, current, resistance and power',
  ohmDiagramDescription: 'A DC source drives current I through resistor R. Voltage U is measured across the resistor; P indicates the electrical power absorbed by it. Units: V, A, Ω and W.',
  ohmDiagramHint: 'Select an input to highlight its quantity and unit in the circuit. The other quantities turn grey.',
  conflict: 'These inputs contradict the model equations. Check the given quantities.',
  underdetermined: 'These values do not determine a unique result. Add an independent quantity or change the input pair.',
  twoInputs: 'Enter exactly two quantities; clear the other fields.',
  idealTransformer: 'Assumption: ideal transformer, η = 1.',
  partialInductor: 'Only uniquely determined quantities are shown. Add independent known values for further results. Calculated values remain below the inputs.',
  partialTransformer: 'Only uniquely determined missing quantities are shown. More independent inputs may be needed for the remaining quantities.',
  incomplete: 'Enter the required input values to calculate.',
  invalid: 'Check the marked inputs and the model limits below.',
  range: 'These values exceed the numerical range of this model. Use less extreme inputs.',
  generator: 'Three-phase generator: normalised phase vectors', phase: 'Phase', generatorNote: 'The vertical projections give the instantaneous phase voltages divided by their peak amplitude. Change elapsed time to rotate the vectors. Checkboxes control vector visibility only.',
  phasor: 'Impedance triangle', phasorNote: 'Normalised impedance direction; the horizontal component is resistive and the signed vertical component is reactive.',
  input: 'Input', output: 'Result unit', conversion: 'SI conversions',
  schematic: 'Schematic curve; no numerical scale.', calculated: 'Calculated from the validated SI inputs.',
  diagram: 'Circuit diagram.',
  diagramNote: 'Source illustration; the assumptions stated here define this calculation.',
  zero: 'Zero is a valid input where the model permits it.'
  ,highPassCircuit:'High-pass circuit',lowPassCircuit:'Low-pass circuit',filterCircuitDescription:'Automatically generated ideal first-order passive filter circuit.',bodeMagnitudeDiagram:'Bode magnitude',bodePhaseDiagram:'Bode phase shift',seriesResonator:'Series RLC resonator',parallelResonator:'Parallel RLC resonator',resonatorCircuitDescription:'Automatically generated ideal RLC resonant circuit.'
};

export const idealGasUi = {
  p: 'absolute pressure', V: 'volume', n: 'amount of substance', T: 'absolute temperature',
  assumptions: 'Ideal gas in equilibrium; all quantities must be positive. Use absolute pressure and temperature in kelvin. Real-gas effects and phase changes are excluded.',
  invalid: 'Enter finite positive values within the numerical range.',
  conflict: 'The four values are inconsistent with the ideal gas law.',
  consistent: 'The four values satisfy the ideal gas law.',
  incomplete: 'Enter three quantities to calculate the remaining one.'
} as const;

export const qubitUi = {
  sphere: 'Bloch sphere',
  sphereDescription: 'Perspective 3D view of the pure qubit. The blue arrow is the Bloch vector; the dotted blue curve is the last gate path. The +z pole is |0⟩ and the −z pole is |1⟩. Dashed guides project the vector onto the xy plane; θ is measured from +z and φ from +x toward +y. At |1⟩, a semicircle in the xz plane shows θ = 180°. The azimuth is undefined at both poles.',
  orbitLabel: 'Rotate the 3D Bloch sphere',
  orbitHelp: 'Drag to orbit. With the view focused, use arrow keys to rotate and Home to reset the camera.',
  resetView: 'Reset view',
  loading: 'Loading interactive 3D view…',
  viewError: 'The interactive view could not be loaded. State amplitudes and probabilities remain available.',
  showMatrices: 'Show matrices', hideMatrices: 'Hide matrices',
  pauli: 'Pauli gates', squareRoot: 'Square-root gates', hadamard: 'Hadamard', rotations: 'Rotation gates', general: 'General gate',
  rotationAngle: 'rotation angle', theta: 'polar rotation', phi: 'output phase', lambda: 'input phase',
  defaults: 'Blank angle fields use γ = π/2, θ = π/2 and φ = λ = 0. U uses the IBM convention: θ ∈ [0, π], φ, λ ∈ [0, 2π).',
  invalidAngle: 'Enter finite angles. For U, use θ ∈ [0, π] and φ, λ ∈ [0, 2π). Rotation angles γ must be between −2π and 2π.',
  currentState: 'Current state', probabilities: 'Z-basis probabilities', coordinates: 'Bloch coordinates',
  assumptions: 'One pure, isolated qubit; ideal gates, no noise, entanglement or measurement collapse. Probabilities are predictions in the Z basis. Global phase is invisible on the Bloch sphere. Animation timing is illustrative.',
  start: 'Initial state', undefinedPhase: 'undefined at the poles',
  defaultHalfPi: 'default π/2', defaultZero: 'default 0',
  rotationHint: 'Positive rotations follow the right-hand rule.',
  reducedMotion: 'Reduced motion: gates are applied without animation.'
} as const;

export const dopplerUi = {
  fs: 'emitted frequency', fo: 'observed frequency', vs: 'source velocity', vo: 'observer velocity', c: 'sound speed',
  incomplete: 'Enter three of fₛ, fₒ, vₛ and vₒ; use 0 for a stationary source or observer.',
  conflict: 'The four inputs are inconsistent with the Doppler equation.',
  'no-solution': 'No solution exists within this subsonic model.',
  domain: 'Frequencies and sound speed must be positive; both velocity magnitudes must be below the sound speed.',
  numerical: 'The result is outside the finite numerical range.',
  parseError: 'Enter a valid finite number in each completed field.',
  consistent: 'The four inputs satisfy the Doppler equation.',
  defaultSpeed: 'default 343 m/s',
  assumedSpeed: 'Using c = 343 m/s (air near 20 °C).',
  signConvention: 'Positive vₛ means the source moves toward the observer; positive vₒ means the observer moves toward the source. Negative values mean moving away. Both velocities are relative to the medium.',
  assumptions: 'Uniform stationary medium, constant sound speed and collinear motion with |vₛ| < c and |vₒ| < c, before source and observer pass. No wind, sonic booms, reflection or relativistic light Doppler effect.',
  wavelength: 'wavelength toward observer', shift: 'frequency shift',
  source: 'Source', observer: 'Observer',
  diagramTitle: 'Doppler wavefronts',
  diagramDescription: 'Cross-section of spherical sound wavefronts. Each circle expands from its fixed emission point in the stationary medium. Source and observer move along the horizontal line.',
  schematic: 'Schematic preview; enter valid inputs to show your model.',
  scaled: 'Wavefronts are one source period apart. Space and time are scaled for display; the loop restarts before source and observer pass.',
  play: 'Play animation', pause: 'Pause animation',
  reducedMotion: 'Reduced motion: a static wavefront view is shown.'
} as const;

export const reflectionUi = {
  n1: 'incident-medium refractive index', n2: 'second-medium refractive index', angle: 'angle of incidence',
  criticalAngle: 'critical angle', reflectedAngle: 'angle of reflection', transmittedAngle: 'angle of refraction',
  incomplete: 'Enter both refractive indices to find whether total internal reflection is possible.',
  addAngle: 'Enter an incidence angle to determine the ray paths.',
  noCritical: 'No critical angle exists for total internal reflection in this direction because n₁ ≤ n₂.',
  'total-reflection': 'Total internal reflection: θ₁ > θc. No propagating refracted ray enters medium 2.',
  critical: 'At the critical angle: θ₂ = 90°. The limiting refracted ray runs along the boundary.',
  refraction: 'Refraction: a transmitted ray is allowed by Snell’s law.',
  matched: 'Equal refractive indices: the ray continues straight with no interface reflection in this ideal model.',
  domain: 'Refractive indices must be finite and positive. The incidence angle must satisfy 0 ≤ θ₁ < 90° (π/2 rad).',
  numerical: 'The result is outside the finite numerical range.',
  parseError: 'Enter a valid finite number in each completed field.',
  convention: 'Light travels from medium 1 into medium 2. All angles are measured from the normal, not from the surface.',
  assumptions: 'Flat interface between homogeneous, isotropic, non-magnetic, transparent media with positive real refractive indices at the same wavelength. Ray paths only: polarization, reflected/transmitted intensities and the evanescent field are not calculated.',
  medium1: 'Medium 1', medium2: 'Medium 2', normal: 'Normal',
  incident: 'Incident', reflected: 'Reflected', transmitted: 'Refracted',
  diagramTitle: 'Refraction and total internal reflection',
  schematic: 'Schematic ray preview; enter both indices and an incidence angle for your ray paths.',
  calculated: 'Ray geometry from the calculated angles; line brightness does not represent optical intensity.',
  diagramDescription: 'Medium 1 is below the horizontal interface and medium 2 is above. The incident ray travels toward the interface; the reflected ray remains below it. A refracted ray is drawn only when propagation into medium 2 is allowed.'
} as const;

export const resourceUi = {
 incomplete:'Enter the model inputs to calculate the results.',
 incompleteRelation:'Leave one model quantity empty; enter the others to calculate it.',
 invalid:'Check the highlighted inputs against the stated model domains.',
 conflict:'These inputs are inconsistent with the model equation.',
 underdetermined:'These inputs do not determine a unique value (0 divided by 0).',
 'no-solution':'No solution exists within the stated model domain.',
 numerical:'The result is outside the finite numerical range.',
 consistent:'The entered values satisfy the model equation.',
 defaultValue:'Default:',
 prismReflection:'Total internal reflection at the second prism face: no transmitted emergence angle or transmitted total deviation.'
} as const;

export const kinematicsUi={
 initialVelocity:'initial velocity',initialVerticalVelocity:'initial vertical velocity',acceleration:'constant acceleration',launchHeight:'launch height',horizontalVelocity:'horizontal velocity',gravity:'gravitational acceleration',
 acceleratedAssumptions:'Straight-line motion with constant signed acceleration. Positions and velocities are directed quantities; t is elapsed time and must be non-negative. Position change is not necessarily distance travelled.',
 projectileAssumptions:'Point mass, constant g > 0, no air resistance and horizontal ground at y = 0. Motion ends at first ground contact; no bounce or continuation below ground.',
 verticalConvention:'The positive y-axis points upward. Positive v₀ means an upward launch; negative v₀ means a downward launch. Launch height y₀ must be non-negative.',
 horizontalConvention:'Positive x points right and positive y upward. Negative vₓ throws to the left; R is signed displacement, not an unsigned range. Launch height h must be non-negative.',
 incompleteAccelerated:'Enter four quantities, or three with a blank s₀ to assume s₀ = 0.',
 incompleteProjectile:'Enter the launch conditions; blank gravity uses 9.81 m/s².',
 domain:'Enter finite values. Time and launch height must be non-negative; g must be positive.',
 numerical:'The motion is outside the finite numerical range.',
 'too-many':'Leave one quantity empty to select the accelerated-motion calculation.',
 'no-solution':'No solution exists for non-negative elapsed time.',
 underdetermined:'These inputs do not determine a unique solution.',
 parseError:'Enter valid finite numbers in the completed fields.',
 initialAssumption:'Using s₀ = 0 m for the blank initial-position field.',
 defaultValue:'Default:',multipleTimes:'Two non-negative times reach this position. Both are solutions; choose the interval to show in the diagrams.',
 diagramInterval:'Diagram interval',timeSolution:'Time solution',
 velocity:'final velocity',displacement:'position change',flight:'time to ground',peakTime:'time of maximum height',peakHeight:'maximum height after launch',impactVelocity:'vertical impact velocity',range:'horizontal displacement',vyImpact:'vertical impact velocity',speedImpact:'impact speed',
 charts:'Motion diagrams',positionDescription:'Position over the selected elapsed-time interval, calculated from the same constant-acceleration model.',velocityDescription:'Signed velocity over the selected elapsed-time interval.',heightDescription:'Height above ground until first contact; no continuation below ground.',horizontalDescription:'Signed horizontal coordinate until first ground contact.',trajectoryDescription:'Trajectory in the x–y plane until first ground contact. A negative horizontal velocity carries the body to the left.',schematic:'Schematic preview without numerical scales.'
} as const;
