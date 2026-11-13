import type {Values} from '../physics/resources/solver.ts';
/** Schematic, bounded deformation; no invented natural length or force magnitude. */
export function hookeSketch(values:Values){
 const x=values.x;
 const end=x===undefined?230:230+85*(x===0?0:Math.sign(x)*Math.min(1,Math.log1p(Math.abs(x)*100)/5));
 const points=[[50,90],[65,90],...Array.from({length:17},(_,i)=>[70+(end-90)*i/16,90+(i===0||i===16?0:i%2?15:-15)]),[end,90]];
 const F=values.F;
 return {end,path:points.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' '),forceEnd:F===undefined||F===0?undefined:end+(F>0?60:-60)};
}
