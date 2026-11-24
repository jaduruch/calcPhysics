<script lang="ts">
  import {onMount} from 'svelte';
  import {inertiaDerivations} from '#lib/content/inertia-derivations.ts';
  import {text} from '#lib/i18n/runtime.ts';
  import Formula from '../Formula.svelte';
  let selected=$state('sphere');
  let interactive=$state(false);
  const id=$props.id();
  onMount(()=>{interactive=true;});
</script>
<div class="derivation">
  <div class="shape-buttons" role="group" aria-label={text('Choose a body for the derivation')}>
    {#each inertiaDerivations as shape}
      <button disabled={!interactive} aria-pressed={selected===shape.id} aria-controls={`${id}-${shape.id}`} onclick={()=>selected=shape.id}>{text(shape.label)}</button>
    {/each}
  </div>
  {#each inertiaDerivations as shape}
    <section id={`${id}-${shape.id}`} hidden={interactive&&selected!==shape.id} aria-labelledby={`${id}-${shape.id}-title`}>
      <h4 id={`${id}-${shape.id}-title`}>{text(shape.title)}</h4>
      <ol>
        {#each shape.steps as step}<li><p>{text(step.text)}</p><Formula expression={step.expression} wrap/></li>{/each}
      </ol>
      <figure>
        <svg viewBox="0 0 340 300" role="img" aria-label={text(shape.caption)}>
          {#if shape.id==='sphere'}
            <circle cx="160" cy="150" r="110" class="body"/>
            <ellipse cx="160" cy="90" rx="92.2" ry="10" class="slice"/>
            <path d="M160 90H252.2 M160 150L237.8 72.2" class="measure"/>
            <text x="194" y="81">a(z)</text><text x="209" y="122">R</text>
            <path d="M48 90H39V150H48" class="measure"/>
            <text x="21" y="125">z</text>
          {:else}
            <path d="M60 65A100 24 0 0 1 260 65V235A100 24 0 0 1 60 235Z" class="body"/>
            <ellipse cx="160" cy="65" rx="100" ry="24" class="body"/>
            <path d="M100 65A60 15 0 0 1 220 65V235A60 15 0 0 1 100 235Z" class="slice"/>
            <ellipse cx="160" cy="65" rx="60" ry="15" class="slice"/>
            <path d="M160 65H220 M160 235H260 M278 65H287V235H278" class="measure"/>
            <text x="183" y="57">s</text><text x="205" y="253">R</text><text x="298" y="155">H</text>
          {/if}
          <line x1="160" y1="15" x2="160" y2="285" class="axis"/>
          <text x="172" y="25">z</text>
        </svg>
        <figcaption>{text(shape.caption)}</figcaption>
      </figure>
    </section>
  {/each}
</div>
<style>
  .derivation{max-width:var(--theory-width)}.shape-buttons{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}button{min-height:44px;min-width:100px;padding:8px 16px;border:0;border-radius:var(--control-radius);background:var(--color-control);color:var(--color-text);cursor:pointer}button[aria-pressed=true]{outline:2px solid currentColor;font-weight:600}h4{font-size:1rem;margin:12px 0}ol{padding-left:1.5rem;margin:0}li{padding-left:4px;margin-bottom:20px}li p{line-height:1.6;margin:0}figure{margin:24px 0 0;max-width:380px}svg{display:block;width:100%;height:auto;color:var(--color-text)}.body{fill:var(--color-control);stroke:currentColor;stroke-width:1.5}.slice{fill:color-mix(in srgb,var(--color-accent) 20%,transparent);stroke:var(--color-accent);stroke-width:1.5}.axis{stroke:currentColor;stroke-width:1.5;stroke-dasharray:6 5}.measure{stroke:currentColor;stroke-width:1.3;fill:none}text{fill:currentColor;font-size:14px}figcaption{color:var(--color-text-muted);font-size:.85rem;line-height:1.5}
</style>
