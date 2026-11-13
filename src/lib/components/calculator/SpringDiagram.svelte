<script lang="ts">
 import type {Values} from '#lib/physics/resources/solver.ts';
 import QuantitySymbol from '../ui/QuantitySymbol.svelte';
 import {formatMeasurement} from '#lib/calculators/quantities.ts';
 import {unitGroups} from '#lib/physics/units.ts';

 import {springOrbitScene} from '#lib/visualization/spring-orbit.ts';
 import {springOscillatorFields,circularSpringFields} from '#lib/content/spring-models.ts';
 import {text} from '#lib/i18n/runtime.ts';
 let {values,focused=null,circular=false}:{values:Values;focused?:string|null;circular?:boolean}=$props();
 const id=$props.id();
 const scene=$derived(springOrbitScene(values));
 const fields=$derived(circular?circularSpringFields:springOscillatorFields);
 const wave=Array.from({length:101},(_,i)=>`${i?'L':'M'}${50+i*3} ${220-30*Math.cos(i/100*4*Math.PI)}`).join(' ');
</script>
<figure>
 <figcaption>{text(circular?'Circling Spring Pendulum':'Spring Oscillator')}</figcaption>
 <svg viewBox={circular?"0 0 420 250":"0 0 420 300"} role="img" aria-labelledby={`${id}-title ${id}-description`}>
 <title id={`${id}-title`}>{text(circular?'Circling Spring Pendulum':'Spring Oscillator')}</title><desc id={`${id}-description`}>{text(circular?'Schematic circular orbit: the known angle is drawn to scale; spring length is normalized. Force arrows use one shared scale; the centripetal component is dashed and is not an additional force.':'Schematic spring at equilibrium and normalized oscillation over two periods. No amplitude or spring length is assumed.')}</desc>
 {#if circular}
 <path d="M180 30H240 M210 30V230" class="axis"/>
 <ellipse cx="210" cy={scene.mass.y} rx={scene.radius} ry={scene.radius*.2} class="orbit" class:muted={focused!==null&&!['R','v','omega','T','f'].includes(focused)}/>
 <g class:muted={focused!==null&&!['k','l','L','x','alpha'].includes(focused)}><path d={scene.spring}/><text x={210+(scene.mass.x-210)/2+12} y={30+(scene.mass.y-30)/2-10}>L</text><path d={`M210 65A35 35 0 0 0 ${210+35*Math.sin(values.alpha??Math.PI/6)} ${30+35*Math.cos(values.alpha??Math.PI/6)}`} class="axis"/><text x="225" y="60">α</text></g>
 <g class:muted={focused!==null&&focused!=='m'}><circle cx={scene.mass.x} cy={scene.mass.y} r="7"/><text x={scene.mass.x+12} y={scene.mass.y+4}>m</text></g>
 <g class:muted={focused!==null&&focused!=='R'}><path d={`M210 ${scene.mass.y+22}H${scene.mass.x}`} class="axis"/><text x={210+scene.radius/2} y={scene.mass.y+40}>R</text></g>
 {#each scene.arrows as arrow}<g class:muted={focused!==null&&![arrow.key,'m','g'].includes(focused)}>
 <path d={`M${scene.mass.x} ${scene.mass.y}L${arrow.x} ${arrow.y}`} class:component={arrow.key==='Fc'}/><polyline points={arrow.head}/><text x={arrow.key==='Fs'?scene.mass.x+12:arrow.key==='Fg'?scene.mass.x+12:arrow.x-12} y={arrow.key==='Fs'?scene.mass.y-25:arrow.key==='Fg'?arrow.y+14:arrow.y+18}>{arrow.label}</text>
 </g>{/each}
 {:else}
 <path d="M170 20H250" class="support"/>
 <g class:muted={focused!==null&&focused!=='k'}><path d="M210 20V35L195 42L225 52L195 62L225 72L195 82L225 92L195 102L210 110V120"/><text x="240" y="78">k</text></g>
 <g class:muted={focused!==null&&focused!=='m'}><rect x="188" y="120" width="44" height="32" rx="4"/><text x="210" y="141" text-anchor="middle">m</text></g>
 <g class:muted={focused!==null&&!['T','f','omega'].includes(focused)}>
 <path d="M50 180V260H365 M50 220H350" class="axis"/><path d={wave}/><text x="15" y="175">x/A</text><text x="340" y="280">t/T</text><text x="50" y="278">0</text><text x="195" y="278">1</text><text x="345" y="278">2</text>
 </g>
 {/if}
 </svg>
 <div class="legend">{#each fields.filter(f=>(circular?['omega','R','alpha']:['T','f','omega']).includes(f.id)) as field}{#if values[field.id]!==undefined}{@const measurement=formatMeasurement(field.id==='alpha'?values[field.id]*180/Math.PI:values[field.id],field.id==='alpha'?'°':unitGroups[field.kind].si,false)}<span><QuantitySymbol symbol={field.symbol}/> = {measurement.number} {field.id==='alpha'?'°':unitGroups[field.kind].si}</span>{/if}{/each}</div>
 <p>{text(circular?'Schematic circular orbit: the known angle is drawn to scale; spring length is normalized. Force arrows use one shared scale; the centripetal component is dashed and is not an additional force.':'Schematic spring at equilibrium and normalized oscillation over two periods. No amplitude or spring length is assumed.')}</p>
 {#if !circular&&values.T===undefined}<p>{text('The period is not yet determined.')}</p>{/if}
</figure>
<style>
 .legend{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:.8125rem}.legend span{white-space:nowrap}
 figure{max-width:30rem;margin:24px 0 0;padding:16px;border-radius:var(--control-radius);background:var(--color-control)}figcaption{font-size:.875rem;font-weight:600}svg{width:100%;height:auto;display:block}path,polyline,ellipse{fill:none;stroke:var(--color-accent);stroke-width:2}circle{fill:var(--color-text)}.orbit{stroke-dasharray:4 4}.component{stroke-dasharray:4 4}rect{fill:var(--color-surface);stroke:var(--color-text);stroke-width:2}text{fill:var(--color-text);font-size:13px}.support,.axis{stroke:var(--color-text-muted);stroke-width:1}.muted path,.muted rect,.muted polyline,ellipse.muted{stroke:var(--color-diagram-muted)}.muted circle,.muted text{fill:var(--color-diagram-muted)}p{font-size:.75rem;color:var(--color-text-muted)}
</style>
