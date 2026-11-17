<script lang="ts">
  import { calculatorUi as text, text as translate, localPath } from '#lib/i18n/runtime.ts';
  let { onreset, compact=false, onexample }: { onreset: () => void; compact?:boolean; onexample?:()=>void } = $props();
</script>
<div class="calculator-tools">{#if !compact}<p>{text.precision} <a href={localPath('/calculator-help')}>{text.help}</a></p>{/if}{#if onexample}<button type="button" onclick={onexample}>{translate('Load example')}</button>{/if}<button type="button" onclick={onreset}>{text.reset}</button></div>
