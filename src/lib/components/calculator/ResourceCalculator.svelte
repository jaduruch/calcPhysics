<script lang="ts">
  import {resourceDefinitions} from '#lib/content/resource-catalog.ts';
  import {resourcePhysics} from '#lib/physics/resources/models.ts';
  import {solveResourceModel,inResourceDomain,type Values} from '#lib/physics/resources/solver.ts';
  import {unitGroups,fromSI,defaultInputUnit} from '#lib/physics/units.ts';
  import {parseQuantityInUnit} from '#lib/calculators/quantities.ts';
  import {resourceEquations,resourceDisplaySymbol} from '#lib/calculators/resource-equations.ts';
  import {resourceUi as text,calculatorUi} from '#lib/i18n/runtime.ts';
  import KeplerDiagram from './KeplerDiagram.svelte';
  import PulleyDiagram from './PulleyDiagram.svelte';
  import ResourceOpticsDiagram from './ResourceOpticsDiagram.svelte';
  import CalculatorShell from './CalculatorShell.svelte';
  import CalculatorTools from './CalculatorTools.svelte';
  import QuantityField from './QuantityField.svelte';
  import EquationBlock from './EquationBlock.svelte';
  let {modelId}:{modelId:string}=$props();
  const definition=$derived(resourceDefinitions.find(item=>item.id===modelId)!);
  const physics=$derived(resourcePhysics[modelId]);
  let raw=$state<Record<string,string>>({});
  let selectedUnits=$state<Record<string,string>>({});
  const unit=(key:string)=>selectedUnits[key]??defaultInputUnit(definition.fields.find(field=>field.id===key)!.kind);
  const parsed=$derived(Object.fromEntries(definition.fields.map(field=>[field.id,parseQuantityInUnit(raw[field.id]??'',field.kind,unit(field.id))])));
  const invalid=$derived(definition.fields.filter(field=>{const item=parsed[field.id];return item.status==='invalid'||(item.status==='valid'&&!inResourceDomain(item.value,physics.domains[field.id]));}).map(field=>field.id));
  const result=$derived.by(()=>{
    if(invalid.length)return {status:'invalid' as const,fields:invalid};
    const input:Partial<Values>={};
    for(const field of definition.fields){const item=parsed[field.id];if(item.status==='valid')input[field.id]=item.value;}
    const solution=solveResourceModel(physics,input);
    if(solution.status==='success') {
      const key=solution.target;
      if(key){const field=definition.fields.find(field=>field.id===key)!;const displays=(solution.solutions??[solution.values]).map(values=>fromSI(values[key],field.kind,unit(key)));if(!displays.every(Number.isFinite))return {status:'numerical' as const};}
    }
    return solution;
  });
  const equations=$derived(result.status==='success'?(result.solutions??[result.values]).map(values=>resourceEquations(definition,{...result,values},selectedUnits)):[]);
  function changeUnit(key:string,next:string){selectedUnits[key]=next;}
  function reset(){raw={};selectedUnits={};}
  const statusId=$derived(`${modelId}-status`);
</script>
<CalculatorShell>
  <div class="input-grid">
    {#each definition.fields as field}
      <QuantityField id={`${modelId}-${field.id}`} symbol={resourceDisplaySymbol(field.symbol)} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field.id)} invalid={invalid.includes(field.id)} state={physics.defaults?.[field.id]!==undefined&&!(raw[field.id]??'').trim()?`${text.defaultValue} ${physics.defaults[field.id]} ${unitGroups[field.kind].si}`:''} describedby={statusId} onvalue={value=>raw[field.id]=value} onunit={next=>changeUnit(field.id,next)} />
    {/each}
  </div>
  <CalculatorTools onreset={reset}/>
  <div id={statusId} aria-live="polite" aria-atomic="true">
    {#if result.status==='success'}
      {#each equations as group,index}
      {#if equations.length>1}<p class="status">{text.solution} {index+1}</p>{/if}
      {#if group.conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={group.conversions} conversion/>{/if}
      {#each group.equations as equation}<EquationBlock label={equation.label} equations={[equation.expression]}/>{/each}
      {/each}
      {#if !result.target&&physics.primary}<p class="status">{text.consistent}</p>{/if}
      {#if modelId==='prism-deviation'&&result.outputs.e===undefined}<p class="status">{text.prismReflection}</p>{/if}
    {:else}<p class="status" class:error={result.status!=='incomplete'}>{result.status==='incomplete'?(physics.primary?text.incompleteRelation:text.incomplete):text[result.status]}</p>{/if}
  </div>
  {#if ['mirror-focus','lens-power','optical-medium','parallel-plate','prism-deviation'].includes(modelId)}
    <ResourceOpticsDiagram {modelId} result={result.status==='success'?result:null}/>
  {/if}
  {#if modelId==='book-pulley-force'||modelId==='book-pulley-distance'}
    <PulleyDiagram enteredCount={parsed.n?.status==='valid'&&inResourceDomain(parsed.n.value,physics.domains.n)?parsed.n.value:undefined} result={result.status==='success'?result:null} mode={modelId==='book-pulley-force'?'force':'travel'}/>
  {/if}
  {#if modelId==='kepler-ellipse'||modelId==='kepler-areas'}
    <KeplerDiagram {modelId} result={result.status==='success'?result:null} enteredE={parsed.e?.status==='valid'&&parsed.e.value>=0&&parsed.e.value<1?parsed.e.value:undefined}/>
  {/if}
  <p class="assumption">{definition.assumption}</p>
</CalculatorShell>
