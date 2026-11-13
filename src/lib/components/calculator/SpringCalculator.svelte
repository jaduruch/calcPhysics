<script lang="ts">
 import {springOscillatorFields,springOscillatorAssumption,circularSpringFields,circularSpringAssumption} from '#lib/content/spring-models.ts';
 import {solveSpringOscillator,springOscillatorDomains,solveCircularSpring,circularSpringDomains} from '#lib/physics/mechanics/spring-models.ts';
 import {parseQuantityInUnit,quantityLatex,prefixes} from '#lib/calculators/quantities.ts';
 import {resourceFormula,resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {defaultInputUnit,unitGroups,getUnit} from '#lib/physics/units.ts';
 import {inResourceDomain,type Values} from '#lib/physics/resources/solver.ts';
 import {text,calculatorUi,resourceUi} from '#lib/i18n/runtime.ts';
 import CalculatorShell from './CalculatorShell.svelte';
 import QuantityField from './QuantityField.svelte';
 import CalculatorTools from './CalculatorTools.svelte';
 import EquationBlock from './EquationBlock.svelte';
 import SpringDiagram from './SpringDiagram.svelte';
 let {modelId='spring-oscillator'}:{modelId?:string}=$props();
 const circular=$derived(modelId==='circular-spring-oscillator');
 const fields=$derived(circular?circularSpringFields:springOscillatorFields);
 const domains=$derived(circular?circularSpringDomains:springOscillatorDomains);
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({}),focused=$state<string|null>(null);
 const unit=(key:string)=>units[key]??defaultInputUnit(fields.find(f=>f.id===key)!.kind);
 const parsed=$derived(Object.fromEntries(fields.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind,unit(f.id))])));
 const invalid=$derived(fields.filter(f=>{const p=parsed[f.id];return p.status==='invalid'||p.status==='valid'&&!inResourceDomain(p.value,domains[f.id]);}).map(f=>f.id));
 const result=$derived.by(()=>{const input:Values={};for(const f of fields){const p=parsed[f.id];if(p.status==='valid')input[f.id]=p.value;}return circular?solveCircularSpring(input,invalid):{...solveSpringOscillator(input,invalid),assumed:false,noOrbit:false};});
 const equations=$derived(result.steps.map(step=>{const f=fields.find(f=>f.id===step.target)!;return `${f.symbol}=${resourceFormula(step.formula,fields)}=${resourceFormula(step.formula,fields,result.values)}\\approx ${resourceQuantity(result.values[f.id],f.kind,unit(f.id))}`;}));
 const conversions=$derived(fields.flatMap(f=>{const p=parsed[f.id],selected=unit(f.id);if(p.status!=='valid'||invalid.includes(f.id)||selected===unitGroups[f.kind].si)return [];const u=getUnit(f.kind,selected),factor='factorLatex' in u?u.factorLatex:u.factor;return [`${f.symbol}=${quantityLatex(Number(p.number),selected,false)}${p.prefix?`\\cdot ${prefixes.find(i=>i.symbol===p.prefix)!.factor}`:''}\\cdot\\frac{${factor}\\,\\mathrm{${unitGroups[f.kind].si}}}{1\\,\\mathrm{${selected}}}\\approx ${resourceQuantity(p.value,f.kind)}`];}));
</script>
<CalculatorShell>
 <div class="input-grid">{#each fields as field}<div onfocusin={()=>focused=field.id} onfocusout={event=>{if(!(event.relatedTarget instanceof Node)||!event.currentTarget.contains(event.relatedTarget))focused=null;}}>
 <QuantityField id={`${modelId}-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field.id)} invalid={invalid.includes(field.id)||result.conflicts.includes(field.id)} describedby={`${modelId}-status`} onvalue={v=>raw[field.id]=v} onunit={v=>units[field.id]=v}/>
 </div>{/each}</div>
 <CalculatorTools onreset={()=>{raw={};units={};}}/>
 <div id={`${modelId}-status`} aria-live="polite">
 {#if invalid.length}<p class="status error">{circular?text('Use positive quantities and an angle strictly between 0° and 90°.'):text('All quantities must be strictly positive.')}</p>{/if}
 {#if result.conflicts.length}<p class="status error">{resourceUi.conflict}</p>{/if}
 {#if result.numerical&&!result.noOrbit}<p class="status error">{resourceUi.numerical}</p>{/if}
 {#if result.noOrbit}<p class="status error">{text('No horizontal circular orbit is possible with these values. Spring tension must exceed weight and the rotating length must exceed the natural length.')}</p>{/if}
 {#if result.assumed}<p class="assumption">{text('Assumed gravitational acceleration: 9.81 m/s².')}</p>{/if}
 {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
 <EquationBlock label="" {equations}/>
 </div>
 <SpringDiagram values={result.values} {focused} {circular}/>
 <p class="assumption">{text(circular?circularSpringAssumption:springOscillatorAssumption)}</p>
</CalculatorShell>
