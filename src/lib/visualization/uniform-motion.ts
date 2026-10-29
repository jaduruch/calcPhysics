import type { MotionResult } from '../physics/mechanics/uniform-motion.ts';

export interface MotionCharts {
  times: number[];
  positions: number[];
  velocities: number[];
}
/** Linear interpolation between the solver's unrounded endpoints; no independent solver. */
export function uniformMotionChartData(result: MotionResult): MotionCharts | null {
  if (result.status !== 'success') return null;
  const { s0, s, v, t } = result.values;
  if (t === 0) return { times: [0], positions: [s0], velocities: [v] };
  const fractions = Array.from({ length: 11 }, (_, index) => index / 10);
  return {
    times: fractions.map(fraction => t * fraction),
    positions: fractions.map((fraction, index) => index === 0 ? s0 : index === 10 ? s : s0 * (1 - fraction) + s * fraction),
    velocities: fractions.map(() => v)
  };
}
