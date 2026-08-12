<script>
import { Badge, Button, Card, Col, Row } from "sveltestrap";

export let labs = [];
export let numbered = true;
</script>

<Row cols={{ lg: 2, md: 2, sm: 1, xs: 1 }}>
	{#each labs as lab, i}
		<Col class="my-2">
			<Card class="h-100 lab-card p-4">
				<div class="d-flex justify-content-between align-items-center mb-2">
					<span class="lab-eyebrow">{numbered ? `Lab ${i + 1}` : (lab.difficulty || [])[0]}</span>
					<span class="text-muted small">{lab.steps.length} steps</span>
				</div>

				<h5 class="fw-bold">{lab.name}</h5>
				<p class="text-secondary">{@html lab.description}</p>

				<div class="mb-3">
					{#each lab.tools || [] as tool}
						<code class="tool-chip">{tool}</code>
					{/each}
				</div>

				<div class="mt-auto d-flex align-items-center gap-3">
					<Button color="primary" class="stretched-link" href="/tutorials/{lab.id}">Start lab</Button>
					{#each lab.difficulty || [] as tag}
						<Badge color="secondary bg-opacity-75">{tag}</Badge>
					{/each}
				</div>
			</Card>
		</Col>
	{/each}
</Row>

<style>
:global(.lab-card) {
	border-color: var(--border-subtle, #e0e0e2) !important;
}
:global(.lab-card:hover) {
	background-color: #f7f7f8 !important;
}
.lab-eyebrow {
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: #d22030;
}
.tool-chip {
	font-size: 11px;
	color: #56565b;
	background: #f7f7f8;
	border: 1px solid #eeeeef;
	border-radius: 3px;
	padding: 3px 7px;
	margin-right: 4px;
}
</style>
