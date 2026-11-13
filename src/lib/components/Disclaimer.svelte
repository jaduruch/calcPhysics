<script lang="ts">
 import {disclaimer} from '#lib/content/disclaimer.ts';
 import {text} from '#lib/i18n/runtime.ts';
</script>
<div class="disclaimer-content">
 {#each disclaimer.sections as section,index}<section aria-labelledby={`disclaimer-${index}`}><h2 id={`disclaimer-${index}`}>{text(section.title)}</h2><p>{text(section.text)}</p></section>{/each}
</div>
<style>
 .disclaimer-content{max-width:70ch}.disclaimer-content section+section{margin-top:2rem}h2{font-size:1.125rem;margin-bottom:.75rem}p{color:var(--color-text-muted);line-height:1.7}
</style>
