<script lang="ts">
 import {calculatorHelp} from '#lib/content/calculator-help.ts';
 import {text} from '#lib/i18n/runtime.ts';
</script>
<section class="calculator-help" aria-label={text(calculatorHelp.title)}>
 <ol>{#each calculatorHelp.steps as step}<li>{text(step)}</li>{/each}</ol>
</section>
<style>
 .calculator-help{max-width:65ch}.calculator-help ol{margin:0;padding-left:1.4em}.calculator-help li{padding-left:.25em;margin-bottom:1rem;line-height:1.7;color:var(--color-text-muted)}
</style>
