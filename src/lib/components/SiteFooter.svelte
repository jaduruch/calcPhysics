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
    <nav class="footer-section" aria-labelledby="footer-legal"><h2 id="footer-legal">{text('Legal information')}</h2>
     <a href={localPath('/disclaimer')}>{text('Disclaimer')}</a>
     <p>{text('Observe the model assumptions and check results before practical use.')}</p>
    </nav>
   </div>
   <nav class="footer-project footer-section" aria-labelledby="footer-project"><h2 id="footer-project">{text('Project')}</h2>
    <a href={localPath('/about')}>{text('About calcPhysics')}</a>
    <a href="https://github.com/jaduruch/calcPhysics" rel="external noreferrer"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.104.77-.244.77-.542 0-.267-.01-.975-.015-1.913-3.13.68-3.79-1.51-3.79-1.51-.512-1.3-1.25-1.646-1.25-1.646-1.022-.7.078-.686.078-.686 1.13.08 1.725 1.16 1.725 1.16 1.004 1.72 2.635 1.223 3.277.935.102-.727.393-1.223.715-1.504-2.5-.284-5.13-1.25-5.13-5.566 0-1.23.44-2.234 1.16-3.022-.117-.285-.503-1.43.11-2.98 0 0 .945-.303 3.094 1.155A10.8 10.8 0 0 1 12 6.176c.956.005 1.918.129 2.816.378 2.148-1.458 3.09-1.155 3.09-1.155.616 1.55.23 2.695.113 2.98.722.788 1.158 1.792 1.158 3.022 0 4.327-2.634 5.28-5.143 5.559.404.348.765 1.034.765 2.084 0 1.504-.014 2.718-.014 3.087 0 .3.203.65.774.54A11.252 11.252 0 0 0 12 .75Z"/></svg><span>GitHub</span></a>
    <a href="https://www.instagram.com/calcphysics/" aria-label="Instagram: @calcphysics" rel="external noreferrer"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg><span>Instagram <span class="footer-handle">@calcphysics</span></span></a>
   </nav>
   <nav class="footer-resources footer-section" aria-labelledby="footer-resources"><h2 id="footer-resources">{text('Help & Reference')}</h2>
    <div class="footer-resource-links">
     <a href={localPath('/calculator-help')}>{text('Calculator guide')}</a>
     <a href={localPath('/si-units-and-constants')}>{text('SI Units & Physical Constants')}</a>
    </div>
    <div class="footer-contact"><a class="footer-email" href="mailto:calcphysics@outlook.com">calcphysics@outlook.com</a><span class="footer-contact-note">{text('Suggestions, missing or incorrect formulas, and bug reports.')}</span></div>
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
