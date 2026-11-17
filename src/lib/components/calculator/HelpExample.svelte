<script lang="ts">
 import {helpExamples} from '#lib/content/calculator-help.ts';
 import {helpMotion} from '#lib/calculators/help-examples.ts';
 import {parseQuantityInUnit,quantityLatex} from '#lib/calculators/quantities.ts';
 import {resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {defaultInputUnit,fromSI,type QuantityKind} from '#lib/physics/units.ts';
 import {text,calculatorUi,ui} from '#lib/i18n/runtime.ts';
 import InfoButton from '../ui/InfoButton.svelte';
 import CalculatorShell from './CalculatorShell.svelte';import CalculatorTools from './CalculatorTools.svelte';import QuantityField from './QuantityField.svelte';import EquationBlock from './EquationBlock.svelte';import Formula from '../Formula.svelte';
 let {example}:{example:(typeof helpExamples)[number]}=$props();
 let showInfo=$state(false);
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({});
 const fields=$derived(example.id==='motion'?[
  {id:'s',symbol:'s',name:'displacement',kind:'length'},{id:'t',symbol:'t',name:'elapsed time',kind:'time'},{id:'v',symbol:'v',name:'velocity',kind:'velocity'}
 ]:example.id==='units'?[
  {id:'v',symbol:'v',name:'velocity',kind:'velocity'},{id:'alpha',symbol:String.raw`\alpha`,name:'angle',kind:'angle'}
 ]:[{id:'x',symbol:example.id==='prefix'?'s':'x',name:example.id==='prefix'?'Length':example.id==='precision'?'Expression to round':'Expression',kind:example.id==='prefix'?'length':'dimensionless'}]);
 const unit=(id:string,kind:QuantityKind)=>units[id]??defaultInputUnit(kind);
 const parsed=$derived(Object.fromEntries(fields.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind as QuantityKind,unit(f.id,f.kind as QuantityKind))])));
 const motion=$derived(helpMotion(raw,units));
 const invalid:string[]=$derived(example.id==='motion'?motion.invalid:fields.filter(f=>parsed[f.id].status==='invalid').map(f=>f.id));
 const equations=$derived(example.id==='motion'?(motion.equation?[motion.equation]:[]):fields.flatMap(f=>{
  const p=parsed[f.id];if(p.status!=='valid')return [];
  const kind=f.kind as QuantityKind,selected=unit(f.id,kind);
  return [`${f.symbol}=${quantityLatex(fromSI(p.value,kind,selected),selected==='1'?'':selected,false)}\\approx ${resourceQuantity(p.value,kind)}`];
 }));
 const status=$derived(example.id==='motion'&&parsed.t?.status==='valid'&&parsed.t.value<0?calculatorUi['negative-time']:invalid.length?calculatorUi.invalidNumber:example.id==='motion'&&motion.result?.status==='invalid'?calculatorUi[motion.result.code]:example.id==='motion'&&motion.result?.status==='no-solution'?calculatorUi.noSolution:example.id==='motion'&&motion.result?.status==='underdetermined'?calculatorUi.underdetermined:'');
 function loadExample(){units={};raw={};if(example.id==='motion')raw={s:'120',t:'10'};else if(example.id==='expression')raw={x:'(1 + 3) * 2'};else if(example.id==='prefix')raw={x:'1k + 1m'};else if(example.id==='units'){raw={v:'36',alpha:'90'};units={v:'km/h'};}else raw={x:'1 / 3'};}
</script>
<div class="help-example" data-example={example.id}>
 <h3>{text(example.title)}</h3><p class="example-hint">{text(example.hint)}</p>
 {#if example.id==='motion'}<Formula expression={String.raw`v=\frac{s}{t},\qquad s=v\cdot t,\qquad t=\frac{s}{v}`}/>{/if}
 {#if example.id==='precision'}
 <InfoButton expanded={showInfo} controls="help-precision-info" label={showInfo?ui.hideTheory:ui.showTheory} onclick={()=>showInfo=!showInfo}/>
 <p id="help-precision-info" class="example-hint" hidden={!showInfo}>{text('Three significant figures describe display rounding, not measurement accuracy. Subsequent calculations use the value before display rounding.')}</p>
 {/if}
 <CalculatorShell>
  <div class="input-grid" class:input-grid--single={fields.length===1}>
   {#each fields as field}<QuantityField id={`help-${example.id}-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind as QuantityKind} raw={raw[field.id]??''} unit={unit(field.id,field.kind as QuantityKind)} invalid={invalid.includes(field.id)} describedby={`help-${example.id}-status`} onvalue={value=>raw[field.id]=value} onunit={value=>units[field.id]=value}/>{/each}
  </div>
  <CalculatorTools compact onexample={loadExample} onreset={()=>{raw={};units={};showInfo=false;}}/>
  <div id={`help-${example.id}-status`} aria-live="polite">
   {#if status}<p class="status error">{status}</p>{/if}
   {#if example.id==='motion'&&motion.conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={motion.conversions} conversion/>{/if}
   <EquationBlock label="" {equations}/>
   {#if ['expression','prefix'].includes(example.id)&&parsed.x.status==='valid'}<p class="precision-value">{text('Evaluated input:')} <output>{String(fromSI(parsed.x.value,fields[0].kind as QuantityKind,unit('x',fields[0].kind as QuantityKind)))}{fields[0].kind==='dimensionless'?'':` ${unit('x',fields[0].kind as QuantityKind)}`}</output></p>{/if}
   {#if example.id==='precision'&&parsed.x.status==='valid'}<p class="precision-value">{text('Value before display rounding:')} <output>{String(parsed.x.value)}</output></p>{/if}
  </div>
 </CalculatorShell>
</div>
<style>
 .help-example{margin-top:12px;padding:16px;border-radius:var(--control-radius);background:var(--color-surface-raised);color:var(--color-text);min-width:0}h3{font-size:.9rem;margin:0 0 8px}.example-hint{font-size:.8125rem;color:var(--color-text-muted);margin:0 0 16px;max-width:70ch}.help-example :global(.formula){margin-top:8px}.precision-value{font-size:.8125rem;color:var(--color-text-muted);overflow-wrap:anywhere}output{font-variant-numeric:tabular-nums}
</style>
