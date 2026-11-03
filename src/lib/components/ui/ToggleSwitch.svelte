<script lang="ts">
  let { checked, label, offLabel, onLabel, onchange }: {
    checked: boolean; label: string; offLabel: string; onLabel: string; onchange: (checked: boolean) => void;
  } = $props();
  const group = $props.id();
</script>

<fieldset class="segmented-toggle" class:checked>
  <legend>{label}</legend>
  <label>
    <input type="radio" name={group} value="off" checked={!checked} onchange={() => onchange(false)} />
    <span class:active={!checked}>{offLabel}</span>
  </label>
  <label>
    <input type="radio" name={group} value="on" {checked} onchange={() => onchange(true)} />
    <span class:active={checked}>{onLabel}</span>
  </label>
</fieldset>

<style>
  .segmented-toggle {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2px;
    width: min(100%, 12rem);
    min-width: 0;
    margin: 0;
    padding: 2px;
    border: 0;
    border-radius: 999px;
    background: var(--color-control);
  }
  .segmented-toggle::before {
    content: '';
    position: absolute;
    inset: 2px auto 2px 2px;
    width: calc((100% - 6px) / 2);
    border-radius: inherit;
    background: var(--color-accent);
    transition: transform 180ms ease;
  }
  .segmented-toggle.checked::before { transform: translateX(calc(100% + 2px)); }
  legend, input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  label { position: relative; min-width: 0; cursor: pointer; }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    padding: 4px 10px;
    border-radius: 999px;
    color: var(--color-text-muted);
    font-size: .75rem;
    font-weight: 600;
    text-align: center;
    overflow-wrap: anywhere;
  }
  span.active { color: var(--color-on-accent); }
  input:focus-visible + span { outline: 2px solid var(--color-text); outline-offset: -3px; }
  @media (prefers-reduced-motion: reduce) {
    .segmented-toggle::before { transition: none; }
  }
</style>
