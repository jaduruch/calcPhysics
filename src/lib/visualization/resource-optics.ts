import type { Values } from '../physics/resources/solver.ts';
export interface OpticalLine { x1:number; y1:number; x2:number; y2:number; kind:'ray'|'extension'|'normal'|'dimension'; }
export interface OpticalLabel { x:number; y:number; text:string; }
export interface OpticalScene { lines:OpticalLine[]; labels:OpticalLabel[]; surface:string; }
/** Geometry only: angles and signs come from the validated resource solver. Lengths are normalised to fit. */
export function resourceOpticsScene(id:string,v:Values,o:Values):OpticalScene {
 const lines:OpticalLine[]=[],labels:OpticalLabel[]=[];
 const line=(x1:number,y1:number,x2:number,y2:number,kind:OpticalLine['kind']='ray')=>lines.push({x1,y1,x2,y2,kind});
 const label=(x:number,y:number,text:string)=>labels.push({x,y,text});
 let surface='';
 if(id==='lens-power'||id==='mirror-focus') {
  const mirror=id==='mirror-focus',positive=v.f>0,vertex=320,f=positive?(mirror?180:460):(mirror?460:180);
  line(32,180,608,180,'normal');
  surface=mirror?(positive?'M310 65 Q330 180 310 295':'M330 65 Q310 180 330 295'):(positive?'M320 65 Q350 180 320 295 Q290 180 320 65':'M300 65 Q325 180 300 295 L340 295 Q315 180 340 65 Z');
  for(const y of [145,180,215]) {line(45,y,vertex,y); const end=mirror?50:595; const endY=y+(180-y)*(end-vertex)/(f-vertex);line(vertex,y,end,endY);if(!positive)line(vertex,y,f,180,'extension');}
  label(f,205,'F');label(320,320,mirror?'S':'O');
  line(320,260,f,260,'dimension');label((320+f)/2,282,'|f|');
  if(mirror){const c=320+2*(f-320);label(c,205,'C');line(320,300,c,300,'dimension');label((320+c)/2,322,'|r|');}
 } else if(id==='parallel-plate') {
  // Scale both axes equally, keeping even near-grazing rays inside the viewport.
  const dx=Math.tan(o.r),span=Math.max(2,Math.abs(dx)+1),scale=Math.min(100,280/span),h=scale,x=240,y=130,ex=x+h*dx,ey=y+h;
  surface=`M24 ${y} H616 V${ey} H24 Z`;
  line(x-95*Math.sin(v.i),y-95*Math.cos(v.i),x,y);line(x,y,ex,ey);line(ex,ey,ex+95*Math.sin(v.i),ey+95*Math.cos(v.i));
  line(x,y,x+190*Math.sin(v.i),y+190*Math.cos(v.i),'extension');
  line(x,y-65,x,y+65,'normal');line(ex,ey-55,ex,ey+65,'normal');
  line(570,y,570,ey,'dimension');label(589,(y+ey)/2,'d');label(x+20,y-25,'θ₁');label(x+20,y+35,'θ₂');
  // Shortest distance from emergence point to the incident continuation.
  const t=(ex-x)*Math.sin(v.i)+(ey-y)*Math.cos(v.i);
  const px=x+t*Math.sin(v.i),py=y+t*Math.cos(v.i);
  line(ex,ey,px,py,'dimension');label((ex+px)/2+15,(ey+py)/2+18,'s');label(55,(y+ey)/2,'n');
 } else if(id==='prism-deviation') {
  // Face normals enclose A. Internal direction is -A/2+r₁ relative to horizontal.
  const a=v.A/2,top={x:320,y:55},height=220,half=height*Math.tan(a),p={x:320-half*.52,y:55+height*.52};
  const dir=-a+o.r1,dx=Math.cos(dir),dy=Math.sin(dir),t=(Math.tan(a)*(p.y-top.y)-(p.x-top.x))/(dx-Math.tan(a)*dy),q={x:p.x+t*dx,y:p.y+t*dy};
  // Very flat or narrow prisms are fitted with a single uniform scale.
  const scale=Math.min(1,240/Math.max(half,1),210/Math.max(q.y-top.y,220));
  const X=(x:number)=>320+(x-320)*scale,Y=(y:number)=>55+(y-55)*scale;
  surface=`M320 55 L${X(320-half)} ${Y(275)} L${X(320+half)} ${Y(275)} Z`;
  const ray=(x:number,y:number,angle:number,length:number,back=false,kind:OpticalLine['kind']='ray')=>line(X(x),Y(y),X(x)+length*Math.cos(angle)*(back?-1:1),Y(y)+length*Math.sin(angle)*(back?-1:1),kind);
  ray(p.x,p.y,-a+v.i,100,true);line(X(p.x),Y(p.y),X(q.x),Y(q.y));
  ray(p.x,p.y,-a,48,false,'normal');ray(p.x,p.y,-a,48,true,'normal');ray(q.x,q.y,a,48,false,'normal');ray(q.x,q.y,a,48,true,'normal');
  if(o.e!==undefined)ray(q.x,q.y,a-o.e,110);else ray(q.x,q.y,Math.PI+2*a-dir,90);
  label(320,85,'A');label(X(p.x)-25,Y(p.y)-22,'i');label(X(p.x)+32,Y(p.y)+18,'r₁');label(X(q.x)-30,Y(q.y)+26,'r₂');if(o.e!==undefined)label(X(q.x)+45,Y(q.y)-10,'e');
 } else {
  surface='M320 55 H610 V300 H320 Z';
  line(55,170,300,170);line(340,170,340+245/Math.max(1,v.n),170);label(165,145,'c₀');label(460,145,'v');label(460,265,'n');
 }
 return {lines,labels,surface};
}
