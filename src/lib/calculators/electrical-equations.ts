import { formatQuantity } from './quantities.ts';
import { getUnit, unitGroups } from '../physics/units.ts';
import type { ElectricalDefinition, ElectricalField } from '../content/electricity.ts';
import { MU0, EPS0 } from '../physics/electricity.ts';
import type { ElectricalResult } from '../physics/electricity.ts';

const symbols: Record<string, string> = {
  Uin: 'U_{in}', Uout: 'U_{out}', Up: 'U_p', Upp: 'U_{pp}', Urms: 'U_{rms}', Uavg: 'U_{avg}',
  U1: 'U_1', U2: 'U_2', Uind: 'U_{ind}', Umot: 'U_{mot}', lm: 'l_{c}', I1: 'I_1', I2: 'I_2', N1: 'N_1', N2: 'N_2',
  R1: 'R_1', R2: 'R_2', RL: 'R_L', C1: 'C_1', C2: 'C_2', P1: 'P_1', P2: 'P_2',
  IR2: 'I_{R2}', IL: 'I_L', Rt: 'R_t', Rp: 'R_p',
  Phi: String.raw`\Phi`, Theta: String.raw`\Theta`, dPhi: String.raw`\Delta\Phi`, dt: String.raw`\Delta t`,
  dI: String.raw`\Delta I`, mu: String.raw`\mu_r`, er: String.raw`\epsilon_r`,
  phi: String.raw`\phi`, eta: String.raw`\eta`, tau: String.raw`\tau`, ut: 'u(t)', it: 'i(t)',
  AL: 'A_L', Rm: 'R_m', f0: 'f_0', fc: 'f_c', Qfactor: 'Q', bw: 'b',
  gain: 'g', attenuation: 'a', ratio: 'V', ton: 't_{on}', UL: 'U_L',
  Ip: 'I_p', u1: 'u_1', u2: 'u_2', u3: 'u_3', Xc: 'X_C', Qc: 'Q_C',
  Xl: 'X_L', Ql: 'Q_L', UR: 'U_R', UC: 'U_C', IR: 'I_R', IC: 'I_C', cosPhi: String.raw`\cos(\phi)`, sinPhi: String.raw`\sin(\phi)`
};
export function electricalSymbol(id: string): string { return symbols[id] ?? (/^[RCL][1-9]\d*$/.test(id) ? `${id[0]}_{${id.slice(1)}}` : id); }
const numeric = (value: string) => value.replace(/e\+?(-?\d+)/i, String.raw`\times10^{$1}`);
export function electricalQuantity(value: number, unit: string, engineering = true): string {
  const formatted = engineering ? formatQuantity(value) : { number: value.toPrecision(3), prefix: '' };
  const symbol = unit === '1' ? '' : unit.replace('Ω', String.raw`\Omega`).replace('²', '^2').replace('%', String.raw`\%`);
  const prefix = formatted.prefix === 'u' ? String.raw`\mu ` : formatted.prefix;
  return `${numeric(formatted.number)}${symbol ? `\\,\\mathrm{${prefix}${symbol}}` : ''}`;
}
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** All substitutions come from the same validated SI result as the diagrams. */
export function electricalEquations(definition: ElectricalDefinition, result: ElectricalResult, units: Record<string, string>): string[] {
  if (result.status !== 'success') return [];
  const values = { ...result.values, ...result.outputs };
  const fields: readonly ElectricalField[] = [...definition.inputs, ...definition.outputs];
  const substitutions = new Map(fields.filter(field => values[field.id] !== undefined).map(field => [electricalSymbol(field.id), `\\left(${electricalQuantity(values[field.id], unitGroups[field.kind].si, false)}\\right)`]));
  substitutions.set(String.raw`\mu_0`, `\\left(${electricalQuantity(MU0, 'H/m', false)}\\right)`);
  substitutions.set(String.raw`\epsilon_0`, `\\left(${electricalQuantity(EPS0, 'F/m', false)}\\right)`);
  const tokens = [...substitutions.keys()].sort((a,b) => b.length-a.length);
  const pattern = new RegExp(`(?:${tokens.map(escapeRegExp).join('|')}|\\\\[a-zA-Z]+)`, 'g');
  return definition.outputs.filter(output => result.outputs[output.id] !== undefined).map(output => {
    const unit = units[output.id] ?? unitGroups[output.kind].si;
    const step = result.steps?.find(step => step.target === output.id);
    const ids = [...fields.map(field => field.id)].sort((a,b)=>b.length-a.length);
    const idPattern = new RegExp(`(?:${ids.map(escapeRegExp).join('|')}|\\\\[a-zA-Z]+)`, 'g');
    const formula = step ? step.formula.replace(idPattern, token => ids.includes(token) ? `${electricalSymbol(token)} ` : token) : output.formula;
    const substitution = formula.replace(pattern, token => substitutions.get(token) ?? token);
    return `${electricalSymbol(output.id)} = ${formula} = ${substitution} \\approx ${electricalQuantity(result.outputs[output.id] / getUnit(output.kind, unit).factor, unit, output.kind !== 'ratio' && output.kind !== 'angle' && output.kind !== 'decibel' && output.kind !== 'dimensionless')}`;
  });
}
