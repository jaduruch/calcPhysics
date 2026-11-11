<script lang="ts">
  import { calculatorUi as text } from '#lib/i18n/runtime.ts';
  let { onreset }: { onreset: () => void } = $props();
</script>
<div class="calculator-tools"><p>{text.precision}</p><button type="button" onclick={onreset}>{text.reset}</button></div>
