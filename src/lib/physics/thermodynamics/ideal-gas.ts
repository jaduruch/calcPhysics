/** Ideal gas in equilibrium, absolute pressure and temperature; p,V,n,T > 0.
 * R = N_A k_B, from the exact SI defining constants. No real-gas corrections.
 * https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas
 */
export const gasConstant = 6.02214076e23 * 1.380649e-23;
export const gasFields = ['p', 'V', 'n', 'T'] as const;
export type GasField = typeof gasFields[number];
export type GasValues = Partial<Record<GasField, number>>;
export type GasResult = { status: 'incomplete' | 'invalid' | 'consistent' | 'conflict' } | { status: 'success'; field: GasField; value: number };
export function solveIdealGas(values: GasValues): GasResult {
  const known = gasFields.filter(field => values[field] !== undefined);
  if (known.some(field => !Number.isFinite(values[field]) || values[field]! <= 0)) return { status: 'invalid' };
  if (known.length < 3) return { status: 'incomplete' };
  // Logarithms avoid overflow in intermediate products for finite valid states.
  const { p, V, n, T } = values;
  if (known.length === 4) {
    const residual = Math.log(p!) + Math.log(V!) - Math.log(n!) - Math.log(gasConstant) - Math.log(T!);
    return { status: Math.abs(residual) <= 1e-10 ? 'consistent' : 'conflict' };
  }
  const field = gasFields.find(field => values[field] === undefined)!;
  const logR = Math.log(gasConstant);
  const logarithm = field === 'p' ? Math.log(n!) + logR + Math.log(T!) - Math.log(V!)
    : field === 'V' ? Math.log(n!) + logR + Math.log(T!) - Math.log(p!)
    : field === 'n' ? Math.log(p!) + Math.log(V!) - logR - Math.log(T!)
    : Math.log(p!) + Math.log(V!) - Math.log(n!) - logR;
  const value = Math.exp(logarithm);
  return Number.isFinite(value) && value > 0 ? { status: 'success', field, value } : { status: 'invalid' };
}
