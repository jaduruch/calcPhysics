<script lang="ts">
 import {solveCombinedIncline,inclineDomains,inclineRelations,inclineMappings} from '#lib/physics/mechanics/incline-combined.ts';
 import {solveInclinedPlane} from '#lib/physics/mechanics/inclined-plane.ts';
 import {formulaBookRule} from '#lib/calculators/formula-book-equations.ts';
 import {quantityLatex,prefixes} from '#lib/calculators/quantities.ts';
 import {getUnit,unitGroups} from '#lib/physics/units.ts';
 import {resourceDefinitions,type ResourceField} from '#lib/content/resource-catalog.ts';
 import {resourceFormula,resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {parseQuantityInUnit} from '#lib/calculators/quantities.ts';
 import {defaultInputUnit,type QuantityKind} from '#lib/physics/units.ts';
 import {inResourceDomain} from '#lib/physics/resources/solver.ts';
 import {inclinedPlaneUi as text,resourceUi,calculatorUi} from '#lib/i18n/runtime.ts';
 import CalculatorShell from './CalculatorShell.svelte';
 import QuantityField from './QuantityField.svelte';
 import CalculatorTools from './CalculatorTools.svelte';
 import EquationBlock from './EquationBlock.svelte';
 import ModelVariantSwitch from '../ui/ModelVariantSwitch.svelte';
 import InclinedPlaneSketch from './InclinedPlaneSketch.svelte';
 const metadata:ResourceField[]=[
  {id:'length',name:'plane length',symbol:'L',kind:'length'}, {id:'height',name:'height difference',symbol:'h',kind:'length'},
  {id:'angle',name:'inclination angle',symbol:String.raw`\alpha`,kind:'angle'}, {id:'endVelocity',name:'end speed (input or calculated, start from rest)',symbol:'v_{end}',kind:'velocity'},
  {id:'mass',name:'mass',symbol:'m',kind:'mass'}, {id:'friction',name:'kinetic friction coefficient',symbol:String.raw`\mu_k`,kind:'dimensionless'},
  {id:'gravity',name:'gravitational acceleration',symbol:'g',kind:'acceleration'},
  ...['weight','normal','parallel','frictionForce','net','raising','acceleration'].map((id,i)=>({id,name:['weight magnitude','normal force magnitude','downhill gravity component','kinetic friction force','net force','required uphill force for uniform raising','constant acceleration'][i],symbol:['F_G','F_N',String.raw`F_{\parallel}`,'F_f','F_{net}','F_{up}','a'][i],kind:(id==='acceleration'?'acceleration':'force') as QuantityKind}))
 ];
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({}),focused=$state<string|null>(null),selected=$state(0);
 const unit=(f:ResourceField)=>units[f.id]??defaultInputUnit(f.kind);
 const parsed=$derived(Object.fromEntries(metadata.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind,unit(f))])));
 const invalid=$derived(metadata.filter(f=>{const item=parsed[f.id];return item.status==='invalid'||item.status==='valid'&&!inResourceDomain(item.value,inclineDomains[f.id]);}).map(f=>f.id));
 const result=$derived.by(()=>{const values:Record<string,number>={};for(const f of metadata){const item=parsed[f.id];if(item.status==='valid'&&!invalid.includes(f.id))values[f.id]=item.value;}return solveCombinedIncline(values,invalid);});
 function formula(target:string,fallback:string,source:number|undefined,values:Record<string,number>){
  if(fallback)return fallback;
  const map=inclineRelations[source!].map,id=Object.keys(inclineMappings).find(id=>inclineMappings[id]===map)!;
  const key=Object.keys(map).find(k=>map[k]===target)!;
  return formulaBookRule(id,key,resourceDefinitions.find(d=>d.id===id)!.rules[key],Object.fromEntries(Object.entries(map).map(([key,value])=>[key,values[value]]))).replace(/\[\[(\w+)\]\]/g,(_,k)=>`[[${map[k]}]]`);
 }
 const equations=$derived(result.branches.map(branch=>branch.steps.map(step=>{
  const field=metadata.find(f=>f.id===step.target)!,expression=formula(step.target,step.formula,step.source,branch.values);
  return `${field.symbol}=${resourceFormula(expression,metadata)}=${resourceFormula(expression,metadata,branch.values)}\\approx ${resourceQuantity(branch.values[step.target],field.kind)}`;
 })));
 const conversions=$derived(metadata.flatMap(field=>{const item=parsed[field.id],selected=unit(field);if(item.status!=='valid'||invalid.includes(field.id)||selected===unitGroups[field.kind].si)return [];const u=getUnit(field.kind,selected);return [`${field.symbol}=${quantityLatex(Number(item.number),selected,false)}${item.prefix?`\\cdot 10^{${Math.log10(prefixes.find(p=>p.symbol===item.prefix)!.factor)}}`:''}\\cdot\\frac{${'factorLatex' in u?u.factorLatex:u.factor}\\,\\mathrm{${unitGroups[field.kind].si}}}{1\\,\\mathrm{${selected}}}\\approx ${resourceQuantity(item.value,field.kind)}`];}));
 const branch=$derived(result.branches[Math.min(selected,result.branches.length-1)]);
 const sketchResult=$derived(branch?solveInclinedPlane(Object.fromEntries(['mass','angle','length','height','friction','gravity'].filter(k=>branch.values[k]!==undefined).map(k=>[k,branch.values[k]]))):null);
</script>
<CalculatorShell>
 <div class="input-grid">
 {#each metadata as field}
 <div onfocusin={()=>focused=field.id} onfocusout={event=>{if(!(event.relatedTarget instanceof Node)||!event.currentTarget.contains(event.relatedTarget))focused=null;}}>
 <QuantityField id={`incline-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field)} invalid={invalid.includes(field.id)||result.conflictFields.includes(field.id)} onvalue={value=>raw[field.id]=value} onunit={value=>units[field.id]=value} />
 </div>
 {/each}
 </div>
 <CalculatorTools onreset={()=>{raw={};units={};}}/>
 <p class="assumption">{text.defaults}</p><p class="assumption">{text.combinedAssumptions}</p>
 <div id="incline-status" aria-live="polite">
 {#if invalid.length}<p class="status error">{calculatorUi.invalidNumber}</p>{/if}
 {#if result.conflict}<p class="status error">{text.speedInvalid}</p>{/if}
 {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
 {#each equations as group,index}
 {#if equations.length>1}<p>{resourceUi.solution} {index+1}</p>{/if}
 <EquationBlock label="" equations={group}/>
 {/each}
 </div>
 {#if result.branches.length>1}<ModelVariantSwitch options={result.branches.map((_,index)=>`${resourceUi.solution} ${index+1}`)} label={resourceUi.solution} value={Math.min(selected,result.branches.length-1)} onchange={index=>selected=index}/>{/if}
 <InclinedPlaneSketch result={sketchResult} enteredAngle={branch?.values.angle} enteredFriction={branch?.values.friction} highlightAngle={focused==='angle'} highlightLength={focused==='length'} highlightHeight={focused==='height'} focusedField={focused}/>
</CalculatorShell>
