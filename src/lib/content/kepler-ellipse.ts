import type {ResourceField} from './resource-catalog.ts';
export const ellipseFields:readonly ResourceField[]=[
 {id:'a',name:'semi-major axis',symbol:'a',kind:'length'},
 {id:'b',name:'semi-minor axis',symbol:'b',kind:'length'},
 {id:'e',name:'orbital eccentricity',symbol:String.raw`\varepsilon`,kind:'dimensionless'},
 {id:'c',name:'centre-to-focus distance',symbol:'c',kind:'length'},
 {id:'p',name:'semi-latus rectum',symbol:'p',kind:'length'},
 {id:'rp',name:'periapsis distance',symbol:'r_p',kind:'length'},
 {id:'ra',name:'apoapsis distance',symbol:'r_a',kind:'length'},
 {id:'area',name:'ellipse area',symbol:'A',kind:'area'},
 {id:'X',name:'point coordinate relative to ellipse centre (X)',symbol:'X',kind:'length'},
 {id:'Y',name:'point coordinate relative to ellipse centre (Y)',symbol:'Y',kind:'length'},
 {id:'x',name:'point coordinate relative to focus (x)',symbol:'x',kind:'length'},
 {id:'y',name:'point coordinate relative to focus (y)',symbol:'y',kind:'length'},
 {id:'r',name:'distance of the point from the attracting focus',symbol:'r',kind:'length'},
 {id:'phi',name:'polar angle from periapsis on the positive x-axis',symbol:String.raw`\varphi`,kind:'angle'},
 {id:'z',name:'auxiliary cone height of the point',symbol:'z',kind:'length'}
];
export const ellipseAssumption='Enter any known ellipse or point quantities and leave unknown values blank. Signed coordinates refer to the same point. X = x + c and Y = y; periapsis lies on the positive x-axis. The cone construction uses the upper cone, so z = r > 0. Polar angles are equivalent modulo 360°. Missing point coordinates may have multiple solutions; a circle does not determine an angle from radius alone. No scale or angle is assumed.';

export const ellipseDomainNotice='Use positive ellipse lengths, radius and area, a non-negative focus distance and 0 ≤ ε < 1. Coordinates and polar angle may be signed.';
