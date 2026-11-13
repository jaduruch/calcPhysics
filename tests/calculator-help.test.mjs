import test from 'node:test';
import assert from 'node:assert/strict';
import {topics,childrenOf} from '../src/lib/content/topics.ts';
import {calculatorHelp} from '../src/lib/content/calculator-help.ts';
import {germanText} from '../src/lib/i18n/text-de.ts';
import {createSiteSearchIndex,searchSite} from '../src/lib/search/site-search.ts';
import {publishedPaths,pageMetadata} from '../src/lib/seo.ts';
test('short bilingual input guide is published and searchable without becoming a physics subject',()=>{const help=topics.find(t=>t.id==='calculator-help');assert.ok(help?.published);assert.equal(help.kind,'guide');assert.ok(!childrenOf(null).some(t=>t.id===help.id));assert.equal(calculatorHelp.steps.length,5);for(const text of [calculatorHelp.title,calculatorHelp.description,...calculatorHelp.steps])assert.ok(germanText[text],text);for(const locale of ['en','de']){const path=locale==='de'?'/de/calculator-help':'/calculator-help';assert.ok(publishedPaths().includes(path));assert.ok(pageMetadata(path));const hits=searchSite(createSiteSearchIndex(locale),'Eingabehilfe');assert.ok(hits.some(h=>h.href===path));}});
