<script lang="ts">
 import {ellipseFields,ellipseAssumption,ellipseDomainNotice} from '#lib/content/kepler-ellipse.ts';
 import {solveKeplerEllipse,ellipseDomains} from '#lib/physics/mechanics/kepler-ellipse.ts';
 import {ellipseEquations,ellipseConversions} from '#lib/calculators/kepler-ellipse.ts';
 import {defaultInputUnit} from '#lib/physics/units.ts';
 import {parseQuantityInUnit} from '#lib/calculators/quantities.ts';
 import {inResourceDomain,type Values,type ResourceResult} from '#lib/physics/resources/solver.ts';
 import {text,resourceUi,calculatorUi} from '#lib/i18n/runtime.ts';
 import CalculatorShell from './CalculatorShell.svelte';
 import CalculatorTools from './CalculatorTools.svelte';
 import QuantityField from './QuantityField.svelte';
 import EquationBlock from './EquationBlock.svelte';
 import ModelVariantSwitch from '../ui/ModelVariantSwitch.svelte';
 import KeplerDiagram from './KeplerDiagram.svelte';
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({}),focused=$state<string|null>(null),selected=$state(0);
 const unit=(id:string)=>units[id]??defaultInputUnit(ellipseFields.find(f=>f.id===id)!.kind);
 const parsed=$derived(Object.fromEntries(ellipseFields.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind,unit(f.id))])));
 const invalid=$derived(ellipseFields.filter(f=>{const p=parsed[f.id];return p.status==='invalid'||p.status==='valid'&&!inResourceDomain(p.value,ellipseDomains[f.id]);}).map(f=>f.id));
 const result=$derived.by(()=>{const input:Values={};for(const f of ellipseFields){const p=parsed[f.id];if(p.status==='valid')input[f.id]=p.value;}return solveKeplerEllipse(input,invalid);});
 const branch=$derived(result.branches[Math.min(selected,result.branches.length-1)]);
 const equations=$derived(result.branches.map(b=>ellipseEquations(b,Object.fromEntries(ellipseFields.map(f=>[f.id,unit(f.id)])))));
 const conversions=$derived(ellipseConversions(parsed,Object.fromEntries(ellipseFields.map(f=>[f.id,unit(f.id)]))));
 const diagramResult=$derived(branch?.values.a!==undefined&&branch.values.e!==undefined?{status:'success',values:branch.values,outputs:{},target:null,assumed:[]} as ResourceResult:null);
</script>
<CalculatorShell>
 <div class="input-grid">{#each ellipseFields as field}<div onfocusin={()=>focused=field.id} onfocusout={event=>{if(!(event.relatedTarget instanceof Node)||!event.currentTarget.contains(event.relatedTarget))focused=null;}}>
 <QuantityField id={`kepler-ellipse-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field.id)} invalid={invalid.includes(field.id)||result.conflicts.includes(field.id)} describedby="kepler-ellipse-status" onvalue={value=>raw[field.id]=value} onunit={value=>units[field.id]=value}/>
 </div>{/each}</div>
 <CalculatorTools onreset={()=>{raw={};units={};selected=0;}}/>
 <div id="kepler-ellipse-status" aria-live="polite">
 {#if invalid.length}<p class="status error">{text(ellipseDomainNotice)}</p>{/if}
 {#if result.conflicts.length}<p class="status error">{resourceUi.conflict}</p>{/if}
 {#if result.numerical}<p class="status error">{resourceUi.numerical}</p>{/if}
 {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
 {#each equations as group,index}{#if equations.length>1}<p class="status">{resourceUi.solution} {index+1}</p>{/if}<EquationBlock label="" equations={group}/>{/each}
 </div>
 {#if result.branches.length>1}<ModelVariantSwitch options={result.branches.map((_,i)=>`${resourceUi.solution} ${i+1}`)} value={Math.min(selected,result.branches.length-1)} label={resourceUi.solution} onchange={value=>selected=value}/>{/if}
 <KeplerDiagram modelId="kepler-ellipse" result={diagramResult} enteredE={branch?.values.e} pointPhase={branch?.phase} pointAngle={branch?.values.phi} focusedField={focused}/>
 <p class="assumption">{text(ellipseAssumption)}</p>
</CalculatorShell>
