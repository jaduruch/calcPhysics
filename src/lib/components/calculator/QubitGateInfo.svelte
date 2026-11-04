<script lang="ts">
  import { onMount } from 'svelte';
  import { qubitGates } from '#lib/content/quantum.ts';
  import type { GateId } from '#lib/physics/quantum/qubit.ts';
  import { qubitUi as text } from '#lib/i18n/en.ts';
  import InfoButton from '../ui/InfoButton.svelte';
  import Formula from '../Formula.svelte';
  let { label, gates }: { label: string; gates: readonly GateId[] } = $props();
  const id = $props.id();
  let expanded = $state(false);
  let root: HTMLDivElement;
  onMount(() => {
    const card = root.closest('details');
    const reset = () => { if (!card?.open) expanded = false; };
    card?.addEventListener('toggle', reset);
    return () => card?.removeEventListener('toggle', reset);
  });
</script>
<div class="gate-info" bind:this={root}>
  <div class="gate-heading"><span>{label}</span><InfoButton {expanded} controls={`${id}-matrices`} label={`${expanded ? text.hideMatrices : text.showMatrices}: ${label}`} onclick={() => expanded = !expanded} /></div>
  <div id={`${id}-matrices`} class="gate-matrices" hidden={!expanded}>
    {#each gates as id}
      <Formula expression={qubitGates.find(gate => gate.id === id)!.matrix} />
    {/each}
  </div>
</div>
<style>
  .gate-info { min-width: 0; }
  .gate-heading { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; font-size: .8125rem; color: var(--color-text-muted); }
  .gate-matrices { min-width: 0; }
  .gate-matrices :global(.formula) { min-width: 0; padding: 0; margin: 8px 0 16px; background: transparent; }
  .gate-matrices :global(.katex-display) { text-align: left; margin: 0; }
</style>
