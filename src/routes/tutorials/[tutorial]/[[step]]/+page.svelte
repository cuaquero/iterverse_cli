<script>
import { page } from "$app/stores";
import Tutorial from "$content/Tutorial.svelte";
import { tutorials } from "$src/stores/tutorials";

let tutorial;
let step = 0;

$: tutorial = $tutorials.find((t) => t.id == $page.params.tutorial);
$: step = +$page.params.step || 0;
</script>

<svelte:head>
	{#if tutorial?.name}
		<title>{tutorial.name} - Iterverse Terminal</title>
	{:else}
		<title>Iterverse Terminal</title>
	{/if}
</svelte:head>

{#if tutorial}
	<Tutorial {tutorial} {step} />
{/if}
