/** Collinear classical acoustic Doppler effect in a uniform stationary medium.
 * Positive source speed points toward the observer; positive observer speed
 * points toward the source (opposite spatial directions). All speeds relative
 * to the medium. Constant subsonic motion, before source/observer pass.
 * https://openstax.org/books/university-physics-volume-1/pages/17-7-the-doppler-effect
 */
export const DEFAULT_SOUND_SPEED = 343;
export const dopplerFields = ['fs', 'fo', 'vs', 'vo'] as const;
export type DopplerField = typeof dopplerFields[number];
export type DopplerInput = Partial<Record<DopplerField | 'c', number>>;
export type DopplerValues = Record<DopplerField | 'c', number>;
export type DopplerResult =
  | { status: 'incomplete' | 'conflict' | 'no-solution' }
  | { status: 'invalid'; fields: readonly (DopplerField | 'c')[]; code: 'domain' | 'numerical' }
  | { status: 'success'; values: DopplerValues; field: DopplerField | null; wavelength: number; shift: number; assumedSoundSpeed: boolean };
export function solveDoppler(input: DopplerInput): DopplerResult {
  const c = input.c ?? DEFAULT_SOUND_SPEED;
  const invalid = [...dopplerFields, 'c' as const].filter(field => {
    const value = field === 'c' ? c : input[field];
    if (value === undefined) return false;
    return !Number.isFinite(value) || (field === 'fs' || field === 'fo' || field === 'c' ? value <= 0 : Math.abs(value) >= c);
  });
  if (invalid.length) return { status: 'invalid', fields: invalid, code: 'domain' };
  const known = dopplerFields.filter(field => input[field] !== undefined);
  if (known.length < 3) return { status: 'incomplete' };
  const field = dopplerFields.find(field => input[field] === undefined) ?? null;
  const values = { ...input, c } as DopplerValues;
  const { fs, fo, vs, vo } = values;
  if (field === 'fo') values.fo = fs * ((1 + vo / c) / (1 - vs / c));
  else if (field === 'fs') values.fs = fo * ((1 - vs / c) / (1 + vo / c));
  else if (field === 'vs') values.vs = c * (1 - (fs / fo) * (1 + vo / c));
  else if (field === 'vo') values.vo = c * ((fo / fs) * (1 - vs / c) - 1);
  else {
    // Dimensionless residual: only machine-level consistency, not measurement uncertainty.
    const residual = Math.log(fo) - Math.log(fs) - Math.log1p(vo / c) + Math.log1p(-vs / c);
    if (Math.abs(residual) > 1e-10) return { status: 'conflict' };
  }
  if (!Object.values(values).every(Number.isFinite) || values.fs <= 0 || values.fo <= 0) return { status: 'invalid', fields: field ? [field] : [], code: 'numerical' };
  if (Math.abs(values.vs) >= c || Math.abs(values.vo) >= c) return { status: 'no-solution' };
  const wavelength = Math.exp(Math.log(c) + Math.log1p(-values.vs / c) - Math.log(values.fs));
  const shift = values.fo - values.fs;
  if (!Number.isFinite(wavelength) || wavelength <= 0 || !Number.isFinite(shift)) return { status: 'invalid', fields: [], code: 'numerical' };
  return { status: 'success', values, field, wavelength, shift, assumedSoundSpeed: input.c === undefined };
}
