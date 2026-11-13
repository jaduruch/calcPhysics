import type {Values} from '../physics/resources/solver.ts';
/** Schematic spring length, true known inclination and common force scale. */
export function springOrbitScene(v:Values){
 const angle=v.alpha??Math.PI/6,s=Math.sin(angle),c=Math.cos(angle),length=145;
 const mass={x:210+length*s,y:30+length*c};
 const spring=Array.from({length:25},(_,i)=>{const t=i/24,offset=i===0||i===24?0:i%2?5:-5;return {x:210+length*t*s+offset*c,y:30+length*t*c-offset*s};});
 const maximum=Math.max(v.Fs??0,v.Fg??0,v.Fc??0),scale=maximum>0?75/maximum:0;
 const arrows=[{key:'Fs',label:'Fₛ',dx:-s,dy:-c},{key:'Fg',label:'Fɢ',dx:0,dy:1},{key:'Fc',label:'F꜀',dx:-1,dy:0}].filter(a=>v[a.key]!==undefined&&v[a.key]>0&&(a.key==='Fg'||v.alpha!==undefined)).map(a=>{const len=v[a.key]*scale,x=mass.x+a.dx*len,y=mass.y+a.dy*len,head=Math.min(6,len*.25);return {...a,x,y,head:`${x-a.dx*head-a.dy*head*.5},${y-a.dy*head+a.dx*head*.5} ${x},${y} ${x-a.dx*head+a.dy*head*.5},${y-a.dy*head-a.dx*head*.5}`};});
 return {mass,spring:spring.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' '),arrows,radius:mass.x-210};
}
