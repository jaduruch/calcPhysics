<script lang="ts">
 import {formulaBookRule} from '#lib/calculators/formula-book-equations.ts';
 import {combinedDefinition} from '#lib/content/combined-models.ts';
 import {solveCombined,combinedDomains} from '#lib/physics/resources/combined.ts';
 import {inResourceDomain,type Values} from '#lib/physics/resources/solver.ts';
 import {parseQuantityInUnit,quantityLatex} from '#lib/calculators/quantities.ts';
 import {resourceFormula,resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {defaultInputUnit,unitGroups,getUnit,fromSI} from '#lib/physics/units.ts';
 import {text,calculatorUi,resourceUi} from '#lib/i18n/runtime.ts';
 import PulleyDiagram from './PulleyDiagram.svelte';
 import CalculatorShell from './CalculatorShell.svelte';import CalculatorTools from './CalculatorTools.svelte';import QuantityField from './QuantityField.svelte';import EquationBlock from './EquationBlock.svelte';
 let {modelId}:{modelId:string}=$props();
 const definition=$derived(combinedDefinition(modelId)!);
 const domains=$derived(combinedDomains(definition.relations));
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({});
 const unit=(key:string)=>units[key]??defaultInputUnit(definition.fields.find(f=>f.id===key)!.kind);
 const parsed=$derived(Object.fromEntries(definition.fields.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind,unit(f.id))])));
 const invalid=$derived(definition.fields.filter(f=>{const p=parsed[f.id];return p.status==='invalid'||p.status==='valid'&&domains[f.id].some(d=>!inResourceDomain(p.value,d));}).map(f=>f.id));
 const results=$derived.by(()=>{const input:Values={};for(const f of definition.fields){const p=parsed[f.id];if(p.status==='valid')input[f.id]=p.value;}return solveCombined(definition.relations,input,invalid,definition.zeros);});
 const result=$derived(results[0]);
 const equations=$derived(results.map(solution=>solution.steps.map(s=>{const f=definition.fields.find(f=>f.id===s.target)!;const formula=s.source?formulaBookRule(s.source,s.sourceTarget!,s.formula,s.local!):s.formula;return {label:f.name,expression:`${f.symbol}=${resourceFormula(formula,definition.fields)}=${resourceFormula(formula,definition.fields,s.values)}\\approx ${resourceQuantity(solution.values[f.id],f.kind,unit(f.id))}`};})));
 const conversions=$derived(definition.fields.flatMap(f=>{const p=parsed[f.id],u=unit(f.id);if(p.status!=='valid'||invalid.includes(f.id)||result.values[f.id]===undefined||u===unitGroups[f.kind].si)return [];const entry=getUnit(f.kind,u),factor='factorLatex' in entry?entry.factorLatex:String(entry.factor);const original=quantityLatex(fromSI(p.value,f.kind,u),u,false);return ['offset' in entry?`${f.symbol}=(${quantityLatex(fromSI(p.value,f.kind,u),'',false)}+${entry.offset})\\cdot ${factor}\\,\\mathrm{K}\\approx ${resourceQuantity(p.value,f.kind)}`:`${f.symbol}=${original}\\cdot\\frac{${factor}\\,\\mathrm{${unitGroups[f.kind].si}}}{1\\,\\mathrm{${u}}}\\approx ${resourceQuantity(p.value,f.kind)}`];}));
</script>
<CalculatorShell>
 <div class="input-grid">{#each definition.fields as f}
 <QuantityField id={`${modelId}-${f.id}`} name={f.name} symbol={f.symbol} kind={f.kind} raw={raw[f.id]??''} unit={unit(f.id)} invalid={invalid.includes(f.id)||result.conflicts.includes(f.id)||result.impossible.includes(f.id)||result.numerical.includes(f.id)} describedby={`${modelId}-status`} onvalue={v=>{raw[f.id]=v;}} onunit={v=>{units[f.id]=v;}}/>
 {/each}</div>
 <CalculatorTools onreset={()=>{raw={};units={};}}/>
 <div id={`${modelId}-status`} aria-live="polite">
 {#if invalid.length}<p class="status error">{resourceUi.invalid}</p>{/if}
 {#if result.conflicts.length}<p class="status error">{resourceUi.conflict}</p>{/if}
 {#if result.impossible.length}<p class="status error">{resourceUi['no-solution']}</p>{/if}
 {#if result.numerical.length}<p class="status error">{resourceUi.numerical}</p>{/if}
 {#if result.singular.length}<p class="status">{resourceUi.underdetermined}</p>{/if}
 {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
 {#each equations as group,index}{#if equations.length>1}<p class="status">{resourceUi.solution} {index+1}</p>{/if}{#each group as equation}<EquationBlock label={equation.label} equations={[equation.expression]}/>{/each}{/each}
 {#if !result.steps.length&&!result.conflicts.length&&!result.impossible.length&&!result.numerical.length}<p class="status">{definition.fields.every(f=>result.values[f.id]!==undefined)?resourceUi.consistent:text('Enter known quantities; each independent relation is evaluated as soon as it is determined.')}</p>{/if}
 </div>
 {#if modelId==='book-pulley-force'}<div class="motion-chart-grid"><PulleyDiagram mode="force" enteredCount={result.values.n} result={result.values.n!==undefined&&result.values.F!==undefined&&result.values.Fg!==undefined?{status:'success',values:result.values,outputs:{},target:null,assumed:[]}:null}/><PulleyDiagram mode="travel" enteredCount={result.values.n} result={result.values.n!==undefined&&result.values.s!==undefined&&result.values.h!==undefined?{status:'success',values:result.values,outputs:{},target:null,assumed:[]}:null}/></div>{/if}
 {#each definition.assumptions as assumption}<p class="assumption">{text(assumption)}</p>{/each}
</CalculatorShell>
