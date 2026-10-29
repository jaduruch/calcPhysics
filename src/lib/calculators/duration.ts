/** Below 60 SI seconds omit the clock; otherwise MM:SS.s, HH:MM:SS.s, or days.
 * Integer arithmetic avoids overflow for large finite durations and carries across days.
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Duration must be finite and non-negative');
  if (seconds < 60) return '';
  const ticks = BigInt(Math.trunc(seconds)) * 10n + BigInt(Math.round((seconds % 1) * 10));
  const days = ticks / 864000n;
  const hours = (ticks / 36000n) % 24n;
  const minutes = (ticks / 600n) % 60n;
  const wholeSeconds = (ticks / 10n) % 60n;
  const pad = (value: bigint) => value.toString().padStart(2, '0');
  return `${days > 0n ? `${days}d, ` : ''}${ticks >= 36000n ? `${pad(hours)}:` : ''}${pad(minutes)}:${pad(wholeSeconds)}.${ticks % 10n}`;
}
