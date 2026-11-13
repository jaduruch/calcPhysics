import { DEFAULT_PROJECTILE_GRAVITY } from '../physics/mechanics/projectiles.ts';
import type { QuantityKind } from '../physics/units.ts';
import type { ObliqueField } from '../physics/mechanics/oblique-throw.ts';
export const obliqueFields: readonly {id:ObliqueField;name:string;symbol:string;latex:string;kind:QuantityKind;defaultValue?:number}[] = [
 {id:'y0',name:'launch height above ground',symbol:'y₀',latex:'y_0',kind:'length',defaultValue:0},
 {id:'v0',name:'launch speed',symbol:'v₀',latex:'v_0',kind:'velocity'},
 {id:'alpha',name:'launch angle',symbol:'α',latex:String.raw`\alpha`,kind:'angle'},
 {id:'vx',name:'horizontal velocity',symbol:'vₓ',latex:'v_x',kind:'velocity'},
 {id:'vy0',name:'initial vertical velocity',symbol:'vᵧ₀',latex:'v_{y0}',kind:'velocity'},
 {id:'g',name:'gravitational acceleration magnitude',symbol:'g',latex:'g',kind:'acceleration',defaultValue:DEFAULT_PROJECTILE_GRAVITY},
 {id:'flight',name:'total flight time to ground',symbol:'t_{f}',latex:'t_f',kind:'time'},
 {id:'range',name:'signed horizontal range',symbol:'R',latex:'R',kind:'length'},
 {id:'peakTime',name:'time to the highest point after launch',symbol:'t_{peak}',latex:'t_{peak}',kind:'time'},
 {id:'rise',name:'maximum rise above launch point',symbol:'h',latex:'h',kind:'length'},
 {id:'peakHeight',name:'maximum height above ground',symbol:'y_{peak}',latex:'y_{peak}',kind:'length'},
 {id:'t',name:'observation time since launch',symbol:'t',latex:'t',kind:'time'},
 {id:'x',name:'horizontal position at observation time',symbol:'x(t)',latex:'x',kind:'length'},
 {id:'y',name:'height at observation time',symbol:'y(t)',latex:'y',kind:'length'},
 {id:'vy',name:'vertical velocity at observation time',symbol:'vᵧ(t)',latex:'v_y',kind:'velocity'},
 {id:'vyImpact',name:'vertical impact velocity',symbol:'v_{y,impact}',latex:'v_{y,impact}',kind:'velocity'},
 {id:'speedImpact',name:'impact speed',symbol:'v_{impact}',latex:'v_{impact}',kind:'velocity'}
];
