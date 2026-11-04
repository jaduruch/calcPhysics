import { solveTotalReflection, type ReflectionResult } from '../physics/optics/total-internal-reflection.ts';
export type RayPoint = { x: number; y: number };
const origin = { x: 320, y: 190 };
/** Project the same solver angles into a meridional ray cross-section. */
export function totalReflectionScene(result: Extract<ReflectionResult, { status: 'success' }> | null) {
  const schematic = !result?.incidence;
  const preview = solveTotalReflection({ n1: 1.5, n2: 1, angle: 0.5 });
  if (preview.status !== 'success' || !preview.incidence) throw new Error('Invalid reference ray');
  const data = !schematic ? result! : preview;
  const incidence = data.incidence!;
  const point = (angle: number, horizontal: number, vertical: number, radius = 145): RayPoint => ({
    x: origin.x + horizontal * radius * Math.sin(angle),
    y: origin.y + vertical * radius * Math.cos(angle)
  });
  const arc = (angle: number, horizontal: number, vertical: number) => Array.from({ length: 49 }, (_, index) => point(angle * index / 48, horizontal, vertical, 46));
  return {
    origin, schematic,
    incident: point(incidence.angle, -1, 1),
    reflected: data.n1 === data.n2 ? null : point(incidence.reflectedAngle, 1, 1),
    transmitted: incidence.transmittedAngle === null ? null : point(incidence.transmittedAngle, 1, -1),
    incidenceArc: arc(incidence.angle, -1, 1),
    incidenceLabel: point(incidence.angle / 2, -1, 1, 65),
    transmissionArc: incidence.transmittedAngle === null ? [] : arc(incidence.transmittedAngle, 1, -1),
    transmissionLabel: incidence.transmittedAngle === null ? null : point(incidence.transmittedAngle / 2, 1, -1, 65),
    labelAngles: !schematic && incidence.angle > .08
  };
}
