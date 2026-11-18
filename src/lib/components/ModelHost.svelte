<script lang="ts">
  import { tick, untrack } from 'svelte';
  import { page } from '$app/state';
  import { linkedModelIndex } from '#lib/content/model-groups.ts';
  import type { ModelDefinition } from '#lib/content/model-types.ts';
  import { ui, text } from '#lib/i18n/runtime.ts';
  import ModelCard from './ModelCard.svelte';
  import ModelTheory from './ModelTheory.svelte';
  import ModelCalculator from './ModelCalculator.svelte';
  import ModelVariantSwitch from './ui/ModelVariantSwitch.svelte';
  let { model, index }: { model: ModelDefinition; index: number } = $props();
  let currentHash = $state('');
  let open = $state(false);
  let element = $state<HTMLDetailsElement>();
  let selected = $state(0);
  let visited = $state<number[]>([0]);
  const active = $derived(model.variants?.[selected]?.model ?? model);
  const displayed = $derived({ ...active, id: model.id, title: model.title });
  function select(value: number) {
    selected = value;
    if (!visited.includes(value)) visited = [...visited, value];
  }
  $effect(() => { currentHash = page.url.hash; });
  $effect(() => {
    const hash = currentHash;
    const position = linkedModelIndex(model, hash);
    if (position === null) return;
    untrack(() => select(position));
    open = true;
    void tick().then(() => {
      if (window.location.hash !== hash) return;
      element?.scrollIntoView({ block: 'start' });
      element?.querySelector('summary')?.focus({ preventScroll: true });
    });
  });
</script>
<svelte:window onhashchange={() => currentHash = window.location.hash} />
<ModelCard model={displayed} {index} bind:open bind:element>
  {#snippet calculator()}
    <noscript>
      {#each model.variants?.slice(1) ?? [] as variant}
        <section aria-label={text(variant.label)}><h4>{text(variant.label)}</h4><ModelTheory model={variant.model} /></section>
      {/each}
    </noscript>
    {#if model.variants}
      <ModelVariantSwitch options={model.variants.map(variant => text(variant.label))} value={selected} label={`${ui.calculate}: ${text(model.title)}`} onchange={select} />
      {#each model.variants as variant, position (variant.model.id)}
        {#if visited.includes(position)}
          <div hidden={selected !== position}><ModelCalculator model={variant.model} /></div>
        {/if}
      {/each}
    {:else}
      <ModelCalculator {model} />
    {/if}
  {/snippet}
</ModelCard>
