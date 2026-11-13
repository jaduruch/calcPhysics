<script lang="ts">
  import { calculatorUi as text, localPath } from '#lib/i18n/runtime.ts';
  let { onreset }: { onreset: () => void } = $props();
</script>
<div class="calculator-tools"><p>{text.precision} <a href={localPath('/calculator-help')}>{text.help}</a></p><button type="button" onclick={onreset}>{text.reset}</button></div>
