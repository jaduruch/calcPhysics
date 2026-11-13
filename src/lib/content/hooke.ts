import type {ResourceDefinition} from './resource-catalog.ts';
export const hookeDefinition:ResourceDefinition={
 id:'hookes-law',topic:'hookes-law',title:'Hooke’s Law',
 fields:[{id:'F',name:'spring restoring force',symbol:'F_s',kind:'force'},{id:'k',name:'spring constant',symbol:'k',kind:'springConstant'},{id:'x',name:'signed spring displacement',symbol:'x',kind:'length'}],
 rules:{F:String.raw`-[[k]]\cdot[[x]]`,k:String.raw`-\frac{[[F]]}{[[x]]}`,x:String.raw`-\frac{[[F]]}{[[k]]}`},outputs:[],
 assumption:'Ideal linear spring within its elastic range. Displacement is measured from the unstretched position; positive x means extension, negative x compression. The restoring force acts opposite to displacement. The spring constant is positive. At zero force and zero displacement the spring constant is undetermined. No damping, preload or plastic deformation is modelled.',
 source:'OpenStax',pages:[],reference:'https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion'
};
