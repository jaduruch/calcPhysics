<script lang="ts">
 import {collisionFields,elasticAssumption,inelasticAssumption} from '#lib/content/collisions.ts';
 import {solveCollision,collisionDomains} from '#lib/physics/mechanics/collisions.ts';
 import ModelVariantSwitch from '../ui/ModelVariantSwitch.svelte';
 import {momentumFields,rocketFields,momentumAssumption,rocketAssumption} from '#lib/content/momentum.ts';
 import {solveMomentum,momentumDomains,rocketDomains} from '#lib/physics/mechanics/momentum.ts';
 import {parseQuantityInUnit,quantityLatex} from '#lib/calculators/quantities.ts';
 import {resourceFormula,resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {defaultInputUnit,unitGroups,getUnit,fromSI} from '#lib/physics/units.ts';
 import {inResourceDomain,type Values} from '#lib/physics/resources/solver.ts';
 import {text,calculatorUi,resourceUi} from '#lib/i18n/runtime.ts';
 import CalculatorShell from './CalculatorShell.svelte';import QuantityField from './QuantityField.svelte';
 import CalculatorTools from './CalculatorTools.svelte';import EquationBlock from './EquationBlock.svelte';import MomentumDiagram from './MomentumDiagram.svelte';
 let {modelId}:{modelId:string}=$props();
 const rocket=$derived(modelId==='rocket-equation'),collision=$derived(modelId==='elastic-collision'||modelId==='inelastic-collision'),elastic=$derived(modelId==='elastic-collision');
 const fields=$derived(collision?collisionFields.filter(f=>!elastic||f.id!=='e'):rocket?rocketFields:momentumFields),domains=$derived(collision?collisionDomains:rocket?rocketDomains:momentumDomains);
 const equationFields=$derived(collision?collisionFields:fields);
 let selected=$state(0);
 let raw=$state<Record<string,string>>({}),units=$state<Record<string,string>>({}),focused=$state<string|null>(null);
 const unit=(key:string)=>units[key]??defaultInputUnit(fields.find(f=>f.id===key)!.kind);
 const parsed=$derived(Object.fromEntries(fields.map(f=>[f.id,parseQuantityInUnit(raw[f.id]??'',f.kind,unit(f.id))])));
 const invalid=$derived(fields.filter(f=>{const p=parsed[f.id];return p.status==='invalid'||p.status==='valid'&&!inResourceDomain(p.value,domains[f.id]);}).map(f=>f.id));
 const solved=$derived.by(()=>{const input:Values={};for(const f of fields){const p=parsed[f.id];if(p.status==='valid')input[f.id]=p.value;}if(collision)return solveCollision(elastic,input,invalid);const s=solveMomentum(rocket?'rocket':'momentum',input,invalid);return {solutions:[s],fallback:s,ambiguous:false};});
 const results=$derived(solved.solutions.length?solved.solutions:[solved.fallback]);
 const result=$derived(results[Math.min(selected,results.length-1)]);
 const equations=$derived(results.map(solution=>solution.steps.filter(s=>!elastic||s.target!=='e').map(s=>{const f=equationFields.find(f=>f.id===s.target)!;const template=elastic?s.formula.replaceAll('[[e]]','1'):s.formula;return `${f.symbol}=${resourceFormula(template,equationFields)}=${resourceFormula(template,equationFields,s.snapshot)}\\approx ${resourceQuantity(solution.values[f.id],f.kind,unit(f.id))}`;})));
 const conversions=$derived(fields.flatMap(f=>{const p=parsed[f.id],selected=unit(f.id);if(p.status!=='valid'||invalid.includes(f.id)||result.conflicts.includes(f.id)||selected===unitGroups[f.kind].si)return [];const u=getUnit(f.kind,selected),factor='factorLatex' in u?u.factorLatex:String(u.factor);return [`${f.symbol}=${quantityLatex(fromSI(p.value,f.kind,selected),selected,false)}\\cdot\\frac{${factor}\\,\\mathrm{${unitGroups[f.kind].si}}}{1\\,\\mathrm{${selected}}}\\approx ${resourceQuantity(p.value,f.kind)}`];}));
</script>
<CalculatorShell>
 <div class="input-grid">{#each fields as field}<div onfocusin={()=>focused=field.id} onfocusout={event=>{if(!(event.relatedTarget instanceof Node)||!event.currentTarget.contains(event.relatedTarget))focused=null;}}>
 <QuantityField id={`${modelId}-${field.id}`} symbol={field.symbol} name={field.name} kind={field.kind} raw={raw[field.id]??''} unit={unit(field.id)} invalid={invalid.includes(field.id)||result.conflicts.includes(field.id)} describedby={`${modelId}-status`} onvalue={v=>raw[field.id]=v} onunit={v=>units[field.id]=v}/>
 </div>{/each}</div>
 <CalculatorTools onreset={()=>{raw={};units={};focused=null;selected=0;}}/>
 <div id={`${modelId}-status`} aria-live="polite">
 {#if invalid.length}<p class="status error">{text(collision?'Use positive masses, nonnegative energies and a coefficient of restitution between 0 and 1. Velocities and momenta may be signed.':rocket?'Use positive rocket masses and exhaust speed, mass ratio ≥ 1, and nonnegative expelled mass, velocity gain, flow, thrust and acceleration. Velocities may be signed.':'Use positive masses and finite signed velocities or momenta.')}</p>{/if}
 {#if result.noSolution}<p class="status error">{text('No physical solution exists for the affected quantities in this model.')}</p>{:else if result.conflicts.length}<p class="status error">{resourceUi.conflict}</p>{/if}
 {#if result.numerical}<p class="status error">{resourceUi.numerical}</p>{/if}
 {#if result.underdetermined.length}<p class="assumption">{text('A zero divided by zero does not determine a unique value. Add an independent measurement.')}</p>{/if}
 {#if conversions.length}<EquationBlock label={calculatorUi.unitConversion} equations={conversions} conversion/>{/if}
 {#each equations as group,index}{#if equations.length>1}<p class="status">{resourceUi.solution} {index+1}</p>{/if}<EquationBlock label="" equations={group}/>{/each}
 </div>
 {#if results.length>1}<ModelVariantSwitch options={results.map((_,i)=>`${resourceUi.solution} ${i+1}`)} value={Math.min(selected,results.length-1)} label={resourceUi.solution} onchange={value=>selected=value}/>{/if}
 <MomentumDiagram values={result.values} {focused} {rocket} {collision}/>
 <p class="assumption">{text(collision?elastic?elasticAssumption:inelasticAssumption:rocket?rocketAssumption:momentumAssumption)}</p>
</CalculatorShell>
