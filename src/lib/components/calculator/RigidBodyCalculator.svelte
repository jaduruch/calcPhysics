<script lang="ts">
 import {rigidFields,rigidAssumptions,fieldsForRigid} from '#lib/content/rigid-body.ts';
 import {solveRigid,rigidDomain,type RigidMode,type Shape,type Values} from '#lib/physics/mechanics/rigid-body.ts';
 import {parseQuantityInUnit,quantityLatex} from '#lib/calculators/quantities.ts';
 import {resourceFormula,resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {defaultInputUnit,unitGroups,getUnit,fromSI} from '#lib/physics/units.ts';
 import {text,calculatorUi,resourceUi} from '#lib/i18n/runtime.ts';
 import CalculatorShell from './CalculatorShell.svelte';import CalculatorTools from './CalculatorTools.svelte';import QuantityField from './QuantityField.svelte';import EquationBlock from './EquationBlock.svelte';import RigidBodyDiagram from './RigidBodyDiagram.svelte';
 let {modelId}:{modelId:string}=$props();
 const mode=$derived(modelId.startsWith('rigid-inertia')?'inertia':modelId.slice(6) as RigidMode);
 const shape=$derived((modelId.startsWith('rigid-inertia-')?modelId.slice(14):'general') as Shape);
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({}),focused=$state<string|null>(null),target=$state<string|null>(null),selected=$state(0);
 const fields=$derived(fieldsForRigid(mode,shape));
 const unit=(key:string)=>units[key]??defaultInputUnit(rigidFields[mode].find(f=>f.id===key)!.kind);
 const parsed=$derived(Object.fromEntries(fields.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind,unit(f.id))])));
 const invalid=$derived(fields.filter(f=>{const p=parsed[f.id];return p.status==='invalid'||p.status==='valid'&&!rigidDomain(f.id,p.value);}).map(f=>f.id));
 const results=$derived.by(()=>{const input:Values={};for(const f of fields){const p=parsed[f.id];if(p.status==='valid')input[f.id]=p.value;}return solveRigid(mode,input,shape,invalid);});
 const result=$derived(results[Math.min(selected,results.length-1)]);
 const equations=$derived(results.map(solution=>solution.steps.map(s=>{const f=fields.find(f=>f.id===s.target)!;return {label:f.name,expression:`${f.symbol}=${resourceFormula(s.formula,fields)}=${resourceFormula(s.formula,fields,s.snapshot)}\\approx ${resourceQuantity(solution.values[f.id],f.kind,unit(f.id))}`};})));
 const conversions=$derived(fields.flatMap(f=>{const p=parsed[f.id],u=unit(f.id);if(p.status!=='valid'||invalid.includes(f.id)||result.values[f.id]===undefined||u===unitGroups[f.kind].si)return [];const entry=getUnit(f.kind,u),factor='factorLatex' in entry?entry.factorLatex:String(entry.factor);return [`${f.symbol}=${quantityLatex(fromSI(p.value,f.kind,u),u,false)}\\cdot\\frac{${factor}\\,\\mathrm{${unitGroups[f.kind].si}}}{1\\,\\mathrm{${u}}}\\approx ${resourceQuantity(p.value,f.kind)}`];}));
 function edit(key:string,value:string){raw[key]=value;selected=0;}
</script>
<CalculatorShell>
 <div class="input-grid">{#each fields as f}<div onfocusin={()=>focused=f.id} onfocusout={event=>{if(!(event.relatedTarget instanceof Node)||!event.currentTarget.contains(event.relatedTarget))focused=null;}}>
 <QuantityField id={`${modelId}-${f.id}`} name={f.name} symbol={f.symbol} kind={f.kind} raw={raw[f.id]??''} unit={unit(f.id)} invalid={invalid.includes(f.id)||result.conflicts.includes(f.id)||result.impossible.includes(f.id)||result.numerical.includes(f.id)} describedby={`${modelId}-status`} onvalue={v=>edit(f.id,v)} onunit={v=>{units[f.id]=v;selected=0;}}/>
 </div>{/each}</div>
 <CalculatorTools onreset={()=>{raw={};units={};target=null;focused=null;selected=0;}}/>
 <div id={`${modelId}-status`} aria-live="polite">
 {#if invalid.length}<p class="status error">{text('Use positive mass, inertia and body dimensions; energies and axis distances must be nonnegative. Angular quantities and velocities may be signed.')}</p>{/if}
 {#if result.conflicts.length}<p class="status error">{resourceUi.conflict}</p>{/if}
 {#if result.impossible.length}<p class="status error">{resourceUi['no-solution']}</p>{/if}
 {#if result.numerical.length}<p class="status error">{resourceUi.numerical}</p>{/if}
 {#if result.singular.length}<p class="status">{resourceUi.underdetermined}</p>{/if}
 {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
 {#each equations as group,index}
 {#if equations.length>1}<p class="status">{resourceUi.solution} {index+1}</p>{/if}
 {#each group as equation}<EquationBlock label={equation.label} equations={[equation.expression]}/>{/each}
 {/each}
 {#if !result.steps.length&&!result.conflicts.length&&!result.impossible.length&&!result.numerical.length}<p class="status">{fields.every(f=>result.values[f.id]!==undefined)?resourceUi.consistent:text('Enter known quantities; each independent relation is evaluated as soon as it is determined.')}</p>{/if}
 </div>
 {#if results.length>1}<div class="calculator-modes" role="group" aria-label={text('Diagram solution')}>{#each results as _,index}<button type="button" aria-pressed={selected===index} onclick={()=>selected=index}>{resourceUi.solution} {index+1}</button>{/each}</div>{/if}
 <div class="calculator-modes" role="group" aria-label={text('Highlight a quantity')}>{#each fields as f}<button type="button" aria-pressed={target===f.id} onclick={()=>target=target===f.id?null:f.id}>{text(f.name)}</button>{/each}</div>
 <RigidBodyDiagram {mode} {shape} values={result.values} active={focused??target}/>
 <p class="assumption">{text(rigidAssumptions[mode])}</p>
</CalculatorShell>
