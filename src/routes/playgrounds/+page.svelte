<script>
import Listings from "$components/Listings.svelte";
import { playgrounds } from "$stores/tutorials";
</script>

<svelte:head>
	<title>Playgrounds - Iterverse CLI</title>
</svelte:head>

<h3>Playgrounds</h3>

<Listings items={$playgrounds} />
