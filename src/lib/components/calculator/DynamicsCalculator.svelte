<script lang="ts">
 import {dynamicsGroups} from '#lib/content/dynamics.ts';
 import {text,ui} from '#lib/i18n/runtime.ts';
 import InclinedPlaneCalculator from './InclinedPlaneCalculator.svelte';
 import ResourceCalculator from './ResourceCalculator.svelte';
 let {modelId}:{modelId:string}=$props();
 const group=$derived(dynamicsGroups.find(group=>group.id===modelId)!);
 let selected=$state('');
 const active=$derived(selected||modelId);
</script>
<div class="calculator-modes" role="group" aria-label={ui.calculate}>
 {#each group.modes as [id,label]}<button type="button" aria-pressed={active===id} onclick={()=>selected=id}>{text(label)}</button>{/each}
</div>
{#each group.modes as [id]}
 <div hidden={active!==id}>
  {#if id==='inclined-plane'}<InclinedPlaneCalculator/>{:else}<ResourceCalculator modelId={id}/>{/if}
 </div>
{/each}
