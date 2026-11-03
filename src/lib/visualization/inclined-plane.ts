import { solveInclinedPlane, type InclineResult } from '../physics/mechanics/inclined-plane.ts';

export type InclineSuccess = Extract<InclineResult, { status: 'success' }>;
export interface SketchPoint { x: number; y: number }
export interface ForceArrow {
  id: 'weight' | 'normal' | 'parallel' | 'friction';
  label: string;
  component: boolean;
  magnitude: number;
  length: number;
  tip: SketchPoint;
  shaftEnd: SketchPoint;
  shaftWidth: number;
  head: SketchPoint[];
  labelPosition: SketchPoint;
}
/** Equal x/y scale keeps geometry and angles faithful. Every arrow uses one force scale.
 * Preview ratios use the same solver with unit mass/gravity, never arbitrary arrow lengths.
 */
export function inclinedPlaneSketch(result: InclineSuccess | null, enteredAngle?: number, enteredFriction?: number) {
  const validAngle = enteredAngle !== undefined && Number.isFinite(enteredAngle) && enteredAngle >= 0 && enteredAngle <= Math.PI / 2;
  const angle = result?.angle ?? (validAngle ? enteredAngle : Math.PI / 6);
  const friction = enteredFriction !== undefined && Number.isFinite(enteredFriction) && enteredFriction >= 0 ? enteredFriction : 0;
  const preview = result ?? solveInclinedPlane({ mass: 1, gravity: 1, angle, friction });
  // A pathological, overflowing preview coefficient must never break the rendering.
  const forces = preview.status === 'success' ? preview : solveInclinedPlane({ mass: 1, gravity: 1, angle, friction: 0 }) as InclineSuccess;
  const cos = angle === Math.PI / 2 ? 0 : Math.cos(angle);
  const sin = Math.sin(angle);
  const base = { x: 85, y: 265 };
  const end = { x: base.x + 235 * cos, y: base.y - 235 * sin };
  const centre = { x: base.x + 120 * cos - 16 * sin, y: base.y - 120 * sin - 16 * cos };
  const largest = Math.max(forces.weight, forces.normal, forces.parallel, forces.frictionForce);
  const vectors = [
    { id: 'weight', label: 'Fg', dx: 0, dy: 1, magnitude: forces.weight, component: false },
    { id: 'normal', label: 'FN', dx: -sin, dy: -cos, magnitude: forces.normal, component: false },
    { id: 'parallel', label: 'F∥', dx: -cos, dy: sin, magnitude: forces.parallel, component: true },
    { id: 'friction', label: 'Ff', dx: cos, dy: -sin, magnitude: forces.frictionForce, component: false }
  ] as const;
  const arrows: ForceArrow[] = vectors.map(vector => {
    const length = 74 * (vector.magnitude / largest);
    const tip = { x: centre.x + vector.dx * length, y: centre.y + vector.dy * length };
    // The tip is exactly the physical endpoint. Shrinking arrowheads preserve tiny ratios.
    const headLength = Math.min(7, length * .35);
    const halfWidth = Math.min(3.5, length * .18);
    const tail = { x: tip.x - vector.dx * headLength, y: tip.y - vector.dy * headLength };
    return {
      id: vector.id, label: vector.label, component: vector.component, magnitude: vector.magnitude, length, tip,
      // Stop at the head's base; the full vector still ends at its unchanged tip.
      shaftEnd: tail,
      shaftWidth: Math.min(2, halfWidth),
      head: [tip, { x: tail.x - vector.dy * halfWidth, y: tail.y + vector.dx * halfWidth }, { x: tail.x + vector.dy * halfWidth, y: tail.y - vector.dx * halfWidth }],
      labelPosition: {
        x: tip.x + vector.dx * 13 + (vector.id === 'weight' ? 12 : vector.id === 'parallel' ? -10 : 0),
        y: tip.y + vector.dy * 13 + 4
      }
    };
  });
  return { angle, cos, sin, base, end, centre, arrows, schematic: !result, angleKnown: !!result || validAngle };
}
