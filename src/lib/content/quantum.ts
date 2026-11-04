import type { ModelDefinition } from './model-types.ts';
import type { GateId } from '../physics/quantum/qubit.ts';
export const qubitGates: readonly { id: GateId; label: string; matrix: string }[] = [
  { id: 'X', label: 'X', matrix: String.raw`X = \begin{pmatrix}0&1\\1&0\end{pmatrix}` },
  { id: 'Y', label: 'Y', matrix: String.raw`Y = \begin{pmatrix}0&-i\\i&0\end{pmatrix}` },
  { id: 'Z', label: 'Z', matrix: String.raw`Z = \begin{pmatrix}1&0\\0&-1\end{pmatrix}` },
  { id: 'sqrtX', label: '√X', matrix: String.raw`\sqrt{X} = \frac12\begin{pmatrix}1+i&1-i\\1-i&1+i\end{pmatrix}` },
  { id: 'sqrtZ', label: '√Z', matrix: String.raw`\sqrt{Z} = S = \begin{pmatrix}1&0\\0&i\end{pmatrix}` },
  { id: 'H', label: 'H', matrix: String.raw`H = \frac{1}{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}` },
  { id: 'Rx', label: 'Rₓ', matrix: String.raw`R_x(\gamma)=\begin{pmatrix}\cos\frac\gamma2&-i\sin\frac\gamma2\\-i\sin\frac\gamma2&\cos\frac\gamma2\end{pmatrix}` },
  { id: 'Ry', label: 'Rᵧ', matrix: String.raw`R_y(\gamma)=\begin{pmatrix}\cos\frac\gamma2&-\sin\frac\gamma2\\\sin\frac\gamma2&\cos\frac\gamma2\end{pmatrix}` },
  { id: 'Rz', label: 'Rz', matrix: String.raw`R_z(\gamma)=\begin{pmatrix}e^{-i\gamma/2}&0\\0&e^{i\gamma/2}\end{pmatrix}` },
  { id: 'U', label: 'U', matrix: String.raw`U(\theta,\phi,\lambda)=\begin{pmatrix}\cos\frac\theta2&-e^{i\lambda}\sin\frac\theta2\\e^{i\phi}\sin\frac\theta2&e^{i(\phi+\lambda)}\cos\frac\theta2\end{pmatrix}` }
];
export const qubitModel: ModelDefinition = {
  id: 'qubit', topicId: 'quantum', calculator: 'qubit', title: 'Qubit',
  variables: [
    { name: 'complex amplitude of |0⟩', symbol: 'α', unit: '1', unitName: 'dimensionless' },
    { name: 'complex amplitude of |1⟩', symbol: 'β', unit: '1', unitName: 'dimensionless' },
    { name: 'polar angle', symbol: 'θ', unit: 'rad', unitName: 'radian' },
    { name: 'azimuthal angle', symbol: 'φ', unit: 'rad', unitName: 'radian' }
  ],
  formulas: [
    { label: 'Pure state', expression: String.raw`|\psi\rangle=\alpha|0\rangle+\beta|1\rangle,\quad |\alpha|^2+|\beta|^2=1` },
    { label: 'Bloch representation (up to global phase)', expression: String.raw`|\psi\rangle\sim\cos\frac\theta2|0\rangle+e^{i\phi}\sin\frac\theta2|1\rangle` },
    { label: 'Bloch vector', expression: String.raw`\mathbf r=(2\operatorname{Re}(\alpha^*\beta),\;2\operatorname{Im}(\alpha^*\beta),\;|\alpha|^2-|\beta|^2)` },
    { label: 'Gate action', expression: String.raw`\begin{pmatrix}\alpha'\\\beta'\end{pmatrix}=G\begin{pmatrix}\alpha\\\beta\end{pmatrix}` },
    { label: 'Z-basis probabilities', expression: String.raw`P(0)=|\alpha|^2,\quad P(1)=|\beta|^2` },
    ...qubitGates.map(gate => ({ label: gate.label, expression: gate.matrix }))
  ],
  notes: [
    { text: 'Requires complex numbers, vectors and matrix multiplication. This simulator describes one pure, isolated qubit with ideal unitary gates. It excludes noise, mixed states, entanglement and measurement collapse. Probabilities refer to measurement in the computational (Z) basis.' },
    { text: 'X, Y and Z rotate the Bloch vector by π about their respective axes; √X and √Z rotate it by π/2. H rotates by π about (x + z)/√2. Global phase is retained in the amplitudes but is invisible on the sphere and does not affect measurement probabilities.' },
    { text: 'For U, θ is in [0, π] and φ, λ are in [0, 2π). Gate animations illustrate continuous unitary paths, not physical pulse timing. The azimuth φ is undefined at the poles.' }
  ],
  references: [{ title: 'IBM Quantum Learning — Bits, gates, and circuits', url: 'https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits' }]
};
