import type { DopplerValues } from '../physics/waves/doppler.ts';
/** Lengths in c/f_s, time in source periods; a common scale preserves geometry.
 * Every front keeps its emission center x_s(t_e), radius c(t - t_e).
 * The selected interval ends before source and observer pass one another.
 */
export function dopplerScene(values: DopplerValues, phase: number) {
  const sourceMach = values.vs / values.c;
  const observerMach = values.vo / values.c;
  const closure = sourceMach + observerMach;
  const duration = closure > 0 ? Math.min(6, 3 / closure) : 6;
  const time = Math.max(0, Math.min(duration, phase));
  const source = sourceMach * time;
  const observer = 6 - observerMach * time;
  const center = (source + observer) / 2;
  const scale = Math.min(38, 400 / (observer - source + 4));
  const project = (x: number) => 320 + (x - center) * scale;
  const fronts = Array.from({ length: 22 }, (_, index) => {
    const emission = Math.floor(time) - index;
    return { emission, center: sourceMach * emission, radius: time - emission, cx: project(sourceMach * emission), r: (time - emission) * scale };
  });
  return { sourcePosition: source, observerPosition: observer, source: project(source), observer: project(observer), fronts, scale, duration, time,
    sourceArrow: sourceMach * 60, observerArrow: -observerMach * 60 };
}
