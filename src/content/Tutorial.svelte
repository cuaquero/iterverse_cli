<script>
import { Button, DropdownItem, Offcanvas } from "sveltestrap";
import { afterNavigate } from "$app/navigation";
import { status } from "$stores/status";
import Alert from "$components/Alert.svelte";
import Terminal from "$components/Terminal.svelte";

export let tutorial;
export let step = 0;

// State
const tocToggle = () => (tocOpen = !tocOpen);
let tocOpen = false;
let stepInfo = {};

// Reactive statements
$: stepInfo = tutorial.steps[step] || {};
$: isFirstStep = step === 0;
$: isLastStep = step === tutorial.steps.length - 1;
// If invalid step (e.g. a lab was shortened), go back to the start of the lab
$: if (tutorial.steps.length > 0 && (step < 0 || step >= tutorial.steps.length)) {
	window.location = `/tutorials/${tutorial.id}`;
}

// Make sure to reset scroll position when navigating between steps
afterNavigate(() => {
	document.getElementById("tutorial-sidebar")?.scrollTo(0, 0);
});

</script>

<div class="container-fluid pb-3 px-0">
	<div class="d-grid gap-2" style="grid-template-columns: {tutorial.steps.length > 0 ? '1fr 2fr' : ''}; height:85vh; max-height:85vh">
		{#if tutorial.steps.length > 0}
			<div class="bg-light border rounded-3 p-2 d-flex align-items-end flex-column" style="width:25vw; max-width:25vw">
				<div id="tutorial-sidebar" class="w-100 p-2 mb-auto" style="max-height:77vh; overflow-y:scroll; overflow-x:hidden">
					<h4>{stepInfo.name || tutorial.name}</h4>
					{#if stepInfo.subtitle || (step == 0 && tutorial.subtitle)}
						<h6>{@html stepInfo.subtitle || tutorial.subtitle}</h6>
					{/if}
					{#if step == 0 && tutorial.tags.length > 0}
						<div class="row mb-2">
							<h6>
								{#each tutorial.tags as tag, i}
									<span class="badge bg-primary" class:ms-1={i > 0} class:bg-danger={tag == "draft"}>
										{tag}
									</span>
								{/each}
								{#each tutorial.difficulty as tag}
									<span
										class="badge ms-0"
										class:bg-success={tag == "beginner"}
										class:bg-danger={tag == "difficult"}
										style={tag == "intermediate" ? "background-color:#fd7e14" : ""}>{tag}</span
									>
								{/each}
							</h6>
						</div>
					{/if}
					<hr class="border-2 border-top border-secondary" />

					<div id="tutorial-wrapper" class="row" style="overflow-x: hidden">
						<div class="container">
							<svelte:component this={stepInfo.component} />
						</div>
					</div>
				</div>

				<div class="w-100 p-2 border-top pt-4">
					<div class="row">
						<div class="d-flex justify-content-between">
							<div>
								<Button
									href={isFirstStep ? "#" : `/tutorials/${tutorial.id}` + (step === 1 ? "" : `/${step - 1}`)}
									color={isFirstStep ? "secondary" : "primary"}
									size="sm"
								>
									&larr;<span class="mobile-hide">&nbsp;Previous</span>
								</Button>

								<Button
									href={isLastStep ? "#" : `/tutorials/${tutorial.id}/${step + 1}`}
									color={isLastStep ? "secondary" : "primary"}
									size="sm"
								>
									<span class="mobile-hide">Next&nbsp;</span>&rarr;
								</Button>
							</div>
							<div>
								<span on:click={tocToggle} class="badge rounded-pill bg-info">{step + 1} / {tutorial.steps.length}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
		{#if tutorial.id != null}
			<div id="terminal-wrapper" class="border rounded-3 p-2">
				<Terminal
					on:status={(event) => ($status.terminal = event.detail)}
					terminalId={tutorial.id}
					assets={tutorial.assets || []}
					files={tutorial.files || []}
					tools={tutorial.tools || []}
					intro={tutorial.intro || ""}
					init={tutorial.init || ""}
					complete={isLastStep}
				/>
			</div>
		{:else}
			<div>
				<Alert color="warning">
					<p><strong>This lab does not exist.</strong></p>
					<p>The link may be out of date. Please let your instructor know how you got here.</p>
				</Alert>
				<Button color="primary" href="/">Browse labs &rarr;</Button>
			</div>
		{/if}
	</div>
</div>

<!-- Note: this throws "Uncaught TypeError: Cannot read properties of undefined (reading 'autoClose')"
	when clicking a lesson, but it still works -->
<Offcanvas header="Lessons" placement="end" isOpen={tocOpen} toggle={tocToggle}>
	<DropdownItem header class="text-muted">Introduction</DropdownItem>

	{#each tutorial.steps as s, i}
		{#if s.header}
			<DropdownItem header class="mt-4 text-muted">
				{s.name}
			</DropdownItem>
		{/if}

		<DropdownItem href="/tutorials/{tutorial.id}/{i}" class="my-2">
			{#if i == step}
				&rarr; <strong>{@html s.subtitle || s.name}</strong>
			{:else}
				<span style="visibility:hidden">&rarr;</span> {@html s.subtitle || s.name}
			{/if}
		</DropdownItem>
	{/each}
</Offcanvas>

<style>
#terminal-wrapper {
	background-color: black;
}

.rounded-pill:hover {
	cursor: pointer;
}

@media only screen and (max-width: 768px) {
	.mobile-hide {
		display: none;
	}
}
</style>
