import type { ElectricalResult } from './electricity.ts';
/** Positive finite resistors; an empty trailing field is optional, an interior gap is incomplete. */
export function solveResistorNetwork(given: Readonly<Record<string, number>>, parallel = false): ElectricalResult {
  return solvePositiveNetwork(given, 'R', parallel);
}

/** Ideal positive capacitances: reciprocal sum in series, direct sum in parallel. */
export function solveCapacitorNetwork(given: Readonly<Record<string, number>>, parallel = false): ElectricalResult {
  return solvePositiveNetwork(given, 'C', !parallel);
}

// Positive ideal inductances without mutual magnetic coupling.
export function solveInductorNetwork(given: Readonly<Record<string, number>>, parallel = false): ElectricalResult {
  return solvePositiveNetwork(given, 'L', parallel);
}

function solvePositiveNetwork(given: Readonly<Record<string, number>>, symbol: 'R' | 'C' | 'L', reciprocal: boolean): ElectricalResult {
  const keys=Object.keys(given);
  const invalid=keys.filter(key=>!new RegExp(`^${symbol}[1-9]\\d*$`).test(key) || !Number.isFinite(given[key]) || given[key]<=0);
  if(invalid.length)return {status:'invalid',fields:invalid};
  const count=Math.max(0,...keys.map(key=>Number(key.slice(1))));
  if(count<2 || keys.length!==count)return {status:'incomplete',fields:[]};
  const ids=Array.from({length:count},(_,i)=>`${symbol}${i+1}`);
  const components=ids.map(key=>given[key]);
  // Normalising the reciprocal sum avoids overflow for very small component values.
  const minimum=Math.min(...components);
  const equivalent=reciprocal ? minimum/components.reduce((sum,value)=>sum+minimum/value,0) : components.reduce((sum,value)=>sum+value,0);
  if(!Number.isFinite(equivalent) || equivalent<=0)return {status:'out-of-range',fields:[]};
  const formula=reciprocal ? `\\frac{1}{${ids.map(key=>`\\frac{1}{${key}}`).join('+')}}` : ids.join('+');
  return {status:'success',values:{...given},outputs:{[symbol]:equivalent},steps:[{target:symbol,formula}]};
}
