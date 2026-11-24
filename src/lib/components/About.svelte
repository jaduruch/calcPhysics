<script lang="ts">
 import {about} from '#lib/content/about.ts';
 import {text,localPath} from '#lib/i18n/runtime.ts';
</script>
<section class="about-content" aria-label={text(about.title)}>
 {#each about.paragraphs as paragraph}
  <p>{#each text(paragraph).split(text(about.linkLabel)) as part,index}{#if index>0}<a href={localPath('/electromagnetism')}>{text(about.linkLabel)}</a>{/if}{part}{/each}</p>
 {/each}
</section>
<style>
 .about-content{max-width:65ch}.about-content p{color:var(--color-text-muted);line-height:1.7;margin:0 0 1.25rem}.about-content a,.about-content a:hover,.about-content a:visited{display:inline;color:inherit;text-decoration:none}
</style>
