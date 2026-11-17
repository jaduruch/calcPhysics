import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import * as compiler from 'svelte/compiler';
import * as en from '../src/lib/i18n/en.ts';
import * as de from '../src/lib/i18n/de.ts';
import {germanTranslation,translateText} from '../src/lib/i18n/translate.ts';
import {unitNames} from '../src/lib/physics/units.ts';
import {resistorNetworkDefinition,capacitorNetworkDefinition,inductorNetworkDefinition,transformerDefinition,rlAcDefinition} from '../src/lib/content/electricity.ts';
const root=fileURLToPath(new URL('../src/',import.meta.url));
const displayKeys=new Set(['title','description','name','label','text','unitName','assumption','linkLabel','navigationTitle','caption','heading','ariaLabel','message','quantity','note']);
const displayArrays=new Set(['notes','paragraphs','steps','searchTerms']);
const requireGerman=(value,location)=>assert.ok(germanTranslation(value)!==undefined,`Missing German translation: ${location}: ${value}`);
function contentStrings(value,location,key=''){
 if(typeof value==='string'){if(value.trim()&&(displayKeys.has(key)||displayArrays.has(key)))requireGerman(value,location);return;}
 if(Array.isArray(value)){value.forEach((x,i)=>contentStrings(x,`${location}[${i}]`,key));return;}
 if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))contentStrings(v,`${location}.${k}`,k);
}
function files(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(path.join(directory,f.name)):[path.join(directory,f.name)]);}
test('all German UI dictionaries cover the full English key set',()=>{
 for(const[name,dictionary]of Object.entries(en)){if(!dictionary||typeof dictionary!=='object')continue;for(const[key,value]of Object.entries(dictionary))if(typeof value==='string')assert.ok(typeof de[name]?.[key]==='string'&&de[name][key].trim(),`${name}.${key}`);}
});
test('every editorial content export has German display text, including SI tables and assumptions',async()=>{
 const directory=path.join(root,'lib/content');for(const file of fs.readdirSync(directory).filter(f=>f.endsWith('.ts'))){const module=await import(pathToFileURL(path.join(directory,file)).href);for(const[key,value]of Object.entries(module))if(typeof value!=='function')contentStrings(value,`${file}:${key}`);}
 for(const[k,v]of Object.entries(unitNames))requireGerman(v,`unitNames.${k}`);
 for(const real of [false,true])contentStrings(transformerDefinition(real),`transformer:${real}`);
 for(const id of ['rl-series-ac','rl-parallel-ac'])contentStrings(rlAcDefinition(id),id);
});
test('numbered network fields stay translated when more components are added',()=>{
 for(const make of [resistorNetworkDefinition,capacitorNetworkDefinition,inductorNetworkDefinition]){const id=make===resistorNetworkDefinition?'resistance-series':make===capacitorNetworkDefinition?'capacitance-series':'inductance-series';for(const field of make(id,12).inputs)requireGerman(field.name,id);}
 assert.equal(translateText('resistance 12','de'),'Widerstand 12');assert.equal(translateText('capacitance 3','de'),'Kapazität 3');assert.equal(translateText('inductance 4','de'),'Induktivität 4');
 assert.equal(translateText('resistance 12','en'),'resistance 12');assert.equal(germanTranslation('unknown arbitrary prose'),undefined);
});
test('Svelte text calls and accessible literal labels have translations; visible prose is never hardcoded',()=>{
 const literalText=new Set(['calc','Physics','calcPhysics','— calcPhysics','GitHub','Instagram','@calcphysics','calcphysics@outlook.com','English','Deutsch']);
 const accessibleNames=new Set(['Instagram: @calcphysics']);
 for(const file of files(root).filter(f=>f.endsWith('.svelte'))){const source=fs.readFileSync(file,'utf8'),ast=compiler.parse(source,{modern:true});
  function stringArgument(n){if(n?.type==='Literal'&&typeof n.value==='string')requireGerman(n.value,file);else if(n?.type==='ConditionalExpression'){stringArgument(n.consequent);stringArgument(n.alternate);}else if(n?.type==='TemplateLiteral'&&!n.expressions.length)requireGerman(n.quasis[0].value.cooked,file);}
  function visit(n,inAttribute=false){if(!n||typeof n!=='object')return;
   if(n.type==='Attribute'||n.type?.endsWith('Directive'))inAttribute=true;
   if(n.type==='CallExpression'&&['text','translate'].includes(n.callee?.name))n.arguments.forEach(stringArgument);
   if(n.type==='Text'&&!inAttribute){const value=n.data.trim();if(/[A-Za-z]{3}/.test(value))assert.ok(literalText.has(value),`${file}: hardcoded visible text: ${value}`);}
   if(n.type==='Attribute'&&['aria-label','title','placeholder'].includes(n.name)&&Array.isArray(n.value))for(const value of n.value)if(value.type==='Text'&&/[A-Za-z]{3}/.test(value.data))assert.ok(accessibleNames.has(value.data),`${file}: hardcoded ${n.name}: ${value.data}`);
   for(const[k,v]of Object.entries(n))if(k!=='parent'){if(Array.isArray(v))v.forEach(x=>visit(x,inAttribute));else if(v&&typeof v==='object')visit(v,inAttribute);}
  }visit(ast);
 }
});
