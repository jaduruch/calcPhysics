import type { ElectricalDefinition } from '../content/electricity.ts';
import { pwmVoltage, solveElectrical, type ElectricalResult } from '../physics/electricity.ts';

export interface ElectricalCurve { title: string; yLabel: string; times: number[]; values: number[]; xLabel: string; schematic: boolean; color?: 'current'; marker?: { time: number; value: number } }
/** Sampling calls the same validated model; it never duplicates the circuit equations. */
export function electricalCurves(definition: ElectricalDefinition, result: ElectricalResult): ElectricalCurve[] {
  if (!definition.chart) return [];
  const schematic = result.status !== 'success';
  const preview: Record<string, number> = { R: 1, C: 1, L: 1, U: 1, Up: 1, Uin: 1, f: 1, t: 0, phi: 0, d: 0.4 };
  const source = result.status === 'success' ? result.values : preview;
  if(['sine-signal','triangle-rms','square-rms','pwm'].includes(definition.id)) {
    if(definition.id==='triangle-rms'||definition.id==='square-rms') {
      const determined=result.status==='success'&&source.Up!==undefined;
      const amplitude=determined?source.Up:1;const times=Array.from({length:241},(_,i)=>2*i/240);
      const values=times.map(time=>definition.id==='square-rms'?(Math.sin(2*Math.PI*time)>=0?amplitude:-amplitude):amplitude*2/Math.PI*Math.asin(Math.sin(2*Math.PI*time)));
      return [{title:'instantaneous voltage',yLabel:'u [V]',xLabel:'t/T [1]',schematic:!determined,times,values}];
    }
    if(definition.id==='sine-signal') {
      const determined=result.status==='success'&&source.Up!==undefined&&source.f>0;
      const amplitude=determined?source.Up:1,frequency=determined?source.f:1,phase=source.phi??0,duration=2/frequency;
      const times=Array.from({length:241},(_,i)=>duration*i/240);
      const values=times.map(time=>{const sample=solveElectrical('sine-signal',{Up:amplitude,f:frequency,t:time,phi:phase});return sample.status==='success'?sample.outputs.u:0;});
      const marker=determined&&source.t!==undefined&&source.u!==undefined&&source.t<=duration?{time:source.t,value:source.u}:undefined;
      return [{title:'instantaneous voltage',yLabel:'u [V]',xLabel:'t [s]',schematic:!determined,times,values,marker}];
    }
    const determined=result.status==='success'&&source.Up!==undefined&&source.f>0&&source.d!==undefined;
    const amplitude=determined?source.Up:1,frequency=determined?source.f:1,duty=determined?source.d:.4,duration=2/frequency;
    const times=Array.from({length:241},(_,i)=>duration*i/240);
    return [{title:'PWM voltage',yLabel:'u [V]',xLabel:'t [s]',schematic:!determined,times,values:times.map(time=>pwmVoltage(amplitude,frequency,duty,time))}];
  }
  if (definition.chart === 'transient' && (definition.id.startsWith('rc-') || definition.id.startsWith('rl-'))) {
    const specifications = [
      { key: 'ut', initial: 'U', yLabel: 'u [V]' },
      { key: 'it', initial: 'I', yLabel: 'i [A]', color: 'current' as const }
    ];
    return specifications.map(specification => {
      const determined = result.status === 'success' && source[specification.initial] !== undefined && source.tau > 0 && Number.isFinite(source.tau);
      const tau = determined ? source.tau : 1;
      const initial = determined ? source[specification.initial] : 1;
      const duration = 5 * tau;
      const times = Array.from({ length: 241 }, (_, index) => duration * index / 240);
      const samples = times.map(time => solveElectrical(definition.id, { [specification.initial]: initial, tau, t: time }));
      const values = samples.map(sample => sample.status === 'success' ? sample.outputs[specification.key] : 0);
      const output = definition.outputs.find(candidate => candidate.id === specification.key)!;
      const marker = determined && source.t !== undefined && source[specification.key] !== undefined && source.t >= 0 && source.t <= duration
        ? { time: source.t, value: source[specification.key] } : undefined;
      return { title: output.name, yLabel: specification.yLabel, xLabel: 't [s]', schematic: !determined, times, values, color: specification.color, marker };
    });
  }
  const resolved = solveElectrical(definition.id, definition.chart === 'transient' && definition.id.startsWith('rc-')
    ? { R: source.R, C: source.C, U: source.U, t: source.t }
    : source);
  if (resolved.status !== 'success') return [];
  const filter = definition.chart === 'filter';
  const duration = filter ? 5 * resolved.outputs.fc : definition.chart === 'transient' ? 5 * resolved.outputs.tau : 2 / source.f;
  if (!Number.isFinite(duration) || duration <= 0) return [];
  const keys = filter ? ['gain'] : definition.chart === 'transient' ? ['ut', 'it'] : definition.chart === 'three-phase' ? ['u1','u2','u3'] : ['u'];
  if (definition.chart === 'pwm') {
    const times = [0, source.d / source.f, 1 / source.f, (1 + source.d) / source.f, 2 / source.f];
    const coordinates = times.flatMap(time => [Math.max(0, time - duration * 1e-12), time]);
    return [{ title: 'PWM voltage', yLabel: 'u [V]', xLabel: 't [s]', schematic, times: coordinates, values: coordinates.map(time => pwmVoltage(source.Up, source.f, source.d, time)) }];
  }
  const samples = Array.from({ length: 241 }, (_, index) => {
    const coordinate = duration * (index / 240);
    const sampleInputs = definition.chart === 'transient' && definition.id.startsWith('rc-')
      ? { R: source.R, C: source.C, U: source.U, t: coordinate }
      : { ...source, [filter ? 'f' : 't']: filter && coordinate === 0 ? duration / 2400 : coordinate };
    const sample = solveElectrical(definition.id, sampleInputs);
    return { coordinate: filter && coordinate === 0 ? duration / 2400 : coordinate, sample };
  });
  if (samples.some(({ sample }) => sample.status !== 'success')) return [];
  return keys.map(key => {
    const output = definition.outputs.find(output => output.id === key)!;
    return {
      title: output.name, yLabel: filter ? '|H| [1]' : `${key === 'it' ? 'i' : 'u'} [${key === 'it' ? 'A' : 'V'}]`,
      xLabel: filter ? 'f [Hz]' : 't [s]', schematic,
      color: key === 'it' ? 'current' : undefined,
      times: samples.map(sample => sample.coordinate),
      values: samples.map(({ sample }) => sample.status === 'success' ? sample.outputs[key] : 0)
    };
  });
}

/** Rotating phase vectors from the generator solver at quadrature, normalised by peak voltage. */
export function generatorVectors(result: ElectricalResult) {
  const schematic = result.status !== 'success';
  const values = result.status === 'success' ? result.values : { Up: 1, f: 1, t: 0 };
  const now = solveElectrical('three-phase-generator', values);
  const quadrature = solveElectrical('three-phase-generator', { ...values, t: values.t + 1 / (4 * values.f) });
  if (now.status !== 'success' || quadrature.status !== 'success') return { schematic: true, vectors: [] };
  return { schematic, vectors: ['u1','u2','u3'].map((key, index) => ({
    label: `u${index+1}`, x: values.Up === 0 ? 0 : quadrature.outputs[key] / values.Up,
    y: values.Up === 0 ? 0 : -now.outputs[key] / values.Up
  })) };
}
