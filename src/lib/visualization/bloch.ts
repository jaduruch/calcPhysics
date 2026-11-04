import type { Vector3 } from '../physics/quantum/qubit.ts';
export type Camera = { yaw: number; elevation: number };
export const defaultBlochCamera: Camera = { yaw: -0.65, elevation: 0.35 };
/** Angle guides in world coordinates, independent of the viewing camera.
 * At the south pole, use the xz plane to illustrate θ = π; azimuth stays undefined.
 */
export function blochAngleGuides(vector: Vector3) {
  const radial = Math.hypot(vector.x, vector.y);
  const southPole = radial < 1e-12 && vector.z < 0;
  if (radial < 1e-12 && !southPole) return null;
  const theta = southPole ? Math.PI : Math.atan2(radial, vector.z);
  const direction = southPole ? { x: 1, y: 0 } : { x: vector.x / radial, y: vector.y / radial };
  const phi = (Math.atan2(vector.y, vector.x) + 2 * Math.PI) % (2 * Math.PI);
  const meridian = (angle: number, radius: number): Vector3 => ({
    x: radius * Math.sin(angle) * direction.x,
    y: radius * Math.sin(angle) * direction.y,
    z: radius * Math.cos(angle)
  });
  const equator = (angle: number, radius: number): Vector3 => ({ x: radius * Math.cos(angle), y: radius * Math.sin(angle), z: 0 });
  return {
    southPole,
    foot: { x: vector.x, y: vector.y, z: 0 },
    thetaArc: Array.from({ length: 49 }, (_, index) => meridian(theta * index / 48, 0.42)),
    phiArc: southPole ? [] : Array.from({ length: 97 }, (_, index) => equator(phi * index / 96, 0.36)),
    thetaLabel: meridian(theta / 2, 0.56),
    phiLabel: southPole ? null : equator(phi / 2, 0.49)
  };
}
/** Right-handed camera basis: screen-right × screen-up = toward-viewer.
 * At yaw = elevation = 0, +y points right, +z up and +x toward the viewer.
 * SVG's downward y direction is applied only after the 3D camera transform.
 * Camera distance: 4 sphere radii.
 */
export function projectBloch(point: Vector3, camera: Camera) {
  const horizontal = Math.sin(camera.yaw) * point.x + Math.cos(camera.yaw) * point.y;
  const forward = Math.cos(camera.yaw) * point.x - Math.sin(camera.yaw) * point.y;
  const vertical = Math.cos(camera.elevation) * point.z - Math.sin(camera.elevation) * forward;
  const depth = Math.cos(camera.elevation) * forward + Math.sin(camera.elevation) * point.z;
  const scale = 126 * 4 / (4 - depth);
  return { x: 240 + horizontal * scale, y: 195 - vertical * scale, depth };
}
export const sphereGrid: readonly (readonly Vector3[])[] = [
  ...[-0.5, 0, 0.5].map(z => Array.from({ length: 97 }, (_, index) => {
    const t = index * 2 * Math.PI / 96, r = Math.sqrt(1 - z * z);
    return { x: r * Math.cos(t), y: r * Math.sin(t), z };
  })),
  ...Array.from({ length: 6 }, (_, meridian) => Array.from({ length: 97 }, (_, index) => {
    const t = index * 2 * Math.PI / 96, phi = meridian * Math.PI / 6;
    return { x: Math.cos(phi) * Math.sin(t), y: Math.sin(phi) * Math.sin(t), z: Math.cos(t) };
  }))
];
export const blochLabels = [
  { point: { x: 1.28, y: 0, z: 0 }, text: '+x |+⟩' },
  { point: { x: 0, y: 1.28, z: 0 }, text: '+y |+i⟩' },
  { point: { x: 0, y: 0, z: 1.28 }, text: '+z |0⟩' },
  { point: { x: 0, y: 0, z: -1.28 }, text: '−z |1⟩' }
] as const;
