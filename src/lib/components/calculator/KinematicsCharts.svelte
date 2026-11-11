<script lang="ts">
 import type {KinematicsModelId} from '#lib/content/kinematics.ts';
 import type {MotionScenario} from '#lib/physics/mechanics/accelerated-motion.ts';
 import {solveAcceleratedMotion} from '#lib/physics/mechanics/accelerated-motion.ts';
 import {solveVerticalThrow,solveHorizontalThrow,solveObliqueThrow} from '#lib/physics/mechanics/projectiles.ts';
 import {kinematicsChartData} from '#lib/visualization/kinematics.ts';
 import {kinematicsUi as text} from '#lib/i18n/runtime.ts';
 import MotionChart from './MotionChart.svelte';
 let {modelId,scenario}:{modelId:KinematicsModelId;scenario:MotionScenario|null}=$props();
 const preview=$derived(modelId==='accelerated-motion'?solveAcceleratedMotion({s0:0,v0:0,a:1,t:1}):modelId==='vertical-throw'?solveVerticalThrow({y0:0,v0:1,g:1}):modelId==='oblique-throw'?solveObliqueThrow({y0:0,v0:1,alpha:Math.PI/4,g:1}):solveHorizontalThrow({h:1,vx:1,g:1}));
 const data=$derived(kinematicsChartData(scenario??(preview.status==='success'?preview.scenarios[0]:null)!));
 const schematic=$derived(!scenario);
 const description=(value:string)=>schematic?text.schematic:value;
</script>
<section class="motion-charts" aria-label={text.charts}>
 <div class="motion-chart-grid">
  {#if modelId==='horizontal-throw'||modelId==='oblique-throw'}
   <MotionChart shape="position" title="y(x)" yLabel="y [m]" xLabel="x [m]" times={data.horizontal} values={data.positions} xBounds={{min:Math.min(0,...data.horizontal),max:Math.max(0,...data.horizontal)}} {schematic} description={description(text.trajectoryDescription)}/>
   <MotionChart shape="position" title="x(t)" yLabel="x [m]" times={data.times} values={data.horizontal} {schematic} description={description(text.horizontalDescription)}/>
  {/if}
  <MotionChart shape="position" title={modelId==='accelerated-motion'?'s(t)':'y(t)'} yLabel={modelId==='accelerated-motion'?'s [m]':'y [m]'} times={data.times} values={data.positions} {schematic} description={description(modelId==='accelerated-motion'?text.positionDescription:text.heightDescription)}/>
  <MotionChart shape="velocity" title={modelId==='accelerated-motion'?'v(t)':'vᵧ(t)'} yLabel={modelId==='accelerated-motion'?'v [m/s]':'vᵧ [m/s]'} times={data.times} values={data.velocities} {schematic} description={description(text.velocityDescription)}/>
 </div>
</section>
