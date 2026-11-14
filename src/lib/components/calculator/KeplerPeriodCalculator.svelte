<script lang="ts">
 import {keplerPeriodFields,keplerPeriodAssumption} from '#lib/content/kepler-period.ts';
 import {solveKeplerPeriod} from '#lib/physics/mechanics/kepler-period.ts';
 import {keplerPeriodEquations,keplerPeriodConversions} from '#lib/calculators/kepler-period.ts';
 import {defaultInputUnit} from '#lib/physics/units.ts';
 import {parseQuantityInUnit} from '#lib/calculators/quantities.ts';
 import {text,resourceUi,calculatorUi} from '#lib/i18n/runtime.ts';
 import type {Values} from '#lib/physics/resources/solver.ts';
 import CalculatorShell from './CalculatorShell.svelte';
 import CalculatorTools from './CalculatorTools.svelte';
 import QuantityField from './QuantityField.svelte';
 import EquationBlock from './EquationBlock.svelte';
 import KeplerPeriodDiagram from './KeplerPeriodDiagram.svelte';
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({}),focused=$state<string|null>(null);
 const unit=(id:string)=>units[id]??defaultInputUnit(keplerPeriodFields.find(f=>f.id===id)!.kind);
 const parsed=$derived(Object.fromEntries(keplerPeriodFields.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind,unit(f.id))])));
 const invalid=$derived(keplerPeriodFields.filter(f=>{const p=parsed[f.id];return p.status==='invalid'||p.status==='valid'&&p.value<=0;}).map(f=>f.id));
 const result=$derived.by(()=>{const input:Values={};for(const f of keplerPeriodFields){const p=parsed[f.id];if(p.status==='valid')input[f.id]=p.value;}return solveKeplerPeriod(input,invalid);});
 const equations=$derived(keplerPeriodEquations(result,Object.fromEntries(keplerPeriodFields.map(f=>[f.id,unit(f.id)]))));
 const conversions=$derived(keplerPeriodConversions(parsed,Object.fromEntries(keplerPeriodFields.map(f=>[f.id,unit(f.id)]))));
</script>
<CalculatorShell>
 <div class="input-grid">{#each keplerPeriodFields as field}<div onfocusin={()=>focused=field.id} onfocusout={event=>{if(!(event.relatedTarget instanceof Node)||!event.currentTarget.contains(event.relatedTarget))focused=null;}}>
 <QuantityField id={`kepler-period-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field.id)} invalid={invalid.includes(field.id)||result.conflicts.includes(field.id)} describedby="kepler-period-status" onvalue={value=>raw[field.id]=value} onunit={value=>units[field.id]=value}/>
 </div>{/each}</div>
 <CalculatorTools onreset={()=>{raw={};units={};}}/>
 <div id="kepler-period-status" aria-live="polite">
 {#if invalid.length}<p class="status error">{text('All quantities must be strictly positive.')}</p>{/if}
 {#if result.conflicts.length}<p class="status error">{resourceUi.conflict}</p>{/if}
 {#if result.numerical}<p class="status error">{resourceUi.numerical}</p>{/if}
 {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
 <EquationBlock label="" {equations}/>
 </div>
 <KeplerPeriodDiagram values={result.values} {focused}/>
 <p class="assumption">{text(keplerPeriodAssumption)}</p>
</CalculatorShell>
