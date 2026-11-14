import type {ResourceField} from './resource-catalog.ts';
export const keplerPeriodFields=[
 {id:'T',name:'orbital period of orbit 1',symbol:'T_1',kind:'time'},
 {id:'a',name:'relative semi-major axis of orbit 1',symbol:'a_1',kind:'length'},
 {id:'T2',name:'orbital period of orbit 2',symbol:'T_2',kind:'time'},
 {id:'a2',name:'relative semi-major axis of orbit 2',symbol:'a_2',kind:'length'},
 {id:'M',name:'total mass of both bodies',symbol:'M_{tot}',kind:'mass'},
 {id:'centralMass',name:'central body mass',symbol:'M',kind:'mass'},
 {id:'companionMass',name:'companion body mass',symbol:'m',kind:'mass'},
 {id:'periodRatio',name:'period ratio (orbit 2 / orbit 1)',symbol:'q_T',kind:'dimensionless'},
 {id:'axisRatio',name:'semi-major-axis ratio (orbit 2 / orbit 1)',symbol:'q_a',kind:'dimensionless'}
] as const satisfies readonly ResourceField[];
export const keplerPeriodAssumption='Both compared orbits share the same total mass, equal to M + m. Semi-major axes describe the relative separation of the two bodies. All input quantities are positive. A missing individual mass is not assumed to be zero; the total mass alone does not determine the two individual masses. The gravitational constant G is fixed at 6.67430 × 10⁻¹¹ m³/(kg s²).';
