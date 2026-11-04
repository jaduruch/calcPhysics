import { test } from 'node:test';
import assert from 'node:assert/strict';
import { site, canonicalUrl, publishedPaths, pageMetadata, sitemapXml, robotsTxt, pageStructuredData, structuredDataJson } from '../src/lib/seo.ts';

test('canonicals use the primary HTTPS domain without parameters or trailing slash', () => {
  assert.equal(canonicalUrl('/'), 'https://calcphysics.com/');
  assert.equal(canonicalUrl('/mechanics/kinematics/?v=10#calculate'), 'https://calcphysics.com/mechanics/kinematics');
  assert.throws(() => canonicalUrl('//example.com/path'));
  assert.throws(() => canonicalUrl('https://example.com/path'));
});
test('published pages have unique useful titles and canonical metadata', () => {
  const paths = publishedPaths();
  for (const path of ['/', '/si-units-and-constants', '/mechanics', '/mechanics/kinematics', '/mechanics/dynamics', '/electromagnetism', '/electromagnetism/direct-current', '/electromagnetism/three-phase']) assert.ok(paths.includes(path));
  assert.ok(!paths.includes('/electromagnetism/three-phase-generator'));
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(!paths.includes('/electromagnetism/transformers'));
  assert.ok(paths.includes('/electromagnetism/inductors'));
  assert.equal(pageMetadata('/electromagnetism/transformers'), null);
  const pages = paths.map(pageMetadata);
  assert.equal(new Set(pages.map(page => page.title)).size, pages.length);
  assert.ok(pages.every(page => page.description.length > 40 && page.canonical.startsWith(site.origin)));
  assert.match(pageMetadata('/mechanics/kinematics').title, /Uniform Motion Calculator/);
  assert.equal(pageMetadata('/thermodynamics'), null);
  assert.equal(pageMetadata('/unknown'), null);
});
test('sitemap follows the publication registry automatically and escapes XML', () => {
  const items = [
    { id: 'future', path: '/future', published: false },
    { id: 'live', path: '/new-topic', published: true },
    { id: 'escaped', path: '/a&b', published: true }
  ];
  const xml = sitemapXml(items);
  assert.ok(xml.includes('https://calcphysics.com/new-topic'));
  assert.ok(xml.includes('/a&amp;b'));
  assert.ok(!xml.includes('/future'));
  assert.equal((xml.match(/<url>/g) ?? []).length, 3);
  assert.ok(!xml.includes('lastmod'));
  assert.ok(!xml.includes('priority'));
});
test('robots advertises the canonical sitemap and blocks preview crawling', () => {
  assert.ok(robotsTxt(true).includes('Allow: /'));
  assert.ok(robotsTxt(true).includes('Sitemap: https://calcphysics.com/sitemap.xml'));
  assert.equal(robotsTxt(false), 'User-agent: *\nDisallow: /\n');
});

test('structured data matches published pages and their visible breadcrumbs', () => {
  for (const path of publishedPaths()) {
    const data = JSON.parse(structuredDataJson(path));
    const page = data['@graph'].find(item => item['@type'] === 'WebPage');
    assert.equal(page.url, pageMetadata(path).canonical);
    assert.equal(page.name, pageMetadata(path).title);
  }
  const data = pageStructuredData('/mechanics/dynamics?mass=10');
  const crumbs = data['@graph'].find(item => item['@type'] === 'BreadcrumbList');
  assert.deepEqual(crumbs.itemListElement.map(item => [item.position, item.name, item.item]), [
    [1, 'Home', 'https://calcphysics.com/'],
    [2, 'Mechanics', 'https://calcphysics.com/mechanics'],
    [3, 'Dynamics', 'https://calcphysics.com/mechanics/dynamics']
  ]);
  assert.equal(pageStructuredData('/thermodynamics'), null);
  assert.equal(structuredDataJson('/unknown'), null);
  assert.ok(!pageStructuredData('/')['@graph'].some(item => item['@type'] === 'BreadcrumbList'));
});
