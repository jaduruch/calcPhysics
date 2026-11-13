<script lang="ts">
 import {browser} from '$app/env';
 import {page} from '$app/state';
 import {isGerman,localPath,text} from '#lib/i18n/runtime.ts';
 import {languagePath} from '#lib/i18n/locale.ts';
</script>
<footer class="site-footer">
 <div class="footer-inner">
  <div class="footer-grid">
   <div class="footer-identity">
    <a class="brand footer-brand" href={localPath('/')} aria-label={text('calcPhysics home')}>calc<span>Physics</span></a>
    <nav aria-labelledby="footer-legal"><h2 id="footer-legal">{text('Legal information')}</h2>
     <a href={localPath('/disclaimer')}>{text('Disclaimer')}</a>
     <p>{text('Observe the model assumptions and check results before practical use.')}</p>
    </nav>
   </div>
   <nav class="footer-project" aria-labelledby="footer-project"><h2 id="footer-project">{text('Project')}</h2>
    <a href={localPath('/about')}>{text('About calcPhysics')}</a>
    <a href="https://www.instagram.com/calcphysics/" aria-label="Instagram: @calcphysics" rel="external noreferrer"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg><span>Instagram <span class="footer-handle">@calcphysics</span></span><span aria-hidden="true">↗</span></a>
   </nav>
   <nav class="footer-resources" aria-labelledby="footer-resources"><h2 id="footer-resources">{text('Help & Reference')}</h2>
    <a href={localPath('/calculator-help')}>{text('Calculator guide')}</a>
    <a href={localPath('/si-units-and-constants')}>{text('SI Units & Physical Constants')}</a>
    <a class="footer-email" href="mailto:calcphysics@outlook.com">calcphysics@outlook.com</a>
    <p>{text('Suggestions, missing or incorrect formulas, and bug reports.')}</p>
   </nav>
  </div>
  <div class="footer-bottom"><p>calcPhysics</p>
   <nav class="footer-language" aria-label={isGerman()?'Sprache':'Language'}>
    <a href={`${languagePath(page.url.pathname,'en')}${browser?page.url.search+page.url.hash:''}`} lang="en" hreflang="en" aria-current={!isGerman()?'true':undefined}>English</a><span aria-hidden="true">/</span>
    <a href={`${languagePath(page.url.pathname,'de')}${browser?page.url.search+page.url.hash:''}`} lang="de" hreflang="de" aria-current={isGerman()?'true':undefined}>Deutsch</a>
   </nav>
  </div>
 </div>
</footer>
