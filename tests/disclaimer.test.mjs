import test from 'node:test';
import assert from 'node:assert/strict';
import {disclaimer} from '../src/lib/content/disclaimer.ts';
import {topics,childrenOf} from '../src/lib/content/topics.ts';
import {germanText} from '../src/lib/i18n/text-de.ts';
import {createSiteSearchIndex,searchSite} from '../src/lib/search/site-search.ts';
import {pageMetadata,publishedPaths} from '../src/lib/seo.ts';
test('disclaimer is localized and discoverable without becoming a physics subject',()=>{assert.ok(topics.find(t=>t.id==='disclaimer')?.published);assert.ok(!childrenOf(null).some(t=>t.id==='disclaimer'));for(const text of [disclaimer.title,disclaimer.description,...disclaimer.sections.flatMap(s=>[s.title,s.text])])assert.ok(germanText[text],text);for(const locale of ['en','de']){const path=locale==='de'?'/de/disclaimer':'/disclaimer';assert.ok(publishedPaths().includes(path));assert.ok(pageMetadata(path));assert.ok(searchSite(createSiteSearchIndex(locale),'Haftungsausschluss').some(hit=>hit.href===path));}});
