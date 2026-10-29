/** Straight-line motion, constant signed velocity. t is elapsed time in seconds (>= 0).
 * All values are SI. s and s0 are signed positions, not travelled distances.
 */
export const fields = ['s0', 's', 'v', 't'] as const;
export type Field = (typeof fields)[number];
export type Values = Partial<Record<Field, number>>;
export type MotionResult =
  | { status: 'incomplete' }
  | { status: 'invalid'; code: 'non-finite' | 'negative-time' | 'too-many' }
  | { status: 'no-solution' | 'underdetermined' }
  | { status: 'success'; field: Field; value: number; assumedInitial: boolean; values: Record<Field, number> };

export function solveUniformMotion(input: Values): MotionResult {
  const known = fields.filter(key => input[key] !== undefined);
  if (known.some(key => !Number.isFinite(input[key]))) return { status: 'invalid', code: 'non-finite' };
  if (input.t !== undefined && input.t < 0) return { status: 'invalid', code: 'negative-time' };
  if (known.length === 4) return { status: 'invalid', code: 'too-many' };
  const values = { ...input };
  const assumedInitial = known.length === 2 && input.s0 === undefined;
  if (assumedInitial) values.s0 = 0;
  const missing = fields.filter(key => values[key] === undefined);
  if (missing.length !== 1) return { status: 'incomplete' };
  const field = missing[0];
  let value: number;
  if (field === 's') value = values.s0! + values.v! * values.t!;
  else if (field === 's0') value = values.s! - values.v! * values.t!;
  else {
    const displacement = values.s! - values.s0!;
    const denominator = field === 'v' ? values.t! : values.v!;
    if (denominator === 0) return { status: displacement === 0 ? 'underdetermined' : 'no-solution' };
    value = displacement / denominator;
  }
  if (!Number.isFinite(value)) return { status: 'invalid', code: 'non-finite' };
  if (field === 't' && value < 0) return { status: 'no-solution' };
  return { status: 'success', field, value, assumedInitial, values: { ...values, [field]: value } as Record<Field, number> };
}
