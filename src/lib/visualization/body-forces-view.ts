import {rotate, type BodyState} from '../physics/mechanics/body-forces.ts';
export const bodyOutline = '-110,-20 -70,-70 5,-60 45,-90 110,-35 85,20 110,65 25,80 -20,45 -90,65 -120,25';
const vertices=bodyOutline.split(' ').map(pair=>pair.split(',').map(Number));
export type BodyView = {x:number;y:number;zoom:number};
export function bodyViewBounds(body: BodyState) {
  const points=vertices.map(([x,y])=>{
    const r=rotate({x,y:-y},body.angle);
    return {x:330+body.x*85+r.x,y:230-body.y*85-r.y};
  });
  return {left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
}
/** Only crossings count, so an already cropped figure can still move back into view. */
export function crossesBodyViewEdge(before: BodyState, after: BodyState, view: BodyView): boolean {
  const a=bodyViewBounds(before),b=bodyViewBounds(after);
  const right=view.x+660/view.zoom,bottom=view.y+460/view.zoom;
  return (a.left>=view.x&&b.left<view.x)||(a.right<=right&&b.right>right)||
    (a.top>=view.y&&b.top<view.y)||(a.bottom<=bottom&&b.bottom>bottom);
}
