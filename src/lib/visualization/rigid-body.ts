import type {Shape,Values} from '../physics/mechanics/rigid-body.ts';
/** Projection along the rotation axis. Known lengths share one scale; unknown ones stay schematic. */
export function rigidGeometry(shape:Shape,v:Values,phase:number) {
 const length=shape==='rod'?v.l:shape==='cuboid'?v.a:v.R===undefined?undefined:2*v.R;
 const height=shape==='rod'?undefined:shape==='cuboid'?v.b:length;
 const scale=180/Math.max(length??1,height??length??1,2*(v.d??0),Number.MIN_VALUE);
 const width=length===undefined?180:length*scale;
 const bodyHeight=shape==='rod'?10:height===undefined?120:height*scale;
 const angle=phase*Math.PI/180;
 return {width,height:bodyHeight,radius:width/2,innerRadius:v.r!==undefined?v.r*scale:undefined,offset:v.d!==undefined?v.d*scale:undefined,marker:{x:Math.cos(angle)*width*.38,y:Math.sin(angle)*bodyHeight*.38},energyRatio:v.Er!==undefined&&v.Et!==undefined&&v.Er+v.Et>0?v.Er/(v.Er+v.Et):undefined};
}
