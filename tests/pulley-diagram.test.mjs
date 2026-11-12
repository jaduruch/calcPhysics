import test from 'node:test';import assert from 'node:assert/strict';
import {pulleyScene} from '../src/lib/visualization/pulley.ts';
import {solveResourceModel} from '../src/lib/physics/resources/solver.ts';
import {resourcePhysics} from '../src/lib/physics/resources/models.ts';
test('one continuous rope has exactly n vertical load-supporting segments',()=>{
 for(let n=1;n<=8;n++){
  const r=solveResourceModel(resourcePhysics['book-pulley-force'],{n,Fg:400});assert.equal(r.status,'success');
  const scene=pulleyScene(r);assert.equal(scene.count,n);assert.equal(scene.segments.length,n);assert.equal(scene.compact,false);assert.equal(scene.schematic,false);
  assert.equal(scene.moving.length,Math.floor(n/2));
  assert.equal(scene.fixed.length,Math.ceil(n/2));
  assert.equal((scene.rope.match(/M/g)||[]).length,1);assert.ok(!scene.rope.includes('NaN'));
  assert.equal(new Set(scene.segments.map(s=>s.x)).size,n);
  assert.ok(Math.abs(scene.segments.reduce((sum,s)=>sum+s.x,0)/n-scene.loadX)<1e-12,'load is centred under the support resultant');
 }
});
test('travel uses the same reeving geometry; missing/invalid inputs never invent results',()=>{
 const result=solveResourceModel(resourcePhysics['book-pulley-distance'],{n:3,h:2});assert.equal(result.status,'success');
 assert.equal(pulleyScene(result).segments.length,3);assert.equal(result.values.s,6);
 assert.equal(pulleyScene(null).schematic,true);assert.equal(pulleyScene(null,2).segments.length,2);
 assert.equal(pulleyScene(null,-2).count,4);
 assert.equal(pulleyScene({status:'invalid',fields:['n']}).schematic,true);
});
test('large valid integer counts have bounded diagram complexity and retain the exact n',()=>{
 const result=solveResourceModel(resourcePhysics['book-pulley-force'],{n:1000,Fg:1000});assert.equal(result.status,'success');
 const scene=pulleyScene(result);assert.equal(scene.count,1000);assert.equal(scene.compact,true);assert.ok(scene.segments.length<=8);assert.ok(scene.rope.length<1000);
});
