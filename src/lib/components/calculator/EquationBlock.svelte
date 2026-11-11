<script lang="ts">
  import { text } from '#lib/i18n/runtime.ts';
  import Formula from '../Formula.svelte';
  let { label, equations, conversion = false }: { label: string; equations: readonly string[]; conversion?: boolean } = $props();
</script>
<div class={conversion ? 'conversions' : 'result'}>{#if label}<span>{text(label)}</span>{/if}{#each equations as expression}<Formula {expression} wrap />{/each}</div>
