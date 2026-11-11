<script lang="ts">
 import {kinematicFields,type KinematicsModelId} from '#lib/content/kinematics.ts';
 import {solveAcceleratedMotion,type AcceleratedField,type KinematicsResult} from '#lib/physics/mechanics/accelerated-motion.ts';
 import {solveVerticalThrow,solveHorizontalThrow,solveObliqueThrow} from '#lib/physics/mechanics/projectiles.ts';
 import {unitGroups,fromSI} from '#lib/physics/units.ts';
 import {parseQuantityInUnit,changeQuantityUnit,formatMeasurement} from '#lib/calculators/quantities.ts';
 import {kinematicsEquations} from '#lib/calculators/kinematics-equations.ts';
 import {kinematicsUi as text,calculatorUi} from '#lib/i18n/runtime.ts';
 import CalculatorShell from './CalculatorShell.svelte';
 import CalculatorTools from './CalculatorTools.svelte';
 import QuantityField from './QuantityField.svelte';
 import EquationBlock from './EquationBlock.svelte';
 import ToggleSwitch from '../ui/ToggleSwitch.svelte';
 import KinematicsCharts from './KinematicsCharts.svelte';
 let {modelId}:{modelId:KinematicsModelId}=$props();
 const fields=$derived(kinematicFields[modelId]);
 let raw=$state<Record<string,string>>({});
 let selectedUnits=$state<Record<string,string>>({});
 let selectedScenario=$state(0);
 const unit=(key:string)=>selectedUnits[key]??unitGroups[fields.find(field=>field.id===key)!.kind].si;
 const parsed=$derived(Object.fromEntries(fields.map(field=>[field.id,parseQuantityInUnit(raw[field.id]??'',field.kind,unit(field.id))])));
 const parseErrors=$derived(fields.filter(field=>parsed[field.id].status==='invalid').map(field=>field.id));
 const result:KinematicsResult=$derived.by(()=>{
  if(parseErrors.length)return {status:'invalid',code:'domain',fields:parseErrors};
  const input:Partial<Record<string,number>>={};
  for(const field of fields){const item=parsed[field.id];if(item.status==='valid')input[field.id]=item.value;}
  if(modelId==='accelerated-motion'){
   const solution=solveAcceleratedMotion(input as Partial<Record<AcceleratedField,number>>);
   if(solution.status==='success'&&solution.target){const key=solution.target;const field=fields.find(item=>item.id===key)!;if(solution.scenarios.some(item=>!Number.isFinite(fromSI(item.values[key],field.kind,unit(key)))))return {status:'invalid',code:'numerical',fields:[]};}
   return solution;
  }
  if(modelId==='vertical-throw')return solveVerticalThrow(input);
  if(modelId==='oblique-throw')return solveObliqueThrow(input);
  return solveHorizontalThrow(input);
 });
 const equations=$derived(result.status==='success'?kinematicsEquations(modelId,result,selectedUnits):null);
 const scenario=$derived(result.status==='success'?result.scenarios[Math.min(selectedScenario,result.scenarios.length-1)]:null);
 const invalid=$derived(result.status==='invalid'?result.fields:[]);
 const timeLabel=(time:number)=>{const value=formatMeasurement(time,'s');return `t = ${value.number} ${value.prefix}s`;};
 const statusId=$derived(`${modelId}-status`);
 $effect(()=>{const current=result;selectedScenario=0;});
 function changeUnit(key:string,next:string){const field=fields.find(field=>field.id===key)!;raw[key]=changeQuantityUnit(raw[key]??'',field.kind,unit(key),next);selectedUnits[key]=next;}
 function reset(){raw={};selectedUnits={};selectedScenario=0;}
</script>
<CalculatorShell>
 <div class="input-grid">
  {#each fields as field}
   <QuantityField id={`${modelId}-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field.id)} invalid={invalid.includes(field.id)} state={field.defaultValue!==undefined&&!(raw[field.id]??'').trim()?`${text.defaultValue} ${field.defaultValue} ${unitGroups[field.kind].si}`:''} describedby={statusId} onvalue={value=>raw[field.id]=value} onunit={next=>changeUnit(field.id,next)}/>
  {/each}
 </div>
 <CalculatorTools onreset={reset}/>
 <div id={statusId} aria-live="polite" aria-atomic="true">
  {#if result.status==='success'&&equations}
   {#if result.assumed.includes('s0')}<p class="assumption">{text.initialAssumption}</p>{/if}
   {#if equations.conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={equations.conversions} conversion/>{/if}
   {#each equations.scenarios as group,index}
    {#if equations.scenarios.length>1}<p class="status">{text.timeSolution} {index+1}</p>{/if}
    {#each group as equation}<EquationBlock label={equation.label} equations={[equation.expression]}/>{/each}
   {/each}
  {:else if result.status==='invalid'}<p class="status error">{parseErrors.length?text.parseError:modelId==='oblique-throw'&&result.code==='domain'?text.obliqueDomain:text[result.code]}</p>
  {:else if result.status!=='success'}<p class="status" class:error={result.status!=='incomplete'}>{result.status==='incomplete'?(modelId==='accelerated-motion'?text.incompleteAccelerated:text.incompleteProjectile):text[result.status]}</p>{/if}
 </div>
 <p class="assumption">{modelId==='accelerated-motion'?text.acceleratedAssumptions:text.projectileAssumptions}</p>
 {#if modelId!=='accelerated-motion'}<p class="assumption">{modelId==='vertical-throw'?text.verticalConvention:modelId==='oblique-throw'?text.obliqueConvention:text.horizontalConvention}</p>{/if}
 {#if result.status==='success'&&result.scenarios.length>1}
  <p class="status">{text.multipleTimes}</p>
  <ToggleSwitch label={text.diagramInterval} checked={selectedScenario===1} offLabel={timeLabel(result.scenarios[0].duration)} onLabel={timeLabel(result.scenarios[1].duration)} onchange={checked=>selectedScenario=checked?1:0}/>
 {/if}
 <KinematicsCharts {modelId} {scenario}/>
</CalculatorShell>
