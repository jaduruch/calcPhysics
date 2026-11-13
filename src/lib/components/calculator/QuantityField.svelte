<script lang="ts">
  import type { QuantityKind } from '#lib/physics/units.ts';
  import { calculatorUi as text, text as translate } from '#lib/i18n/runtime.ts';
  import QuantitySymbol from '../ui/QuantitySymbol.svelte';
  import UnitSelect from '../ui/UnitSelect.svelte';
  let { id, symbol, name, kind, raw, unit, invalid = false, pending = false, disabled = false, state = '', describedby, onvalue, onunit, onfocuschange }: {
    id: string; symbol: string; name: string; kind: QuantityKind; raw: string; unit: string;
    invalid?: boolean; pending?: boolean; disabled?: boolean; state?: string; describedby?: string;
    onvalue: (value: string) => void; onunit: (unit: string) => void; onfocuschange?: (focused: boolean) => void;
  } = $props();
</script>
<div class="quantity-field" class:pending class:disabled>
  <label for={id}><span class="symbol"><QuantitySymbol {symbol}/></span> {translate(name)}<span class="field-state">{state}</span></label>
  <div class="quantity-controls">
    <input {id} {disabled} type="text" autocomplete="off" spellcheck="false" value={raw} placeholder="—" aria-invalid={invalid} aria-describedby={describedby} oninput={event => onvalue(event.currentTarget.value)} onfocus={() => onfocuschange?.(true)} onblur={() => onfocuschange?.(false)} />
    <UnitSelect {disabled} {kind} value={unit} label={`${text.unitFor} ${translate(name)}`} onchange={onunit} />
  </div>
</div>
