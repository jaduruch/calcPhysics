<script lang="ts">
  let { expanded, controls, label, title = label, onclick }: {
    expanded: boolean; controls: string; label: string; title?: string; onclick: () => void;
  } = $props();
</script>
<button class="info-toggle" type="button" aria-label={label} aria-expanded={expanded} aria-controls={controls} {title} {onclick}><span aria-hidden="true">{expanded ? '✕' : 'ⓘ'}</span></button>
<style>
  .info-toggle { display: inline-flex; align-items: center; justify-content: flex-start; background: none; border: none; color: var(--color-text-muted); font-size: 16px; padding: 0; line-height: 1; min-width: 44px; min-height: 44px; flex-shrink: 0; cursor: pointer; }
  .info-toggle:hover, .info-toggle[aria-expanded="true"] { color: var(--color-text); }
</style>
