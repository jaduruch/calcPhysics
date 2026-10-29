<script lang="ts">
  import Overview from '#lib/components/Overview.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>
<Overview topic={data.topic} />
