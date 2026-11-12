<script lang="ts">
  import { createSiteSearchIndex, searchSite } from '#lib/search/site-search.ts';
  import { isGerman, searchUi } from '#lib/i18n/runtime.ts';
  const id = $props.id();
  let query = $state('');
  let visibleCount = $state(12);
  const index = $derived(createSiteSearchIndex(isGerman() ? 'de' : 'en'));
  const results = $derived(searchSite(index, query));
</script>

<section class="site-search" aria-labelledby={`${id}-label`}>
  <label id={`${id}-label`} for={`${id}-input`}>{searchUi.label}</label>
  <input id={`${id}-input`} type="search" value={query} placeholder={searchUi.placeholder} autocomplete="off" spellcheck="false" aria-controls={`${id}-results`} aria-describedby={`${id}-status`} oninput={event => { query = event.currentTarget.value; visibleCount = 12; }} onkeydown={event => { if (event.key === 'Escape') { query = ''; event.currentTarget.value = ''; } }} />
  <p id={`${id}-status`} role="status" aria-live="polite" aria-atomic="true">{#if query.trim()}{results.length ? `${Math.min(visibleCount, results.length)} / ${results.length} ${results.length === 1 ? searchUi.result : searchUi.results}` : searchUi.noResults}{/if}</p>
  <ul id={`${id}-results`} class="search-pills">
    {#each results.slice(0, visibleCount) as result (result.id)}
      <li><a href={result.href}>{result.path.join(' / ')}</a></li>
    {/each}
  </ul>
  {#if results.length > visibleCount}<button type="button" class="show-more" onclick={() => visibleCount += 12}>{searchUi.more}</button>{/if}
</section>

<style>
  .site-search { max-width: 56rem; margin: 0 0 32px; }
  label { display: block; margin-bottom: 10px; font-weight: 600; font-size: .875rem; }
  input { display: block; width: 100%; min-height: var(--control-height); padding: 12px 16px; border: 1px solid transparent; border-radius: var(--control-radius); color: var(--color-text); background: var(--color-control); font: inherit; }
  input::placeholder { color: var(--color-text-muted); opacity: 1; }
  input:focus { outline: none; border-color: var(--color-border); }
  p { min-height: 0; margin: 8px 0 0; font-size: .8125rem; color: var(--color-text-muted); }
  p:empty { margin: 0; }
  .search-pills { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 12px 0 0; list-style: none; }
  .search-pills:empty { margin: 0; }
  li { max-width: 100%; min-width: 0; }
  a { display: inline-block; min-height: var(--control-height); padding: 10px 16px; border: 1px solid transparent; border-radius: 999px; background: var(--color-surface); color: var(--color-text); font-size: .8125rem; line-height: 1.65; text-decoration: none; overflow-wrap: anywhere; }
  a:hover { color: var(--color-accent); }
  a:focus-visible, button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  .show-more { min-height: var(--control-height); margin-top: 12px; padding: 8px 16px; border: 0; border-radius: var(--control-radius); background: var(--color-control); color: var(--color-text); font: inherit; font-size: .8125rem; cursor: pointer; }
</style>
