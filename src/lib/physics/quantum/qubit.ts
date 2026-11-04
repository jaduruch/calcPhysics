/** Pure, normalized, isolated single qubit. Computational basis |0>, |1>.
 * Matrices follow Qubit_Demo/main/portal.html (including U in the IBM convention).
 * Angles in radians; ideal unitary evolution only, no noise or measurement collapse.
 * https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits
 */
export type Complex = Readonly<{ re: number; im: number }>;
export type Qubit = readonly [Complex, Complex];
export type Matrix = readonly [readonly [Complex, Complex], readonly [Complex, Complex]];
export type Vector3 = Readonly<{ x: number; y: number; z: number }>;
export const gateIds = ['X', 'Y', 'Z', 'sqrtX', 'sqrtZ', 'H', 'Rx', 'Ry', 'Rz', 'U'] as const;
export type GateId = typeof gateIds[number];
export type Gate = Readonly<{ id: GateId; theta?: number; phi?: number; lambda?: number }>;
export const zeroQubit: Qubit = [{ re: 1, im: 0 }, { re: 0, im: 0 }];
const c = (re: number, im = 0): Complex => ({ re, im });
const add = (a: Complex, b: Complex): Complex => c(a.re + b.re, a.im + b.im);
const mul = (a: Complex, b: Complex): Complex => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const phase = (angle: number): Complex => c(Math.cos(angle), Math.sin(angle));
export const probability = (a: Complex): number => a.re * a.re + a.im * a.im;
export function validateQubit(state: Qubit): void {
  if (!state.flatMap(a => [a.re, a.im]).every(Number.isFinite) || Math.abs(probability(state[0]) + probability(state[1]) - 1) > 1e-10) {
    throw new RangeError('A finite normalized qubit is required');
  }
}
function angle(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) throw new RangeError('A finite angle is required');
  return value;
}
/** Fractional evolution follows the gate axis, including its global phase.
 * For U, all three Euler parameters scale together, a continuous unitary path.
 * This is an illustrative path, not a specified physical pulse duration.
 */
export function gateMatrix(gate: Gate, fraction = 1): Matrix {
  if (!gateIds.includes(gate.id) || !Number.isFinite(fraction) || fraction < 0 || fraction > 1) throw new RangeError('Invalid gate or fraction');
  if (gate.id === 'U') {
    const theta = angle(gate.theta), phi = angle(gate.phi), lambda = angle(gate.lambda);
    if (theta < 0 || theta > Math.PI || phi < 0 || phi >= 2 * Math.PI || lambda < 0 || lambda >= 2 * Math.PI) throw new RangeError('U parameters outside their domain');
    const t = theta * fraction;
    const p = angle(gate.phi) * fraction;
    const l = angle(gate.lambda) * fraction;
    const ct = Math.cos(t / 2), st = Math.sin(t / 2);
    return [[c(ct), mul(c(-st), phase(l))], [mul(c(st), phase(p)), mul(c(ct), phase(p + l))]];
  }
  let axis: Vector3;
  let rotation: number;
  let globalPhase = 0;
  switch (gate.id) {
    case 'X': axis = { x: 1, y: 0, z: 0 }; rotation = Math.PI; globalPhase = Math.PI / 2; break;
    case 'Y': axis = { x: 0, y: 1, z: 0 }; rotation = Math.PI; globalPhase = Math.PI / 2; break;
    case 'Z': axis = { x: 0, y: 0, z: 1 }; rotation = Math.PI; globalPhase = Math.PI / 2; break;
    case 'H': axis = { x: Math.SQRT1_2, y: 0, z: Math.SQRT1_2 }; rotation = Math.PI; globalPhase = Math.PI / 2; break;
    case 'sqrtX': axis = { x: 1, y: 0, z: 0 }; rotation = Math.PI / 2; globalPhase = Math.PI / 4; break;
    case 'sqrtZ': axis = { x: 0, y: 0, z: 1 }; rotation = Math.PI / 2; globalPhase = Math.PI / 4; break;
    case 'Rx': axis = { x: 1, y: 0, z: 0 }; rotation = angle(gate.theta); break;
    case 'Ry': axis = { x: 0, y: 1, z: 0 }; rotation = angle(gate.theta); break;
    case 'Rz': axis = { x: 0, y: 0, z: 1 }; rotation = angle(gate.theta); break;
  }
  if (Math.abs(rotation) > 2 * Math.PI) throw new RangeError('Rotation outside ±2π');
  const co = Math.cos(rotation * fraction / 2), si = Math.sin(rotation * fraction / 2);
  const factor = phase(globalPhase * fraction);
  const entry = (re: number, im: number) => mul(c(re, im), factor);
  return [[entry(co, -axis.z * si), entry(-axis.y * si, -axis.x * si)], [entry(axis.y * si, -axis.x * si), entry(co, axis.z * si)]];
}
export function applyGate(state: Qubit, gate: Gate, fraction = 1): Qubit {
  validateQubit(state);
  const matrix = gateMatrix(gate, fraction);
  const a = add(mul(matrix[0][0], state[0]), mul(matrix[0][1], state[1]));
  const b = add(mul(matrix[1][0], state[0]), mul(matrix[1][1], state[1]));
  // Correct only floating-point drift, never normalize invalid user states.
  const norm = Math.hypot(a.re, a.im, b.re, b.im);
  return [c(a.re / norm, a.im / norm), c(b.re / norm, b.im / norm)];
}
export function blochVector(state: Qubit): Vector3 {
  validateQubit(state);
  const [a, b] = state;
  return { x: 2 * (a.re * b.re + a.im * b.im), y: 2 * (a.re * b.im - a.im * b.re), z: probability(a) - probability(b) };
}
export function blochAngles(state: Qubit): { theta: number; phi: number | null } {
  const v = blochVector(state);
  return { theta: Math.acos(Math.max(-1, Math.min(1, v.z))), phi: Math.hypot(v.x, v.y) < 1e-12 ? null : (Math.atan2(v.y, v.x) + 2 * Math.PI) % (2 * Math.PI) };
}
export function gateTrajectory(state: Qubit, gate: Gate): readonly Vector3[] {
  return Array.from({ length: 97 }, (_, index) => blochVector(applyGate(state, gate, index / 96)));
}
