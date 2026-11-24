import type {ModelDefinition} from './model-types.ts';
export const inertiaDerivationModel: ModelDefinition = {
  id:'inertia-derivations',topicId:'dynamics',calculator:'resource',presentation:'derivation',title:'Moment of Inertia',
  variables:[
    {name:'total mass',symbol:'M',unit:'kg',unitName:'kilogram'},
    {name:'outer radius',symbol:'R',unit:'m',unitName:'meter'},
    {name:'uniform mass density',symbol:'\\rho',unit:'kg/m³',unitName:'kilograms per cubic meter'},
    {name:'perpendicular distance to the rotation axis',symbol:'s',unit:'m',unitName:'meter'}
  ],
  formulas:[{label:'Moment of inertia',expression:String.raw`I=\int s^2\,\mathrm{d}m`}],
  notes:[{text:'Homogeneous solid bodies with M > 0 and R > 0. The rotation axis passes through the center of the sphere or along the symmetry axis of the cylinder. The cylinder height H is positive. These derivations do not include hollow bodies or displaced axes.'}]
};
export const inertiaDerivations = [
  {id:'sphere',label:'Sphere',title:'Homogeneous solid sphere',
    caption:'Axial cross-section of a sphere: a thin disk at height z has radius a(z). R is the sphere radius; the dashed vertical line is the rotation axis.',
    steps:[
      {text:'Use a constant density and divide the sphere into thin disks perpendicular to the rotation axis.',expression:String.raw`\rho=\frac{M}{\frac{4}{3}\pi R^3},\qquad -R\le z\le R`},
      {text:'The Pythagorean theorem gives the disk radius. Multiplying its area by its thickness and density gives the disk mass.',expression:String.raw`a(z)^2=R^2-z^2,\qquad \mathrm{d}m=\rho\pi a(z)^2\,\mathrm{d}z`},
      {text:'Each thin disk has the same central rotation axis. Its moment of inertia follows from the solid-cylinder derivation.',expression:String.raw`\mathrm{d}I=\frac12 a(z)^2\,\mathrm{d}m=\frac12\rho\pi(R^2-z^2)^2\,\mathrm{d}z`},
      {text:'Sum the moments of all disks and integrate the expanded polynomial.',expression:String.raw`I=\frac{\rho\pi}{2}\int_{-R}^{R}\left(R^4-2R^2z^2+z^4\right)\,\mathrm{d}z`},
      {text:'Evaluate the antiderivative at both ends of the sphere.',expression:String.raw`I=\frac{\rho\pi}{2}\left[R^4z-\frac{2R^2z^3}{3}+\frac{z^5}{5}\right]_{-R}^{R}=\frac{8\pi\rho R^5}{15}`},
      {text:'Substitute the density and simplify.',expression:String.raw`I=\frac{8\pi R^5}{15}\cdot\frac{3M}{4\pi R^3}=\boxed{\frac{2}{5}MR^2}`}
    ]},
  {id:'cylinder',label:'Cylinder',title:'Homogeneous solid cylinder',
    caption:'Schematic cylinder with height H and radius R. A thin coaxial cylindrical shell at distance s from the dashed rotation axis is highlighted.',
    steps:[
      {text:'Use a constant density and divide the cylinder into thin coaxial cylindrical shells.',expression:String.raw`\rho=\frac{M}{\pi R^2H},\qquad 0\le s\le R`},
      {text:'Shell circumference times height times radial thickness gives its volume. Every mass element of the thin shell lies at distance s from the axis.',expression:String.raw`\mathrm{d}V=2\pi sH\,\mathrm{d}s,\qquad \mathrm{d}m=2\pi\rho Hs\,\mathrm{d}s`},
      {text:'Integrate the squared perpendicular distance over the shell masses.',expression:String.raw`I=\int_0^R s^2\,\mathrm{d}m=2\pi\rho H\int_0^R s^3\,\mathrm{d}s`},
      {text:'Evaluate the integral and substitute the density. The height cancels.',expression:String.raw`I=2\pi\rho H\left[\frac{s^4}{4}\right]_0^R=\frac{\pi\rho HR^4}{2}=\boxed{\frac12 MR^2}`}
    ]}
] as const;
