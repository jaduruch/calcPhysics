<script lang="ts">
 import RangeSlider from '../ui/RangeSlider.svelte';
 import type {RigidMode,Shape,Values} from '#lib/physics/mechanics/rigid-body.ts';
 import {rigidGeometry} from '#lib/visualization/rigid-body.ts';
 import {rigidFields,rigidShapes} from '#lib/content/rigid-body.ts';
 import {formatMeasurement} from '#lib/calculators/quantities.ts';
 import {unitGroups} from '#lib/physics/units.ts';
 import {text} from '#lib/i18n/runtime.ts';
 let {mode,shape,values,active}:{mode:RigidMode;shape:Shape;values:Values;active:string|null}=$props();
 const id=$props.id();
 let phase=$state(25);
 const geometry=$derived(rigidGeometry(mode==='inertia'?shape:'cylinder',values,phase));
 const color=(keys:string[])=>active&&!keys.includes(active)?'var(--color-diagram-muted)':'var(--color-text)';
 const label=(key:string)=>{const f=rigidFields[mode].find(f=>f.id===key);if(!f)return '';const value=values[key];if(value===undefined)return `${f.symbol.replaceAll('\\','')} —`;const q=formatMeasurement(value,unitGroups[f.kind].si);return `${f.symbol.replaceAll('\\','')} = ${q.number} ${q.prefix}${unitGroups[f.kind].si}`;};
 const rotationKeys=$derived(mode==='inertia'?['I0','IA','m','R','r','l','a','b']:['I','w','L','M','alpha','Er']);
</script>
<div class="rigid-diagram">
 <p class="status">{text(mode==='inertia'?'View along the centroidal rotation axis. Unknown dimensions are schematic.':'Rotation about the center of mass. Arrows show directions; their lengths are normalized.')}</p>
 <svg viewBox="0 0 560 340" role="img" aria-label={text(mode==='inertia'?'Body projection with centroidal and parallel shifted axes':'Rigid-body rotation, translation and energy distribution')}>
 <title>{text(mode==='inertia'?'Body projection with centroidal and parallel shifted axes':'Rigid-body rotation, translation and energy distribution')}</title>
 <g transform="translate(245 145)">
 <g stroke={color(rotationKeys)} fill="none" stroke-width="2">
 {#if mode==='inertia'&&(shape==='rod'||shape==='cuboid')}
 <rect x={-geometry.width/2} y={-geometry.height/2} width={geometry.width} height={geometry.height} rx="2"/>
 {:else}
 <ellipse rx={geometry.radius} ry={geometry.height/2}/>
 {#if mode==='inertia'&&(shape==='tube'||shape==='ring'||shape==='shell')}
 <ellipse rx={geometry.innerRadius??geometry.radius*.9} ry={geometry.innerRadius??geometry.height*.45} stroke-dasharray={geometry.innerRadius===undefined?'4 4':undefined}/>
 {/if}
 {#if mode==='inertia'&&shape==='cone'}<circle r={geometry.radius*.5} stroke-dasharray="3 5"/>{/if}
 {/if}
 </g>
 <g stroke={color(mode==='inertia'?['I0','m']:['I','w','L','Er'])} fill="none" stroke-width="2"><circle r="5"/><path d="M -9 0 H 9 M 0 -9 V 9"/></g>
 <text x="-14" y="-15" text-anchor="end" fill={color(mode==='inertia'?['I0']:['I'])}>{mode==='inertia'?'S, I₀':'S, I'}</text>
 {#if mode==='inertia'}
 {#if geometry.offset!==undefined}
 <g stroke={color(['d','IA'])} fill="none" stroke-width="2"><circle cx={geometry.offset} r="7"/><path d={`M ${geometry.offset-5} -5 l 10 10 M ${geometry.offset-5} 5 l 10 -10`}/><path d={`M 0 ${geometry.height/2+18} H ${geometry.offset}`}/></g>
 <text x={geometry.offset+12} y="18" fill={color(['IA','d'])}>A</text>
 <text x={geometry.offset/2} y={geometry.height/2+38} text-anchor="middle" fill={color(['d'])}>{label('d')}</text>
 {/if}
 <g stroke={color(shape==='rod'?['l','m','I0']:shape==='cuboid'?['a','b','m','I0']:['R','r','m','I0'])} fill="none">
 <path d={`M 0 0 L ${geometry.marker.x} ${geometry.marker.y}`} stroke-dasharray="4 4"/>
 </g>
 {#if shape==='rod'||shape==='cuboid'}
 <g stroke={color(shape==='rod'?['l']:['a'])} fill="none"><path d={`M ${-geometry.width/2} ${-geometry.height/2-10} H ${geometry.width/2}`}/></g>
 <text x="0" y={-geometry.height/2-17} text-anchor="middle" fill={color(shape==='rod'?['l']:['a'])}>{shape==='rod'?'l':'a'}</text>
 {#if shape==='cuboid'}<g stroke={color(['b'])}><path d={`M ${-geometry.width/2-12} ${-geometry.height/2} V ${geometry.height/2}`}/></g><text x={-geometry.width/2-20} y="0" text-anchor="end" fill={color(['b'])}>b</text>{/if}
 {:else if shape!=='general'}
 <g stroke={color(['R'])} fill="none"><path d={`M 0 0 H ${geometry.radius}`}/></g><text x={geometry.radius*.65} y="-8" fill={color(['R'])}>R</text>
 {#if shape==='tube'}<g stroke={color(['r'])}><path d={`M 0 0 V ${-(geometry.innerRadius??geometry.radius*.5)}`} stroke-dasharray={geometry.innerRadius===undefined?'3 4':undefined}/></g><text x="8" y={-(geometry.innerRadius??geometry.radius*.5)*.65} fill={color(['r'])}>r</text>{/if}
 {/if}
 <text x="0" y={-geometry.height/2-43} text-anchor="middle" fill={color(rotationKeys)}>{text(rigidShapes.find(s=>s.id===shape)!.label)}</text>
 {:else}
 <g stroke={color(['w','Er','L'])} fill="none" stroke-width="3">
 {#if values.w!==undefined&&values.w!==0}<path d="M -60 -85 A 105 105 0 0 1 90 -50"/>{#if values.w>0}<path d="M 78 -53 L 90 -50 L 90 -63"/>{:else}<path d="M -47 -87 L -60 -85 L -57 -72"/>{/if}{/if}
 <path d={`M 0 0 L ${geometry.marker.x} ${geometry.marker.y}`} stroke-dasharray="4 4"/>
 </g>
 {#if mode==='energy'&&values.v!==undefined&&values.v!==0}
 <g stroke={color(['v','m','Et'])} stroke-width="3" fill="none"><path d={`M 0 125 H ${Math.sign(values.v)*100}`}/><path d={`M ${Math.sign(values.v)*88} 118 L ${Math.sign(values.v)*100} 125 L ${Math.sign(values.v)*88} 132`}/></g>
 {/if}
 {#if mode==='momentum'}
 {#each ['L','M','alpha'] as key,index}
 {#if values[key]!==undefined&&values[key]!==0}<g transform={`translate(${155+index*40} -30)`} stroke={color([key,'I'])} fill="none" stroke-width="2"><circle r="10"/>{#if values[key]>0}<circle r="2" fill={color([key,'I'])}/>{:else}<path d="M -5 -5 L 5 5 M -5 5 L 5 -5"/>{/if}</g><text x={155+index*40} y="-6" text-anchor="middle" fill={color([key,'I'])}>{key==='alpha'?'α':key}</text>{/if}
 {/each}
 {/if}
 {/if}
 </g>
 </svg>
 <label class="phase-label" for={`${id}-phase`}>{text('Reference marker angle')}<RangeSlider id={`${id}-phase`} label={text('Reference marker angle')} min={0} max={360} step={1} value={phase} valueText={`${phase}°`} onvalue={value=>phase=value}/></label>
 <div class="diagram-values">{#each rigidFields[mode] as f}{#if values[f.id]!==undefined}<span style:color={color([f.id])}>{text(f.name)}: {label(f.id).split(' = ')[1]}</span>{/if}{/each}</div>
 {#if mode==='energy'&&geometry.energyRatio!==undefined}<div class="energy-bars" role="img" aria-label={text('Fraction of rotational and translational kinetic energy')}><span style:width={`${100*geometry.energyRatio}%`} style:background={color(['Er','E'])}></span><span style:flex="1" style:background={active&&!['Et','E'].includes(active)?'var(--color-diagram-muted)':'var(--color-accent)'}></span></div><p class="status">{text('Rotational fraction')} {(100*geometry.energyRatio).toPrecision(3)}% · {text('Translational fraction')} {(100*(1-geometry.energyRatio)).toPrecision(3)}%</p>{/if}
 {#if mode==='momentum'}<p class="status">{text('Dot: positive axial component toward you. Cross: negative axial component away from you. Zero and unknown components have no arrow.')}</p>{/if}
</div>
<style>
 .rigid-diagram{max-width:640px;margin:24px auto 0}.rigid-diagram svg{display:block;width:100%;height:auto;overflow:visible}.rigid-diagram text{font:13px var(--font-sans, sans-serif)}.phase-label{display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:.8125rem}.phase-label :global(.range-control){flex:1;min-width:140px;max-width:100%}.diagram-values{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:.8125rem;margin:12px 0}.energy-bars{height:14px;display:flex;gap:3px}.energy-bars span{display:block;min-width:0}
</style>
