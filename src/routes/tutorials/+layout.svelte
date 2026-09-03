<svelte:head>
	<title>Labs - Iterverse CLI</title>
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
