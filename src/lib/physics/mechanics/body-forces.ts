export type Vector = { x: number; y: number };
export type AppliedForce = { point: Vector; force: Vector };
export type BodyState = { x: number; y: number; vx: number; vy: number; angle: number; omega: number };
export const initialBody = (): BodyState => ({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, omega: 0 });
// Metres, kilograms, seconds. Fixed illustrative mass distribution about SP.
export const bodyMass = 1;
export const bodyInertia = 0.6;
export function rotate(v: Vector, angle: number): Vector {
  return { x: v.x * Math.cos(angle) - v.y * Math.sin(angle), y: v.x * Math.sin(angle) + v.y * Math.cos(angle) };
}
export function bodyWrench(forces: readonly AppliedForce[], angle: number) {
  return forces.reduce((sum, f) => {
    const r = rotate(f.point, angle);
    return { x: sum.x + f.force.x, y: sum.y + f.force.y, torque: sum.torque + r.x * f.force.y - r.y * f.force.x };
  }, { x: 0, y: 0, torque: 0 });
}
/** Midpoint integration: body-fixed application points, space-fixed forces. */
export function stepBody(state: BodyState, forces: readonly AppliedForce[], dt: number): BodyState {
  if (!Number.isFinite(dt) || dt < 0 || dt > 0.02 || !Object.values(state).every(Number.isFinite) || forces.some(f => ![f.point.x,f.point.y,f.force.x,f.force.y].every(Number.isFinite))) throw new RangeError('Invalid simulation state');
  const a = bodyWrench(forces, state.angle);
  const mid = bodyWrench(forces, state.angle + state.omega * dt / 2 + a.torque / bodyInertia * dt * dt / 8);
  return { x: state.x + state.vx * dt + a.x / bodyMass * dt * dt / 2,
    y: state.y + state.vy * dt + a.y / bodyMass * dt * dt / 2,
    vx: state.vx + a.x / bodyMass * dt, vy: state.vy + a.y / bodyMass * dt,
    angle: state.angle + state.omega * dt + mid.torque / bodyInertia * dt * dt / 2,
    omega: state.omega + mid.torque / bodyInertia * dt };
}

/** Editing one force drives the other while preserving its magnitude/direction when unconstrained.
 * Parallel includes antiparallel: preserve the nearer orientation; at a perpendicular
 * crossing use the previous orientation, so dragging can deliberately reverse the pair.
 * Zero has no direction: use the previous direction, then the other vector, then +x.
 */
export function constrainForcePair(
  vectors: readonly [Vector, Vector], index: 0 | 1, next: Vector,
  equalMagnitude: boolean, parallel: boolean
): [Vector, Vector] {
  if (![...vectors.flatMap(v => [v.x, v.y]), next.x, next.y].every(Number.isFinite)) throw new RangeError('Invalid force');
  const other = vectors[1 - index];
  const magnitude = Math.hypot(next.x, next.y), otherMagnitude = Math.hypot(other.x, other.y);
  const unit = (v: Vector, fallback: Vector): Vector => {
    const length = Math.hypot(v.x, v.y);
    return length > 0 ? { x: v.x / length, y: v.y / length } : fallback;
  };
  const direction = unit(next, unit(vectors[index], unit(other, { x: 1, y: 0 })));
  let otherDirection = unit(other, direction);
  if (parallel) {
    let dot = direction.x * other.x + direction.y * other.y;
    if (Math.abs(dot) <= otherMagnitude * 1e-12) dot = vectors[index].x * other.x + vectors[index].y * other.y;
    const sign = dot < 0 ? -1 : 1;
    otherDirection = { x: sign * direction.x, y: sign * direction.y };
  }
  const length = equalMagnitude ? magnitude : otherMagnitude;
  const adjusted = equalMagnitude || parallel ? { x: otherDirection.x * length, y: otherDirection.y * length } : { ...other };
  return index === 0 ? [{ ...next }, adjusted] : [adjusted, { ...next }];
}

/** Resultant applied at the intersection of the two nonparallel lines of action.
 * Relative sine <= 1e-12 is numerically indistinguishable from parallel.
 */
export function intersectingResultant(forces: readonly AppliedForce[], angle: number): AppliedForce | null {
  if (forces.length !== 2 || !Number.isFinite(angle) || forces.some(f => ![f.point.x,f.point.y,f.force.x,f.force.y].every(Number.isFinite))) return null;
  const [a,b] = forces;
  const scale = Math.hypot(a.force.x,a.force.y)*Math.hypot(b.force.x,b.force.y);
  const determinant = a.force.x*b.force.y-a.force.y*b.force.x;
  if (scale === 0 || Math.abs(determinant) <= scale*1e-12) return null;
  const p = rotate(a.point,angle), q = rotate(b.point,angle);
  const t = ((q.x-p.x)*b.force.y-(q.y-p.y)*b.force.x)/determinant;
  const point = {x:p.x+t*a.force.x,y:p.y+t*a.force.y};
  const sum = bodyWrench(forces,angle);
  return [point.x,point.y,sum.x,sum.y].every(Number.isFinite) ? {point,force:{x:sum.x,y:sum.y}} : null;
}
