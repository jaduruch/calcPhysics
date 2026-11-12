import test from 'node:test';import assert from 'node:assert/strict';
import {models} from '../src/lib/content/topics.ts';
import {groupDynamicsModels,dynamicsGroups} from '../src/lib/content/dynamics.ts';
test('Dynamics groups related cards without losing inverse definitions',()=>{
 const all=models.filter(model=>model.topicId==='dynamics'),grouped=groupDynamicsModels(all);
 assert.equal(all.length,14);assert.equal(grouped.length,6);assert.equal(grouped[0].id,'inclined-plane');
 for(const group of dynamicsGroups)for(const id of group.members){assert.ok(all.some(model=>model.id===id));assert.ok(grouped.find(model=>model.id===group.id).formulas.length);}
 assert.equal(new Set(grouped.map(model=>model.id)).size,grouped.length);
 assert.deepEqual(grouped.find(model=>model.id==='book-pulley-force').formulas,all.filter(model=>['book-pulley-force','book-pulley-distance'].includes(model.id)).flatMap(model=>model.formulas));
});
