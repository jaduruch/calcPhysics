<script lang="ts">
  import type { ModelDefinition } from '#lib/content/model-types.ts';
  import { ui, text } from '#lib/i18n/runtime.ts';
  import QuantitySymbol from './ui/QuantitySymbol.svelte';
  import Formula from './Formula.svelte';
  let { model }: { model: ModelDefinition } = $props();
</script>
<div class="theory-content">
      <div class="theory-layout">
        <div class="variables-section">
          <h3>{ui.variables}</h3>
          <dl class="variables-list">
            {#each model.variables as variable}
              <div class="variable-row">
                <dt><span class="variable-symbol"><QuantitySymbol symbol={variable.symbol} subscript={variable.subscript}/></span><span class="variable-name">{text(variable.name)}</span></dt>
                <dd><strong>{variable.unit}</strong><span>{text(variable.unitName)}</span></dd>
              </div>
            {/each}
          </dl>
        </div>
        <div class="formulas-section">
          <h3>{ui.keyFormulas}</h3>
          {#each model.formulas as formula}
            <div class="formula-row"><span class="formula-label">{text(formula.label)}</span><Formula expression={formula.expression} /></div>
          {/each}
        </div>
      </div>
      {#each model.notes ?? [] as note}
        <div class="derivative-note"><p>{text(note.text)}</p>{#if note.expression}<Formula expression={note.expression} />{/if}</div>
      {/each}
      {#each model.references ?? [] as reference}<p class="theory-source"><a href={reference.url}>{text(reference.title)}</a></p>{/each}
</div>
<style>
  .derivative-note { max-width: var(--theory-width); margin-top: 20px; }
  .theory-source { margin-top: 16px; font-size: .75rem; color: var(--color-text-muted); }
  .derivative-note p { margin: 0; max-width: 70ch; font-size: .875rem; color: var(--color-text-muted); }
  .theory-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); max-width: var(--theory-width); gap: 24px; }
  .theory-content h3 { color: var(--color-text-muted); font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 10px; }
  .variables-list { margin: 0; }
  .variable-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; padding: 8px 0; }
  .variable-row dt { display: flex; align-items: baseline; gap: 12px; }
  .variable-symbol { flex-shrink: 0; min-width: 24px; font-family: Georgia, serif; font-style: italic; font-size: 1.2rem; }
  .variable-name { min-width: 0; overflow-wrap: anywhere; font-size: .875rem; text-transform: capitalize; }
  .variable-row dd { display: flex; flex-direction: column; margin: 0; font-size: .875rem; }
  .variable-row dd strong { font-weight: 500; }
  .variable-row dd > span { color: var(--color-text-muted); font-size: .75rem; }
  .formula-row { display: grid; grid-template-columns: 88px minmax(0, 1fr); align-items: center; gap: 8px; min-height: 52px; }
  .formula-label { overflow-wrap: anywhere; color: var(--color-text-muted); font-size: .875rem; }
  .theory-content :global(.formula) { min-width: 0; background: transparent; border-radius: 0; padding: 0; margin: 8px 0; }
  .theory-content :global(.katex-display) { text-align: left; }
  @media (max-width: 56rem) { .theory-layout { grid-template-columns: 1fr; gap: 20px; } }
  @media (max-width: 40rem) { .formula-row { grid-template-columns: 1fr; gap: 0; padding: 8px 0; } }
</style>
