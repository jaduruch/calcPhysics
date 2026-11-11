<script lang="ts">
  import { solveElectrical,type ElectricalModelId,type ElectricalResult } from '#lib/physics/electricity.ts';
  import { formatAxisLabel } from '#lib/visualization/axis-label.ts';
  import { electricalUi as text } from '#lib/i18n/runtime.ts';
  let { modelId,result }:{modelId:ElectricalModelId;result:ElectricalResult}=$props();
  const calculated=$derived(result.status==='success'&&result.values.fc>0);
  const fc=$derived(result.status==='success'&&result.values.fc>0?result.values.fc:1);
  const ratios=[.01,.1,1,10,100];
  const samples=$derived.by(()=>Array.from({length:161},(_,index)=>{
    const exponent=-2+4*index/160,frequency=fc*10**exponent;
    const sample=solveElectrical(modelId,{fc,f:frequency,Uin:1});
    return {x:58+300*index/160,attenuation:sample.status==='success'?sample.values.attenuation:0,phase:sample.status==='success'?sample.values.phi*180/Math.PI:0};
  }));
  const highPass=$derived(modelId.endsWith('high-pass'));
  const charts=$derived([
    {title:text.bodeMagnitudeDiagram,label:'20 log₁₀|H| [dB]',values:samples.map(sample=>-sample.attenuation),minimum:-40,maximum:0},
    {title:text.bodePhaseDiagram,label:'φ [°]',values:samples.map(sample=>sample.phase),minimum:highPass?0:-90,maximum:highPass?90:0}
  ]);
  const frequencyLabel=(ratio:number)=>{
    if(!calculated)return ratio===1?'f_c':`${ratio}f_c`;
    const formatted=formatAxisLabel(fc*ratio);return formatted.exponent===undefined?formatted.coefficient:`${formatted.coefficient}×10^${formatted.exponent}`;
  };
</script>
<div class="filter-charts">
  {#each charts as chart}
    <figure>
      <figcaption><strong>{chart.title}</strong></figcaption>
      <svg viewBox="0 0 390 270" role="img" aria-label={chart.title}>
        {#each ratios as ratio,index}<line class="grid" x1={58+75*index} y1="24" x2={58+75*index} y2="220"/><text x={58+75*index} y="242" text-anchor="middle">{frequencyLabel(ratio)}</text>{/each}
        {#each [0,.25,.5,.75,1] as fraction}<line class="grid" x1="58" y1={24+196*fraction} x2="358" y2={24+196*fraction}/><text x="50" y={28+196*fraction} text-anchor="end">{(chart.maximum-fraction*(chart.maximum-chart.minimum)).toPrecision(3)}</text>{/each}
        <line class="axis" x1="58" y1="220" x2="365" y2="220"/><line class="axis" x1="58" y1="220" x2="58" y2="16"/>
        <text class="axis-label" x="58" y="15" text-anchor="start">{chart.label}</text><text class="axis-label" x="358" y="263" text-anchor="end">f [Hz]</text>
        <polyline class="curve" points={samples.map((sample,index)=>`${sample.x},${24+196*(1-Math.max(0,Math.min(1,(chart.values[index]-chart.minimum)/(chart.maximum-chart.minimum))))}`).join(' ')}/>
      </svg>
      <p>{calculated?text.calculated:text.schematic}</p>
    </figure>
  {/each}
</div>
<style>
  .filter-charts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px;max-width:var(--calculator-width)}
  figure{margin:0;padding:16px;background:var(--color-control);border-radius:8px;min-width:0}figcaption{font-size:.875rem;margin-bottom:8px}svg{display:block;width:100%;height:auto;overflow:visible}text{fill:var(--color-text-muted);font-size:10px}.axis-label{font-size:11px}.grid{stroke:var(--color-text-muted);stroke-opacity:.15}.axis{stroke:var(--color-text-muted);stroke-width:1}.curve{fill:none;stroke:var(--color-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}p{margin:8px 0 0;font-size:.75rem;color:var(--color-text-muted)}
  @media(max-width:44rem){.filter-charts{grid-template-columns:1fr}}
</style>
