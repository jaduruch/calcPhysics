<script lang="ts">
  import { models } from '#lib/content/topics.ts';
  import { ui } from '#lib/i18n/en.ts';
  import Formula from './Formula.svelte';
  import UniformMotionCalculator from './calculator/UniformMotionCalculator.svelte';
  let { model, index }: { model: (typeof models)[number]; index: number } = $props();
  let showTheory = $state(false);
</script>

<details class="motion-card">
  <summary>
    <span class="topic-number">0{index + 1}</span>
    <h3>{model.title}</h3>
    <span class="chevron" aria-hidden="true"></span>
  </summary>
  <div class="motion-content">
    <div class="theory-heading">
      <button class="info-toggle" type="button" aria-label={`${showTheory ? ui.hideTheory : ui.showTheory}: ${model.title}`} aria-expanded={showTheory} aria-controls={`${model.id}-theory`} title={showTheory ? ui.hideTheory : ui.showTheory} onclick={() => showTheory = !showTheory}><span aria-hidden="true">{showTheory ? '✕' : 'ⓘ'}</span></button>
    </div>
    <section class="theory-panel" id={`${model.id}-theory`} hidden={!showTheory} aria-label={ui.theory}>
      <div class="theory-layout">
        <div class="variables-section">
          <h5>{ui.variables}</h5>
          <dl class="variables-list">
            {#each model.variables as variable}
              <div class="variable-row">
                <dt><span class="variable-symbol">{variable.symbol}</span><span class="variable-name">{variable.name}</span></dt>
                <dd><strong>{variable.unit}</strong><span>{variable.unitName}</span></dd>
              </div>
            {/each}
          </dl>
        </div>
        <div class="formulas-section">
          <h5>{ui.keyFormulas}</h5>
          {#each model.formulas as formula}
            <div class="formula-row"><span class="formula-label">{formula.label}</span><Formula expression={formula.expression} /></div>
          {/each}
        </div>
      </div>
      <div class="derivative-note">
        <p>{ui.velocityDerivative}</p>
        <Formula expression={String.raw`v(t) = \dot{s}(t) = \mathrm{constant}`} />
      </div>
    </section>
    <section class="calculate-panel" aria-labelledby={`${model.id}-calculate-heading`}>
      <div class="panel-heading"><h4 id={`${model.id}-calculate-heading`}>{ui.calculate}</h4></div>
      <UniformMotionCalculator />
    </section>
  </div>
</details>

<style>
  .motion-card { background: var(--color-surface); border-radius: var(--radius); min-width: 0; }
  summary { display: flex; align-items: center; gap: 16px; padding: 20px; min-height: 72px; cursor: pointer; list-style: none; border-radius: var(--radius); }
  summary::-webkit-details-marker { display: none; }
  summary h3 { margin: 0; font-size: 1.125rem; font-weight: 600; letter-spacing: -.02em; }
  .chevron { width: 8px; height: 8px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); margin: 0 4px 4px auto; flex-shrink: 0; }
  details[open] .chevron { transform: rotate(225deg); margin-bottom: -4px; }
  .motion-content { padding: 0 20px 20px; }
  .theory-heading { display: flex; align-items: center; justify-content: flex-start; gap: 8px; }
  .info-toggle { display: inline-flex; align-items: center; justify-content: flex-start; background: none; border: none; color: var(--color-text-muted); font-size: 16px; padding: 0; line-height: 1; min-width: 44px; min-height: 44px; flex-shrink: 0; cursor: pointer; }
  .info-toggle:hover, .info-toggle[aria-expanded="true"] { color: var(--color-text); }
  .theory-panel { padding: 8px 0 28px; }
  .derivative-note { max-width: 48rem; margin-top: 20px; }
  .derivative-note p { margin: 0; max-width: 70ch; font-size: .875rem; color: var(--color-text-muted); }
  .theory-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); max-width: 48rem; gap: 24px; }
  .theory-panel h5 { color: var(--color-text-muted); font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 10px; }
  .variables-list { margin: 0; }
  .variable-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; padding: 8px 0; }
  .variable-row dt { display: flex; align-items: baseline; gap: 12px; }
  .variable-symbol { min-width: 24px; font-family: Georgia, serif; font-style: italic; font-size: 1.2rem; }
  .variable-name { font-size: .875rem; text-transform: capitalize; }
  .variable-row dd { display: flex; flex-direction: column; margin: 0; font-size: .875rem; }
  .variable-row dd strong { font-weight: 500; }
  .variable-row dd > span { color: var(--color-text-muted); font-size: .75rem; }
  .formula-row { display: grid; grid-template-columns: 88px minmax(0, 1fr); align-items: center; gap: 8px; min-height: 52px; }
  .formula-label { color: var(--color-text-muted); font-size: .875rem; }
  .theory-panel :global(.formula) { min-width: 0; background: transparent; border-radius: 0; padding: 0; margin: 8px 0; }
  .theory-panel :global(.katex-display) { text-align: left; }
  @media (max-width: 56rem) { .theory-layout { grid-template-columns: 1fr; gap: 20px; } }
  .calculate-panel { background: var(--color-surface-raised); border-radius: 8px; padding: 16px; margin-top: 12px; }
  h4 { margin: 0; font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .panel-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
  @media (max-width: 40rem) {
    summary { padding: 16px; gap: 12px; }
    .motion-content { padding: 0 16px 16px; }
    summary h3 { font-size: 1rem; }
    .formula-row { grid-template-columns: 1fr; gap: 0; padding: 8px 0; }
  }
</style>
