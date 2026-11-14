<script lang="ts">
 import type {Values} from '#lib/physics/resources/solver.ts';
 import {resourceQuantity} from '#lib/calculators/resource-equations.ts';
 import {text} from '#lib/i18n/runtime.ts';import Formula from '../Formula.svelte';
 let {values,focused,rocket,collision=false}:{values:Values;focused:string|null;rocket:boolean;collision?:boolean}=$props();
 const related=(keys:string[])=>focused!==null&&!keys.includes(focused);
 const arrows=$derived(rocket?[
 {key:'v',label:'v',x:260,y:85,keys:['v','v0','dv','vg','u']},
 {key:'vg',label:'v_gas',x:110,y:175,keys:['vg','v','u']}
 ]:[
 {key:'p1',label:'p₁',x:130,y:85,keys:['p1','m1','v1','dp1','P','e','E0','loss']},{key:'p2',label:'p₂',x:130,y:150,keys:['p2','m2','v2','dp2','P','e','E0','loss']},
 {key:'q1',label:'p′₁',x:340,y:85,keys:['q1','m1','w1','dp1','P','e','E1','loss']},{key:'q2',label:'p′₂',x:340,y:150,keys:['q2','m2','w2','dp2','P','e','E1','loss']}
 ]);
 const scale=$derived(Math.max(...arrows.map(a=>Math.abs(values[a.key]??0)),Number.MIN_VALUE));
 const massFraction=$derived(values.ratio!==undefined?1/values.ratio:values.M!==undefined&&values.M0!==undefined?values.M/values.M0:undefined);
</script>
<figure>
 <figcaption>{text(rocket?'Rocket and freshly expelled gas':'Momentum before and after')}</figcaption>
 <svg viewBox={collision?"0 0 470 330":"0 0 470 260"} role="img" aria-label={text(rocket?'Schematic rocket geometry; signed observer-frame velocity arrows share one relative scale.':'Signed momentum arrows share one relative scale before and after. Missing momenta have no arrow.')}>
 {#if rocket}
 <g class:muted={related(['M','M0','dm','ratio'])}><path class="body" d="M210 110H300L330 135L300 160H210Z"/><text x="262" y="142" text-anchor="middle">M</text></g>
 <g class:muted={related(['u','flow','vg','dm'])}><circle cx="90" cy="135" r="7"/><circle cx="125" cy="135" r="5"/><circle cx="157" cy="135" r="3"/></g>
 {#if values.F!==undefined&&values.F>0}<g class:muted={related(['F','flow','u','a','M'])}><path class="vector" d="M340 135h65m-7-5l7 5l-7 5"/><text x="365" y="122">F</text></g>{/if}
 {#if values.a!==undefined&&values.a>0}<g class:muted={related(['a','F','M'])}><path class="vector" d="M260 187h65m-7-5l7 5l-7 5"/><text x="335" y="192">a</text></g>{/if}
 {#if massFraction!==undefined}<g class:muted={related(['M','M0','dm','ratio'])}><rect class="mass-remaining" x="55" y="220" width={350*massFraction} height="12"/><rect class="mass-expelled" x={55+350*massFraction} y="220" width={350*(1-massFraction)} height="12"/><text x="55" y="211">M / M₀</text><text x="405" y="211" text-anchor="end">m / M₀</text></g>{/if}
 {:else}
 <text x="130" y="32" text-anchor="middle">{text('Before')}</text><text x="340" y="32" text-anchor="middle">{text('After')}</text>
 {#each arrows as arrow}<g class:muted={related(arrow.keys)}><circle cx={arrow.x} cy={arrow.y} r="8"/><text x={arrow.x} y={arrow.y+35} text-anchor="middle">{arrow.label}</text></g>{/each}
 {/if}
 {#each arrows as arrow}{#if values[arrow.key]!==undefined}{@const length=values[arrow.key]/scale*(rocket?90:70)}
 <g class:muted={related(arrow.keys)} data-quantity={arrow.key}>
 {#if length!==0}<path class="vector" d={`M${arrow.x} ${arrow.y}h${length}`}/><path class="vector" d={`M${arrow.x+length-Math.sign(length)*7} ${arrow.y-5}L${arrow.x+length} ${arrow.y}l${-Math.sign(length)*7} 5`}/>{:else}<text x={arrow.x+14} y={arrow.y+5}>0</text>{/if}
 {#if rocket}<text x={arrow.x} y={arrow.y-14}>{arrow.key==='vg'?'v_gas':'v'}</text>{/if}
 </g>
 {/if}{/each}
 {#if collision}
 {@const maxEnergy=Math.max(values.E0??0,values.E1??0,values.loss??0,Number.MIN_VALUE)}
 {#each ['E0','E1','loss'] as key,index}{#if values[key]!==undefined}<g class:muted={related([key,'m1','m2',...(key==='E0'?['v1','v2']:key==='E1'?['w1','w2']:['e','v1','v2'])])}><text x="25" y={222+index*35}>{key==='E0'?'E₀':key==='E1'?'E₁':'Eₗₒₛₛ'}</text><rect x="95" y={210+index*35} width={330*values[key]/maxEnergy} height="16" fill="var(--color-accent)"/></g>{/if}{/each}
 {/if}
 </svg>
 <div class="readouts">{#each arrows as arrow}{#if values[arrow.key]!==undefined}<Formula expression={`${arrow.key==='vg'?'v_{gas}':rocket?'v':({p1:'p_1',p2:'p_2',q1:"p'_1",q2:"p'_2"}[arrow.key])}=${resourceQuantity(values[arrow.key],rocket?'velocity':'momentum')}`} />{/if}{/each}</div>
 {#if collision}<div class="readouts">{#each ['E0','E1','loss'] as key}{#if values[key]!==undefined}<Formula expression={`${key==='loss'?'E_{loss}':key==='E0'?'E_{kin,0}':'E_{kin,1}'}=${resourceQuantity(values[key],'energy')}`}/>{/if}{/each}</div><p>{text('Energy bars share one relative scale: kinetic energy before, after and the amount converted to internal energy.')}</p>{/if}
 <p>{text(rocket?'Schematic geometry. Arrows show velocities in the same observer frame, normalized to their largest magnitude; they do not show relative exhaust speed u. Thrust and acceleration arrows indicate direction only. A known mass bar shows remaining and expelled fractions.':'Arrow lengths compare signed momenta on one common scale. Zero momentum has no arrow. Body positions and sizes are schematic.')}</p>
</figure>
<style>
 figure{max-width:38rem;margin:24px 0 0;padding:16px;background:var(--color-control);border-radius:var(--control-radius)}figcaption{font-size:.875rem;font-weight:600}svg{width:100%;height:auto;display:block}text{fill:var(--color-text);font-size:14px}.body{fill:none;stroke:var(--color-text);stroke-width:2}circle,.mass-remaining{fill:var(--color-accent)}.mass-expelled{fill:var(--color-text-muted)}.vector{fill:none;stroke:var(--color-accent);stroke-width:2}.muted text{fill:var(--color-diagram-muted)}.muted .body,.muted .vector{stroke:var(--color-diagram-muted)}.muted circle,.muted rect{fill:var(--color-diagram-muted)}.readouts{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:.8rem}p{font-size:.75rem;color:var(--color-text-muted);line-height:1.6}
</style>
