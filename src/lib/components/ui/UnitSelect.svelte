<script lang="ts">
  import { unitGroups, type QuantityKind } from '#lib/physics/units.ts';
  let { kind, value, label, onchange, disabled = false }: {
    disabled?: boolean; kind: QuantityKind; value: string; label: string; onchange: (unit: string) => void;
  } = $props();
  const id = $props.id();
  const options = $derived(unitGroups[kind].units);
  let expanded = $state(false);
  let active = $state(0);
  let above = $state(false);
  let container: HTMLDivElement;
  let search = '';
  let lastKey = 0;
  $effect(() => { if (disabled) expanded = false; });
  function open() {
    if (disabled) return;
    active = Math.max(0, options.findIndex(option => option.symbol === value));
    const rect = container.getBoundingClientRect();
    const height = options.length * 44 + 16;
    above = window.innerHeight - rect.bottom < height && rect.top > height;
    expanded = true;
  }
  function choose(index: number) {
    onchange(options[index].symbol);
    expanded = false;
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === 'Tab') { expanded = false; return; }
    if (event.key === 'Escape') { if (expanded) event.preventDefault(); expanded = false; return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!expanded) { open(); if (event.key === 'ArrowDown' || event.key === 'ArrowUp') return; }
      if (event.key === 'ArrowDown') active = (active + 1) % options.length;
      if (event.key === 'ArrowUp') active = (active - 1 + options.length) % options.length;
      if (event.key === 'Home') active = 0;
      if (event.key === 'End') active = options.length - 1;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (expanded) choose(active); else open();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (!expanded) open();
      const now = Date.now();
      search = now - lastKey > 700 ? event.key : search + event.key;
      lastKey = now;
      let index = options.findIndex(option => option.symbol.toLowerCase().startsWith(search.toLowerCase()));
      if (index < 0) { search = event.key; index = options.findIndex(option => option.symbol.toLowerCase().startsWith(search.toLowerCase())); }
      if (index >= 0) active = index;
    }
  }
  function outside(event: PointerEvent) {
    if (expanded && event.target instanceof Node && !container.contains(event.target)) expanded = false;
  }
</script>

<svelte:window onpointerdown={outside} onresize={() => expanded = false} />
<div class="unit-select" bind:this={container} onfocusout={event => { if (!container.contains(event.relatedTarget as Node | null)) expanded = false; }}>
  <button {disabled} class="trigger" type="button" role="combobox" aria-label={label} aria-expanded={expanded} aria-haspopup="listbox" aria-controls={`${id}-options`} aria-activedescendant={expanded ? `${id}-option-${active}` : undefined} onkeydown={keydown} onclick={() => { if (expanded) expanded = false; else open(); }}>
    <span>{value}</span>{#if options.length > 1}<span class="chevron" class:expanded aria-hidden="true"></span>{/if}
  </button>
  {#if expanded}
    <div class="options" class:above id={`${id}-options`} role="listbox" aria-label={label}>
      {#each options as option, index}
        <button type="button" role="option" id={`${id}-option-${index}`} tabindex="-1" aria-selected={value === option.symbol} class:active={active === index} onpointerenter={() => active = index} onpointerdown={event => event.preventDefault()} onclick={() => choose(index)}>
          <span>{option.symbol}</span><span class="check" aria-hidden="true">{value === option.symbol ? '✓' : ''}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .unit-select { position: relative; min-width: 0; }
  button { border: none; border-radius: var(--control-radius); color: var(--color-text); font: inherit; font-size: .8125rem; cursor: pointer; text-decoration: none; }
  .trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-height: var(--control-height); padding: 8px 14px 8px 12px; background: var(--color-control); }
  .trigger:focus, .trigger:focus-visible { outline: none; box-shadow: none; text-decoration: none; }
  .chevron { width: 6px; height: 6px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: translateY(-2px) rotate(45deg); flex-shrink: 0; }
  .chevron.expanded { transform: translateY(2px) rotate(225deg); }
  .options { position: absolute; right: 0; top: calc(100% + 6px); z-index: 20; min-width: 100%; padding: 6px; border-radius: 10px; background: var(--color-input); box-shadow: 0 4px 16px rgb(0 0 0 / .12); }
  .options.above { top: auto; bottom: calc(100% + 6px); }
  .options button { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: var(--control-height); padding: 8px 10px; background: transparent; text-align: left; outline: none; white-space: nowrap; }
  .options button.active { background: var(--color-control); }
  .check { min-width: 12px; font-size: .75rem; }
  @media (forced-colors: active) { .options { border: 1px solid CanvasText; } .options button.active { background: Highlight; color: HighlightText; } }
</style>
