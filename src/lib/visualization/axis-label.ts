/** Three significant figures; large and small axis values use an explicit power of ten. */
export function formatAxisLabel(value: number): { coefficient: string; exponent?: number } {
  if (value === 0) return { coefficient: '0' };
  const rounded = Number(value.toPrecision(3));
  if (Math.abs(value) >= 1000 || Math.abs(rounded) >= 1000 || Math.abs(value) <= 0.001 || Math.abs(rounded) <= 0.001) {
    const [coefficient, exponent] = value.toExponential(2).split('e');
    return { coefficient: Number(coefficient).toString(), exponent: Number(exponent) };
  }
  return { coefficient: rounded.toString() };
}
