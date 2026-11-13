import {divide,product,type ResourcePhysics} from '../resources/solver.ts';
/** Signed restoring force F = -k x, linear elastic range only. */
export const hookePhysics:ResourcePhysics={domains:{F:'real',k:'positive',x:'real'},primary:['F','k','x'],inverse:{F:v=>-product(v.k,v.x),k:v=>-divide(v.F,v.x),x:v=>-divide(v.F,v.k)}};
