<script lang="ts">
  import { solveElectrical,type ElectricalResult } from '#lib/physics/electricity.ts';
  import { formatAxisLabel } from '#lib/visualization/axis-label.ts';
  import { electricalUi as text } from '#lib/i18n/runtime.ts';
  let { parallel,result }:{parallel:boolean;result:ElectricalResult}=$props();
  const values=$derived(result.status==='success'?result.values:{});
  const complete=$derived((values.R??0)>0&&(values.L??0)>0&&(values.C??0)>0);
  const R=$derived(complete?values.R:1),L=$derived(complete?values.L:1),C=$derived(complete?values.C:1);
  const f0=$derived(complete?1/(2*Math.PI*Math.sqrt(L*C)):1);
  const ratios=[.01,.1,1,10,100];
  const samples=$derived.by(()=>Array.from({length:161},(_,index)=>{
    const frequency=f0*10**(-2+4*index/160),sample=solveElectrical(parallel?'parallel-rlc':'series-rlc',{R,L,C,f:frequency});
    const Z=sample.status==='success'?sample.values.Z:R,phi=sample.status==='success'?sample.values.phi*180/Math.PI:0;
    return{x:58+300*index/160,magnitude:20*Math.log10(Z/R),phase:phi};
  }));
  const magnitudeLimit=$derived(Math.max(6,...samples.map(sample=>Math.abs(sample.magnitude))));
  const charts=$derived([
    {title:text.bodeMagnitudeDiagram,label:'20 log₁₀|Z/R| [dB]',values:samples.map(sample=>sample.magnitude),minimum:parallel?-magnitudeLimit:0,maximum:parallel?0:magnitudeLimit},
    {title:text.bodePhaseDiagram,label:'φZ [°]',values:samples.map(sample=>sample.phase),minimum:-90,maximum:90}
  ]);
  const frequencyLabel=(ratio:number)=>{if(!complete)return ratio===1?'f₀':`${ratio}f₀`;const v=formatAxisLabel(f0*ratio);return v.exponent===undefined?v.coefficient:`${v.coefficient}×10^${v.exponent}`;};
</script>
<div class="response-charts">
  {#each charts as chart}
    <figure><figcaption><strong>{chart.title}</strong></figcaption><svg viewBox="0 0 390 270" role="img" aria-label={chart.title}>
      {#each ratios as ratio,index}<line class="grid" x1={58+75*index} y1="24" x2={58+75*index} y2="220"/><text x={58+75*index} y="242" text-anchor="middle">{frequencyLabel(ratio)}</text>{/each}
      {#each [0,.25,.5,.75,1] as fraction}<line class="grid" x1="58" y1={24+196*fraction} x2="358" y2={24+196*fraction}/><text x="50" y={28+196*fraction} text-anchor="end">{(chart.maximum-fraction*(chart.maximum-chart.minimum)).toPrecision(3)}</text>{/each}
      <line class="axis" x1="58" y1="220" x2="365" y2="220"/><line class="axis" x1="58" y1="220" x2="58" y2="16"/><text class="axis-label" x="58" y="15">{chart.label}</text><text class="axis-label" x="358" y="263" text-anchor="end">f [Hz]</text>
      <polyline class="curve" points={chart.values.map((value,index)=>`${samples[index].x},${24+196*(1-Math.max(0,Math.min(1,(value-chart.minimum)/(chart.maximum-chart.minimum))))}`).join(' ')}/>
    </svg><p>{complete?text.calculated:text.schematic}</p></figure>
  {/each}
</div>
<style>
  .response-charts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px;max-width:var(--calculator-width)}figure{margin:0;padding:16px;background:var(--color-control);border-radius:8px;min-width:0}figcaption{font-size:.875rem;margin-bottom:8px}svg{display:block;width:100%;height:auto;overflow:visible}text{fill:var(--color-text-muted);font-size:10px}.axis-label{font-size:11px}.grid{stroke:var(--color-text-muted);stroke-opacity:.15}.axis{stroke:var(--color-text-muted)}.curve{fill:none;stroke:var(--color-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}p{margin:8px 0 0;font-size:.75rem;color:var(--color-text-muted)}@media(max-width:44rem){.response-charts{grid-template-columns:1fr}}
</style>
