<script lang="ts">
  import { ui, text } from '#lib/i18n/runtime.ts';
  import Formula from '../Formula.svelte';
  let { label, equations, conversion = false }: { label: string; equations: readonly string[]; conversion?: boolean } = $props();
</script>
{#if !conversion && equations.length}<div class="solution-label">{ui.stepByStepSolution}</div>{/if}
<div class={conversion ? 'conversions' : 'result'}>{#if label}<span>{text(label)}</span>{/if}{#each equations as expression}<Formula {expression} wrap />{/each}</div>

<style>
  .solution-label { font-size: .875rem; font-weight: 600; }
  :global(.solution-label) ~ .solution-label { display: none; }
</style>
