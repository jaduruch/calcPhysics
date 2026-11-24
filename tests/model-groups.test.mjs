import test from 'node:test';
import assert from 'node:assert/strict';
import { models } from '../src/lib/content/topics.ts';
import { groupTopicModels, modelGroups } from '../src/lib/content/model-groups.ts';
import { germanText } from '../src/lib/i18n/text-de.ts';

test('every calculator, theory and inverse remains available exactly once within its topic', () => {
  const used = new Set();
  for (const group of modelGroups) {
    assert.ok(group.members.length > 1);
    assert.ok(germanText[group.title]);
    for (const id of group.members) {
      assert.ok(!used.has(id), `duplicate group member: ${id}`);
      used.add(id);
      const model = models.find(model => model.id === id);
      assert.equal(model?.topicId, group.topic, id);
      assert.ok(germanText[model.title] ?? germanText[model.title.toLowerCase()], model.title);
    }
  }
  for (const topic of new Set(models.map(model => model.topicId))) {
    const originals = models.filter(model => model.topicId === topic);
    const cards = groupTopicModels(originals);
    const recovered = cards.flatMap(card => card.integratedModels ?? card.variants?.map(variant => variant.model) ?? [card]);
    assert.deepEqual(recovered.map(model => model.id).sort(), originals.map(model => model.id).sort());
    assert.equal(new Set(cards.map(card => card.id)).size, cards.length);
    for (const model of recovered) assert.strictEqual(model, originals.find(original => original.id === model.id));
  }
});

test('dense topics use coherent cards and existing combined networks remain intact', () => {
  const counts = { kinematics: 5, dynamics: 5, rotation: 17, 'work-energy': 9, 'fluid-statics': 10, 'fluid-flow': 8, 'thermal-expansion': 4, 'optical-imaging': 5, photometry: 6, filters: 2 };
  for (const [topic, count] of Object.entries(counts)) assert.equal(groupTopicModels(models.filter(model => model.topicId === topic)).length, count, topic);
  const direct = models.filter(model => model.topicId === 'direct-current');
  assert.deepEqual(groupTopicModels(direct), direct);
  assert.strictEqual(groupTopicModels(models.filter(model => model.topicId === 'kinematics')).find(model => model.id === 'uniform-motion'), models.find(model => model.id === 'uniform-motion'));
  assert.deepEqual(groupTopicModels([]), []);
});

test('momentum shows four independent accordion cards in the requested order',()=>{const cards=groupTopicModels(models.filter(m=>m.topicId==='momentum'));assert.deepEqual(cards.map(m=>m.id),['momentum-balance','inelastic-collision','elastic-collision','rocket-equation']);assert.ok(cards.every(m=>!m.variants));});

test('Dynamics keeps the requested five-card order', () => {
  assert.deepEqual(groupTopicModels(models.filter(model => model.topicId === 'dynamics')).map(model => model.id),
    ['inclined-plane', 'book-force', 'book-gravitation', 'body-forces', 'book-pulley-force']);
});
