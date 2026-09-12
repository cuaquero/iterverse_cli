<script>
import Listings from "$components/Listings.svelte";
import { playgrounds } from "$stores/tutorials";
</script>

<svelte:head>
	<title>Playgrounds - Iterverse Terminal</title>
</svelte:head>

<h3>Playgrounds</h3>

<Listings items={$playgrounds} />
