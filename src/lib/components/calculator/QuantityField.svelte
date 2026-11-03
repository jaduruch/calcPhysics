<script lang="ts">
  import type { QuantityKind } from '#lib/physics/units.ts';
  import { calculatorUi as text } from '#lib/i18n/en.ts';
  import UnitSelect from '../ui/UnitSelect.svelte';
  let { id, symbol, name, kind, raw, unit, invalid = false, state = '', describedby, onvalue, onunit, onfocuschange }: {
    id: string; symbol: string; name: string; kind: QuantityKind; raw: string; unit: string;
    invalid?: boolean; state?: string; describedby?: string;
    onvalue: (value: string) => void; onunit: (unit: string) => void; onfocuschange?: (focused: boolean) => void;
  } = $props();
</script>
<div class="quantity-field">
  <label for={id}><span class="symbol">{symbol}</span> {name}<span class="field-state">{state}</span></label>
  <div class="quantity-controls">
    <input {id} type="text" autocomplete="off" spellcheck="false" value={raw} placeholder="—" aria-invalid={invalid} aria-describedby={describedby} oninput={event => onvalue(event.currentTarget.value)} onfocus={() => onfocuschange?.(true)} onblur={() => onfocuschange?.(false)} />
    <UnitSelect {kind} value={unit} label={`${text.unitFor} ${name}`} onchange={onunit} />
  </div>
</div>
