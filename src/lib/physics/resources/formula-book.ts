import { divide, product, type ResourcePhysics } from './solver.ts';
import { root, signedRoot, quadratic, asin, acos, cosine, inclineAngles, rangeAngles, trajectoryAngles, positiveExp } from './formula-book-math.ts';
/** Explicit SI inverses; constants G and R remain fixed. */
export const formulaBookPhysics: Record<string, ResourcePhysics> = {
 "book-angular-motion": {
  domains:{"phi": "real", "omega": "real", "t": "nonnegative"},
  primary:["phi", "omega", "t"],
  inverse: {
   "phi":v=>product(v.omega,v.t),
   "omega":v=>divide(v.phi,product(v.t)),
   "t":v=>divide(v.phi,product(v.omega))},
  balance:v=>[product(v.phi),product(1,v.omega,v.t)]},
 "book-arc-length": {
  domains:{"s": "real", "r": "positive", "phi": "real"},
  primary:["s", "r", "phi"],
  inverse: {
   "s":v=>product(v.r,v.phi),
   "r":v=>divide(v.s,product(v.phi)),
   "phi":v=>divide(v.s,product(v.r))},
  balance:v=>[product(v.s),product(1,v.r,v.phi)]},
 "book-revolutions": {
  domains:{"phi": "real", "N": "real"},
  primary:["phi", "N"],
  inverse: {
   "phi":v=>product(6.283185307179586,v.N),
   "N":v=>divide(v.phi,product(6.283185307179586))},
  balance:v=>[product(v.phi),product(6.283185307179586,v.N)]},
 "book-angular-frequency": {
  domains:{"omega": "positive", "f": "positive"},
  primary:["omega", "f"],
  inverse: {
   "omega":v=>product(6.283185307179586,v.f),
   "f":v=>divide(v.omega,product(6.283185307179586))},
  balance:v=>[product(v.omega),product(6.283185307179586,v.f)]},
 "book-rotation-period": {
  domains:{"T": "positive", "f": "positive"},
  primary:["T", "f"],
  inverse: {
   "T":v=>divide(1,product(v.f)),
   "f":v=>divide(1,product(v.T))},
  balance:v=>[product(v.T,v.f),product(1)]},
 "book-rotation-count": {
  domains:{"f": "positive", "N": "nonnegative", "t": "nonnegative"},
  primary:["f", "N", "t"],
  inverse: {
   "f":v=>divide(v.N,product(v.t)),
   "N":v=>product(v.f,v.t),
   "t":v=>divide(v.N,product(v.f))},
  balance:v=>[product(v.f,v.t),product(1,v.N)]},
 "book-tangential-speed": {
  domains:{"v": "real", "omega": "real", "r": "positive"},
  primary:["v", "omega", "r"],
  inverse: {
   "v":v=>product(v.omega,v.r),
   "omega":v=>divide(v.v,product(v.r)),
   "r":v=>divide(v.v,product(v.omega))},
  balance:v=>[product(v.v),product(1,v.omega,v.r)]},
 "book-angular-path": {
  domains:{"s": "real", "omega": "real", "r": "positive", "t": "nonnegative"},
  primary:["s", "omega", "r", "t"],
  inverse: {
   "s":v=>product(v.omega,v.r,v.t),
   "omega":v=>divide(v.s,product(v.r,v.t)),
   "r":v=>divide(v.s,product(v.omega,v.t)),
   "t":v=>divide(v.s,product(v.omega,v.r))},
  balance:v=>[product(v.s),product(1,v.omega,v.r,v.t)]},
 "book-angular-velocity": {
  domains:{"w0": "real", "w1": "real", "alpha": "real", "t": "nonnegative"},
  primary:["w0", "w1", "alpha", "t"],
  inverse: {
   "w1":v=>v.w0+v.alpha*v.t,
   "w0":v=>v.w1-v.alpha*v.t,
   "alpha":v=>divide(v.w1-v.w0,v.t),
   "t":v=>divide(v.w1-v.w0,v.alpha)},
  balance:v=>[v.w1,v.w0+v.alpha*v.t]},
 "book-angular-average": {
  domains:{"phi": "real", "w0": "real", "w1": "real", "t": "nonnegative"},
  primary:["phi", "w0", "w1", "t"],
  inverse: {
   "phi":v=>(v.w0+v.w1)*v.t/2,
   "w0":v=>divide(2*v.phi,v.t)-v.w1,
   "w1":v=>divide(2*v.phi,v.t)-v.w0,
   "t":v=>divide(2*v.phi,v.w0+v.w1)}},
 "book-angular-displacement": {
  domains:{"phi": "real", "w0": "real", "alpha": "real", "t": "nonnegative"},
  primary:["phi", "w0", "alpha", "t"],
  inverse: {
   "phi":v=>v.w0*v.t+v.alpha*v.t*v.t/2,
   "w0":v=>divide(v.phi,v.t)-v.alpha*v.t/2,
   "alpha":v=>divide(2*(v.phi-v.w0*v.t),v.t*v.t),
   "t":v=>quadratic(v.alpha/2,v.w0,-v.phi)},
  balance:v=>[v.phi-v.alpha*v.t*v.t/2,v.w0*v.t]},
 "book-angular-energy": {
  domains:{"phi": "real", "w0": "real", "w1": "real", "alpha": "real"},
  primary:["phi", "w0", "w1", "alpha"],
  inverse: {
   "w1":v=>signedRoot(v.w0*v.w0+2*v.alpha*v.phi),
   "w0":v=>signedRoot(v.w1*v.w1-2*v.alpha*v.phi),
   "phi":v=>divide((v.w1-v.w0)*(v.w1+v.w0),2*v.alpha),
   "alpha":v=>divide((v.w1-v.w0)*(v.w1+v.w0),2*v.phi)},
  balance:v=>[v.w1*v.w1,v.w0*v.w0+2*v.alpha*v.phi]},
 "book-force": {
  domains:{"F": "real", "m": "positive", "a": "real"},
  primary:["F", "m", "a"],
  inverse: {
   "F":v=>product(v.m,v.a),
   "m":v=>divide(v.F,product(v.a)),
   "a":v=>divide(v.F,product(v.m))},
  balance:v=>[product(v.F),product(1,v.m,v.a)]},
 "book-weight": {
  domains:{"Fg": "nonnegative", "m": "positive", "g": "positive"},
  primary:["Fg", "m", "g"],
  inverse: {
   "Fg":v=>product(v.m,v.g),
   "m":v=>divide(v.Fg,product(v.g)),
   "g":v=>divide(v.Fg,product(v.m))},
  balance:v=>[product(v.Fg),product(1,v.m,v.g)]},
 "book-gravitation": {
  domains:{"F": "positive", "m1": "positive", "m2": "positive", "r": "positive"},
  primary:["F", "m1", "m2", "r"],
  inverse: {
   "F":v=>divide(product(6.6743e-11,v.m1,v.m2),product(product(v.r,v.r))),
   "m1":v=>divide(product(v.F,product(v.r,v.r)),product(6.6743e-11,v.m2)),
   "m2":v=>divide(product(v.F,product(v.r,v.r)),product(6.6743e-11,v.m1)),
   "r":v=>root(divide(product(6.6743e-11,v.m1,v.m2),product(v.F)),2)},
  balance:v=>[product(v.F,product(v.r,v.r)),product(6.6743e-11,v.m1,v.m2)]},
 "book-orthogonal-force": {
  domains:{"R": "nonnegative", "X": "nonnegative", "Y": "nonnegative"},
  primary:["R", "X", "Y"],
  inverse: {
   "R":v=>Math.hypot(v.X,v.Y),
   "X":v=>root((v.R-v.Y)*(v.R+v.Y),2),
   "Y":v=>root((v.R-v.X)*(v.R+v.X),2)}},
 "book-kinetic-friction": {
  domains:{"Fr": "nonnegative", "mu": "nonnegative", "Fn": "nonnegative"},
  primary:["Fr", "mu", "Fn"],
  inverse: {
   "Fr":v=>product(v.mu,v.Fn),
   "mu":v=>divide(v.Fr,product(v.Fn)),
   "Fn":v=>divide(v.Fr,product(v.mu))},
  balance:v=>[product(v.Fr),product(1,v.mu,v.Fn)]},
 "book-friction-work": {
  domains:{"W": "nonnegative", "mu": "nonnegative", "Fn": "nonnegative", "s": "nonnegative"},
  primary:["W", "mu", "Fn", "s"],
  inverse: {
   "W":v=>product(v.mu,v.Fn,v.s),
   "mu":v=>divide(v.W,product(v.Fn,v.s)),
   "Fn":v=>divide(v.W,product(v.mu,v.s)),
   "s":v=>divide(v.W,product(v.mu,v.Fn))},
  balance:v=>[product(v.W),product(1,v.mu,v.Fn,v.s)]},
 "book-work-force": {
  domains:{"W": "real", "F": "real", "s": "real"},
  primary:["W", "F", "s"],
  inverse: {
   "W":v=>product(v.F,v.s),
   "F":v=>divide(v.W,product(v.s)),
   "s":v=>divide(v.W,product(v.F))},
  balance:v=>[product(v.W),product(1,v.F,v.s)]},
 "book-potential-energy": {
  domains:{"E": "real", "m": "positive", "g": "positive", "h": "real"},
  primary:["E", "m", "g", "h"],
  inverse: {
   "E":v=>product(v.m,v.g,v.h),
   "m":v=>divide(v.E,product(v.g,v.h)),
   "g":v=>divide(v.E,product(v.m,v.h)),
   "h":v=>divide(v.E,product(v.m,v.g))},
  balance:v=>[product(v.E),product(1,v.m,v.g,v.h)]},
 "book-weight-energy": {
  domains:{"E": "real", "Fg": "positive", "h": "real"},
  primary:["E", "Fg", "h"],
  inverse: {
   "E":v=>product(v.Fg,v.h),
   "Fg":v=>divide(v.E,product(v.h)),
   "h":v=>divide(v.E,product(v.Fg))},
  balance:v=>[product(v.E),product(1,v.Fg,v.h)]},
 "book-kinetic-energy": {
  domains:{"E": "nonnegative", "m": "positive", "v": "nonnegative"},
  primary:["E", "m", "v"],
  inverse: {
   "E":v=>product(0.5,v.m,product(v.v,v.v)),
   "m":v=>divide(v.E,product(0.5,product(v.v,v.v))),
   "v":v=>root(divide(v.E,product(0.5,v.m)),2)},
  balance:v=>[product(v.E),product(0.5,v.m,product(v.v,v.v))]},
 "book-kinetic-weight": {
  domains:{"E": "nonnegative", "Fg": "positive", "v": "nonnegative", "g": "positive"},
  primary:["E", "Fg", "v", "g"],
  inverse: {
   "E":v=>divide(product(0.5,v.Fg,product(v.v,v.v)),product(v.g)),
   "Fg":v=>divide(product(v.E,v.g),product(0.5,product(v.v,v.v))),
   "v":v=>root(divide(product(v.E,v.g),product(0.5,v.Fg)),2),
   "g":v=>divide(product(0.5,v.Fg,product(v.v,v.v)),product(v.E))},
  balance:v=>[product(v.E,v.g),product(0.5,v.Fg,product(v.v,v.v))]},
 "book-power-time": {
  domains:{"W": "real", "P": "real", "t": "nonnegative"},
  primary:["W", "P", "t"],
  inverse: {
   "W":v=>product(v.P,v.t),
   "P":v=>divide(v.W,product(v.t)),
   "t":v=>divide(v.W,product(v.P))},
  balance:v=>[product(v.W),product(1,v.P,v.t)]},
 "book-mechanical-power": {
  domains:{"P": "real", "F": "real", "v": "real"},
  primary:["P", "F", "v"],
  inverse: {
   "P":v=>product(v.F,v.v),
   "F":v=>divide(v.P,product(v.v)),
   "v":v=>divide(v.P,product(v.F))},
  balance:v=>[product(v.P),product(1,v.F,v.v)]},
 "book-rotational-power": {
  domains:{"P": "real", "M": "real", "omega": "real"},
  primary:["P", "M", "omega"],
  inverse: {
   "P":v=>product(v.M,v.omega),
   "M":v=>divide(v.P,product(v.omega)),
   "omega":v=>divide(v.P,product(v.M))},
  balance:v=>[product(v.P),product(1,v.M,v.omega)]},
 "book-electrical-power": {
  domains:{"P": "real", "U": "real", "I": "real"},
  primary:["P", "U", "I"],
  inverse: {
   "P":v=>product(v.U,v.I),
   "U":v=>divide(v.P,product(v.I)),
   "I":v=>divide(v.P,product(v.U))},
  balance:v=>[product(v.P),product(1,v.U,v.I)]},
 "book-acceleration-work": {
  domains:{"W": "real", "m": "positive", "v0": "nonnegative", "v": "nonnegative"},
  primary:["W", "m", "v0", "v"],
  inverse: {
   "W":v=>v.m*(v.v-v.v0)*(v.v+v.v0)/2,
   "m":v=>divide(2*v.W,(v.v-v.v0)*(v.v+v.v0)),
   "v":v=>root(v.v0*v.v0+divide(2*v.W,v.m),2),
   "v0":v=>root(v.v*v.v-divide(2*v.W,v.m),2)}},
 "book-acceleration-distance-work": {
  domains:{"W": "real", "m": "positive", "a": "real", "s": "real"},
  primary:["W", "m", "a", "s"],
  inverse: {
   "W":v=>product(v.m,v.a,v.s),
   "m":v=>divide(v.W,product(v.a,v.s)),
   "a":v=>divide(v.W,product(v.m,v.s)),
   "s":v=>divide(v.W,product(v.m,v.a))},
  balance:v=>[product(v.W),product(1,v.m,v.a,v.s)]},
 "book-pulley-force": {
  domains:{"F": "nonnegative", "Fg": "nonnegative", "n": "positiveInteger"},
  primary:["F", "Fg", "n"],
  inverse: {
   "F":v=>divide(v.Fg,product(v.n)),
   "Fg":v=>product(v.F,v.n),
   "n":v=>divide(v.Fg,product(v.F))},
  balance:v=>[product(v.F,v.n),product(1,v.Fg)]},
 "book-pulley-distance": {
  domains:{"s": "nonnegative", "n": "positiveInteger", "h": "nonnegative"},
  primary:["s", "n", "h"],
  inverse: {
   "s":v=>product(v.n,v.h),
   "n":v=>divide(v.s,product(v.h)),
   "h":v=>divide(v.s,product(v.n))},
  balance:v=>[product(v.s),product(1,v.n,v.h)]},
 "book-combined-gas": {
  domains:{"p1": "positive", "V1": "positive", "T1": "positive", "p2": "positive", "V2": "positive", "T2": "positive"},
  primary:["p1", "V1", "T1", "p2", "V2", "T2"],
  inverse: {
   "p1":v=>divide(product(v.T1,v.p2,v.V2),product(v.V1,v.T2)),
   "V1":v=>divide(product(v.T1,v.p2,v.V2),product(v.p1,v.T2)),
   "T1":v=>divide(product(v.p1,v.V1,v.T2),product(v.p2,v.V2)),
   "p2":v=>divide(product(v.p1,v.V1,v.T2),product(v.T1,v.V2)),
   "V2":v=>divide(product(v.p1,v.V1,v.T2),product(v.T1,v.p2)),
   "T2":v=>divide(product(v.T1,v.p2,v.V2),product(v.p1,v.V1))},
  balance:v=>[product(v.p1,v.V1,v.T2),product(1,v.T1,v.p2,v.V2)]},
 "book-isobaric-gas": {
  domains:{"V1": "positive", "T1": "positive", "V2": "positive", "T2": "positive"},
  primary:["V1", "T1", "V2", "T2"],
  inverse: {
   "V1":v=>divide(product(v.T1,v.V2),product(v.T2)),
   "T1":v=>divide(product(v.V1,v.T2),product(v.V2)),
   "V2":v=>divide(product(v.V1,v.T2),product(v.T1)),
   "T2":v=>divide(product(v.T1,v.V2),product(v.V1))},
  balance:v=>[product(v.V1,v.T2),product(1,v.T1,v.V2)]},
 "book-isochoric-gas": {
  domains:{"p1": "positive", "T1": "positive", "p2": "positive", "T2": "positive"},
  primary:["p1", "T1", "p2", "T2"],
  inverse: {
   "p1":v=>divide(product(v.T1,v.p2),product(v.T2)),
   "T1":v=>divide(product(v.p1,v.T2),product(v.p2)),
   "p2":v=>divide(product(v.p1,v.T2),product(v.T1)),
   "T2":v=>divide(product(v.T1,v.p2),product(v.p1))},
  balance:v=>[product(v.p1,v.T2),product(1,v.T1,v.p2)]},
 "book-mass-gas": {
  domains:{"p": "positive", "V": "positive", "m": "positive", "M": "positive", "T": "positive"},
  primary:["p", "V", "m", "M", "T"],
  inverse: {
   "p":v=>divide(product(8.31446261815324,v.m,v.T),product(v.V,v.M)),
   "V":v=>divide(product(8.31446261815324,v.m,v.T),product(v.p,v.M)),
   "m":v=>divide(product(v.p,v.V,v.M),product(8.31446261815324,v.T)),
   "M":v=>divide(product(8.31446261815324,v.m,v.T),product(v.p,v.V)),
   "T":v=>divide(product(v.p,v.V,v.M),product(8.31446261815324,v.m))},
  balance:v=>[product(v.p,v.V,v.M),product(8.31446261815324,v.m,v.T)]},
 "book-surface-energy": {
  domains:{"E": "nonnegative", "gamma": "nonnegative", "A": "nonnegative"},
  primary:["E", "gamma", "A"],
  inverse: {
   "E":v=>product(v.gamma,v.A),
   "gamma":v=>divide(v.E,product(v.A)),
   "A":v=>divide(v.E,product(v.gamma))},
  balance:v=>[product(v.E),product(1,v.gamma,v.A)]},
 "book-surface-force": {
  domains:{"F": "nonnegative", "gamma": "nonnegative", "l": "nonnegative"},
  primary:["F", "gamma", "l"],
  inverse: {
   "F":v=>product(v.gamma,v.l),
   "gamma":v=>divide(v.F,product(v.l)),
   "l":v=>divide(v.F,product(v.gamma))},
  balance:v=>[product(v.F),product(1,v.gamma,v.l)]},
 "book-static-pressure": {
  domains:{"p": "real", "pk": "real", "ps": "real"},
  primary:["p", "pk", "ps"],
  inverse: {
   "p":v=>v.pk+v.ps,
   "pk":v=>v.p-v.ps,
   "ps":v=>v.p-v.pk}},
 "book-gauge-pressure": {
  domains:{"pg": "real", "pa": "nonnegative", "pamb": "positive"},
  primary:["pg", "pa", "pamb"],
  inverse: {
   "pg":v=>v.pa-v.pamb,
   "pa":v=>v.pg+v.pamb,
   "pamb":v=>v.pa-v.pg}},
 "book-underpressure": {
  domains:{"pu": "nonnegative", "pa": "nonnegative", "pamb": "positive"},
  primary:["pu", "pa", "pamb"],
  inverse: {
   "pu":v=>v.pamb-v.pa,
   "pa":v=>v.pamb-v.pu,
   "pamb":v=>v.pa+v.pu}},
 "book-buoyancy": {
  domains:{"Fa": "nonnegative", "rho": "positive", "g": "positive", "V": "nonnegative"},
  primary:["Fa", "rho", "g", "V"],
  inverse: {
   "Fa":v=>product(v.rho,v.g,v.V),
   "rho":v=>divide(v.Fa,product(v.g,v.V)),
   "g":v=>divide(v.Fa,product(v.rho,v.V)),
   "V":v=>divide(v.Fa,product(v.rho,v.g))},
  balance:v=>[product(v.Fa),product(1,v.rho,v.g,v.V)]},
 "book-net-buoyancy": {
  domains:{"F": "real", "drho": "real", "g": "positive", "V": "positive"},
  primary:["F", "drho", "g", "V"],
  inverse: {
   "F":v=>product(v.drho,v.g,v.V),
   "drho":v=>divide(v.F,product(v.g,v.V)),
   "g":v=>divide(v.F,product(v.drho,v.V)),
   "V":v=>divide(v.F,product(v.drho,v.g))},
  balance:v=>[product(v.F),product(1,v.drho,v.g,v.V)]},
 "book-volume-rate": {
  domains:{"q": "nonnegative", "V": "nonnegative", "t": "nonnegative"},
  primary:["q", "V", "t"],
  inverse: {
   "q":v=>divide(v.V,product(v.t)),
   "V":v=>product(v.q,v.t),
   "t":v=>divide(v.V,product(v.q))},
  balance:v=>[product(v.q,v.t),product(1,v.V)]},
 "book-flow-speed": {
  domains:{"q": "nonnegative", "A": "positive", "v": "nonnegative"},
  primary:["q", "A", "v"],
  inverse: {
   "q":v=>product(v.A,v.v),
   "A":v=>divide(v.q,product(v.v)),
   "v":v=>divide(v.q,product(v.A))},
  balance:v=>[product(v.q),product(1,v.A,v.v)]},
 "book-dynamic-pressure": {
  domains:{"p": "nonnegative", "rho": "positive", "v": "nonnegative"},
  primary:["p", "rho", "v"],
  inverse: {
   "p":v=>product(0.5,v.rho,product(v.v,v.v)),
   "rho":v=>divide(v.p,product(0.5,product(v.v,v.v))),
   "v":v=>root(divide(v.p,product(0.5,v.rho)),2)},
  balance:v=>[product(v.p),product(0.5,v.rho,product(v.v,v.v))]},
 "book-reynolds": {
  domains:{"Re": "nonnegative", "rho": "positive", "v": "nonnegative", "l": "positive", "eta": "positive"},
  primary:["Re", "rho", "v", "l", "eta"],
  inverse: {
   "Re":v=>divide(product(v.rho,v.v,v.l),product(v.eta)),
   "rho":v=>divide(product(v.Re,v.eta),product(v.v,v.l)),
   "v":v=>divide(product(v.Re,v.eta),product(v.rho,v.l)),
   "l":v=>divide(product(v.Re,v.eta),product(v.rho,v.v)),
   "eta":v=>divide(product(v.rho,v.v,v.l),product(v.Re))},
  balance:v=>[product(v.Re,v.eta),product(1,v.rho,v.v,v.l)]},
 "book-stokes-radius": {
  domains:{"F": "nonnegative", "r": "positive", "eta": "positive", "v": "nonnegative"},
  primary:["F", "r", "eta", "v"],
  inverse: {
   "F":v=>product(18.84955592153876,v.r,v.eta,v.v),
   "r":v=>divide(v.F,product(18.84955592153876,v.eta,v.v)),
   "eta":v=>divide(v.F,product(18.84955592153876,v.r,v.v)),
   "v":v=>divide(v.F,product(18.84955592153876,v.r,v.eta))},
  balance:v=>[product(v.F),product(18.84955592153876,v.r,v.eta,v.v)]},
 "book-stokes-diameter": {
  domains:{"F": "nonnegative", "d": "positive", "eta": "positive", "v": "nonnegative"},
  primary:["F", "d", "eta", "v"],
  inverse: {
   "F":v=>product(9.42477796076938,v.d,v.eta,v.v),
   "d":v=>divide(v.F,product(9.42477796076938,v.eta,v.v)),
   "eta":v=>divide(v.F,product(9.42477796076938,v.d,v.v)),
   "v":v=>divide(v.F,product(9.42477796076938,v.d,v.eta))},
  balance:v=>[product(v.F),product(9.42477796076938,v.d,v.eta,v.v)]},
 "book-drag": {
  domains:{"F": "nonnegative", "Cd": "nonnegative", "rho": "positive", "v": "nonnegative", "A": "positive"},
  primary:["F", "Cd", "rho", "v", "A"],
  inverse: {
   "F":v=>product(0.5,v.Cd,v.rho,product(v.v,v.v),v.A),
   "Cd":v=>divide(v.F,product(0.5,v.rho,product(v.v,v.v),v.A)),
   "rho":v=>divide(v.F,product(0.5,v.Cd,product(v.v,v.v),v.A)),
   "v":v=>root(divide(v.F,product(0.5,v.Cd,v.rho,v.A)),2),
   "A":v=>divide(v.F,product(0.5,v.Cd,v.rho,product(v.v,v.v)))},
  balance:v=>[product(v.F),product(0.5,v.Cd,v.rho,product(v.v,v.v),v.A)]},
 "book-poiseuille": {
  domains:{"q": "nonnegative", "r": "positive", "dp": "nonnegative", "eta": "positive", "l": "positive"},
  primary:["q", "r", "dp", "eta", "l"],
  inverse: {
   "q":v=>divide(product(0.39269908169872414,product(v.r,v.r,v.r,v.r),v.dp),product(v.eta,v.l)),
   "r":v=>root(divide(product(v.q,v.eta,v.l),product(0.39269908169872414,v.dp)),4),
   "dp":v=>divide(product(v.q,v.eta,v.l),product(0.39269908169872414,product(v.r,v.r,v.r,v.r))),
   "eta":v=>divide(product(0.39269908169872414,product(v.r,v.r,v.r,v.r),v.dp),product(v.q,v.l)),
   "l":v=>divide(product(0.39269908169872414,product(v.r,v.r,v.r,v.r),v.dp),product(v.q,v.eta))},
  balance:v=>[product(v.q,v.eta,v.l),product(0.39269908169872414,product(v.r,v.r,v.r,v.r),v.dp)]},
 "book-luminous-flux": {
  domains:{"Phi": "nonnegative", "I": "nonnegative", "Omega": "solidAngle"},
  primary:["Phi", "I", "Omega"],
  inverse: {
   "Phi":v=>product(v.I,v.Omega),
   "I":v=>divide(v.Phi,product(v.Omega)),
   "Omega":v=>divide(v.Phi,product(v.I))},
  balance:v=>[product(v.Phi),product(1,v.I,v.Omega)]},
 "book-luminous-energy": {
  domains:{"Q": "nonnegative", "Phi": "nonnegative", "t": "nonnegative"},
  primary:["Q", "Phi", "t"],
  inverse: {
   "Q":v=>product(v.Phi,v.t),
   "Phi":v=>divide(v.Q,product(v.t)),
   "t":v=>divide(v.Q,product(v.Phi))},
  balance:v=>[product(v.Q),product(1,v.Phi,v.t)]},
 "book-illuminance-area": {
  domains:{"E": "nonnegative", "Phi": "nonnegative", "A": "positive"},
  primary:["E", "Phi", "A"],
  inverse: {
   "E":v=>divide(v.Phi,product(v.A)),
   "Phi":v=>product(v.E,v.A),
   "A":v=>divide(v.Phi,product(v.E))},
  balance:v=>[product(v.E,v.A),product(1,v.Phi)]},
 "book-inverse-square-light": {
  domains:{"E": "nonnegative", "I": "nonnegative", "r": "positive"},
  primary:["E", "I", "r"],
  inverse: {
   "E":v=>divide(v.I,product(product(v.r,v.r))),
   "I":v=>product(v.E,product(v.r,v.r)),
   "r":v=>root(divide(v.I,product(v.E)),2)},
  balance:v=>[product(v.E,product(v.r,v.r)),product(1,v.I)]},
 "book-oblique-illuminance": {
  domains:{"E": "nonnegative", "I": "nonnegative", "r": "positive", "alpha": "quadrant"},
  primary:["E", "I", "r", "alpha"],
  inverse: {
   "E":v=>v.I*cosine(v.alpha)/(v.r*v.r),
   "I":v=>divide(v.E*v.r*v.r,cosine(v.alpha)),
   "r":v=>root(divide(v.I*cosine(v.alpha),v.E),2),
   "alpha":v=>acos(divide(v.E*v.r*v.r,v.I))}},
 "book-light-distance-comparison": {
  domains:{"E1": "nonnegative", "r1": "positive", "E2": "nonnegative", "r2": "positive"},
  primary:["E1", "r1", "E2", "r2"],
  inverse: {
   "E1":v=>divide(product(v.E2,product(v.r2,v.r2)),product(product(v.r1,v.r1))),
   "r1":v=>root(divide(product(v.E2,product(v.r2,v.r2)),product(v.E1)),2),
   "E2":v=>divide(product(v.E1,product(v.r1,v.r1)),product(product(v.r2,v.r2))),
   "r2":v=>root(divide(product(v.E1,product(v.r1,v.r1)),product(v.E2)),2)},
  balance:v=>[product(v.E1,product(v.r1,v.r1)),product(1,v.E2,product(v.r2,v.r2))]},
 "book-luminance-area": {
  domains:{"L": "nonnegative", "I": "nonnegative", "A": "positive"},
  primary:["L", "I", "A"],
  inverse: {
   "L":v=>divide(v.I,product(v.A)),
   "I":v=>product(v.L,v.A),
   "A":v=>divide(v.I,product(v.L))},
  balance:v=>[product(v.L,v.A),product(1,v.I)]},
 "book-luminance-solid": {
  domains:{"L": "nonnegative", "E": "nonnegative", "Omega": "solidAngle"},
  primary:["L", "E", "Omega"],
  inverse: {
   "L":v=>divide(v.E,product(v.Omega)),
   "E":v=>product(v.L,v.Omega),
   "Omega":v=>divide(v.E,product(v.L))},
  balance:v=>[product(v.L,v.Omega),product(1,v.E)]},
 "book-solid-angle": {
  domains:{"Omega": "solidAngle", "A": "nonnegative", "r": "positive"},
  primary:["Omega", "A", "r"],
  inverse: {
   "Omega":v=>divide(v.A,product(product(v.r,v.r))),
   "A":v=>product(v.Omega,product(v.r,v.r)),
   "r":v=>root(divide(v.A,product(v.Omega)),2)},
  balance:v=>[product(v.Omega,product(v.r,v.r)),product(1,v.A)]},
 "book-thin-lens": {
  domains:{"f": "nonzero", "g": "positive", "b": "nonzero"},
  primary:["f", "g", "b"],
  inverse: {
   "f":v=>divide(v.g*v.b,v.g+v.b),
   "g":v=>divide(v.f*v.b,v.b-v.f),
   "b":v=>divide(v.f*v.g,v.g-v.f)}},
 "book-image-magnification": {
  domains:{"mag": "nonzero", "g": "positive", "b": "nonzero"},
  primary:["mag", "g", "b"],
  inverse: {
   "mag":v=>divide(product(-1,v.b),product(v.g)),
   "g":v=>divide(product(-1,v.b),product(v.mag)),
   "b":v=>divide(product(v.mag,v.g),product(-1))},
  balance:v=>[product(v.mag,v.g),product(-1,v.b)]},
 "book-image-size": {
  domains:{"mag": "nonzero", "B": "nonzero", "G": "nonzero"},
  primary:["mag", "B", "G"],
  inverse: {
   "mag":v=>divide(v.B,product(v.G)),
   "B":v=>product(v.mag,v.G),
   "G":v=>divide(v.B,product(v.mag))},
  balance:v=>[product(v.mag,v.G),product(1,v.B)]},
 "book-real-image-ratio": {
  domains:{"B": "positive", "G": "positive", "b": "positive", "g": "positive"},
  primary:["B", "G", "b", "g"],
  inverse: {
   "B":v=>divide(product(v.G,v.b),product(v.g)),
   "G":v=>divide(product(v.B,v.g),product(v.b)),
   "b":v=>divide(product(v.B,v.g),product(v.G)),
   "g":v=>divide(product(v.G,v.b),product(v.B))},
  balance:v=>[product(v.B,v.g),product(1,v.G,v.b)]},
 "book-image-extension": {
  domains:{"ext": "nonnegative", "b": "positive", "f": "positive"},
  primary:["ext", "b", "f"],
  inverse: {
   "ext":v=>v.b-v.f,
   "b":v=>v.ext+v.f,
   "f":v=>v.b-v.ext}},
 "book-extension-magnification": {
  domains:{"mag": "nonnegative", "ext": "nonnegative", "f": "positive"},
  primary:["mag", "ext", "f"],
  inverse: {
   "mag":v=>divide(v.ext,v.f),
   "ext":v=>v.mag*v.f,
   "f":v=>divide(v.ext,v.mag)}},
 "book-bellows-factor": {
  domains:{"V": "atLeastOne", "ext": "nonnegative", "f": "positive"},
  primary:["V", "ext", "f"],
  inverse: {
   "V":v=>(1+divide(v.ext,v.f))**2,
   "ext":v=>v.f*(root(v.V,2)-1),
   "f":v=>divide(v.ext,root(v.V,2)-1)}},
 "book-snell": {
  domains:{"n1": "positive", "n2": "positive", "i": "quadrant", "r": "quadrant"},
  primary:["n1", "n2", "i", "r"],
  inverse: {
   "n1":v=>divide(v.n2*Math.sin(v.r),Math.sin(v.i)),
   "n2":v=>divide(v.n1*Math.sin(v.i),Math.sin(v.r)),
   "i":v=>asin(divide(v.n2*Math.sin(v.r),v.n1)),
   "r":v=>asin(divide(v.n1*Math.sin(v.i),v.n2))},
  balance:v=>[v.n1*Math.sin(v.i),v.n2*Math.sin(v.r)]},
 "book-speed-refraction": {
  domains:{"v1": "positive", "v2": "positive", "i": "quadrant", "r": "quadrant"},
  primary:["v1", "v2", "i", "r"],
  inverse: {
   "v1":v=>divide(v.v2*Math.sin(v.i),Math.sin(v.r)),
   "v2":v=>divide(v.v1*Math.sin(v.r),Math.sin(v.i)),
   "i":v=>asin(divide(v.v1*Math.sin(v.r),v.v2)),
   "r":v=>asin(divide(v.v2*Math.sin(v.i),v.v1))},
  balance:v=>[v.v2*Math.sin(v.i),v.v1*Math.sin(v.r)]},
 "book-critical-index": {
  domains:{"theta": "criticalAngle", "n1": "positive", "n2": "positive"},
  primary:["theta", "n1", "n2"],
  inverse: {
   "theta":v=>asin(divide(v.n2,v.n1)),
   "n1":v=>divide(v.n2,Math.sin(v.theta)),
   "n2":v=>v.n1*Math.sin(v.theta)},
  valid:v=>v.n1>v.n2},
 "book-critical-speed": {
  domains:{"theta": "criticalAngle", "v1": "positive", "v2": "positive"},
  primary:["theta", "v1", "v2"],
  inverse: {
   "theta":v=>asin(divide(v.v1,v.v2)),
   "v1":v=>v.v2*Math.sin(v.theta),
   "v2":v=>divide(v.v1,Math.sin(v.theta))},
  valid:v=>v.v1<v.v2},
 "book-fiber-ratio": {
  domains:{"a": "nonnegative", "P1": "positive", "P2": "nonnegative"},
  primary:["a", "P1", "P2"],
  inverse: {
   "a":v=>divide(v.P2,product(v.P1)),
   "P1":v=>divide(v.P2,product(v.a)),
   "P2":v=>product(v.a,v.P1)},
  balance:v=>[product(v.a,v.P1),product(1,v.P2)]},
 "book-fiber-db": {
  domains:{"L": "real", "P1": "positive", "P2": "positive"},
  primary:["L", "P1", "P2"],
  inverse: {
   "L":v=>10*(Math.log10(v.P2)-Math.log10(v.P1)),
   "P1":v=>positiveExp(Math.log(v.P2)-v.L*Math.LN10/10),
   "P2":v=>positiveExp(Math.log(v.P1)+v.L*Math.LN10/10)}},
 "book-fiber-dbm": {
  domains:{"L": "real", "P": "positive"},
  primary:["L", "P"],
  inverse: {
   "L":v=>10*(Math.log10(v.P)+3),
   "P":v=>positiveExp(Math.log(.001)+v.L*Math.LN10/10)}},
 "book-solar-projection": {
  domains:{"E": "nonnegative", "E0": "positive", "alpha": "quadrant"},
  primary:["E", "E0", "alpha"],
  inverse: {
   "E":v=>v.E0*Math.sin(v.alpha),
   "E0":v=>divide(v.E,Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.E,v.E0))}},
 "book-expansion-coefficients": {
  domains:{"beta": "real", "alpha": "real"},
  primary:["beta", "alpha"],
  inverse: {
   "beta":v=>product(3,v.alpha),
   "alpha":v=>divide(v.beta,product(3))},
  balance:v=>[product(v.beta),product(3,v.alpha)]},
 "book-heat-capacity-quantity": {
  domains:{"Q": "real", "C": "positive", "dT": "real"},
  primary:["Q", "C", "dT"],
  inverse: {
   "Q":v=>product(v.C,v.dT),
   "C":v=>divide(v.Q,product(v.dT)),
   "dT":v=>divide(v.Q,product(v.C))},
  balance:v=>[product(v.Q),product(1,v.C,v.dT)]},
 "book-heat-rate": {
  domains:{"P": "real", "Q": "real", "t": "nonnegative"},
  primary:["P", "Q", "t"],
  inverse: {
   "P":v=>divide(v.Q,product(v.t)),
   "Q":v=>product(v.P,v.t),
   "t":v=>divide(v.Q,product(v.P))},
  balance:v=>[product(v.P,v.t),product(1,v.Q)]},
 "book-advected-heat": {
  domains:{"P": "real", "mdot": "nonnegative", "c": "positive", "dT": "real"},
  primary:["P", "mdot", "c", "dT"],
  inverse: {
   "P":v=>product(v.mdot,v.c,v.dT),
   "mdot":v=>divide(v.P,product(v.c,v.dT)),
   "c":v=>divide(v.P,product(v.mdot,v.dT)),
   "dT":v=>divide(v.P,product(v.mdot,v.c))},
  balance:v=>[product(v.P),product(1,v.mdot,v.c,v.dT)]},
 "book-conduction-rate": {
  domains:{"P": "real", "k": "positive", "A": "positive", "dT": "real", "l": "positive"},
  primary:["P", "k", "A", "dT", "l"],
  inverse: {
   "P":v=>divide(product(v.k,v.A,v.dT),product(v.l)),
   "k":v=>divide(product(v.P,v.l),product(v.A,v.dT)),
   "A":v=>divide(product(v.P,v.l),product(v.k,v.dT)),
   "dT":v=>divide(product(v.P,v.l),product(v.k,v.A)),
   "l":v=>divide(product(v.k,v.A,v.dT),product(v.P))},
  balance:v=>[product(v.P,v.l),product(1,v.k,v.A,v.dT)]},
 "book-conduction-heat": {
  domains:{"Q": "real", "k": "positive", "A": "positive", "dT": "real", "t": "nonnegative", "l": "positive"},
  primary:["Q", "k", "A", "dT", "t", "l"],
  inverse: {
   "Q":v=>divide(product(v.k,v.A,v.dT,v.t),product(v.l)),
   "k":v=>divide(product(v.Q,v.l),product(v.A,v.dT,v.t)),
   "A":v=>divide(product(v.Q,v.l),product(v.k,v.dT,v.t)),
   "dT":v=>divide(product(v.Q,v.l),product(v.k,v.A,v.t)),
   "t":v=>divide(product(v.Q,v.l),product(v.k,v.A,v.dT)),
   "l":v=>divide(product(v.k,v.A,v.dT,v.t),product(v.Q))},
  balance:v=>[product(v.Q,v.l),product(1,v.k,v.A,v.dT,v.t)]},
 "book-convection-heat": {
  domains:{"Q": "real", "hc": "positive", "A": "positive", "dT": "real", "t": "nonnegative"},
  primary:["Q", "hc", "A", "dT", "t"],
  inverse: {
   "Q":v=>product(v.hc,v.A,v.dT,v.t),
   "hc":v=>divide(v.Q,product(v.A,v.dT,v.t)),
   "A":v=>divide(v.Q,product(v.hc,v.dT,v.t)),
   "dT":v=>divide(v.Q,product(v.hc,v.A,v.t)),
   "t":v=>divide(v.Q,product(v.hc,v.A,v.dT))},
  balance:v=>[product(v.Q),product(1,v.hc,v.A,v.dT,v.t)]},
 "book-layer-conductance": {
  domains:{"U": "positive", "k": "positive", "l": "positive"},
  primary:["U", "k", "l"],
  inverse: {
   "U":v=>divide(v.k,product(v.l)),
   "k":v=>product(v.U,v.l),
   "l":v=>divide(v.k,product(v.U))},
  balance:v=>[product(v.U,v.l),product(1,v.k)]},
 "book-overall-heat": {
  domains:{"Q": "real", "U": "positive", "A": "positive", "dT": "real", "t": "nonnegative"},
  primary:["Q", "U", "A", "dT", "t"],
  inverse: {
   "Q":v=>product(v.U,v.A,v.dT,v.t),
   "U":v=>divide(v.Q,product(v.A,v.dT,v.t)),
   "A":v=>divide(v.Q,product(v.U,v.dT,v.t)),
   "dT":v=>divide(v.Q,product(v.U,v.A,v.t)),
   "t":v=>divide(v.Q,product(v.U,v.A,v.dT))},
  balance:v=>[product(v.Q),product(1,v.U,v.A,v.dT,v.t)]},
 "book-overall-coefficient": {
  domains:{"U": "positive", "h1": "positive", "h2": "positive", "k": "positive", "l": "positive"},
  primary:["U", "h1", "h2", "k", "l"],
  inverse: {
   "U":v=>divide(1,1/v.h1+v.l/v.k+1/v.h2),
   "h1":v=>divide(1,1/v.U-v.l/v.k-1/v.h2),
   "h2":v=>divide(1,1/v.U-v.l/v.k-1/v.h1),
   "k":v=>divide(v.l,1/v.U-1/v.h1-1/v.h2),
   "l":v=>v.k*(1/v.U-1/v.h1-1/v.h2)}},
 "book-bernoulli": {
  domains:{"p1": "real", "p2": "real", "rho": "positive", "v1": "nonnegative", "v2": "nonnegative", "g": "positive", "h1": "real", "h2": "real"},
  primary:["p1", "p2", "rho", "v1", "v2", "g", "h1", "h2"],
  inverse: {
   "p1":v=>v.p2+v.rho*v.g*(v.h2-v.h1)+v.rho*(v.v2*v.v2-v.v1*v.v1)/2,
   "p2":v=>v.p1+v.rho*v.g*(v.h1-v.h2)+v.rho*(v.v1*v.v1-v.v2*v.v2)/2,
   "rho":v=>divide(v.p2-v.p1,v.g*(v.h1-v.h2)+(v.v1*v.v1-v.v2*v.v2)/2),
   "v1":v=>root(v.v2*v.v2+2*divide(v.p2-v.p1,v.rho)+2*v.g*(v.h2-v.h1),2),
   "v2":v=>root(v.v1*v.v1+2*divide(v.p1-v.p2,v.rho)+2*v.g*(v.h1-v.h2),2),
   "g":v=>divide(divide(v.p2-v.p1,v.rho)+(v.v2*v.v2-v.v1*v.v1)/2,v.h1-v.h2),
   "h1":v=>v.h2+divide(divide(v.p2-v.p1,v.rho)+(v.v2*v.v2-v.v1*v.v1)/2,v.g),
   "h2":v=>v.h1+divide(divide(v.p1-v.p2,v.rho)+(v.v1*v.v1-v.v2*v.v2)/2,v.g)}},
 "book-normal-force": {
  domains:{"Fn": "nonnegative", "Fg": "positive", "alpha": "quadrant"},
  primary:["Fn", "Fg", "alpha"],
  inverse: {
   "Fn":v=>v.Fg*cosine(v.alpha),
   "Fg":v=>divide(v.Fn,cosine(v.alpha)),
   "alpha":v=>acos(divide(v.Fn,v.Fg))}},
 "book-slope-component": {
  domains:{"F": "nonnegative", "m": "positive", "g": "positive", "alpha": "quadrant"},
  primary:["F", "m", "g", "alpha"],
  inverse: {
   "F":v=>v.m*v.g*Math.sin(v.alpha),
   "m":v=>divide(v.F,v.g*Math.sin(v.alpha)),
   "g":v=>divide(v.F,v.m*Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.F,v.m*v.g))}},
 "book-slope-geometry": {
  domains:{"h": "nonnegative", "s": "positive", "alpha": "quadrant"},
  primary:["h", "s", "alpha"],
  inverse: {
   "h":v=>v.s*Math.sin(v.alpha),
   "s":v=>divide(v.h,Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.h,v.s))}},
 "book-slope-raising": {
  domains:{"F": "real", "Fg": "positive", "mu": "nonnegative", "alpha": "quadrant"},
  primary:["F", "Fg", "mu", "alpha"],
  inverse: {
   "F":v=>v.Fg*(Math.sin(v.alpha)+v.mu*cosine(v.alpha)),
   "Fg":v=>divide(v.F,Math.sin(v.alpha)+v.mu*cosine(v.alpha)),
   "mu":v=>divide(divide(v.F,v.Fg)-Math.sin(v.alpha),cosine(v.alpha)),
   "alpha":v=>inclineAngles(divide(v.F,v.Fg),v.mu,1)}},
 "book-slope-lowering": {
  domains:{"F": "real", "Fg": "positive", "mu": "nonnegative", "alpha": "quadrant"},
  primary:["F", "Fg", "mu", "alpha"],
  inverse: {
   "F":v=>v.Fg*(Math.sin(v.alpha)-v.mu*cosine(v.alpha)),
   "Fg":v=>divide(v.F,Math.sin(v.alpha)-v.mu*cosine(v.alpha)),
   "mu":v=>divide(Math.sin(v.alpha)-divide(v.F,v.Fg),cosine(v.alpha)),
   "alpha":v=>inclineAngles(divide(v.F,v.Fg),v.mu,-1)}},
 "book-slope-acceleration": {
  domains:{"a": "real", "g": "positive", "mu": "nonnegative", "alpha": "quadrant"},
  primary:["a", "g", "mu", "alpha"],
  inverse: {
   "a":v=>v.g*(Math.sin(v.alpha)-v.mu*cosine(v.alpha)),
   "g":v=>divide(v.a,Math.sin(v.alpha)-v.mu*cosine(v.alpha)),
   "mu":v=>divide(Math.sin(v.alpha)-divide(v.a,v.g),cosine(v.alpha)),
   "alpha":v=>inclineAngles(divide(v.a,v.g),v.mu,-1)}},
 "book-vertical-position": {
  domains:{"y": "real", "y0": "real", "u": "real", "g": "positive", "t": "nonnegative"},
  primary:["y", "y0", "u", "g", "t"],
  inverse: {
   "y":v=>v.y0+v.u*v.t-v.g*v.t*v.t/2,
   "y0":v=>v.y-v.u*v.t+v.g*v.t*v.t/2,
   "u":v=>divide(v.y-v.y0,v.t)+v.g*v.t/2,
   "g":v=>divide(2*(v.y0+v.u*v.t-v.y),v.t*v.t),
   "t":v=>quadratic(-v.g/2,v.u,v.y0-v.y)},
  balance:v=>[v.y+v.g*v.t*v.t/2,v.y0+v.u*v.t]},
 "book-vertical-velocity": {
  domains:{"v": "real", "u": "real", "g": "positive", "t": "nonnegative"},
  primary:["v", "u", "g", "t"],
  inverse: {
   "v":v=>v.u-v.g*v.t,
   "u":v=>v.v+v.g*v.t,
   "g":v=>divide(v.u-v.v,v.t),
   "t":v=>divide(v.u-v.v,v.g)},
  balance:v=>[v.v+v.g*v.t,v.u]},
 "book-projectile-energy": {
  domains:{"v": "nonnegative", "v0": "nonnegative", "g": "positive", "h": "real"},
  primary:["v", "v0", "g", "h"],
  inverse: {
   "v":v=>root(v.v0*v.v0-2*v.g*v.h,2),
   "v0":v=>root(v.v*v.v+2*v.g*v.h,2),
   "g":v=>divide((v.v0-v.v)*(v.v0+v.v),2*v.h),
   "h":v=>divide((v.v0-v.v)*(v.v0+v.v),2*v.g)}},
 "book-free-fall-height": {
  domains:{"h": "nonnegative", "g": "positive", "t": "nonnegative"},
  primary:["h", "g", "t"],
  inverse: {
   "h":v=>product(0.5,v.g,product(v.t,v.t)),
   "g":v=>divide(v.h,product(0.5,product(v.t,v.t))),
   "t":v=>root(divide(v.h,product(0.5,v.g)),2)},
  balance:v=>[product(v.h),product(0.5,v.g,product(v.t,v.t))]},
 "book-free-fall-speed": {
  domains:{"v": "nonnegative", "g": "positive", "h": "nonnegative"},
  primary:["v", "g", "h"],
  inverse: {
   "v":v=>root(product(2,v.g,v.h),2),
   "g":v=>divide(product(v.v,v.v),product(2,v.h)),
   "h":v=>divide(product(v.v,v.v),product(2,v.g))},
  balance:v=>[product(product(v.v,v.v)),product(2,v.g,v.h)]},
 "book-average-fall-speed": {
  domains:{"h": "nonnegative", "v": "nonnegative", "t": "nonnegative"},
  primary:["h", "v", "t"],
  inverse: {
   "h":v=>product(0.5,v.v,v.t),
   "v":v=>divide(v.h,product(0.5,v.t)),
   "t":v=>divide(v.h,product(0.5,v.v))},
  balance:v=>[product(v.h),product(0.5,v.v,v.t)]},
 "book-maximum-height": {
  domains:{"hm": "real", "y0": "real", "v0": "nonnegative", "g": "positive"},
  primary:["hm", "y0", "v0", "g"],
  inverse: {
   "hm":v=>v.y0+v.v0*v.v0/(2*v.g),
   "y0":v=>v.hm-v.v0*v.v0/(2*v.g),
   "v0":v=>root(2*v.g*(v.hm-v.y0),2),
   "g":v=>divide(v.v0*v.v0,2*(v.hm-v.y0))},
  valid:v=>v.hm>=v.y0},
 "book-vertical-apex-time": {
  domains:{"t": "nonnegative", "v0": "nonnegative", "g": "positive"},
  primary:["t", "v0", "g"],
  inverse: {
   "t":v=>divide(v.v0,product(v.g)),
   "v0":v=>product(v.t,v.g),
   "g":v=>divide(v.v0,product(v.t))},
  balance:v=>[product(v.t,v.g),product(1,v.v0)]},
 "book-horizontal-trajectory": {
  domains:{"y": "nonnegative", "g": "positive", "x": "nonnegative", "v0": "positive"},
  primary:["y", "g", "x", "v0"],
  inverse: {
   "y":v=>divide(product(0.5,v.g,product(v.x,v.x)),product(product(v.v0,v.v0))),
   "g":v=>divide(product(v.y,product(v.v0,v.v0)),product(0.5,product(v.x,v.x))),
   "x":v=>root(divide(product(v.y,product(v.v0,v.v0)),product(0.5,v.g)),2),
   "v0":v=>root(divide(product(0.5,v.g,product(v.x,v.x)),product(v.y)),2)},
  balance:v=>[product(v.y,product(v.v0,v.v0)),product(0.5,v.g,product(v.x,v.x))]},
 "book-speed-components": {
  domains:{"v": "nonnegative", "vx": "nonnegative", "vy": "nonnegative"},
  primary:["v", "vx", "vy"],
  inverse: {
   "v":v=>Math.hypot(v.vx,v.vy),
   "vx":v=>root((v.v-v.vy)*(v.v+v.vy),2),
   "vy":v=>root((v.v-v.vx)*(v.v+v.vx),2)}},
 "book-falling-direction": {
  domains:{"alpha": "incidence", "g": "positive", "t": "nonnegative", "v0": "positive"},
  primary:["alpha", "g", "t", "v0"],
  inverse: {
   "alpha":v=>Math.atan(divide(v.g*v.t,v.v0)),
   "g":v=>divide(v.v0*Math.tan(v.alpha),v.t),
   "t":v=>divide(v.v0*Math.tan(v.alpha),v.g),
   "v0":v=>divide(v.g*v.t,Math.tan(v.alpha))}},
 "book-launch-cos": {
  domains:{"vx": "nonnegative", "v0": "nonnegative", "alpha": "incidence"},
  primary:["vx", "v0", "alpha"],
  inverse: {
   "vx":v=>v.v0*cosine(v.alpha),
   "v0":v=>divide(v.vx,cosine(v.alpha)),
   "alpha":v=>acos(divide(v.vx,v.v0))}},
 "book-launch-sin": {
  domains:{"vy": "nonnegative", "v0": "nonnegative", "alpha": "incidence"},
  primary:["vy", "v0", "alpha"],
  inverse: {
   "vy":v=>v.v0*Math.sin(v.alpha),
   "v0":v=>divide(v.vy,Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.vy,v.v0))}},
 "book-oblique-flight-time": {
  domains:{"t": "nonnegative", "v0": "nonnegative", "alpha": "incidence", "g": "positive"},
  primary:["t", "v0", "alpha", "g"],
  inverse: {
   "t":v=>2*v.v0*Math.sin(v.alpha)/v.g,
   "v0":v=>divide(v.g*v.t,2*Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.g*v.t,2*v.v0)),
   "g":v=>divide(2*v.v0*Math.sin(v.alpha),v.t)}},
 "book-oblique-range": {
  domains:{"R": "nonnegative", "v0": "nonnegative", "alpha": "incidence", "g": "positive"},
  primary:["R", "v0", "alpha", "g"],
  inverse: {
   "R":v=>v.v0*v.v0*Math.sin(2*v.alpha)/v.g,
   "v0":v=>root(divide(v.R*v.g,Math.sin(2*v.alpha)),2),
   "alpha":v=>rangeAngles(v.R,v.g,v.v0),
   "g":v=>divide(v.v0*v.v0*Math.sin(2*v.alpha),v.R)}},
 "book-oblique-apex-height": {
  domains:{"h": "nonnegative", "v0": "nonnegative", "alpha": "incidence", "g": "positive"},
  primary:["h", "v0", "alpha", "g"],
  inverse: {
   "h":v=>v.v0*v.v0*Math.sin(v.alpha)**2/(2*v.g),
   "v0":v=>divide(root(2*v.g*v.h,2),Math.sin(v.alpha)),
   "alpha":v=>asin(divide(root(2*v.g*v.h,2),v.v0)),
   "g":v=>divide(v.v0*v.v0*Math.sin(v.alpha)**2,2*v.h)}},
 "book-oblique-trajectory": {
  domains:{"y": "real", "x": "nonnegative", "v0": "positive", "alpha": "incidence", "g": "positive"},
  primary:["y", "x", "v0", "alpha", "g"],
  inverse: {
   "y":v=>v.x*Math.tan(v.alpha)-divide(v.g*v.x*v.x,2*v.v0*v.v0*Math.cos(v.alpha)**2),
   "x":v=>quadratic(-divide(v.g,2*v.v0*v.v0*Math.cos(v.alpha)**2),Math.tan(v.alpha),-v.y),
   "v0":v=>root(divide(v.g*v.x*v.x,2*Math.cos(v.alpha)**2*(v.x*Math.tan(v.alpha)-v.y)),2),
   "alpha":v=>trajectoryAngles(v.x,v.y,v.v0,v.g),
   "g":v=>divide(2*v.v0*v.v0*Math.cos(v.alpha)**2*(v.x*Math.tan(v.alpha)-v.y),v.x*v.x)},
  balance:v=>[v.x*Math.tan(v.alpha),v.y+divide(v.g*v.x*v.x,2*v.v0*v.v0*Math.cos(v.alpha)**2)]},
 "book-thermal-mixing": {
  domains:{"Tm": "nonnegative", "T1": "nonnegative", "T2": "nonnegative", "c1": "positive", "c2": "positive", "m1": "positive", "m2": "positive"},
  primary:["Tm", "T1", "T2", "c1", "c2", "m1", "m2"],
  inverse: {
   "Tm":v=>(v.c1*v.m1*v.T1+v.c2*v.m2*v.T2)/(v.c1*v.m1+v.c2*v.m2),
   "T1":v=>v.Tm+divide(v.c2*v.m2*(v.Tm-v.T2),v.c1*v.m1),
   "T2":v=>v.Tm-divide(v.c1*v.m1*(v.T1-v.Tm),v.c2*v.m2),
   "c1":v=>divide(v.c2*v.m2*(v.Tm-v.T2),v.m1*(v.T1-v.Tm)),
   "c2":v=>divide(v.c1*v.m1*(v.T1-v.Tm),v.m2*(v.Tm-v.T2)),
   "m1":v=>divide(v.c2*v.m2*(v.Tm-v.T2),v.c1*(v.T1-v.Tm)),
   "m2":v=>divide(v.c1*v.m1*(v.T1-v.Tm),v.c2*(v.Tm-v.T2))}},
 "book-hydrostatic": {
  domains:{"p": "nonnegative", "rho": "positive", "g": "positive", "h": "nonnegative"},
  primary:["p", "rho", "g", "h"],
  inverse: {
   "p":v=>product(v.rho,v.g,v.h),
   "rho":v=>divide(v.p,product(v.g,v.h)),
   "g":v=>divide(v.p,product(v.rho,v.h)),
   "h":v=>divide(v.p,product(v.rho,v.g))},
  balance:v=>[product(v.p),product(1,v.rho,v.g,v.h)]},
 "book-hydrostatic-mass": {
  domains:{"p": "nonnegative", "m": "positive", "g": "positive", "A": "positive"},
  primary:["p", "m", "g", "A"],
  inverse: {
   "p":v=>divide(product(v.m,v.g),product(v.A)),
   "m":v=>divide(product(v.p,v.A),product(v.g)),
   "g":v=>divide(product(v.p,v.A),product(v.m)),
   "A":v=>divide(product(v.m,v.g),product(v.p))},
  balance:v=>[product(v.p,v.A),product(1,v.m,v.g)]},
 "book-horizontal-friction-work": {
  domains:{"W": "nonnegative", "mu": "nonnegative", "m": "positive", "g": "positive", "s": "nonnegative"},
  primary:["W", "mu", "m", "g", "s"],
  inverse: {
   "W":v=>product(v.mu,v.m,v.g,v.s),
   "mu":v=>divide(v.W,product(v.m,v.g,v.s)),
   "m":v=>divide(v.W,product(v.mu,v.g,v.s)),
   "g":v=>divide(v.W,product(v.mu,v.m,v.s)),
   "s":v=>divide(v.W,product(v.mu,v.m,v.g))},
  balance:v=>[product(v.W),product(1,v.mu,v.m,v.g,v.s)]},
 "book-power-force-distance": {
  domains:{"P": "real", "F": "real", "s": "real", "t": "nonnegative"},
  primary:["P", "F", "s", "t"],
  inverse: {
   "P":v=>divide(product(v.F,v.s),product(v.t)),
   "F":v=>divide(product(v.P,v.t),product(v.s)),
   "s":v=>divide(product(v.P,v.t),product(v.F)),
   "t":v=>divide(product(v.F,v.s),product(v.P))},
  balance:v=>[product(v.P,v.t),product(1,v.F,v.s)]},
 "book-incline-work": {
  domains:{"W": "real", "m": "positive", "g": "positive", "s": "real", "alpha": "quadrant"},
  primary:["W", "m", "g", "s", "alpha"],
  inverse: {
   "W":v=>v.m*v.g*v.s*Math.sin(v.alpha),
   "m":v=>divide(v.W,v.g*v.s*Math.sin(v.alpha)),
   "g":v=>divide(v.W,v.m*v.s*Math.sin(v.alpha)),
   "s":v=>divide(v.W,v.m*v.g*Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.W,v.m*v.g*v.s))}},
 "book-total-length-expansion": {
  domains:{"z": "positive", "z0": "positive", "co": "real", "dT": "real"},
  primary:["z", "z0", "co", "dT"],
  inverse: {
   "z":v=>v.z0*(1+1*v.co*v.dT),
   "z0":v=>divide(v.z,1+1*v.co*v.dT),
   "co":v=>divide(divide(v.z,v.z0)-1,1*v.dT),
   "dT":v=>divide(divide(v.z,v.z0)-1,1*v.co)}},
 "book-additive-length-expansion": {
  domains:{"z": "positive", "z0": "positive", "dz": "real"},
  primary:["z", "z0", "dz"],
  inverse: {
   "z":v=>v.z0+v.dz,
   "z0":v=>v.z-v.dz,
   "dz":v=>v.z-v.z0}},
 "book-total-area-expansion": {
  domains:{"z": "positive", "z0": "positive", "co": "real", "dT": "real"},
  primary:["z", "z0", "co", "dT"],
  inverse: {
   "z":v=>v.z0*(1+2*v.co*v.dT),
   "z0":v=>divide(v.z,1+2*v.co*v.dT),
   "co":v=>divide(divide(v.z,v.z0)-1,2*v.dT),
   "dT":v=>divide(divide(v.z,v.z0)-1,2*v.co)}},
 "book-additive-area-expansion": {
  domains:{"z": "positive", "z0": "positive", "dz": "real"},
  primary:["z", "z0", "dz"],
  inverse: {
   "z":v=>v.z0+v.dz,
   "z0":v=>v.z-v.dz,
   "dz":v=>v.z-v.z0}},
 "book-total-volume-expansion": {
  domains:{"z": "positive", "z0": "positive", "co": "real", "dT": "real"},
  primary:["z", "z0", "co", "dT"],
  inverse: {
   "z":v=>v.z0*(1+1*v.co*v.dT),
   "z0":v=>divide(v.z,1+1*v.co*v.dT),
   "co":v=>divide(divide(v.z,v.z0)-1,1*v.dT),
   "dT":v=>divide(divide(v.z,v.z0)-1,1*v.co)}},
 "book-additive-volume-expansion": {
  domains:{"z": "positive", "z0": "positive", "dz": "real"},
  primary:["z", "z0", "dz"],
  inverse: {
   "z":v=>v.z0+v.dz,
   "z0":v=>v.z-v.dz,
   "dz":v=>v.z-v.z0}},
 "book-magnification-focal-image": {
  domains:{"m": "positive", "b": "positive", "f": "positive"},
  primary:["m", "b", "f"],
  inverse: {
   "m":v=>divide(v.b,v.f)-1,
   "b":v=>v.f*(1+v.m),
   "f":v=>divide(v.b,1+v.m)},
  valid:v=>v.b>v.f},
 "book-magnification-focal-object": {
  domains:{"m": "positive", "g": "positive", "f": "positive"},
  primary:["m", "g", "f"],
  inverse: {
   "m":v=>divide(v.f,v.g-v.f),
   "g":v=>v.f*(1+divide(1,v.m)),
   "f":v=>divide(v.m*v.g,1+v.m)},
  valid:v=>v.g>v.f},
 "book-angular-period": {
  domains:{"omega": "positive", "T": "positive"},
  primary:["omega", "T"],
  inverse: {
   "omega":v=>divide(6.283185307179586,product(v.T)),
   "T":v=>divide(6.283185307179586,product(v.omega))},
  balance:v=>[product(v.omega,v.T),product(6.283185307179586)]},
 "book-tangential-period": {
  domains:{"v": "nonnegative", "r": "positive", "T": "positive"},
  primary:["v", "r", "T"],
  inverse: {
   "v":v=>divide(product(6.283185307179586,v.r),product(v.T)),
   "r":v=>divide(product(v.v,v.T),product(6.283185307179586)),
   "T":v=>divide(product(6.283185307179586,v.r),product(v.v))},
  balance:v=>[product(v.v,v.T),product(6.283185307179586,v.r)]},
 "book-tangential-frequency": {
  domains:{"v": "nonnegative", "r": "positive", "f": "positive"},
  primary:["v", "r", "f"],
  inverse: {
   "v":v=>product(6.283185307179586,v.r,v.f),
   "r":v=>divide(v.v,product(6.283185307179586,v.f)),
   "f":v=>divide(v.v,product(6.283185307179586,v.r))},
  balance:v=>[product(v.v),product(6.283185307179586,v.r,v.f)]},
 "book-angular-acceleration-rest": {
  domains:{"omega": "real", "alpha": "real", "t": "nonnegative"},
  primary:["omega", "alpha", "t"],
  inverse: {
   "omega":v=>product(v.alpha,v.t),
   "alpha":v=>divide(v.omega,product(v.t)),
   "t":v=>divide(v.omega,product(v.alpha))},
  balance:v=>[product(v.omega),product(1,v.alpha,v.t)]},
 "book-angular-rest-position": {
  domains:{"phi": "real", "alpha": "real", "t": "nonnegative"},
  primary:["phi", "alpha", "t"],
  inverse: {
   "phi":v=>product(0.5,v.alpha,product(v.t,v.t)),
   "alpha":v=>divide(v.phi,product(0.5,product(v.t,v.t))),
   "t":v=>root(divide(v.phi,product(0.5,v.alpha)),2)},
  balance:v=>[product(v.phi),product(0.5,v.alpha,product(v.t,v.t))]},
 "book-angular-rest-average": {
  domains:{"phi": "real", "omega": "real", "t": "nonnegative"},
  primary:["phi", "omega", "t"],
  inverse: {
   "phi":v=>product(0.5,v.omega,v.t),
   "omega":v=>divide(v.phi,product(0.5,v.t)),
   "t":v=>divide(v.phi,product(0.5,v.omega))},
  balance:v=>[product(v.phi),product(0.5,v.omega,v.t)]},
 "book-equal-heat-mixing": {
  domains:{"Tm": "nonnegative", "T1": "nonnegative", "T2": "nonnegative", "m1": "positive", "m2": "positive"},
  primary:["Tm", "T1", "T2", "m1", "m2"],
  inverse: {
   "Tm":v=>(v.m1*v.T1+v.m2*v.T2)/(v.m1+v.m2),
   "T1":v=>v.Tm+divide(v.m2*(v.Tm-v.T2),v.m1),
   "T2":v=>v.Tm-divide(v.m1*(v.T1-v.Tm),v.m2),
   "m1":v=>divide(v.m2*(v.Tm-v.T2),v.T1-v.Tm),
   "m2":v=>divide(v.m1*(v.T1-v.Tm),v.Tm-v.T2)}},
 "book-angular-rest-energy-angle": {
  domains:{"phi": "real", "omega": "real", "alpha": "real"},
  primary:["phi", "omega", "alpha"],
  inverse: {
   "phi":v=>divide(v.omega*v.omega,2*v.alpha),
   "omega":v=>signedRoot(2*v.alpha*v.phi),
   "alpha":v=>divide(v.omega*v.omega,2*v.phi)},
  balance:v=>[v.omega*v.omega,2*v.alpha*v.phi]},
 "book-angular-rest-energy-revolutions": {
  domains:{"N": "real", "omega": "real", "alpha": "real"},
  primary:["N", "omega", "alpha"],
  inverse: {
   "N":v=>divide(v.omega*v.omega,12.566370614359172*v.alpha),
   "omega":v=>signedRoot(12.566370614359172*v.alpha*v.N),
   "alpha":v=>divide(v.omega*v.omega,12.566370614359172*v.N)},
  balance:v=>[v.omega*v.omega,12.566370614359172*v.alpha*v.N]},
 "book-free-fall-speed-time": {
  domains:{"v": "nonnegative", "g": "positive", "t": "nonnegative"},
  primary:["v", "g", "t"],
  inverse: {
   "v":v=>product(v.g,v.t),
   "g":v=>divide(v.v,product(v.t)),
   "t":v=>divide(v.v,product(v.g))},
  balance:v=>[product(v.v),product(1,v.g,v.t)]},
 "book-horizontal-speed-time": {
  domains:{"v": "nonnegative", "v0": "nonnegative", "g": "positive", "t": "nonnegative"},
  primary:["v", "v0", "g", "t"],
  inverse: {
   "v":v=>Math.hypot(v.v0,v.g*v.t),
   "v0":v=>root((v.v-v.g*v.t)*(v.v+v.g*v.t),2),
   "g":v=>divide(root((v.v-v.v0)*(v.v+v.v0),2),v.t),
   "t":v=>divide(root((v.v-v.v0)*(v.v+v.v0),2),v.g)}},
 "book-falling-direction-depth": {
  domains:{"alpha": "incidence", "g": "positive", "y": "nonnegative", "v0": "positive"},
  primary:["alpha", "g", "y", "v0"],
  inverse: {
   "alpha":v=>Math.atan(divide(root(2*v.g*v.y,2),v.v0)),
   "g":v=>divide(v.v0*v.v0*Math.tan(v.alpha)**2,2*v.y),
   "y":v=>divide(v.v0*v.v0*Math.tan(v.alpha)**2,2*v.g),
   "v0":v=>divide(root(2*v.g*v.y,2),Math.tan(v.alpha))}},
 "book-oblique-vertical-velocity": {
  domains:{"vy": "real", "v0": "nonnegative", "alpha": "incidence", "g": "positive", "t": "nonnegative"},
  primary:["vy", "v0", "alpha", "g", "t"],
  inverse: {
   "vy":v=>v.v0*Math.sin(v.alpha)-v.g*v.t,
   "v0":v=>divide(v.vy+v.g*v.t,Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.vy+v.g*v.t,v.v0)),
   "g":v=>divide(v.v0*Math.sin(v.alpha)-v.vy,v.t),
   "t":v=>divide(v.v0*Math.sin(v.alpha)-v.vy,v.g)},
  balance:v=>[v.vy+v.g*v.t,v.v0*Math.sin(v.alpha)]},
 "book-oblique-apex-time": {
  domains:{"t": "nonnegative", "v0": "nonnegative", "alpha": "incidence", "g": "positive"},
  primary:["t", "v0", "alpha", "g"],
  inverse: {
   "t":v=>v.v0*Math.sin(v.alpha)/v.g,
   "v0":v=>divide(v.g*v.t,Math.sin(v.alpha)),
   "alpha":v=>asin(divide(v.g*v.t,v.v0)),
   "g":v=>divide(v.v0*Math.sin(v.alpha),v.t)}},
 "book-real-magnification-distance": {
  domains:{"m": "positive", "b": "positive", "g": "positive"},
  primary:["m", "b", "g"],
  inverse: {
   "m":v=>divide(v.b,product(v.g)),
   "b":v=>product(v.m,v.g),
   "g":v=>divide(v.b,product(v.m))},
  balance:v=>[product(v.m,v.g),product(1,v.b)]},
 "book-image-focal-sizes": {
  domains:{"f": "positive", "b": "positive", "B": "positive", "G": "positive"},
  primary:["f", "b", "B", "G"],
  inverse: {
   "f":v=>divide(v.b*v.G,v.B+v.G),
   "b":v=>v.f*(1+divide(v.B,v.G)),
   "B":v=>divide(v.G*(v.b-v.f),v.f),
   "G":v=>divide(v.B*v.f,v.b-v.f)},
  valid:v=>v.b>v.f}
};
