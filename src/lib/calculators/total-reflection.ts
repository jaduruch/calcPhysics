import { quantityLatex } from './quantities.ts';
import { getUnit, type QuantityKind } from '../physics/units.ts';
import type { ReflectionResult } from '../physics/optics/total-internal-reflection.ts';
export const reflectionKinds: Record<'n1' | 'n2' | 'angle', QuantityKind> = { n1: 'dimensionless', n2: 'dimensionless', angle: 'angle' };
export const reflectionUnits = { n1: '1', n2: '1', angle: 'rad' };
const q = (value: number) => quantityLatex(value, '', false);
const a = (value: number) => `${quantityLatex(value, 'rad', false)}\\approx ${q(value * 180 / Math.PI)}^\\circ`;
export function reflectionEquations(result: Extract<ReflectionResult, { status: 'success' }>, angleUnit: string) {
  const { n1, n2, criticalAngle, incidence } = result;
  const factor = getUnit('angle', angleUnit);
  const conversions = incidence && angleUnit !== 'rad' ? [String.raw`\theta_1=${q(incidence.angle / factor.factor)}^\circ\cdot\frac{\pi\,\mathrm{rad}}{180^\circ}\approx ${quantityLatex(incidence.angle, 'rad', false)}`] : [];
  const critical = criticalAngle === null ? '' : String.raw`\theta_c=\arcsin\!\left(\frac{n_2}{n_1}\right)=\arcsin\!\left(\frac{${q(n2)}}{${q(n1)}}\right)\approx ${a(criticalAngle)}`;
  const reflected = !incidence || n1 === n2 ? '' : String.raw`\theta_r=\theta_1=${quantityLatex(incidence.angle, 'rad', false)}\approx ${q(incidence.angle * 180 / Math.PI)}^\circ`;
  const transmitted = !incidence || incidence.transmittedAngle === null ? '' : incidence.regime === 'critical'
    ? String.raw`\theta_2=\frac{\pi}{2}\,\mathrm{rad}=90^\circ`
    : String.raw`\theta_2=\arcsin\!\left(\frac{n_1}{n_2}\sin\theta_1\right)=\arcsin\!\left(\frac{${q(n1)}}{${q(n2)}}\cdot\sin\!\left(${quantityLatex(incidence.angle, 'rad', false)}\right)\right)\approx ${a(incidence.transmittedAngle)}`;
  return { conversions, critical, reflected, transmitted };
}
