/** Flat boundary between two homogeneous, isotropic, non-magnetic, transparent media.
 * Positive real refractive indices, angles from the normal (radians).
 * Geometrical ray paths only; no Fresnel intensities or evanescent-field model.
 * https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection
 */
export type ReflectionInput = { n1?: number; n2?: number; angle?: number };
export type ReflectionRegime = 'refraction' | 'critical' | 'total-reflection';
export type ReflectionResult =
  | { status: 'incomplete' }
  | { status: 'invalid'; fields: readonly (keyof ReflectionInput)[]; code: 'domain' | 'numerical' }
  | { status: 'success'; n1: number; n2: number; criticalAngle: number | null;
      incidence: { angle: number; reflectedAngle: number; transmittedAngle: number | null; regime: ReflectionRegime } | null };
/** Angular roundoff band only, eight IEEE-754 epsilons relative to the compared radian angles. */
export const criticalAngleTolerance = 8 * Number.EPSILON;
export function solveTotalReflection(input: ReflectionInput): ReflectionResult {
  const invalid = (['n1', 'n2', 'angle'] as const).filter(key => {
    const value = input[key];
    return value !== undefined && (!Number.isFinite(value) || (key === 'angle' ? value < 0 || value >= Math.PI / 2 : value <= 0));
  });
  if (invalid.length) return { status: 'invalid', fields: invalid, code: 'domain' };
  const { n1, n2, angle } = input;
  if (n1 === undefined || n2 === undefined) return { status: 'incomplete' };
  const criticalRatio = n2 / n1;
  if (n1 > n2 && criticalRatio === 0) return { status: 'invalid', fields: [], code: 'numerical' };
  const criticalAngle = n1 > n2 ? Math.asin(criticalRatio) : null;
  const base = { status: 'success' as const, n1, n2, criticalAngle };
  if (angle === undefined) return { ...base, incidence: null };
  if (criticalAngle !== null) {
    const delta = angle - criticalAngle;
    if (Math.abs(delta) <= criticalAngleTolerance * Math.max(angle, criticalAngle) && angle > 0) {
      return { ...base, incidence: { angle, reflectedAngle: angle, transmittedAngle: Math.PI / 2, regime: 'critical' } };
    }
    if (delta > 0) return { ...base, incidence: { angle, reflectedAngle: angle, transmittedAngle: null, regime: 'total-reflection' } };
  }
  const sine = n1 > n2 ? Math.sin(angle) / criticalRatio : (n1 / n2) * Math.sin(angle);
  if (!Number.isFinite(sine) || sine > 1 || (angle > 0 && sine === 0)) return { status: 'invalid', fields: [], code: 'numerical' };
  const transmittedAngle = n1 === n2 ? angle : Math.asin(sine);
  return { ...base, incidence: { angle, reflectedAngle: angle, transmittedAngle, regime: 'refraction' } };
}
