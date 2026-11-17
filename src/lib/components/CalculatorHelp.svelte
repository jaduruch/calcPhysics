<script lang="ts">
 import {calculatorHelp,helpExamples} from '#lib/content/calculator-help.ts';
 import HelpExample from './calculator/HelpExample.svelte';
 import {text} from '#lib/i18n/runtime.ts';
</script>
<section class="calculator-help" aria-label={text(calculatorHelp.title)}>
 <ol>{#each calculatorHelp.steps as step,index}<li><p>{text(step)}</p><HelpExample example={helpExamples[index]}/></li>{/each}</ol>
</section>
<style>
 .calculator-help{max-width:var(--calculator-width)}.calculator-help ol{margin:0;padding-left:1.4em}.calculator-help li{padding-left:.25em;margin-bottom:2rem;line-height:1.7;color:var(--color-text-muted)}
</style>
