<script lang="ts">
 import { obliqueFields } from '#lib/content/oblique-throw.ts';
 import { solveObliqueModel, inObliqueDomain, obliqueApexFields, obliqueApexUnavailable, type ObliqueField } from '#lib/physics/mechanics/oblique-throw.ts';
 import { defaultInputUnit, unitGroups } from '#lib/physics/units.ts';
 import { parseQuantityInUnit } from '#lib/calculators/quantities.ts';
 import { obliqueEquations, obliqueConversions } from '#lib/calculators/oblique-throw.ts';
 import { obliqueUi as text, kinematicsUi, calculatorUi } from '#lib/i18n/runtime.ts';
 import CalculatorShell from './CalculatorShell.svelte';
 import CalculatorTools from './CalculatorTools.svelte';
 import QuantityField from './QuantityField.svelte';
 import EquationBlock from './EquationBlock.svelte';
 import KinematicsCharts from './KinematicsCharts.svelte';
 import ModelVariantSwitch from '../ui/ModelVariantSwitch.svelte';
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({}),selected=$state(0);
 const unit=(key:ObliqueField)=>units[key]??defaultInputUnit(obliqueFields.find(field=>field.id===key)!.kind);
 const parsed=$derived(Object.fromEntries(obliqueFields.map(field=>[field.id,parseQuantityInUnit(raw[field.id]??'',field.kind,unit(field.id))])));
 const explicitNoApex=$derived(obliqueApexUnavailable(Object.fromEntries(['alpha','vy0'].flatMap(key=>parsed[key].status==='valid'?[[key,parsed[key].value]]:[]))));
 const activeFields=$derived(obliqueFields.filter(field=>!explicitNoApex||!obliqueApexFields.includes(field.id)));
 const invalid=$derived(activeFields.filter(field=>{const item=parsed[field.id];return item.status==='invalid'||item.status==='valid'&&!inObliqueDomain(field.id,item.value);}).map(field=>field.id));
 const input=$derived(Object.fromEntries(activeFields.flatMap(field=>{const item=parsed[field.id];return item.status==='valid'&&!invalid.includes(field.id)?[[field.id,item.value]]:[];})) as Partial<Record<ObliqueField,number>>);
 const result=$derived(solveObliqueModel(input,{blocked:invalid}));
 const branches=$derived(result.status==='success'?result.branches:[]);
 const branch=$derived(branches[Math.min(selected,branches.length-1)]);
 const equations=$derived(branches.map(branch=>obliqueEquations(branch,units)));
 const noApex=$derived(explicitNoApex||branches.length>0&&branches.every(branch=>obliqueApexUnavailable(branch.values)));
 const conversions=$derived(obliqueConversions(Object.fromEntries(Object.entries(input).filter(([key])=>!noApex||!obliqueApexFields.includes(key as ObliqueField))),units));
 $effect(()=>{const current=result;selected=0;});
</script>
<CalculatorShell>
 <div class="input-grid">
  {#each activeFields as field (field.id)}
   <QuantityField id={`oblique-throw-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field.id)} invalid={invalid.includes(field.id)} state={field.defaultValue!==undefined&&!raw[field.id]?.trim()&&(!branch||branch.assumed.includes(field.id))?`${kinematicsUi.defaultValue} ${field.defaultValue} ${unitGroups[field.kind].si}`:''} describedby="oblique-throw-status oblique-throw-help" onvalue={value=>raw[field.id]=value} onunit={value=>units[field.id]=value}/>
  {/each}
 </div>
 <CalculatorTools onreset={()=>{raw={};units={};selected=0;}}/>
 <p id="oblique-throw-help" class="assumption">{text.help}</p>
 {#if noApex}<p class="assumption">{text.noApex}</p>{/if}
 <div id="oblique-throw-status" aria-live="polite" aria-atomic="true">
  {#if invalid.length}<p class="status error">{text.invalid}</p>{/if}
  {#if result.status==='success'}
   {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
   {#each branches as solution,index}
    {#if branches.length>1}<p class="status">{text.solution} {index+1}</p>{/if}
    {#if solution.assumed.includes('y0')||solution.assumed.includes('g')}<p class="assumption">{text.assumptions} {solution.assumed.map(key=>`${key==='y0'?'y₀':'g'} = ${solution.values[key]} ${unitGroups[obliqueFields.find(field=>field.id===key)!.kind].si}`).join(', ')}</p>{/if}
    {#each equations[index] as equation}<EquationBlock label={equation.label} equations={[equation.expression]}/>{/each}
   {/each}
   {#if !branch?.scenario}<p class="status">{text.partial}</p>{/if}
  {:else}<p class="status" class:error={result.status!=='incomplete'}>{result.status==='incomplete'?text.incomplete:result.status==='numerical'?kinematicsUi.numerical:result.status==='invalid'?text.invalid:text.conflict}</p>{/if}
 </div>
 {#if branches.length>1}<ModelVariantSwitch options={branches.map((_,i)=>`${text.solution} ${i+1}`)} value={selected} label={text.diagramSolution} onchange={value=>selected=value}/>{/if}
 <p class="assumption">{kinematicsUi.projectileAssumptions}</p>
 <p class="assumption">{kinematicsUi.obliqueConvention}</p>
 <KinematicsCharts modelId="oblique-throw" scenario={branch?.scenario??null}/>
</CalculatorShell>
