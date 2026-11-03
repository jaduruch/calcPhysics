import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveInclinedPlane } from '../src/lib/physics/mechanics/inclined-plane.ts';
import { inclinedPlaneSketch } from '../src/lib/visualization/inclined-plane.ts';
const near = (a, b, tolerance=1e-11) => assert.ok(Math.abs(a-b)<=tolerance, `${a} != ${b}`);
const arrow = (sketch, id) => sketch.arrows.find(item=>item.id===id);
const vector = (sketch,id) => {const a=arrow(sketch,id);return {x:a.tip.x-sketch.centre.x,y:a.tip.y-sketch.centre.y};};

test('plane, block contact and force directions use the exact entered angle', () => {
  for(const angle of [0,Math.PI/6,Math.PI/4,Math.PI/2]) {
    const s=inclinedPlaneSketch(null,angle,.2);
    near(Math.atan2(s.base.y-s.end.y,s.end.x-s.base.x),angle);
    const n=vector(s,'normal'),p=vector(s,'parallel'),f=vector(s,'friction');
    near(n.x*p.x+n.y*p.y,0);
    near(f.x*p.y-f.y*p.x,0);
    assert.ok(f.x*p.x+f.y*p.y<=0);
    assert.equal(s.angleKnown,true);assert.equal(s.schematic,true);
    assert.ok(s.arrows.every(a=>a.head.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))));
  }
});
test('all physical arrow lengths have one common proportional scale', () => {
  const result=solveInclinedPlane({mass:10,angle:Math.PI/6,friction:.2});
  const s=inclinedPlaneSketch(result);
  const unitScale=arrow(s,'weight').length/result.weight;
  for(const a of s.arrows) {
    near(a.length,a.magnitude*unitScale);
    near(Math.hypot(a.tip.x-s.centre.x,a.tip.y-s.centre.y),a.length);
    assert.deepEqual(a.head[0],a.tip);
  }
  near(arrow(s,'normal').length/arrow(s,'weight').length,Math.sqrt(3)/2);
  near(arrow(s,'parallel').length/arrow(s,'weight').length,.5);
  near(arrow(s,'friction').length/arrow(s,'normal').length,.2);
  const g=vector(s,'weight'),n=vector(s,'normal'),p=vector(s,'parallel');
  near(g.x+n.x,p.x);near(g.y+n.y,p.y);
});
test('preview ratios also remain correct without mass, including zero/tiny forces', () => {
  const s=inclinedPlaneSketch(null,Math.PI/4,.3);
  near(arrow(s,'normal').length,arrow(s,'parallel').length);
  near(arrow(s,'friction').length/arrow(s,'normal').length,.3);
  const noFriction=inclinedPlaneSketch(null,Math.PI/6,0);
  assert.equal(arrow(noFriction,'friction').length,0);
  const vertical=inclinedPlaneSketch(null,Math.PI/2,100);
  assert.equal(arrow(vertical,'normal').length,0);assert.equal(arrow(vertical,'friction').length,0);
  const tiny=inclinedPlaneSketch(null,1e-6,0);
  assert.ok(arrow(tiny,'parallel').length>0&&arrow(tiny,'parallel').length<.5);
  assert.ok(Math.hypot(arrow(tiny,'parallel').head[1].x-arrow(tiny,'parallel').head[0].x,arrow(tiny,'parallel').head[1].y-arrow(tiny,'parallel').head[0].y)<arrow(tiny,'parallel').length);
});
test('invalid preview entries use a safe schematic without retaining obsolete results', () => {
  const s=inclinedPlaneSketch(null,NaN,-1);
  assert.equal(s.angleKnown,false);assert.equal(s.angle,Math.PI/6);assert.equal(s.schematic,true);
  assert.equal(arrow(s,'friction').length,0);
  const unknown=inclinedPlaneSketch(null);
  assert.equal(unknown.angleKnown,false);
});
