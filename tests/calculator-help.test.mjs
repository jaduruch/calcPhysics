import test from 'node:test';
import assert from 'node:assert/strict';
import {topics,childrenOf} from '../src/lib/content/topics.ts';
import {calculatorHelp} from '../src/lib/content/calculator-help.ts';
import {germanText} from '../src/lib/i18n/text-de.ts';
import {createSiteSearchIndex,searchSite} from '../src/lib/search/site-search.ts';
import {publishedPaths,pageMetadata} from '../src/lib/seo.ts';
test('short bilingual input guide is published and searchable without becoming a physics subject',()=>{const help=topics.find(t=>t.id==='calculator-help');assert.ok(help?.published);assert.equal(help.kind,'guide');assert.ok(!childrenOf(null).some(t=>t.id===help.id));assert.equal(calculatorHelp.steps.length,5);for(const text of [calculatorHelp.title,calculatorHelp.description,...calculatorHelp.steps])assert.ok(germanText[text],text);for(const locale of ['en','de']){const path=locale==='de'?'/de/calculator-help':'/calculator-help';assert.ok(publishedPaths().includes(path));assert.ok(pageMetadata(path));const hits=searchSite(createSiteSearchIndex(locale),'Eingabehilfe');assert.ok(hits.some(h=>h.href===path));}});

import {helpMotion} from '../src/lib/calculators/help-examples.ts';
import {parseQuantityInUnit} from '../src/lib/calculators/quantities.ts';
import katex from 'katex';
test('guide motion demo uses all three inverses without filling raw fields',()=>{for(const [raw,target,value] of [[{s:'120',t:'10'},'v',12],[{v:'12',t:'10'},'s',120],[{s:'120',v:'12'},'t',10]]){const snapshot={...raw},r=helpMotion(raw,{});assert.equal(r.result.status,'success');assert.equal(r.result.field,target);assert.equal(r.result.value,value);assert.deepEqual(raw,snapshot);assert.equal(raw[target],undefined);katex.renderToString(r.equation,{throwOnError:true});}});
test('guide demos preserve real input semantics and report invalid or singular values',()=>{assert.equal(helpMotion({s:'120',t:'0'},{}).result.status,'no-solution');assert.equal(helpMotion({s:'0',t:'0'},{}).result.status,'underdetermined');assert.equal(helpMotion({s:'120',t:'-1'},{}).invalid.includes('t'),true);assert.equal(helpMotion({s:'120',t:'10',v:'12'},{}).result.code,'too-many');assert.equal(helpMotion({s:'(100+20)',t:'2*5'},{}).result.value,12);assert.equal(helpMotion({s:'120',t:'1/0'},{}).result,null);const r=helpMotion({s:'120',t:'10'},{v:'km/h'});assert.ok(r.equation.includes('43.2'));assert.equal(parseQuantityInUnit('1k + 1m','length','m').value,1000.001);assert.equal(parseQuantityInUnit('90','angle','°').value,Math.PI/2);});
