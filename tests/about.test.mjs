import test from 'node:test';
import assert from 'node:assert/strict';
import {about} from '../src/lib/content/about.ts';
import {topics,childrenOf} from '../src/lib/content/topics.ts';
import {germanText} from '../src/lib/i18n/text-de.ts';
import {createSiteSearchIndex,searchSite} from '../src/lib/search/site-search.ts';
import {publishedPaths,pageMetadata} from '../src/lib/seo.ts';
test('about page is bilingual, searchable and separate from physics navigation',()=>{const page=topics.find(t=>t.id==='about');assert.equal(page.kind,'info');assert.ok(!childrenOf(null).some(t=>t.id===page.id));for(const content of [about.title,about.description,about.linkLabel,...about.paragraphs])assert.ok(germanText[content],content);for(const locale of ['en','de']){const path=locale==='de'?'/de/about':'/about';assert.ok(publishedPaths().includes(path));assert.ok(pageMetadata(path));assert.ok(searchSite(createSiteSearchIndex(locale),'About calcPhysics').some(result=>result.href===path));}});
