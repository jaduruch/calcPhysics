import {hookePhysics} from '../mechanics/hooke.ts';
import {keplerPhysics} from '../mechanics/kepler.ts';
import { formulaBookPhysics } from './formula-book.ts';
import { divide, product, ModelFailure, type ResourcePhysics, type Values } from './solver.ts';
function mixTemperature(v: Values): Values {
 const a=Math.log(v.m1)+Math.log(v.c1), b=Math.log(v.m2)+Math.log(v.c2), scale=Math.max(a,b);
 const w=divide(Math.exp(a-scale),Math.exp(a-scale)+Math.exp(b-scale));
 return {Tm:v.T1*w+v.T2*(1-w)};
}
function positiveExp(exponent:number):number {
 const value=Math.exp(exponent);
 if(value===0||!Number.isFinite(value))throw new ModelFailure('numerical');
 return value;
}
function plate(v: Values): Values {
 const r=Math.asin(divide(Math.sin(v.i),v.n));
 return {r,s:v.n===1?0:v.d*Math.sin(v.i-r)/Math.cos(r),apparent:divide(v.d,v.n)};
}
function prism(v: Values): Values {
 const r1=v.n===1?v.i:Math.asin(divide(Math.sin(v.i),v.n)),r2=v.A-r1;
 if (r2<0 || r2>=Math.PI/2) throw new ModelFailure('no-solution');
 const sine=v.n*Math.sin(r2);
 if (sine>1+8*Number.EPSILON) return {r1,r2};
 const e=Math.asin(Math.min(1,sine));
 return {r1,r2,e,delta:v.n===1?0:v.i+e-v.A};
}
export const resourcePhysics: Record<string, ResourcePhysics> = {
...formulaBookPhysics,
...keplerPhysics,
'hookes-law':hookePhysics,
"contact-pressure":{domains:{"p": "nonnegative", "F": "nonnegative", "A": "positive"},primary:["p", "F", "A"],inverse:{"p":v=>divide(v.F,v.A),"F":v=>product(v.p,v.A),"A":v=>divide(v.F,v.p)},},
"hydraulic-press":{domains:{"F1": "nonnegative", "A1": "positive", "F2": "nonnegative", "A2": "positive"},primary:["F1", "A1", "F2", "A2"],inverse:{"F1":v=>divide(product(v.F2,v.A1),v.A2),"A1":v=>divide(product(v.F1,v.A2),v.F2),"F2":v=>divide(product(v.F1,v.A2),v.A1),"A2":v=>divide(product(v.F2,v.A1),v.F1)},derive:v=>({p:divide(v.F1,v.A1)}),},
"hydrostatic-pressure":{domains:{"p": "nonnegative", "rho": "positive", "h": "nonnegative", "g": "positive"},primary:["p", "rho", "h"],inverse:{"p":v=>product(v.rho,v.g,v.h),"rho":v=>divide(v.p,product(v.g,v.h)),"h":v=>divide(v.p,product(v.rho,v.g))},defaults:{"g": 9.81},},
"mass-density":{domains:{"m": "nonnegative", "rho": "positive", "V": "nonnegative"},primary:["m", "rho", "V"],inverse:{"m":v=>product(v.rho,v.V),"rho":v=>divide(v.m,v.V),"V":v=>divide(v.m,v.rho)},},
"volume-flow":{domains:{"V": "nonnegative", "A": "positive", "v": "nonnegative", "t": "nonnegative"},primary:["V", "A", "v", "t"],inverse:{"V":v=>product(v.A,v.v,v.t),"A":v=>divide(v.V,product(v.v,v.t)),"v":v=>divide(v.V,product(v.A,v.t)),"t":v=>divide(v.V,product(v.A,v.v))},},
"continuity":{domains:{"A1": "positive", "v1": "nonnegative", "A2": "positive", "v2": "nonnegative"},primary:["v1", "A1", "A2", "v2"],inverse:{"A1":v=>divide(product(v.A2,v.v2),v.v1),"v1":v=>divide(product(v.A2,v.v2),v.A1),"A2":v=>divide(product(v.A1,v.v1),v.v2),"v2":v=>divide(product(v.A1,v.v1),v.A2)},},
"boyle-law":{domains:{"p1": "positive", "V1": "positive", "p2": "positive", "V2": "positive"},primary:["p1", "V1", "p2", "V2"],inverse:{"p1":v=>divide(product(v.p2,v.V2),v.V1),"V1":v=>divide(product(v.p2,v.V2),v.p1),"p2":v=>divide(product(v.p1,v.V1),v.V2),"V2":v=>divide(product(v.p1,v.V1),v.p2)},},
"temperature-scales":{domains:{"T": "nonnegative"},derive:v=>({TC:v.T,TF:v.T,TRa:v.T,TRe:v.T}),},
"linear-expansion":{domains:{"dl": "real", "l0": "positive", "alpha": "real", "dT": "real"},primary:["dl", "l0", "alpha", "dT"],inverse:{"dl":v=>product(1,v.l0,v.alpha,v.dT),"l0":v=>divide(v.dl,product(1,v.alpha,v.dT)),"alpha":v=>divide(v.dl,product(1,v.l0,v.dT)),"dT":v=>divide(v.dl,product(1,v.l0,v.alpha))},derive:v=>({final:v.l0+v.dl}),valid:v=>v.l0+v.dl>0,},
"area-expansion":{domains:{"dA": "real", "A0": "positive", "alpha": "real", "dT": "real"},primary:["dA", "A0", "alpha", "dT"],inverse:{"dA":v=>product(2,v.A0,v.alpha,v.dT),"A0":v=>divide(v.dA,product(2,v.alpha,v.dT)),"alpha":v=>divide(v.dA,product(2,v.A0,v.dT)),"dT":v=>divide(v.dA,product(2,v.A0,v.alpha))},derive:v=>({final:v.A0+v.dA}),valid:v=>v.A0+v.dA>0,},
"solid-volume-expansion":{domains:{"dV": "real", "V0": "positive", "alpha": "real", "dT": "real"},primary:["dV", "V0", "alpha", "dT"],inverse:{"dV":v=>product(3,v.V0,v.alpha,v.dT),"V0":v=>divide(v.dV,product(3,v.alpha,v.dT)),"alpha":v=>divide(v.dV,product(3,v.V0,v.dT)),"dT":v=>divide(v.dV,product(3,v.V0,v.alpha))},derive:v=>({final:v.V0+v.dV}),valid:v=>v.V0+v.dV>0,},
"liquid-volume-expansion":{domains:{"dV": "real", "V0": "positive", "beta": "real", "dT": "real"},primary:["dV", "V0", "beta", "dT"],inverse:{"dV":v=>product(1,v.V0,v.beta,v.dT),"V0":v=>divide(v.dV,product(1,v.beta,v.dT)),"beta":v=>divide(v.dV,product(1,v.V0,v.dT)),"dT":v=>divide(v.dV,product(1,v.V0,v.beta))},derive:v=>({final:v.V0+v.dV}),valid:v=>v.V0+v.dV>0,},
"expanded-density":{domains:{"rho2": "positive", "rho1": "positive", "beta": "real", "dT": "real"},primary:["rho2", "rho1", "beta", "dT"],inverse:{"rho2":v=>divide(v.rho1,1+product(v.beta,v.dT)),"rho1":v=>v.rho2*(1+product(v.beta,v.dT)),"beta":v=>divide(divide(v.rho1,v.rho2)-1,v.dT),"dT":v=>divide(divide(v.rho1,v.rho2)-1,v.beta)},valid:v=>1+product(v.beta,v.dT)>0,},
"heat-capacity":{domains:{"C": "positive", "m": "positive", "c": "positive"},primary:["C", "m", "c"],inverse:{"C":v=>product(v.m,v.c),"m":v=>divide(v.C,v.c),"c":v=>divide(v.C,v.m)},},
"sensible-heat":{domains:{"Q": "real", "m": "positive", "c": "positive", "dT": "real"},primary:["Q", "m", "c", "dT"],inverse:{"Q":v=>product(v.m,v.c,v.dT),"m":v=>divide(v.Q,product(v.c,v.dT)),"c":v=>divide(v.Q,product(v.m,v.dT)),"dT":v=>divide(v.Q,product(v.m,v.c))},},
"thermal-mixing":{domains:{"m1": "positive", "c1": "positive", "T1": "nonnegative", "m2": "positive", "c2": "positive", "T2": "nonnegative"},derive:v=>mixTemperature(v),},
"fuel-energy":{domains:{"Q": "nonnegative", "m": "nonnegative", "H": "positive"},primary:["Q", "m", "H"],inverse:{"Q":v=>product(v.m,v.H),"m":v=>divide(v.Q,v.H),"H":v=>divide(v.Q,v.m)},},
"fuel-volume":{domains:{"Q": "nonnegative", "rho": "positive", "V": "nonnegative", "H": "positive"},primary:["Q", "rho", "V", "H"],inverse:{"Q":v=>product(v.rho,v.V,v.H),"rho":v=>divide(v.Q,product(v.V,v.H)),"V":v=>divide(v.Q,product(v.rho,v.H)),"H":v=>divide(v.Q,product(v.rho,v.V))},},
"thermal-resistance":{domains:{"T1": "nonnegative", "T2": "nonnegative", "Rth": "positive"},derive:v=>({dT:v.T1-v.T2,P:divide(v.T1-v.T2,v.Rth)}),},
"mirror-focus":{domains:{"r": "nonzero", "f": "nonzero"},primary:["r", "f"],inverse:{"r":v=>product(2,v.f),"f":v=>v.r/2},},
"lens-power":{domains:{"D": "nonzero", "f": "nonzero"},primary:["D", "f"],inverse:{"D":v=>divide(1,v.f),"f":v=>divide(1,v.D)},},
"optical-medium":{domains:{"n": "positive", "v": "positive"},primary:["n", "v"],inverse:{"n":v=>divide(299792458,v.v),"v":v=>divide(299792458,v.n)},},
"parallel-plate":{domains:{"n": "index", "d": "positive", "i": "incidence"},derive:v=>plate(v),},
"prism-deviation":{domains:{"n": "index", "A": "acute", "i": "incidence"},derive:v=>prism(v),},
"wave-relation":{domains:{"v": "positive", "f": "positive", "lambda": "positive"},primary:["v", "f", "lambda"],inverse:{"v":v=>product(v.f,v.lambda),"f":v=>divide(v.v,v.lambda),"lambda":v=>divide(v.v,v.f)},derive:v=>({T:divide(1,v.f)}),},
"string-speed":{domains:{"v": "positive", "F": "positive", "rho": "positive", "A": "positive"},primary:["v", "F", "rho", "A"],inverse:{"v":v=>Math.sqrt(divide(v.F,product(v.rho,v.A))),"F":v=>product(v.rho,v.A,v.v,v.v),"rho":v=>divide(v.F,product(v.A,v.v,v.v)),"A":v=>divide(v.F,product(v.rho,v.v,v.v))},},
"string-fundamental":{domains:{"f": "positive", "v": "positive", "L": "positive"},primary:["f", "v", "L"],inverse:{"f":v=>divide(v.v,product(2,v.L)),"v":v=>product(2,v.L,v.f),"L":v=>divide(v.v,product(2,v.f))},},
"open-pipe":{domains:{"f": "positive", "v": "positive", "L": "positive"},primary:["f", "v", "L"],inverse:{"f":v=>divide(v.v,product(2,v.L)),"v":v=>product(2,v.L,v.f),"L":v=>divide(v.v,product(2,v.f))},},
"closed-pipe":{domains:{"f": "positive", "v": "positive", "L": "positive"},primary:["f", "v", "L"],inverse:{"f":v=>divide(v.v,product(4,v.L)),"v":v=>product(4,v.L,v.f),"L":v=>divide(v.v,product(4,v.f))},},
"acoustic-beats":{domains:{"f1": "positive", "f2": "positive"},derive:v=>({carrier:v.f1/2+v.f2/2,envelope:Math.abs(v.f1-v.f2)/2,beat:Math.abs(v.f1-v.f2)}),},
"sound-pressure-level":{domains:{"Lp": "real", "p": "positive", "p0": "positive"},primary:["Lp", "p"],inverse:{"Lp":v=>20*(Math.log10(v.p)-Math.log10(v.p0)),"p":v=>positiveExp(Math.log(v.p0)+v.Lp/20*Math.LN10)},defaults:{"p0": 2e-05},},
"sound-intensity":{domains:{"P": "nonnegative", "I": "nonnegative", "A": "positive"},primary:["P", "I", "A"],inverse:{"P":v=>product(v.I,v.A),"I":v=>divide(v.P,v.A),"A":v=>divide(v.P,v.I)},},
};
