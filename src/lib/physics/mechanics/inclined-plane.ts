/** Rigid body on a plane, positive downhill. With kinetic friction, already sliding downhill.
 * No applied force, drag, rolling or static-friction/start-from-rest prediction.
 * Source: OpenStax University Physics 1, §6.2 Friction and the Inclined Plane.
 */
export type InclineInput = { mass?: number; angle?: number; friction?: number; gravity?: number; length?: number; height?: number };
export type InclineResult =
  | { status: 'incomplete' }
  | { status: 'invalid'; code: 'domain' | 'non-finite' | 'geometry'; fields: (keyof InclineInput)[] }
  | { status: 'success'; mass: number; angle: number; friction: number; gravity: number;
      length?: number; height?: number; geometryTarget?: 'angle' | 'length' | 'height'; endVelocity?: number; motion?: 'reachable' | 'stationary' | 'no-start';
      weight: number; normal: number; parallel: number; frictionForce: number; net: number; acceleration: number };
export function solveInclinedPlane(input: InclineInput): InclineResult {
  const invalid = (Object.keys(input) as (keyof InclineInput)[]).filter(key => input[key] !== undefined && !Number.isFinite(input[key]));
  if (invalid.length) return { status: 'invalid', code: 'non-finite', fields: invalid };
  const { mass, friction = 0, gravity = 9.81 } = input;
  let { angle, length, height } = input;
  let geometryTarget: 'angle' | 'length' | 'height' | undefined;
  const fields: (keyof InclineInput)[] = [];
  if (mass !== undefined && mass <= 0) fields.push('mass');
  if (angle !== undefined && (angle < 0 || angle > Math.PI / 2)) fields.push('angle');
  if (length !== undefined && length <= 0) fields.push('length');
  if (height !== undefined && height < 0) fields.push('height');
  if (friction < 0) fields.push('friction');
  if (gravity <= 0) fields.push('gravity');
  if (fields.length) return { status: 'invalid', code: 'domain', fields };
  if (length !== undefined && height !== undefined && height > length) return { status: 'invalid', code: 'geometry', fields: ['length', 'height'] };
  if (angle === undefined && length !== undefined && height !== undefined) {
    angle = Math.asin(height / length); geometryTarget = 'angle';
  } else if (angle !== undefined && length !== undefined && height === undefined) {
    height = length * Math.sin(angle); geometryTarget = 'height';
  } else if (angle !== undefined && height !== undefined && length === undefined && angle > 0) {
    length = height / Math.sin(angle); geometryTarget = 'length';
    if (length <= 0) return { status: 'invalid', code: 'geometry', fields: ['angle', 'height'] };
  }
  if (angle !== undefined && length !== undefined && height !== undefined && Math.abs(height / length - Math.sin(angle)) > 1e-12) return { status: 'invalid', code: 'geometry', fields: ['angle', 'length', 'height'] };
  if (angle === 0 && height !== undefined && height > 0) return { status: 'invalid', code: 'geometry', fields: ['angle', 'height'] };
  if (mass === undefined || angle === undefined) return { status: 'incomplete' };
  // Set trigonometric endpoint values exactly to avoid fictitious residual contact at 90°.
  const sin = angle === Math.PI / 2 ? 1 : Math.sin(angle);
  const cos = angle === Math.PI / 2 ? 0 : Math.cos(angle);
  const weight = mass * gravity;
  const normal = weight * cos;
  const parallel = weight * sin;
  const frictionForce = friction * normal;
  const net = parallel - frictionForce;
  const acceleration = gravity * (sin - friction * cos);
  if (![weight, normal, parallel, frictionForce, net, acceleration].every(Number.isFinite) || weight === 0) return { status: 'invalid', code: 'non-finite', fields: [] };
  if (length !== undefined && !Number.isFinite(length)) return { status: 'invalid', code: 'non-finite', fields: ['length'] };
  const endVelocity = length !== undefined && acceleration > 0 ? Math.sqrt(2 * acceleration * length) : length !== undefined && acceleration === 0 && friction === 0 ? 0 : undefined;
  if (endVelocity !== undefined && !Number.isFinite(endVelocity)) return { status: 'invalid', code: 'non-finite', fields: [] };
  return { status: 'success', length, height, geometryTarget, endVelocity, motion: length === undefined ? undefined : endVelocity === undefined ? 'no-start' : endVelocity === 0 ? 'stationary' : 'reachable', mass, angle, friction, gravity, weight, normal, parallel, frictionForce, net, acceleration };
}
