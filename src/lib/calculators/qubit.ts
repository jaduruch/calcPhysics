import type { Complex, Qubit } from '../physics/quantum/qubit.ts';
/** Dimensionless complex amplitudes: three significant digits, no SI prefixes. */
export function qubitNumber(value: number): string {
  if (Math.abs(value) < 5e-15) return '0.00';
  return value.toPrecision(3).replace(/e\+?(-?\d+)/i, String.raw`\times 10^{$1}`);
}
export function complexLatex(value: Complex): string {
  if (Math.abs(value.im) < 5e-15) return qubitNumber(value.re);
  if (Math.abs(value.re) < 5e-15) return `${qubitNumber(value.im)}i`;
  return `${qubitNumber(value.re)} ${value.im < 0 ? '-' : '+'} ${qubitNumber(Math.abs(value.im))}i`;
}
export function qubitStateEquation(state: Qubit): string {
  return String.raw`|\psi\rangle = \alpha|0\rangle + \beta|1\rangle \approx \begin{pmatrix}${complexLatex(state[0])}\\${complexLatex(state[1])}\end{pmatrix}`;
}
