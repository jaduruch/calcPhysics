<script lang="ts">
  import ToggleSwitch from './ToggleSwitch.svelte';
  let { options, value, label, onchange }: {
    options: readonly string[]; value: number; label: string; onchange: (value: number) => void;
  } = $props();
  const group = $props.id();
</script>

<div class="model-variant-switch">
  {#if options.length === 2}
    <ToggleSwitch checked={value === 1} {label} offLabel={options[0]} onLabel={options[1]} onchange={checked => onchange(checked ? 1 : 0)} />
  {:else}
    <fieldset class="variant-options">
      <legend>{label}</legend>
      {#each options as option, index}
        <label class:active={value === index}>
          <input type="radio" name={group} value={index} checked={value === index} onchange={() => onchange(index)} />
          <span>{option}</span>
        </label>
      {/each}
    </fieldset>
  {/if}
</div>

<style>
  .model-variant-switch { margin-bottom: 20px; max-width: 42rem; }
  .model-variant-switch :global(.segmented-toggle) { width: 100%; }
  .variant-options { display: flex; flex-wrap: wrap; gap: 2px; margin: 0; padding: 2px; border: 0; border-radius: var(--control-radius); background: var(--color-control); min-width: 0; }
  legend, input { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  label { position: relative; display: flex; flex: 1 1 12rem; min-width: 0; border-radius: 6px; cursor: pointer; color: var(--color-text-muted); }
  label.active { background: var(--color-accent); color: var(--color-on-accent); }
  span { display: flex; align-items: center; justify-content: center; width: 100%; min-height: var(--control-height); padding: 6px 10px; font-size: .75rem; font-weight: 600; text-align: center; overflow-wrap: anywhere; }
  input:focus-visible + span { outline: 2px solid var(--color-text); outline-offset: -3px; border-radius: inherit; }
  @media (max-width: 28rem) { label { flex-basis: 100%; } }
</style>
