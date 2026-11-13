import test from 'node:test';
import assert from 'node:assert/strict';
import { createSiteSearchIndex, normalizeSearch, searchSite } from '../src/lib/search/site-search.ts';
import { models, topics } from '../src/lib/content/topics.ts';
import { groupTopicModels, linkedModelIndex } from '../src/lib/content/model-groups.ts';
const en = createSiteSearchIndex('en');
const de = createSiteSearchIndex('de');

test('every published topic and original model is indexed once, including grouped variants', () => {
  for (const index of [en, de]) {
    assert.equal(new Set(index.map(entry => entry.id)).size, index.length);
    for (const topic of topics.filter(topic => topic.published)) assert.ok(index.some(entry => entry.id === `topic:${topic.id}`));
    for (const model of models.filter(model => topics.some(topic => topic.id === model.topicId && topic.published))) {
      const entry = index.find(entry => entry.id === `model:${model.id}`);
      assert.ok(entry, model.id);
      const card = groupTopicModels(models.filter(item => item.topicId === model.topicId)).find(card => linkedModelIndex(card, entry.href.slice(entry.href.indexOf('#'))) !== null);
      assert.ok(card, `link must resolve to a card: ${model.id}`);
      const position = linkedModelIndex(card, entry.href.slice(entry.href.indexOf('#')));
      if(card.integratedModels)assert.ok(card.integratedModels.some(source=>source.id===model.id));
      else assert.equal((card.variants?.[position]?.model ?? card).id, model.id);
    }
  }
});

test('titles, full paths and spacing-independent queries find the precise calculator first', () => {
  for (const query of ['Uniform Motion', 'uniformmotion', 'MECHANICS / KINEMATICS / Uniformmotion']) {
    assert.equal(searchSite(en, query)[0]?.id, 'model:uniform-motion');
  }
  assert.deepEqual(searchSite(en, 'uniformmotion')[0].path, ['Mechanics', 'Kinematics', 'Uniform Motion']);
});

test('German and English terms work in either language and preserve localized destinations', () => {
  for (const index of [en, de]) assert.equal(searchSite(index, 'gleichförmige bewegung')[0]?.id, 'model:uniform-motion');
  const entry = searchSite(de, 'uniformmotion')[0];
  assert.deepEqual(entry.path, ['Mechanik', 'Kinematik', 'Gleichförmige Bewegung']);
  assert.equal(entry.href, '/de/mechanics/kinematics#model-uniform-motion');
  assert.equal(normalizeSearch('WÄRME — Größen'), 'warme grossen');
});

test('formula expressions, specialist relations and constants are searchable', () => {
  assert.equal(searchSite(en, 'pV = nRT')[0]?.id, 'model:ideal-gas');
  assert.equal(searchSite(en, 'Reynolds')[0]?.id, 'model:book-reynolds');
  assert.ok(searchSite(en, 'Planck').some(entry => entry.href.endsWith('#constants')));
  assert.ok(searchSite(de, 'Lichtgeschwindigkeit').some(entry => entry.href === '/de/si-units-and-constants#constants'));
  assert.ok(searchSite(en, 'steradian').some(entry => entry.href.endsWith('#derived-units')));
});

test('empty, punctuation-only and unmatched queries do not expose unrelated results', () => {
  for (const query of ['', '  ', '/', '<>!', 'zzzznonexistentphysics']) assert.deepEqual(searchSite(en, query), []);
  assert.deepEqual(searchSite(en, 'Reynolds zzzznonexistentphysics'), []);
});

test('model links tolerate unknown and malformed hashes', () => {
  const model = models.find(model => model.id === 'uniform-motion');
  assert.equal(linkedModelIndex(model, '#model-uniform-motion'), 0);
  for (const hash of ['', '#model-missing', '#%broken']) assert.equal(linkedModelIndex(model, hash), null);
});

test('former vertical, horizontal and oblique searches resolve to one renamed projectile calculator',()=>{
 for(const query of ['Vertical Throw','Horizontal Throw','Oblique Throw','Senkrechter Wurf','Waagerechter Wurf','Schiefer Wurf']){
  const answers=searchSite(en,query).filter(entry=>entry.href.endsWith('#model-oblique-throw'));
  assert.equal(answers.length,1,query);assert.equal(answers[0].path.at(-1),'Projectile Motion');
 }
 const german=searchSite(de,'Wurfbewegung');assert.ok(german.some(entry=>entry.path.at(-1)==='Wurfbewegung'));
});
