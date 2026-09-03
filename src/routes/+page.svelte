<script>
import { Button } from "sveltestrap";
import { labs } from "$stores/tutorials";
import LabList from "$components/LabList.svelte";
</script>

<svelte:head>
	<title>Iterverse CLI</title>
</svelte:head>

<div class="d-flex justify-content-between align-items-baseline">
	<h1 class="fw-bold" style="font-size: 26px">Command line labs</h1>
	<span class="text-muted small">CompTIA A+ Core II</span>
</div>
<p class="text-secondary mb-4" style="max-width: 60ch">
	Each lab runs a real Linux shell in the browser. Nothing to install, and nothing a student can break.
</p>

<LabList labs={$labs} />

<div class="mt-3 p-4 border rounded-3 d-flex justify-content-between align-items-center gap-4" style="background:#f7f7f8">
	<div>
		<h2 class="fw-bold mb-1" style="font-size: 16px">Sandbox terminal</h2>
		<p class="text-secondary mb-0">An empty shell with no lesson attached, for practice and demonstrations.</p>
	</div>
	<Button outline color="dark" href="/tutorials/playground" class="text-nowrap">Open terminal</Button>
</div>
