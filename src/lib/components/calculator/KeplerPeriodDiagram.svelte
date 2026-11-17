<script lang="ts">
 import {keplerPeriodComparison} from '#lib/physics/mechanics/kepler-period.ts';
 import type {Values} from '#lib/physics/resources/solver.ts';
 import {text} from '#lib/i18n/runtime.ts';
 let {values,focused=null}:{values:Values;focused?:string|null}=$props();
 const id=$props.id(),scene=$derived(keplerPeriodComparison(values));
 const point=(p:{x:number;y:number})=>({x:55+320*p.x,y:270-210*p.y});
 const curve=$derived(scene.curve.map((p,i)=>{const q=point(p);return `${i?'L':'M'}${q.x} ${q.y}`;}).join(' '));
 const firstMuted=$derived(focused!==null&&!['T','a','periodRatio','axisRatio'].includes(focused));
 const secondMuted=$derived(focused!==null&&!['T2','a2','periodRatio','axisRatio'].includes(focused));
</script>
<figure><figcaption>{text('Third law — relative orbit comparison')}</figcaption>
 <svg viewBox="0 0 440 360" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
 <title id={`${id}-title`}>{text('Third law — relative orbit comparison')}</title><desc id={`${id}-desc`}>{text(scene.known?'Periods scale with the three-halves power of the semi-major axes. Both axes are normalized to the larger reference orbit; no unknown absolute scale is assumed.':'Schematic proportionality T ∝ a^(3/2). Enter orbit measurements to show the known relative positions.')} {#if scene.masses}{text('The bar shows each individual mass as a fraction of the total mass.')}{/if}</desc>
 <g class:muted={focused!==null&&!['T','T2','periodRatio'].includes(focused)}><path d="M55 40V270 M55 40l-4 8m4-8l4 8" class="axis"/><text x="12" y="28">{#if scene.known}T/T<tspan baseline-shift="sub" font-size="9">{text('ref')}</tspan>{:else}T{/if}</text></g>
 <g class:muted={focused!==null&&!['a','a2','axisRatio'].includes(focused)}><path d="M55 270H395 M395 270l-8-4m8 4l-8 4" class="axis"/><text x="350" y="305">{#if scene.known}a/a<tspan baseline-shift="sub" font-size="9">{text('ref')}</tspan>{:else}a{/if}</text></g>
 <path d={curve} class="curve" class:muted={focused!==null&&!['M','centralMass','companionMass','periodRatio','axisRatio'].includes(focused)}/>
 {#if scene.known}
 <text x="39" y="287">0</text><text x="39" y="63">1</text><text x="370" y="287">1</text>
 {#if scene.first}{@const p=point(scene.first)}<g class:muted={firstMuted}><circle cx={p.x} cy={p.y} r="5"/><text x={p.x-16} y={p.y-12}>1</text></g>{/if}
 {#if scene.second}{@const p=point(scene.second)}<g class:muted={secondMuted}><circle cx={p.x} cy={p.y} r="5"/><text x={p.x+9} y={p.y+18}>2</text></g>{/if}
 {/if}
 {#if scene.masses}
 <g class:muted={focused!==null&&!['M','centralMass'].includes(focused)}><rect x="55" y="325" width={320*scene.masses[0]} height="14"/><text x="55" y="321">M</text></g>
 <g class:muted={focused!==null&&!['M','companionMass'].includes(focused)}><rect x={55+320*scene.masses[0]} y="325" width={320*scene.masses[1]} height="14" class="companion"/><text x="380" y="337">m</text></g>
 {/if}
 </svg>
 <p>{text(scene.known?'Periods scale with the three-halves power of the semi-major axes. Both axes are normalized to the larger reference orbit; no unknown absolute scale is assumed.':'Schematic proportionality T ∝ a^(3/2). Enter orbit measurements to show the known relative positions.')}</p>
</figure>
<style>
 figure{max-width:30rem;margin:24px 0 0;padding:16px;border-radius:var(--control-radius);background:var(--color-control)}figcaption{font-size:.875rem;font-weight:600}svg{display:block;width:100%;height:auto}.axis{fill:none;stroke:var(--color-text);stroke-width:1.5}.curve{fill:none;stroke:var(--color-accent);stroke-width:2}circle,rect{fill:var(--color-accent)}.companion{fill:var(--color-text-muted)}text{fill:var(--color-text);font-size:13px}.muted .axis{stroke:var(--color-diagram-muted)}.muted{stroke:var(--color-diagram-muted)}g.muted circle,g.muted rect{fill:var(--color-diagram-muted)}g.muted text{fill:var(--color-diagram-muted)}p{font-size:.75rem;color:var(--color-text-muted);line-height:1.6}
</style>
