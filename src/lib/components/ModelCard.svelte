<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ModelDefinition } from '#lib/content/model-types.ts';
  import { ui, text } from '#lib/i18n/runtime.ts';
  import ModelTheory from './ModelTheory.svelte';
  import InfoButton from './ui/InfoButton.svelte';
  let { model, index, calculator, open = $bindable(false), element = $bindable() }: { model: ModelDefinition; index: number; calculator: Snippet; open?: boolean; element?: HTMLDetailsElement } = $props();
  let showTheory = $state(false);
  function resetTheoryOnClose(event: Event) {
    if (!(event.currentTarget as HTMLDetailsElement).open) showTheory = false;
  }
</script>

<details id={`model-${model.id}`} bind:this={element} bind:open class="motion-card" ontoggle={resetTheoryOnClose}>
  <summary>
    <span class="topic-number">{String(index + 1).padStart(2, '0')}</span>
    <h2 id={model.id}>{text(model.title)}</h2>
    <span class="chevron" aria-hidden="true"></span>
  </summary>
  <div class="motion-content">
    <div class="theory-heading">
      <InfoButton expanded={showTheory} controls={`${model.id}-theory`} label={`${showTheory ? ui.hideTheory : ui.showTheory}: ${text(model.title)}`} title={showTheory ? ui.hideTheory : ui.showTheory} onclick={() => showTheory = !showTheory} />
    </div>
    <section class="theory-panel" id={`${model.id}-theory`} hidden={!showTheory} aria-label={ui.theory}>
      <ModelTheory {model} />
    </section>
    <section class="calculate-panel" aria-labelledby={`${model.id}-calculate-heading`}>
      <div class="panel-heading"><h3 id={`${model.id}-calculate-heading`}>{ui.calculate}</h3></div>
      {@render calculator()}
    </section>
  </div>
</details>

<style>
  .motion-card { scroll-margin-top: 20px; background: var(--color-surface); border-radius: var(--radius); min-width: 0; }
  summary { display: flex; align-items: center; gap: 16px; padding: var(--model-padding); min-height: 72px; cursor: pointer; list-style: none; border-radius: var(--radius); }
  summary::-webkit-details-marker { display: none; }
  summary h2 { margin: 0; font-size: 1.125rem; font-weight: 600; letter-spacing: -.02em; }
  .chevron { width: 8px; height: 8px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); margin: 0 4px 4px auto; flex-shrink: 0; }
  details[open] .chevron { transform: rotate(225deg); margin-bottom: -4px; }
  .motion-content { padding: 0 var(--model-padding) var(--model-padding); }
  .theory-heading { display: flex; align-items: center; justify-content: flex-start; gap: 8px; }
  .theory-panel { padding: 8px 0 28px; }
  .calculate-panel { background: var(--color-surface-raised); border-radius: 8px; padding: 16px; margin-top: 12px; }
  h3 { margin: 0; font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .panel-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
  @media (max-width: 40rem) {
    summary { padding: var(--model-mobile-padding); gap: 12px; }
    .motion-content { padding: 0 var(--model-mobile-padding) var(--model-mobile-padding); }
    summary h2 { font-size: 1rem; }
  }
</style>
