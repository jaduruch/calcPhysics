import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localeFromPath, basePath, languagePath } from '../src/lib/i18n/locale.ts';
import { pageMetadata, pageStructuredData } from '../src/lib/seo.ts';

test('language URLs preserve the current topic and distinguish the German prefix', () => {
 assert.equal(localeFromPath('/de/mechanics'), 'de');
 assert.equal(localeFromPath('/density'), 'en');
 assert.equal(basePath('/de/mechanics/kinematics?x=1#main'), '/mechanics/kinematics');
 assert.equal(languagePath('/mechanics/kinematics', 'de'), '/de/mechanics/kinematics');
 assert.equal(languagePath('/de/mechanics/kinematics', 'en'), '/mechanics/kinematics');
 assert.equal(languagePath('/', 'de'), '/de');
 assert.equal(languagePath('/de', 'en'), '/');
});
test('German pages have their own canonical and German structured breadcrumbs', () => {
 const meta = pageMetadata('/de/mechanics/dynamics');
 assert.equal(meta.canonical, 'https://calcphysics.com/de/mechanics/dynamics');
 assert.match(meta.title, /Dynamik/);
 const graph = pageStructuredData('/de/mechanics/dynamics')['@graph'];
 assert.equal(graph.find(item => item['@type'] === 'WebPage').inLanguage, 'de');
 assert.deepEqual(graph.find(item => item['@type'] === 'BreadcrumbList').itemListElement.map(item => item.name), ['Startseite', 'Mechanik', 'Dynamik']);
 assert.equal(pageMetadata('/de/unknown'), null);
 assert.match(pageMetadata('/de').title, /Physik/);
});
