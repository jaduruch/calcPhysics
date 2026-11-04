import type { ModelDefinition } from './model-types.ts';
import type { QuantityKind } from '../physics/units.ts';
import type { ElectricalModelId } from '../physics/electricity.ts';
export interface ElectricalField { id: string; name: string; kind: QuantityKind }
export interface ElectricalOutput extends ElectricalField { formula: string }
export interface ElectricalDefinition {
  id: ElectricalModelId; topic: string; title: string;
  inputs: readonly ElectricalField[]; outputs: readonly ElectricalOutput[];
  assumption: string; image?: string; chart?: 'sine' | 'pwm' | 'transient' | 'filter' | 'three-phase';
}
const inductorFields: readonly ElectricalField[] = [
  {
    "id": "I",
    "name": "coil current",
    "kind": "current"
  },
  {
    "id": "L",
    "name": "inductance",
    "kind": "inductance"
  },
  {
    "id": "AL",
    "name": "inductance factor",
    "kind": "inductance"
  },
  {
    "id": "N",
    "name": "turns",
    "kind": "dimensionless"
  },
  {
    "id": "mu",
    "name": "relative permeability",
    "kind": "dimensionless"
  },
  {
    "id": "A",
    "name": "cross-sectional area",
    "kind": "area"
  },
  {
    "id": "l",
    "name": "magnetic path length",
    "kind": "length"
  },
  {
    "id": "Phi",
    "name": "magnetic flux per turn",
    "kind": "flux"
  },
  {
    "id": "B",
    "name": "flux density component",
    "kind": "fluxDensity"
  },
  {
    "id": "W",
    "name": "stored magnetic energy",
    "kind": "energy"
  },
  {
    "id": "dI",
    "name": "current change",
    "kind": "current"
  },
  {
    "id": "dPhi",
    "name": "flux change per turn",
    "kind": "flux"
  },
  {
    "id": "dt",
    "name": "time interval",
    "kind": "time"
  },
  {
    "id": "Uind",
    "name": "mean induced coil EMF",
    "kind": "voltage"
  },
  {
    "id": "lm",
    "name": "moving conductor length",
    "kind": "length"
  },
  {
    "id": "v",
    "name": "conductor velocity component",
    "kind": "velocity"
  },
  {
    "id": "Umot",
    "name": "motional EMF",
    "kind": "voltage"
  }
];
const rcAcFields: readonly ElectricalField[] = [
  { id: 'phi', name: 'phase angle', kind: 'angle' },
  { id: 'I', name: 'total RMS current', kind: 'current' },
  { id: 'R', name: 'resistance', kind: 'resistance' },
  { id: 'Xc', name: 'capacitive reactance', kind: 'resistance' },
  { id: 'Z', name: 'impedance magnitude', kind: 'resistance' },
  { id: 'C', name: 'capacitance', kind: 'capacitance' },
  { id: 'P', name: 'active power', kind: 'power' },
  { id: 'Qc', name: 'capacitive reactive power', kind: 'reactivePower' },
  { id: 'S', name: 'apparent power', kind: 'apparentPower' },
  { id: 'UR', name: 'resistive voltage', kind: 'voltage' },
  { id: 'UC', name: 'capacitive voltage', kind: 'voltage' },
  { id: 'U', name: 'total RMS voltage', kind: 'voltage' },
  { id: 'f', name: 'frequency', kind: 'frequency' },
  { id: 'cosPhi', name: 'power factor', kind: 'ratio' },
  { id: 'sinPhi', name: 'reactive factor', kind: 'ratio' }
];
const rcParallelFields: readonly ElectricalField[] = rcAcFields.flatMap(field => field.id === 'UR'
  ? [{ id: 'IR', name: 'resistive branch current', kind: 'current' as const }]
  : field.id === 'UC' ? [{ id: 'IC', name: 'capacitive branch current', kind: 'current' as const }] : [field]);
const rcTransientFields: readonly ElectricalField[] = [
  { id: 'I', name: 'supply current', kind: 'current' },
  { id: 'it', name: 'instantaneous current', kind: 'current' },
  { id: 'tau', name: 'time constant', kind: 'time' },
  { id: 'R', name: 'resistance', kind: 'resistance' },
  { id: 'C', name: 'capacitance', kind: 'capacitance' },
  { id: 'U', name: 'supply voltage', kind: 'voltage' },
  { id: 'ut', name: 'instantaneous voltage', kind: 'voltage' },
  { id: 't', name: 'elapsed time', kind: 'time' }
];
const capacitorCalculationFields: readonly ElectricalField[] = [
  { id: 'I', name: 'current', kind: 'current' },
  { id: 'F', name: 'force component', kind: 'force' },
  { id: 'E', name: 'electric field strength', kind: 'electricField' },
  { id: 'er', name: 'relative permittivity', kind: 'dimensionless' },
  { id: 'A', name: 'plate area', kind: 'area' },
  { id: 'd', name: 'plate diameter', kind: 'length' },
  { id: 's', name: 'plate separation', kind: 'length' },
  { id: 'C', name: 'capacitance', kind: 'capacitance' },
  { id: 'U', name: 'voltage', kind: 'voltage' },
  { id: 'W', name: 'stored energy', kind: 'energy' },
  { id: 'Q', name: 'charge', kind: 'charge' },
  { id: 't', name: 'time interval', kind: 'time' }
];
const rlSeriesFields: readonly ElectricalField[] = [
  {id:'phi',name:'phase angle',kind:'angle'},{id:'I',name:'total RMS current',kind:'current'},{id:'R',name:'resistance',kind:'resistance'},
  {id:'Xl',name:'inductive reactance',kind:'resistance'},{id:'Z',name:'impedance magnitude',kind:'resistance'},{id:'L',name:'inductance',kind:'inductance'},
  {id:'P',name:'active power',kind:'power'},{id:'Ql',name:'inductive reactive power',kind:'reactivePower'},{id:'S',name:'apparent power',kind:'apparentPower'},
  {id:'UR',name:'resistive voltage',kind:'voltage'},{id:'UL',name:'inductive voltage',kind:'voltage'},{id:'U',name:'total RMS voltage',kind:'voltage'},
  {id:'f',name:'frequency',kind:'frequency'},{id:'cosPhi',name:'power factor',kind:'ratio'},{id:'sinPhi',name:'reactive factor',kind:'ratio'}
];
const rlParallelFields: readonly ElectricalField[] = rlSeriesFields.flatMap(field=>field.id==='UR'?[{id:'IR',name:'resistive branch current',kind:'current' as const}]:field.id==='UL'?[{id:'IL',name:'inductive branch current',kind:'current' as const}]:[field]);
const rlTransientFields: readonly ElectricalField[] = [
  {id:'I',name:'supply current',kind:'current'},{id:'it',name:'instantaneous current',kind:'current'},{id:'tau',name:'time constant',kind:'time'},
  {id:'R',name:'resistance',kind:'resistance'},{id:'L',name:'inductance',kind:'inductance'},{id:'U',name:'supply voltage',kind:'voltage'},
  {id:'ut',name:'instantaneous voltage',kind:'voltage'},{id:'t',name:'elapsed time',kind:'time'}
];
const sineFields:readonly ElectricalField[]=[{id:'u',name:'instantaneous voltage',kind:'voltage'},{id:'Up',name:'peak voltage',kind:'voltage'},{id:'Upp',name:'peak-to-peak voltage',kind:'voltage'},{id:'Urms',name:'RMS voltage',kind:'voltage'},{id:'f',name:'frequency',kind:'frequency'},{id:'t',name:'current time',kind:'time'},{id:'T',name:'period',kind:'time'},{id:'phi',name:'phase shift',kind:'angle'}];
const amplitudeFields:readonly ElectricalField[]=[{id:'Up',name:'peak voltage',kind:'voltage'},{id:'Upp',name:'peak-to-peak voltage',kind:'voltage'},{id:'Urms',name:'RMS voltage',kind:'voltage'}];
const pwmFields:readonly ElectricalField[]=[{id:'Up',name:'peak voltage',kind:'voltage'},{id:'Urms',name:'RMS voltage',kind:'voltage'},{id:'f',name:'frequency',kind:'frequency'},{id:'ton',name:'pulse duration',kind:'time'},{id:'T',name:'period',kind:'time'},{id:'d',name:'duty cycle',kind:'ratio'}];

const inductorFormulas: ModelDefinition['formulas'] = [
  { label: 'Inductance', expression: String.raw`L = A_L N^2` },
  { label: 'Inductance factor', expression: String.raw`A_L = \frac{\mu_0\mu_r A}{l}` },
  { label: 'Flux per turn', expression: String.raw`\Phi = BA = \frac{LI}{N}` },
  { label: 'Stored energy', expression: String.raw`W = \frac12 LI^2` },
  { label: 'Flux change', expression: String.raw`\Delta\Phi = \frac{L\Delta I}{N}` },
  { label: 'Coil EMF', expression: String.raw`U_{ind} = -L\frac{\Delta I}{\Delta t} = -N\frac{\Delta\Phi}{\Delta t}` },
  { label: 'Motional EMF', expression: String.raw`U_{mot} = B l_{c} v` }
];

const rawElectricalDefinitions: readonly ElectricalDefinition[] = [
  {
    "id": "ohms-law",
    "topic": "direct-current",
    "title": "Ohm’s Law & DC Power",
    "inputs": [
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      },
      {
        "id": "I",
        "name": "current",
        "kind": "current"
      },
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "P",
        "name": "power",
        "kind": "power"
      }
    ],
    "outputs": [
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage",
        "formula": "IR"
      },
      {
        "id": "I",
        "name": "current",
        "kind": "current",
        "formula": "\\frac{U}{R}"
      },
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance",
        "formula": "\\frac{U}{I}"
      },
      {
        "id": "P",
        "name": "power",
        "kind": "power",
        "formula": "UI"
      }
    ],
    "assumption": "Enter any two of U, I, R and P; the two remaining quantities are calculated. Linear positive resistance and nonnegative DC magnitudes. Zero-valued pairs may be underdetermined. Results stay below the fields."
  },
  {
    "id": "voltage-divider",
    "topic": "direct-current",
    "title": "Voltage Divider",
    "inputs": [
      {
        "id": "Uin",
        "name": "input voltage",
        "kind": "voltage"
      },
      {
        "id": "Uout",
        "name": "output voltage",
        "kind": "voltage"
      },
      {
        "id": "U1",
        "name": "upper resistor voltage",
        "kind": "voltage"
      },
      {
        "id": "R1",
        "name": "upper resistance",
        "kind": "resistance"
      },
      {
        "id": "R2",
        "name": "lower resistance",
        "kind": "resistance"
      },
      {
        "id": "I",
        "name": "supply current",
        "kind": "current"
      }
    ],
    "outputs": [
      {
        "id": "Uin",
        "name": "input voltage",
        "kind": "voltage",
        "formula": "U_1+U_{out}"
      },
      {
        "id": "Uout",
        "name": "output voltage",
        "kind": "voltage",
        "formula": "U_{in}\\frac{R_2}{R_1+R_2}"
      },
      {
        "id": "U1",
        "name": "upper resistor voltage",
        "kind": "voltage",
        "formula": "IR_1"
      },
      {
        "id": "R1",
        "name": "upper resistance",
        "kind": "resistance",
        "formula": "\\frac{U_1}{I}"
      },
      {
        "id": "R2",
        "name": "lower resistance",
        "kind": "resistance",
        "formula": "\\frac{U_{out}}{I}"
      },
      {
        "id": "I",
        "name": "supply current",
        "kind": "current",
        "formula": "\\frac{U_{in}}{R_t}"
      },
      {
        "id": "Rt",
        "name": "total resistance",
        "kind": "resistance",
        "formula": "R_1+R_2"
      }
    ],
    "assumption": "Ideal DC divider with positive resistances. Enter the known quantities; uniquely determined missing values appear below. No output load."
  },
  {
    "id": "loaded-divider",
    "topic": "direct-current",
    "title": "Loaded Voltage Divider",
    "inputs": [
      {
        "id": "Uin",
        "name": "input voltage",
        "kind": "voltage"
      },
      {
        "id": "Uout",
        "name": "output voltage",
        "kind": "voltage"
      },
      {
        "id": "U1",
        "name": "upper resistor voltage",
        "kind": "voltage"
      },
      {
        "id": "R1",
        "name": "upper resistance",
        "kind": "resistance"
      },
      {
        "id": "R2",
        "name": "lower resistance",
        "kind": "resistance"
      },
      {
        "id": "I",
        "name": "supply current",
        "kind": "current"
      },
      {
        "id": "RL",
        "name": "load resistance",
        "kind": "resistance"
      },
      {
        "id": "IR2",
        "name": "lower resistor current",
        "kind": "current"
      },
      {
        "id": "IL",
        "name": "load current",
        "kind": "current"
      }
    ],
    "outputs": [
      {
        "id": "Uin",
        "name": "input voltage",
        "kind": "voltage",
        "formula": "U_1+U_{out}"
      },
      {
        "id": "Uout",
        "name": "output voltage",
        "kind": "voltage",
        "formula": "U_{in}\\frac{R_p}{R_1+R_p}"
      },
      {
        "id": "U1",
        "name": "upper resistor voltage",
        "kind": "voltage",
        "formula": "IR_1"
      },
      {
        "id": "R1",
        "name": "upper resistance",
        "kind": "resistance",
        "formula": "\\frac{U_1}{I}"
      },
      {
        "id": "R2",
        "name": "lower resistance",
        "kind": "resistance",
        "formula": "\\frac{U_{out}}{I_{R2}}"
      },
      {
        "id": "I",
        "name": "supply current",
        "kind": "current",
        "formula": "\\frac{U_{in}}{R_t}"
      },
      {
        "id": "RL",
        "name": "load resistance",
        "kind": "resistance",
        "formula": "\\frac{U_{out}}{I_L}"
      },
      {
        "id": "IR2",
        "name": "lower resistor current",
        "kind": "current",
        "formula": "\\frac{U_{out}}{R_2}"
      },
      {
        "id": "IL",
        "name": "load current",
        "kind": "current",
        "formula": "\\frac{U_{out}}{R_L}"
      },
      {
        "id": "Rt",
        "name": "total resistance",
        "kind": "resistance",
        "formula": "R_1+R_p"
      },
      {
        "id": "Rp",
        "name": "lower parallel resistance",
        "kind": "resistance",
        "formula": "\\frac{1}{\\frac{1}{R_2}+\\frac{1}{R_L}}"
      }
    ],
    "assumption": "Ideal DC divider with positive resistances. Enter the known quantities; uniquely determined missing values appear below. The load resistance is parallel to R₂."
  },
  {
    "id": "resistance-series",
    "topic": "direct-current",
    "title": "Series Resistors",
    "inputs": [
      {
        "id": "R1",
        "name": "resistance 1",
        "kind": "resistance"
      },
      {
        "id": "R2",
        "name": "resistance 2",
        "kind": "resistance"
      }
    ],
    "outputs": [
      {
        "id": "R",
        "name": "equivalent resistance",
        "kind": "resistance",
        "formula": "R_1+R_2"
      }
    ],
    "assumption": "Ideal positive resistances. Complete the visible resistances to add the next optional field. The empty final field is not included in the calculation."
  },
  {
    "id": "resistance-parallel",
    "topic": "direct-current",
    "title": "Parallel Resistors",
    "inputs": [
      {
        "id": "R1",
        "name": "resistance 1",
        "kind": "resistance"
      },
      {
        "id": "R2",
        "name": "resistance 2",
        "kind": "resistance"
      }
    ],
    "outputs": [
      {
        "id": "R",
        "name": "equivalent resistance",
        "kind": "resistance",
        "formula": "\\frac{1}{\\frac{1}{R_1}+\\frac{1}{R_2}}"
      }
    ],
    "assumption": "Ideal positive resistances. Complete the visible resistances to add the next optional field. The empty final field is not included in the calculation."
  },
  {
    "id": "capacitance-series",
    "topic": "capacitors",
    "title": "Series Capacitors",
    "inputs": [
      {
        "id": "C1",
        "name": "capacitance 1",
        "kind": "capacitance"
      },
      {
        "id": "C2",
        "name": "capacitance 2",
        "kind": "capacitance"
      }
    ],
    "outputs": [
      {
        "id": "C",
        "name": "equivalent capacitance",
        "kind": "capacitance",
        "formula": "\\frac{1}{\\frac{1}{C_1}+\\frac{1}{C_2}}"
      }
    ],
    "assumption": "Ideal positive capacitances. Complete the visible capacitances to add the next optional field. The empty final field is not included."
  },
  {
    "id": "capacitance-parallel",
    "topic": "capacitors",
    "title": "Parallel Capacitors",
    "inputs": [
      {
        "id": "C1",
        "name": "capacitance 1",
        "kind": "capacitance"
      },
      {
        "id": "C2",
        "name": "capacitance 2",
        "kind": "capacitance"
      }
    ],
    "outputs": [
      {
        "id": "C",
        "name": "equivalent capacitance",
        "kind": "capacitance",
        "formula": "C_1+C_2"
      }
    ],
    "assumption": "Ideal positive capacitances. Complete the visible capacitances to add the next optional field. The empty final field is not included."
  },
  {
    "id": "inductance-series",
    "topic": "inductors",
    "title": "Series Inductors",
    "inputs": [
      {
        "id": "L1",
        "name": "inductance 1",
        "kind": "inductance"
      },
      {
        "id": "L2",
        "name": "inductance 2",
        "kind": "inductance"
      }
    ],
    "outputs": [
      {
        "id": "L",
        "name": "equivalent inductance",
        "kind": "inductance",
        "formula": "L_1+L_2"
      }
    ],
    "assumption": "Ideal positive inductances with no mutual magnetic coupling. Complete the visible inductances to add the next optional field. The empty final field is not included."
  },
  {
    "id": "inductance-parallel",
    "topic": "inductors",
    "title": "Parallel Inductors",
    "inputs": [
      {
        "id": "L1",
        "name": "inductance 1",
        "kind": "inductance"
      },
      {
        "id": "L2",
        "name": "inductance 2",
        "kind": "inductance"
      }
    ],
    "outputs": [
      {
        "id": "L",
        "name": "equivalent inductance",
        "kind": "inductance",
        "formula": "\\frac{1}{\\frac{1}{L_1}+\\frac{1}{L_2}}"
      }
    ],
    "assumption": "Ideal positive inductances with no mutual magnetic coupling. Complete the visible inductances to add the next optional field. The empty final field is not included."
  },
  {
    "id": "delta-star",
    "topic": "direct-current",
    "title": "Delta → Star",
    "inputs": [
      {
        "id": "a",
        "name": "resistance a",
        "kind": "resistance"
      },
      {
        "id": "b",
        "name": "resistance b",
        "kind": "resistance"
      },
      {
        "id": "c",
        "name": "resistance c",
        "kind": "resistance"
      }
    ],
    "outputs": [
      {
        "id": "R1",
        "name": "converted resistance 1",
        "kind": "resistance",
        "formula": "\\frac{ab}{a+b+c}"
      },
      {
        "id": "R2",
        "name": "converted resistance 2",
        "kind": "resistance",
        "formula": "\\frac{bc}{a+b+c}"
      },
      {
        "id": "R3",
        "name": "converted resistance 3",
        "kind": "resistance",
        "formula": "\\frac{ca}{a+b+c}"
      }
    ],
    "assumption": "Positive linear resistances. Delta inputs a=R₁₂, b=R₂₃, c=R₃₁; star outputs R₁, R₂, R₃."
  },
  {
    "id": "star-delta",
    "topic": "direct-current",
    "title": "Star → Delta",
    "inputs": [
      {
        "id": "a",
        "name": "resistance a",
        "kind": "resistance"
      },
      {
        "id": "b",
        "name": "resistance b",
        "kind": "resistance"
      },
      {
        "id": "c",
        "name": "resistance c",
        "kind": "resistance"
      }
    ],
    "outputs": [
      {
        "id": "R1",
        "name": "converted resistance 1",
        "kind": "resistance",
        "formula": "a+b+\\frac{ab}{c}"
      },
      {
        "id": "R2",
        "name": "converted resistance 2",
        "kind": "resistance",
        "formula": "b+c+\\frac{bc}{a}"
      },
      {
        "id": "R3",
        "name": "converted resistance 3",
        "kind": "resistance",
        "formula": "c+a+\\frac{ca}{b}"
      }
    ],
    "assumption": "Positive linear resistances. Star inputs a=R₁, b=R₂, c=R₃; delta outputs R₁₂, R₂₃, R₃₁."
  },
  {
    "id": "sine-rms",
    "topic": "alternating-current",
    "title": "Sine Wave: RMS & Peak",
    "inputs": [
      {
        "id": "Up",
        "name": "peak voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "Urms",
        "name": "RMS voltage",
        "kind": "voltage",
        "formula": "\\frac{U_p}{\\sqrt{2}}"
      },
      {
        "id": "Upp",
        "name": "peak-to-peak voltage",
        "kind": "voltage",
        "formula": "2U_p"
      }
    ],
    "assumption": "Symmetric bipolar sine wave with zero DC offset. Peak is a nonnegative magnitude."
  },
  {
    "id": "square-rms",
    "topic": "alternating-current",
    "title": "Square Wave: RMS & Peak",
    "inputs": [
      {
        "id": "Up",
        "name": "peak voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "Urms",
        "name": "RMS voltage",
        "kind": "voltage",
        "formula": "U_p"
      },
      {
        "id": "Upp",
        "name": "peak-to-peak voltage",
        "kind": "voltage",
        "formula": "2U_p"
      }
    ],
    "assumption": "Symmetric bipolar square wave with zero DC offset. Peak is a nonnegative magnitude."
  },
  {
    "id": "triangle-rms",
    "topic": "alternating-current",
    "title": "Triangle Wave: RMS & Peak",
    "inputs": [
      {
        "id": "Up",
        "name": "peak voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "Urms",
        "name": "RMS voltage",
        "kind": "voltage",
        "formula": "\\frac{U_p}{\\sqrt{3}}"
      },
      {
        "id": "Upp",
        "name": "peak-to-peak voltage",
        "kind": "voltage",
        "formula": "2U_p"
      }
    ],
    "assumption": "Symmetric bipolar triangle wave with zero DC offset. Peak is a nonnegative magnitude."
  },
  {
    "id": "sine-signal",
    "topic": "alternating-current",
    "title": "Sinusoidal Signal",
    "inputs": [
      {
        "id": "Up",
        "name": "peak voltage",
        "kind": "voltage"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time"
      },
      {
        "id": "phi",
        "name": "initial phase",
        "kind": "angle"
      }
    ],
    "outputs": [
      {
        "id": "u",
        "name": "instantaneous voltage",
        "kind": "voltage",
        "formula": "U_p\\sin(2\\pi ft+\\phi)"
      },
      {
        "id": "T",
        "name": "period",
        "kind": "time",
        "formula": "\\frac{1}{f}"
      }
    ],
    "assumption": "Ideal sinusoid. Phase is in radians internally. Time ≥ 0, frequency > 0. The chart shows two periods from t = 0.",
    "chart": "sine"
  },
  {
    "id": "pwm",
    "topic": "alternating-current",
    "title": "Pulse Width Modulation",
    "inputs": [
      {
        "id": "Up",
        "name": "high-level voltage",
        "kind": "voltage"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "d",
        "name": "duty cycle",
        "kind": "ratio"
      }
    ],
    "outputs": [
      {
        "id": "Urms",
        "name": "RMS voltage",
        "kind": "voltage",
        "formula": "U_p\\sqrt{d}"
      },
      {
        "id": "Uavg",
        "name": "mean voltage",
        "kind": "voltage",
        "formula": "dU_p"
      },
      {
        "id": "T",
        "name": "period",
        "kind": "time",
        "formula": "\\frac{1}{f}"
      },
      {
        "id": "ton",
        "name": "pulse duration",
        "kind": "time",
        "formula": "\\frac{d}{f}"
      }
    ],
    "assumption": "Unipolar ideal rectangular pulses between 0 and Uₚ. Duty cycle 0 ≤ d ≤ 1 (or 0–100%).",
    "chart": "pwm"
  },
  {
    "id": "ac-power",
    "topic": "alternating-current",
    "title": "AC Power",
    "inputs": [
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      },
      {
        "id": "I",
        "name": "current",
        "kind": "current"
      },
      {
        "id": "phi",
        "name": "voltage–current phase",
        "kind": "angle"
      }
    ],
    "outputs": [
      {
        "id": "S",
        "name": "apparent power",
        "kind": "apparentPower",
        "formula": "UI"
      },
      {
        "id": "P",
        "name": "active power",
        "kind": "power",
        "formula": "UI\\cos\\phi"
      },
      {
        "id": "Q",
        "name": "reactive power",
        "kind": "reactivePower",
        "formula": "UI\\sin\\phi"
      }
    ],
    "assumption": "Sinusoidal steady state; U and I are RMS magnitudes. Passive load, −π/2 ≤ φ ≤ π/2. Q > 0 inductive, Q < 0 capacitive."
  },
  {
    "id": "transformer",
    "topic": "inductors",
    "title": "Transformer",
    "inputs": [
      {
        "id": "U1",
        "name": "primary RMS voltage",
        "kind": "voltage"
      },
      {
        "id": "U2",
        "name": "secondary RMS voltage",
        "kind": "voltage"
      },
      {
        "id": "I1",
        "name": "primary RMS current",
        "kind": "current"
      },
      {
        "id": "I2",
        "name": "secondary RMS current",
        "kind": "current"
      },
      {
        "id": "R1",
        "name": "primary-equivalent resistance",
        "kind": "resistance"
      },
      {
        "id": "R2",
        "name": "secondary load resistance",
        "kind": "resistance"
      },
      {
        "id": "P1",
        "name": "input power",
        "kind": "power"
      },
      {
        "id": "P2",
        "name": "output power",
        "kind": "power"
      },
      {
        "id": "N1",
        "name": "primary turns",
        "kind": "dimensionless"
      },
      {
        "id": "N2",
        "name": "secondary turns",
        "kind": "dimensionless"
      },
      {
        "id": "C1",
        "name": "primary-equivalent capacitance",
        "kind": "capacitance"
      },
      {
        "id": "C2",
        "name": "secondary capacitance",
        "kind": "capacitance"
      },
      {
        "id": "n",
        "name": "turns ratio N₁/N₂",
        "kind": "dimensionless"
      },
      {
        "id": "eta",
        "name": "efficiency",
        "kind": "ratio"
      }
    ],
    "outputs": [
      {
        "id": "U1",
        "name": "primary RMS voltage",
        "kind": "voltage",
        "formula": "n U_2"
      },
      {
        "id": "U2",
        "name": "secondary RMS voltage",
        "kind": "voltage",
        "formula": "\\frac{U_1}{n}"
      },
      {
        "id": "I1",
        "name": "primary RMS current",
        "kind": "current",
        "formula": "\\frac{I_2}{\\eta n}"
      },
      {
        "id": "I2",
        "name": "secondary RMS current",
        "kind": "current",
        "formula": "\\eta n I_1"
      },
      {
        "id": "R1",
        "name": "primary-equivalent resistance",
        "kind": "resistance",
        "formula": "\\eta n^2 R_2"
      },
      {
        "id": "R2",
        "name": "secondary load resistance",
        "kind": "resistance",
        "formula": "\\frac{R_1}{\\eta n^2}"
      },
      {
        "id": "P1",
        "name": "input power",
        "kind": "power",
        "formula": "U_1I_1"
      },
      {
        "id": "P2",
        "name": "output power",
        "kind": "power",
        "formula": "U_2I_2"
      },
      {
        "id": "N1",
        "name": "primary turns",
        "kind": "dimensionless",
        "formula": "n N_2"
      },
      {
        "id": "N2",
        "name": "secondary turns",
        "kind": "dimensionless",
        "formula": "\\frac{N_1}{n}"
      },
      {
        "id": "C1",
        "name": "primary-equivalent capacitance",
        "kind": "capacitance",
        "formula": "\\frac{C_2}{n^2}"
      },
      {
        "id": "C2",
        "name": "secondary capacitance",
        "kind": "capacitance",
        "formula": "C_1 n^2"
      },
      {
        "id": "n",
        "name": "turns ratio N₁/N₂",
        "kind": "dimensionless",
        "formula": "\\frac{N_1}{N_2}"
      },
      {
        "id": "eta",
        "name": "efficiency",
        "kind": "ratio",
        "formula": "\\frac{P_2}{P_1}"
      }
    ],
    "assumption": "Enter known quantities on either side; all uniquely determined missing quantities are calculated. Ideal voltage ratio with a resistive load and lumped efficiency 0 < η ≤ 1. If efficiency cannot be inferred, η = 1 is assumed explicitly. No magnetising current, saturation or winding voltage drop. Two values need not determine every quantity."
  },
  {
    "id": "magnetic-circuit",
    "topic": "magnetism",
    "title": "Linear Magnetic Circuit",
    "inputs": [
      {
        "id": "N",
        "name": "turns",
        "kind": "dimensionless"
      },
      {
        "id": "I",
        "name": "current",
        "kind": "current"
      },
      {
        "id": "l",
        "name": "magnetic path length",
        "kind": "length"
      },
      {
        "id": "A",
        "name": "cross-sectional area",
        "kind": "area"
      },
      {
        "id": "mu",
        "name": "relative permeability",
        "kind": "dimensionless"
      }
    ],
    "outputs": [
      {
        "id": "Theta",
        "name": "magnetomotive force",
        "kind": "current",
        "formula": "NI"
      },
      {
        "id": "H",
        "name": "field strength",
        "kind": "fieldStrength",
        "formula": "\\frac{NI}{l}"
      },
      {
        "id": "B",
        "name": "flux density",
        "kind": "fluxDensity",
        "formula": "\\mu_0\\mu_r\\frac{NI}{l}"
      },
      {
        "id": "Phi",
        "name": "magnetic flux",
        "kind": "flux",
        "formula": "\\mu_0\\mu_r\\frac{NIA}{l}"
      },
      {
        "id": "Rm",
        "name": "reluctance",
        "kind": "reluctance",
        "formula": "\\frac{l}{\\mu_0\\mu_r A}"
      }
    ],
    "assumption": "Uniform closed magnetic path with constant positive relative permeability. No saturation, hysteresis, leakage or fringing. μ₀ = 1.25663706127 × 10⁻⁶ H/m (CODATA 2022)."
  },
  {
    "id": "faraday",
    "topic": "magnetism",
    "title": "Faraday’s Law",
    "inputs": [
      {
        "id": "N",
        "name": "turns",
        "kind": "dimensionless"
      },
      {
        "id": "dPhi",
        "name": "change in linked flux per turn",
        "kind": "flux"
      },
      {
        "id": "dt",
        "name": "time interval",
        "kind": "time"
      }
    ],
    "outputs": [
      {
        "id": "Uind",
        "name": "mean induced EMF",
        "kind": "voltage",
        "formula": "-N\\frac{\\Delta\\Phi}{\\Delta t}"
      }
    ],
    "assumption": "Average EMF over a positive interval. Each turn links the same flux. The minus sign follows Lenz’s law for the chosen loop orientation."
  },
  {
    id: 'capacitor', topic: 'capacitors', title: 'Capacitor Calculations',
    inputs: capacitorCalculationFields,
    outputs: capacitorCalculationFields.map(field => ({ ...field, formula: '' })),
    assumption: 'Ideal linear parallel-plate capacitor with uniform dielectric and field. Edge effects and dielectric breakdown are neglected. Time-related charge and current are mean changes over t. Circular plate geometry uses diameter d; plate separation is s. ε₀ = 8.8541878188 × 10⁻¹² F/m.'
  },
  {
    "id": "plate-capacitor",
    "topic": "capacitors",
    "title": "Parallel-Plate Capacitor",
    "inputs": [
      {
        "id": "A",
        "name": "cross-sectional area",
        "kind": "area"
      },
      {
        "id": "d",
        "name": "plate separation",
        "kind": "length"
      },
      {
        "id": "er",
        "name": "relative permittivity",
        "kind": "dimensionless"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "C",
        "name": "capacitance",
        "kind": "capacitance",
        "formula": "\\epsilon_0\\epsilon_r\\frac{A}{d}"
      },
      {
        "id": "E",
        "name": "electric field magnitude",
        "kind": "electricField",
        "formula": "\\frac{U}{d}"
      }
    ],
    "assumption": "Uniform dielectric and field; separation small compared with plate dimensions. Neglect edge effects and dielectric breakdown. ε₀ = 8.8541878188 × 10⁻¹² F/m (CODATA 2022)."
  },
  {
    "id": "charge-flow",
    "topic": "capacitors",
    "title": "Charge Transfer & Electric Force",
    "inputs": [
      {
        "id": "Q",
        "name": "charge",
        "kind": "charge"
      },
      {
        "id": "dt",
        "name": "time interval",
        "kind": "time"
      },
      {
        "id": "E",
        "name": "electric field component",
        "kind": "electricField"
      }
    ],
    "outputs": [
      {
        "id": "I",
        "name": "mean current",
        "kind": "current",
        "formula": "\\frac{Q}{\\Delta t}"
      },
      {
        "id": "F",
        "name": "force component",
        "kind": "force",
        "formula": "QE"
      }
    ],
    "assumption": "Average current for transferred charge Q over Δt > 0. Force on a test charge in the specified field component."
  },
  {
    "id": "circular-plate",
    "topic": "capacitors",
    "title": "Circular Plate Area",
    "inputs": [
      {
        "id": "d",
        "name": "plate diameter",
        "kind": "length"
      }
    ],
    "outputs": [
      {
        "id": "A",
        "name": "plate area",
        "kind": "area",
        "formula": "\\frac{\\pi d^2}{4}"
      }
    ],
    "assumption": "Circular plate with positive diameter. Area is the overlapping electrode area."
  },
  {
    id: 'inductor', topic: 'inductors', title: 'Inductor Calculations',
    inputs: inductorFields,
    outputs: inductorFields.map(field => ({ ...field, formula: '' })),
    assumption: 'Linear ideal coil with constant permeability, uniform flux and no saturation, fringing or losses. Current I and flux Φ are distinct from their changes ΔI and ΔΦ. Coil EMF follows Lenz’s law; passive terminal voltage has the opposite sign. Motional EMF uses a separate conductor length and voltage, with conductor, velocity and field mutually perpendicular. Energy alone determines only the magnitude of current.'
  },
  {
    id: 'rc-series-ac', topic: 'capacitors', title: 'Series RC at AC',
    inputs: rcAcFields, outputs: rcAcFields.map(field => ({ ...field, formula: '' })),
    assumption: 'Ideal sinusoidal steady state. U and I are RMS values. The phase angle, reactive factor and capacitive reactive power are negative. R, X_C, Z, C and f are positive.'
  },
  {
    id: 'rc-parallel-ac', topic: 'capacitors', title: 'Parallel RC at AC',
    inputs: rcParallelFields, outputs: rcParallelFields.map(field => ({ ...field, formula: '' })),
    assumption: 'Ideal sinusoidal steady state. The resistive and capacitive branch currents I_R and I_C form the total RMS current I. The phase angle, reactive factor and capacitive reactive power are negative.'
  },
  {
    id: 'rc-charge', topic: 'capacitors', title: 'RC: Step Response',
    inputs: rcTransientFields, outputs: rcTransientFields.map(field => ({ ...field, formula: '' })),
    assumption: 'Ideal DC step U at t = 0, zero initial stored energy. I = U/R is the initial supply current. R, C and τ > 0; t ≥ 0.', chart: 'transient'
  },
  {
    id: 'rc-discharge', topic: 'capacitors', title: 'RC: Discharging',
    inputs: rcTransientFields, outputs: rcTransientFields.map(field => ({ ...field, formula: '' })),
    assumption: 'Initially charged capacitor at U, disconnected from the source and discharged through R. I = U/R is the initial current magnitude; i(t) is negative in the chosen reference direction.', chart: 'transient'
  },
  {
    "id": "rl-series-ac",
    "topic": "inductors",
    "title": "Series RL at AC",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "X",
        "name": "reactance magnitude",
        "kind": "resistance",
        "formula": "2\\pi fL"
      },
      {
        "id": "Z",
        "name": "impedance magnitude",
        "kind": "resistance",
        "formula": "\\sqrt{R^2+X^2}"
      },
      {
        "id": "phi",
        "name": "voltage–current phase",
        "kind": "angle",
        "formula": "\\arctan(X/R)"
      },
      {
        "id": "I",
        "name": "RMS supply current",
        "kind": "current",
        "formula": "\\frac{U}{Z}"
      },
      {
        "id": "P",
        "name": "active power",
        "kind": "power",
        "formula": "\\frac{U^2R}{Z^2}"
      },
      {
        "id": "Q",
        "name": "reactive power",
        "kind": "reactivePower",
        "formula": "\\frac{U^2X}{Z^2}"
      }
    ],
    "assumption": "Ideal sinusoidal steady state. U and I are RMS; phase is voltage relative to supply current, negative for capacitive and positive for inductive loads. R, f and L > 0."
  },
  {
    "id": "rl-parallel-ac",
    "topic": "inductors",
    "title": "Parallel RL at AC",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "X",
        "name": "reactance magnitude",
        "kind": "resistance",
        "formula": "2\\pi fL"
      },
      {
        "id": "Z",
        "name": "impedance magnitude",
        "kind": "resistance",
        "formula": "\\frac{1}{\\sqrt{R^{-2}+X^{-2}}}"
      },
      {
        "id": "phi",
        "name": "voltage–current phase",
        "kind": "angle",
        "formula": "\\arctan(R/X)"
      },
      {
        "id": "I",
        "name": "RMS supply current",
        "kind": "current",
        "formula": "\\frac{U}{Z}"
      },
      {
        "id": "P",
        "name": "active power",
        "kind": "power",
        "formula": "\\frac{U^2}{R}"
      },
      {
        "id": "Q",
        "name": "reactive power",
        "kind": "reactivePower",
        "formula": "\\frac{U^2}{X}"
      }
    ],
    "assumption": "Ideal sinusoidal steady state. U and I are RMS; phase is voltage relative to supply current, negative for capacitive and positive for inductive loads. R, f and L > 0."
  },
  {
    "id": "rl-charge",
    "topic": "inductors",
    "title": "RL: Step Response",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time"
      }
    ],
    "outputs": [
      {
        "id": "tau",
        "name": "time constant",
        "kind": "time",
        "formula": "\\frac{L}{R}"
      },
      {
        "id": "ut",
        "name": "inductor voltage",
        "kind": "voltage",
        "formula": "Ue^{-t/\\tau}"
      },
      {
        "id": "it",
        "name": "current",
        "kind": "current",
        "formula": "\\frac{U}{R}(1-e^{-t/\\tau})"
      }
    ],
    "assumption": "Ideal DC step U at t = 0, zero initial stored energy. R and L > 0; t ≥ 0.",
    "chart": "transient"
  },
  {
    "id": "rl-discharge",
    "topic": "inductors",
    "title": "RL: Discharging",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time"
      }
    ],
    "outputs": [
      {
        "id": "tau",
        "name": "time constant",
        "kind": "time",
        "formula": "\\frac{L}{R}"
      },
      {
        "id": "ut",
        "name": "inductor voltage",
        "kind": "voltage",
        "formula": "-Ue^{-t/\\tau}"
      },
      {
        "id": "it",
        "name": "current",
        "kind": "current",
        "formula": "\\frac{U}{R}e^{-t/\\tau}"
      }
    ],
    "assumption": "Initially steady current I₀ = U/R; source removed, closed RL discharge loop retained.",
    "chart": "transient"
  },
  {
    "id": "series-rlc",
    "topic": "resonant-circuits",
    "title": "Series RLC Resonator",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "C",
        "name": "capacitance",
        "kind": "capacitance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "f0",
        "name": "resonance frequency",
        "kind": "frequency",
        "formula": "\\frac{1}{2\\pi\\sqrt{LC}}"
      },
      {
        "id": "Qfactor",
        "name": "quality factor",
        "kind": "dimensionless",
        "formula": "\\frac{1}{R}\\sqrt{L/C}"
      },
      {
        "id": "bw",
        "name": "bandwidth",
        "kind": "frequency",
        "formula": "\\frac{R}{2\\pi L}"
      },
      {
        "id": "Z",
        "name": "impedance magnitude",
        "kind": "resistance",
        "formula": "\\sqrt{R^2+(2\\pi fL-1/(2\\pi fC))^2}"
      },
      {
        "id": "I",
        "name": "RMS supply current",
        "kind": "current",
        "formula": "\\frac{U}{Z}"
      }
    ],
    "assumption": "Ideal series loss resistance R > 0. Sinusoidal RMS source at explicit excitation frequency f > 0; f₀ is calculated separately. No parasitic elements."
  },
  {
    "id": "parallel-rlc",
    "topic": "resonant-circuits",
    "title": "Parallel RLC Resonator",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "C",
        "name": "capacitance",
        "kind": "capacitance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "f0",
        "name": "resonance frequency",
        "kind": "frequency",
        "formula": "\\frac{1}{2\\pi\\sqrt{LC}}"
      },
      {
        "id": "Qfactor",
        "name": "quality factor",
        "kind": "dimensionless",
        "formula": "R\\sqrt{C/L}"
      },
      {
        "id": "bw",
        "name": "bandwidth",
        "kind": "frequency",
        "formula": "\\frac{1}{2\\pi RC}"
      },
      {
        "id": "Z",
        "name": "impedance magnitude",
        "kind": "resistance",
        "formula": "\\frac{1}{\\sqrt{R^{-2}+(2\\pi fC-1/(2\\pi fL))^2}}"
      },
      {
        "id": "I",
        "name": "RMS supply current",
        "kind": "current",
        "formula": "\\frac{U}{Z}"
      }
    ],
    "assumption": "Ideal parallel loss resistance R > 0. Sinusoidal RMS source at explicit excitation frequency f > 0; f₀ is calculated separately. No parasitic elements."
  },
  {
    "id": "voltage-gain",
    "topic": "gain-and-attenuation",
    "title": "Voltage / Current Gain & Attenuation",
    "inputs": [
      {
        "id": "a",
        "name": "input magnitude",
        "kind": "voltage"
      },
      {
        "id": "b",
        "name": "output magnitude",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "gain",
        "name": "gain",
        "kind": "decibel",
        "formula": "20\\log_{10}(b/a)"
      },
      {
        "id": "attenuation",
        "name": "attenuation",
        "kind": "decibel",
        "formula": "20\\log_{10}(a/b)"
      },
      {
        "id": "ratio",
        "name": "amplitude / power ratio",
        "kind": "dimensionless",
        "formula": "\\frac{b}{a}"
      }
    ],
    "assumption": "Positive input and output magnitudes. Amplitude ratio uses 20 log₁₀; equivalent power gain requires equal real impedances. Current ratios follow the same amplitude formula."
  },
  {
    "id": "power-gain",
    "topic": "gain-and-attenuation",
    "title": "Power Gain & Attenuation",
    "inputs": [
      {
        "id": "a",
        "name": "input magnitude",
        "kind": "power"
      },
      {
        "id": "b",
        "name": "output magnitude",
        "kind": "power"
      }
    ],
    "outputs": [
      {
        "id": "gain",
        "name": "gain",
        "kind": "decibel",
        "formula": "10\\log_{10}(b/a)"
      },
      {
        "id": "attenuation",
        "name": "attenuation",
        "kind": "decibel",
        "formula": "10\\log_{10}(a/b)"
      },
      {
        "id": "ratio",
        "name": "amplitude / power ratio",
        "kind": "dimensionless",
        "formula": "\\frac{b}{a}"
      }
    ],
    "assumption": "Positive input and output magnitudes. Power ratio uses 10 log₁₀."
  },
  {
    "id": "rc-high-pass",
    "topic": "filters",
    "title": "RC High-Pass",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "C",
        "name": "capacitance",
        "kind": "capacitance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "Uin",
        "name": "input RMS voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "fc",
        "name": "cutoff frequency",
        "kind": "frequency",
        "formula": "\\frac{1}{2\\pi RC}"
      },
      {
        "id": "gain",
        "name": "voltage gain",
        "kind": "dimensionless",
        "formula": "\\frac{f/f_c}{\\sqrt{1+(f/f_c)^2}}"
      },
      {
        "id": "Uout",
        "name": "output RMS voltage",
        "kind": "voltage",
        "formula": "U_{in}|H|"
      },
      {
        "id": "phi",
        "name": "output phase",
        "kind": "angle",
        "formula": "\\arctan(f_c/f)"
      },
      {
        "id": "attenuation",
        "name": "attenuation",
        "kind": "decibel",
        "formula": "-20\\log_{10}|H|"
      }
    ],
    "assumption": "Unloaded ideal first-order filter; source impedance zero. Output across R. f, R and C > 0. Phase is output relative to input.",
    "chart": "filter"
  },
  {
    "id": "rc-low-pass",
    "topic": "filters",
    "title": "RC Low-Pass",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "C",
        "name": "capacitance",
        "kind": "capacitance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "Uin",
        "name": "input RMS voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "fc",
        "name": "cutoff frequency",
        "kind": "frequency",
        "formula": "\\frac{1}{2\\pi RC}"
      },
      {
        "id": "gain",
        "name": "voltage gain",
        "kind": "dimensionless",
        "formula": "\\frac{1}{\\sqrt{1+(f/f_c)^2}}"
      },
      {
        "id": "Uout",
        "name": "output RMS voltage",
        "kind": "voltage",
        "formula": "U_{in}|H|"
      },
      {
        "id": "phi",
        "name": "output phase",
        "kind": "angle",
        "formula": "-\\arctan(f/f_c)"
      },
      {
        "id": "attenuation",
        "name": "attenuation",
        "kind": "decibel",
        "formula": "-20\\log_{10}|H|"
      }
    ],
    "assumption": "Unloaded ideal first-order filter; source impedance zero. Output across C. f, R and C > 0. Phase is output relative to input.",
    "chart": "filter"
  },
  {
    "id": "rl-high-pass",
    "topic": "filters",
    "title": "RL High-Pass",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "Uin",
        "name": "input RMS voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "fc",
        "name": "cutoff frequency",
        "kind": "frequency",
        "formula": "\\frac{R}{2\\pi L}"
      },
      {
        "id": "gain",
        "name": "voltage gain",
        "kind": "dimensionless",
        "formula": "\\frac{f/f_c}{\\sqrt{1+(f/f_c)^2}}"
      },
      {
        "id": "Uout",
        "name": "output RMS voltage",
        "kind": "voltage",
        "formula": "U_{in}|H|"
      },
      {
        "id": "phi",
        "name": "output phase",
        "kind": "angle",
        "formula": "\\arctan(f_c/f)"
      },
      {
        "id": "attenuation",
        "name": "attenuation",
        "kind": "decibel",
        "formula": "-20\\log_{10}|H|"
      }
    ],
    "assumption": "Unloaded ideal first-order filter; source impedance zero. Output across L. f, R and L > 0. Phase is output relative to input.",
    "chart": "filter"
  },
  {
    "id": "rl-low-pass",
    "topic": "filters",
    "title": "RL Low-Pass",
    "inputs": [
      {
        "id": "R",
        "name": "resistance",
        "kind": "resistance"
      },
      {
        "id": "L",
        "name": "inductance",
        "kind": "inductance"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "Uin",
        "name": "input RMS voltage",
        "kind": "voltage"
      }
    ],
    "outputs": [
      {
        "id": "fc",
        "name": "cutoff frequency",
        "kind": "frequency",
        "formula": "\\frac{R}{2\\pi L}"
      },
      {
        "id": "gain",
        "name": "voltage gain",
        "kind": "dimensionless",
        "formula": "\\frac{1}{\\sqrt{1+(f/f_c)^2}}"
      },
      {
        "id": "Uout",
        "name": "output RMS voltage",
        "kind": "voltage",
        "formula": "U_{in}|H|"
      },
      {
        "id": "phi",
        "name": "output phase",
        "kind": "angle",
        "formula": "-\\arctan(f/f_c)"
      },
      {
        "id": "attenuation",
        "name": "attenuation",
        "kind": "decibel",
        "formula": "-20\\log_{10}|H|"
      }
    ],
    "assumption": "Unloaded ideal first-order filter; source impedance zero. Output across R. f, R and L > 0. Phase is output relative to input.",
    "chart": "filter"
  },
  {
    "id": "star-system",
    "topic": "three-phase",
    "title": "Star Connection",
    "inputs": [
      {
        "id": "Up",
        "name": "phase RMS voltage",
        "kind": "voltage"
      },
      {
        "id": "Ip",
        "name": "phase RMS current",
        "kind": "current"
      },
      {
        "id": "phi",
        "name": "load phase angle",
        "kind": "angle"
      }
    ],
    "outputs": [
      {
        "id": "UL",
        "name": "line RMS voltage",
        "kind": "voltage",
        "formula": "\\sqrt3 U_p"
      },
      {
        "id": "IL",
        "name": "line RMS current",
        "kind": "current",
        "formula": "I_p"
      },
      {
        "id": "P",
        "name": "total active power",
        "kind": "power",
        "formula": "3U_pI_p\\cos\\phi"
      },
      {
        "id": "Q",
        "name": "total reactive power",
        "kind": "reactivePower",
        "formula": "3U_pI_p\\sin\\phi"
      },
      {
        "id": "S",
        "name": "total apparent power",
        "kind": "apparentPower",
        "formula": "3U_pI_p"
      }
    ],
    "assumption": "Balanced sinusoidal three-phase supply and identical passive phase loads. Neutral current is zero in balanced star. Relations do not describe unbalanced loads or floating-neutral voltage shifts."
  },
  {
    "id": "delta-system",
    "topic": "three-phase",
    "title": "Delta Connection",
    "inputs": [
      {
        "id": "Up",
        "name": "phase RMS voltage",
        "kind": "voltage"
      },
      {
        "id": "Ip",
        "name": "phase RMS current",
        "kind": "current"
      },
      {
        "id": "phi",
        "name": "load phase angle",
        "kind": "angle"
      }
    ],
    "outputs": [
      {
        "id": "UL",
        "name": "line RMS voltage",
        "kind": "voltage",
        "formula": "U_p"
      },
      {
        "id": "IL",
        "name": "line RMS current",
        "kind": "current",
        "formula": "\\sqrt3 I_p"
      },
      {
        "id": "P",
        "name": "total active power",
        "kind": "power",
        "formula": "3U_pI_p\\cos\\phi"
      },
      {
        "id": "Q",
        "name": "total reactive power",
        "kind": "reactivePower",
        "formula": "3U_pI_p\\sin\\phi"
      },
      {
        "id": "S",
        "name": "total apparent power",
        "kind": "apparentPower",
        "formula": "3U_pI_p"
      }
    ],
    "assumption": "Balanced sinusoidal three-phase supply and identical passive phase loads. Neutral current is zero in balanced star. Relations do not describe unbalanced loads or floating-neutral voltage shifts."
  },
  {
    "id": "three-phase-generator",
    "topic": "three-phase-generator",
    "title": "Three-Phase Generator",
    "inputs": [
      {
        "id": "Up",
        "name": "phase peak voltage",
        "kind": "voltage"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time"
      }
    ],
    "outputs": [
      {
        "id": "u1",
        "name": "phase 1 voltage",
        "kind": "voltage",
        "formula": "U_p\\sin(2\\pi ft)"
      },
      {
        "id": "u2",
        "name": "phase 2 voltage",
        "kind": "voltage",
        "formula": "U_p\\sin(2\\pi ft-2\\pi/3)"
      },
      {
        "id": "u3",
        "name": "phase 3 voltage",
        "kind": "voltage",
        "formula": "U_p\\sin(2\\pi ft+2\\pi/3)"
      }
    ],
    "assumption": "Ideal balanced generator with 120° electrical phase separation and equal amplitudes. The three phase voltages sum to zero. Change elapsed time to inspect the instantaneous state.",
    "chart": "three-phase"
  }
];
export const electricalDefinitions: readonly ElectricalDefinition[] = rawElectricalDefinitions.map(definition => definition.id === 'rl-series-ac'
  ? {...definition,inputs:rlSeriesFields,outputs:rlSeriesFields.map(field=>({...field,formula:''}))}
  : definition.id === 'rl-parallel-ac'
    ? {...definition,inputs:rlParallelFields,outputs:rlParallelFields.map(field=>({...field,formula:''}))}
    : definition.id === 'rl-charge' || definition.id === 'rl-discharge'
      ? {...definition,inputs:rlTransientFields,outputs:rlTransientFields.map(field=>({...field,formula:''}))}
      : definition.id === 'sine-signal'
        ? {...definition,title:'Sine',inputs:sineFields,outputs:sineFields.map(field=>({...field,formula:''})),chart:'sine'}
        : definition.id === 'square-rms' || definition.id === 'triangle-rms'
          ? {...definition,title:definition.id==='square-rms'?'Rectangle':'Triangle',inputs:amplitudeFields,outputs:amplitudeFields.map(field=>({...field,formula:''})),chart:'sine'}
          : definition.id === 'pwm'
            ? {...definition,title:'PWM',inputs:pwmFields,outputs:pwmFields.map(field=>({...field,formula:''}))}
    : definition);

import { unitGroups, unitNames } from '../physics/units.ts';
import { electricalSymbol } from '../calculators/electrical-equations.ts';
const topicTheory: Record<string, { text: string; expression?: string }> = {
  'direct-current': { text: 'For steady-state networks, charge conservation gives Kirchhoff’s current law at each node and energy conservation gives the voltage law around each closed loop. Ohm’s law applies to linear resistors at constant temperature.', expression: String.raw`\sum I_k=0,\qquad\sum U_k=0` },
  'alternating-current': { text: 'RMS is the DC-equivalent heating value in a resistor, averaged over one complete period. A DC offset contributes separately to the mean square. The waveform formulas here specify their offset and symmetry.', expression: String.raw`U_{rms}=\sqrt{\frac1T\int_0^T u^2(t)\,dt}` },
  transformer: { text: 'A common time-varying core flux induces voltage in each winding in proportion to its turn count. Load reflection scales impedance by the square of the turns ratio. Lumped efficiency is an energy balance approximation.', expression: String.raw`\frac{U_1}{U_2}=\frac{N_1}{N_2},\qquad P_2=\eta P_1` },
  magnetism: { text: 'Ampère’s law reduces to Hl = NI for the uniform closed path. Combining it with the linear material relation B = μ₀μᵣH and uniform flux Φ = BA gives the magnetic circuit equations. Faraday’s law relates flux change to induced EMF.', expression: String.raw`\oint\mathbf H\cdot d\mathbf l=NI,\qquad U_{ind}=-N\frac{d\Phi}{dt}` },
  capacitors: { text: 'For constant capacitance, current is the time derivative of charge. Integrating voltage against transferred charge gives stored energy. In an RC circuit, Kirchhoff’s voltage law produces a first-order differential equation with time constant RC.', expression: String.raw`i=\frac{dQ}{dt}=C\frac{du_C}{dt},\qquad W=\int_0^Q\frac qC\,dq=\frac{Q^2}{2C}` },
  inductors: { text: 'For a linear inductor, passive terminal voltage follows the current derivative; the induced opposing EMF has the opposite sign. Integrating power gives magnetic energy. A series RL step has time constant L/R.', expression: String.raw`u_L=L\frac{di}{dt},\qquad W=\int_0^I Li\,di=\frac12 LI^2` },
  'resonant-circuits': { text: 'Inductive and capacitive contributions cancel at resonance. A series circuit then has minimum impedance; a parallel circuit with parallel loss resistance has maximum impedance. Quality factor relates resonance frequency to the half-power bandwidth.', expression: String.raw`\omega_0 L=\frac1{\omega_0 C},\qquad Q=\frac{f_0}{\Delta f}` },
  'gain-and-attenuation': { text: 'Decibels express logarithmic ratios. Cascaded gains add in dB. The factor 20 for amplitude follows from power being proportional to amplitude squared only when the relevant real impedances are equal.' },
  filters: { text: 'The transfer function is the complex ratio of output to input. With x = f/fc, ideal first-order low-pass and high-pass responses follow directly from the complex voltage divider. Their cutoff magnitude is 1/√2 and their asymptotic slope magnitude is 20 dB per decade.', expression: String.raw`H_{LP}=\frac1{1+jx},\qquad H_{HP}=\frac{jx}{1+jx}` },
  'three-phase': { text: 'Line voltages are differences of phase-voltage phasors. For equal magnitudes separated by 120°, this gives the factor √3 in a star connection. In delta, the corresponding phasor subtraction applies to the line currents. Total complex power is the sum over three equal loads.', expression: String.raw`\underline S_{total}=3\,\underline U_p\,\underline I_p^*` },
  'three-phase-generator': { text: 'Three identical windings displaced by 120 electrical degrees generate equal-amplitude sinusoidal voltages. Their instantaneous sum vanishes in a balanced system. Electrical frequency equals mechanical rotational frequency times the number of pole pairs.', expression: String.raw`\sin\theta+\sin(\theta-2\pi/3)+\sin(\theta+2\pi/3)=0` }
};
const dividerLoaded = electricalDefinitions.find(definition => definition.id === 'loaded-divider')!;
const resistorParallel = electricalDefinitions.find(definition => definition.id === 'resistance-parallel')!;
const rcAcFormulas = [
  { label: 'capacitive reactance', expression: String.raw`X_C=\frac{1}{2\pi fC}` },
  { label: 'series impedance and voltage', expression: String.raw`Z=\sqrt{R^2+X_C^2},\qquad U=\sqrt{U_R^2+U_C^2}` },
  { label: 'parallel impedance and current', expression: String.raw`Z=\frac{R X_C}{\sqrt{R^2+X_C^2}},\qquad I=\sqrt{I_R^2+I_C^2}` },
  { label: 'power triangle', expression: String.raw`S=UI=\sqrt{P^2+Q_C^2}` },
  { label: 'power factors', expression: String.raw`\cos\phi=\frac{P}{S},\qquad\sin\phi=\frac{Q_C}{S}` }
];
const rcTransientFormulas = [
  { label: 'time constant and initial current', expression: String.raw`\tau=RC,\qquad I=\frac{U}{R}` },
  { label: 'charging', expression: String.raw`u(t)=U(1-e^{-t/\tau}),\qquad i(t)=Ie^{-t/\tau}` },
  { label: 'discharging', expression: String.raw`u(t)=Ue^{-t/\tau},\qquad i(t)=-Ie^{-t/\tau}` }
];
const capacitorCalculationFormulas = [
  { label: 'charge', expression: String.raw`Q=CU=It` },
  { label: 'stored energy', expression: String.raw`W=\frac12 CU^2=\frac12 QU` },
  { label: 'electric force and voltage', expression: String.raw`F=QE,\qquad U=Es` },
  { label: 'parallel-plate capacitance', expression: String.raw`C=\epsilon_0\epsilon_r\frac{A}{s}` },
  { label: 'circular plate area', expression: String.raw`A=\frac{\pi d^2}{4}` }
];
const rlAcFormulas = [
  {label:'inductive reactance',expression:String.raw`X_L=2\pi fL`},
  {label:'series impedance and voltage',expression:String.raw`Z=\sqrt{R^2+X_L^2},\qquad U=\sqrt{U_R^2+U_L^2}`},
  {label:'parallel impedance and current',expression:String.raw`Z=\frac{R X_L}{\sqrt{R^2+X_L^2}},\qquad I=\sqrt{I_R^2+I_L^2}`},
  {label:'power triangle',expression:String.raw`S=UI=\sqrt{P^2+Q_L^2}`}
];
const rlTransientFormulas = [
  {label:'time constant and initial current',expression:String.raw`\tau=\frac{L}{R},\qquad I=\frac{U}{R}`},
  {label:'step response',expression:String.raw`u_L(t)=Ue^{-t/\tau},\qquad i(t)=I(1-e^{-t/\tau})`},
  {label:'discharging',expression:String.raw`u_L(t)=-Ue^{-t/\tau},\qquad i(t)=Ie^{-t/\tau}`}
];
const waveformFormulas:Record<string,{label:string;expression:string}[]>={
  'sine-signal':[{label:'sine voltage',expression:String.raw`u(t)=\hat U\sin(2\pi ft+\phi)`},{label:'voltage values',expression:String.raw`U_{pp}=2\hat U,\qquad U_{rms}=\frac{\hat U}{\sqrt2}`}],
  'triangle-rms':[{label:'triangle voltage',expression:String.raw`U_{pp}=2\hat U,\qquad U_{rms}=\frac{\hat U}{\sqrt3}`}],
  'square-rms':[{label:'rectangle voltage',expression:String.raw`U_{pp}=2\hat U,\qquad U_{rms}=\hat U`}],
  pwm:[{label:'PWM voltage',expression:String.raw`U_{rms}=\hat U\sqrt d,\qquad t_{on}=Td,\qquad T=\frac1f`}]
};
const unorderedElectricalCardDefinitions = electricalDefinitions.filter(definition => !['loaded-divider', 'resistance-parallel', 'capacitance-parallel', 'inductance-parallel', 'sine-rms', 'ac-power', 'rc-parallel-ac', 'rl-parallel-ac', 'rc-discharge', 'rl-discharge', 'plate-capacitor', 'charge-flow', 'circular-plate'].includes(definition.id)).map(definition => definition.id === 'voltage-divider'
  ? { ...definition, inputs: dividerLoaded.inputs, outputs: [...new Map([...definition.outputs, ...dividerLoaded.outputs].map(output => [`${output.id}:${output.formula}`, output])).values()], assumption: 'Switch between unloaded and loaded operation. With a load, the load resistance is parallel to R₂. Enter independent known quantities; only uniquely determined missing values are calculated.' }
  : definition.id === 'resistance-series'
    ? { ...definition, title: 'Resistors: Series & Parallel', inputs: [...definition.inputs, { id: 'n', name: 'number of resistors', kind: 'dimensionless' as const }], outputs: [...definition.outputs.map(output => ({ ...output, name: 'series equivalent resistance', formula: String.raw`\sum_{i=1}^{n}R_i` })), ...resistorParallel.outputs.map(output => ({ ...output, name: 'parallel equivalent resistance', formula: String.raw`\frac{1}{\displaystyle\sum_{i=1}^{n}\frac{1}{R_i}}` }))], assumption: 'Positive ideal resistances R₁ … Rₙ. Switch between series and parallel connection. The next optional field appears automatically; the empty final field is not included.' }
    : definition.id === 'capacitance-series'
      ? { ...definition, title: 'Capacitors: Series & Parallel', inputs: [...definition.inputs, { id: 'n', name: 'number of capacitors', kind: 'dimensionless' as const }], outputs: [{ ...definition.outputs[0], name: 'series equivalent capacitance', formula: String.raw`\frac{1}{\displaystyle\sum_{i=1}^{n}\frac{1}{C_i}}` }, { ...definition.outputs[0], name: 'parallel equivalent capacitance', formula: String.raw`\sum_{i=1}^{n}C_i` }] }
      : definition.id === 'inductance-series'
        ? { ...definition, title: 'Inductors: Series & Parallel', inputs: [...definition.inputs, { id: 'n', name: 'number of inductors', kind: 'dimensionless' as const }], outputs: [{ ...definition.outputs[0], name: 'series equivalent inductance', formula: String.raw`\sum_{i=1}^{n}L_i` }, { ...definition.outputs[0], name: 'parallel equivalent inductance', formula: String.raw`\frac{1}{\displaystyle\sum_{i=1}^{n}\frac{1}{L_i}}` }] }
        : definition.id === 'rc-series-ac'
          ? { ...definition, title: 'RC at AC: Series & Parallel', inputs: [...new Map([...definition.inputs, ...rcParallelFields].map(field => [field.id, field])).values()], assumption: 'Switch between series and parallel RC connection. Series uses partial voltages U_R and U_C; parallel uses branch currents I_R and I_C. Enter any independent known quantities; the calculator derives every uniquely determined missing value. U and I are RMS; φ, sin(φ) and Q_C are negative for a capacitive load.' }
          : definition.id === 'rl-series-ac'
            ? { ...definition, title:'RL at AC: Series & Parallel', inputs:[...new Map([...rlSeriesFields,...rlParallelFields].map(field=>[field.id,field])).values()], outputs:rlSeriesFields.map(field=>({...field,formula:''})), assumption:'Switch between series and parallel RL connection. Series uses U_R and U_L; parallel uses I_R and I_L. U and I are RMS; φ, sin(φ) and Q_L are positive for an inductive load.' }
          : definition.id === 'rc-charge'
            ? { ...definition, title: 'RC: Charging & Discharging', assumption: 'Switch between charging from an ideal DC step and discharging an initially charged capacitor through R. Every listed quantity can be entered; uniquely determined missing values are calculated. R, C and τ > 0; t ≥ 0. Inputs remain available when the process changes.' }
            : definition.id === 'rl-charge'
              ? {...definition,title:'RL: Step Response & Discharging',assumption:'Switch between the RL step response and discharging current through R. Every listed quantity can be entered; uniquely determined missing values are calculated. R, L and τ > 0; t ≥ 0.'}
          : definition);
const waveformCardIds = ['sine-signal', 'triangle-rms', 'square-rms', 'pwm'];
const waveformStart = unorderedElectricalCardDefinitions.findIndex(definition => waveformCardIds.includes(definition.id));
const waveformCards = waveformCardIds.map(id => unorderedElectricalCardDefinitions.find(definition => definition.id === id)!);
const nonWaveformCards = unorderedElectricalCardDefinitions.filter(definition => !waveformCardIds.includes(definition.id));
const electricalCardDefinitions = [
  ...nonWaveformCards.slice(0, waveformStart),
  ...waveformCards,
  ...nonWaveformCards.slice(waveformStart)
];
export const electricalModels: readonly ModelDefinition[] = electricalCardDefinitions.map(definition => ({
  id: definition.id, topicId: definition.topic, title: definition.title, calculator: 'electrical',
  variables: [...new Map([...definition.inputs, ...definition.outputs].map(field => [field.id, field])).values()].map(field => ({ name: field.name, symbol: electricalDisplaySymbol(field.id), unit: unitGroups[field.kind].si, unitName: unitNames[field.kind] ?? unitGroups[field.kind].si })),
  formulas: definition.id === 'inductor' ? inductorFormulas : definition.id === 'capacitor' ? capacitorCalculationFormulas : definition.id === 'rc-series-ac' ? rcAcFormulas : definition.id === 'rl-series-ac' ? rlAcFormulas : definition.id === 'rc-charge' ? rcTransientFormulas : definition.id === 'rl-charge' ? rlTransientFormulas : waveformFormulas[definition.id] ?? definition.outputs.map(output => ({ label: output.name, expression: `${electricalSymbol(output.id)} = ${output.formula}` })),
  notes: [topicTheory[definition.id] ?? topicTheory[definition.topic], { text: definition.assumption }]
}));

export function electricalDisplaySymbol(id: string): string {
  const greek: Record<string, string> = { Phi: 'Φ', dPhi: 'ΔΦ', Theta: 'Θ', mu: 'μᵣ', er: 'εᵣ', phi: 'φ', eta: 'η', tau: 'τ', dI: 'ΔI', dt: 'Δt', cosPhi: 'cos(φ)', sinPhi: 'sin(φ)' };
  return greek[id] ?? electricalSymbol(id).replace(/[{}_]/g, '');
}

export function rlAcDefinition(id: 'rl-series-ac'|'rl-parallel-ac'): ElectricalDefinition {
  const base=electricalDefinitions.find(definition=>definition.id===id)!;
  const fields=id==='rl-parallel-ac'?rlParallelFields:rlSeriesFields;
  return {...base,inputs:fields,outputs:fields.map(field=>({...field,formula:''}))};
}

/** Dynamic input metadata; arithmetic remains exclusively in the SI solver. */
export function resistorNetworkDefinition(id: 'resistance-series' | 'resistance-parallel', count: number): ElectricalDefinition {
  const base=electricalDefinitions.find(definition=>definition.id===id)!;
  return { ...base, inputs: Array.from({length:count},(_,index)=>({id:`R${index+1}`,name:`resistance ${index+1}`,kind:'resistance' as const})) };
}

/** Reuse network metadata; capacitor fields use their own physical quantity. */
export function capacitorNetworkDefinition(id: 'capacitance-series' | 'capacitance-parallel', count: number): ElectricalDefinition {
  const base = electricalDefinitions.find(definition => definition.id === id)!;
  return { ...base, inputs: Array.from({ length: count }, (_, index) => ({ id: `C${index + 1}`, name: `capacitance ${index + 1}`, kind: 'capacitance' as const })) };
}

/** Dynamic inductance metadata for uncoupled component networks. */
export function inductorNetworkDefinition(id: 'inductance-series' | 'inductance-parallel', count: number): ElectricalDefinition {
  const base = electricalDefinitions.find(definition => definition.id === id)!;
  return { ...base, inputs: Array.from({ length: count }, (_, index) => ({ id: `L${index + 1}`, name: `inductance ${index + 1}`, kind: 'inductance' as const })) };
}
