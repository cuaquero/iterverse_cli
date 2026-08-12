<svelte:head>
	<title>Labs - cli_box</title>
</svelte:head>

<slot />

<style>
:global(.language-bash) {
	white-space: pre-wrap;
}
:global(pre:has(.language-bash)) {
	border: 1px solid #ccc;
	padding: 8px;
}
</style>
