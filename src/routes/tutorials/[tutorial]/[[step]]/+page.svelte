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
		<title>{tutorial.name} - cli_box</title>
	{:else}
		<title>cli_box</title>
	{/if}
</svelte:head>

{#if tutorial}
	<Tutorial {tutorial} {step} />
{/if}
