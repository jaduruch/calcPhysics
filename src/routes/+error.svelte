<script lang="ts">import { page } from '$app/state';import {text,localPath} from '#lib/i18n/runtime.ts';</script>
<svelte:head><title>{page.status} — calcPhysics</title><meta name="robots" content="noindex" /></svelte:head>
<section class="intro"><p class="eyebrow">{page.status}</p><h1>{text('Page not found')}</h1><p class="lead">{text('This page is not available. Explore the published subjects from the home page.')}</p><a class="primary-link" href={localPath('/')} >{text('Back to Home')} <span aria-hidden="true">↗</span></a></section>
