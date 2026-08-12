<script>
import { page } from "$app/stores";
import { Styles, Navbar, Collapse, Nav, NavItem, NavLink, NavbarBrand, NavbarToggler, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "sveltestrap";
import { playgrounds } from "$stores/tutorials";

let isNavbarOpen;
$: path = $page.url.pathname;
</script>

<svelte:head>
	<title>cli_box</title>
	<script src="/v86/xterm.js"></script>
</svelte:head>

<!-- Bootstrap CSS and icons -->
<Styles />

<Navbar light container color="white" expand="md" class="border-bottom">
	<NavbarBrand href="/">
		<img class="brand-mark" src="/logo-mark.png" alt="Bridgerland Technical College" />
		<span class="brand-name">cli_box</span>
		<span class="brand-sub d-none d-md-inline">Bridgerland Technical College</span>
	</NavbarBrand>
	<NavbarToggler on:click={() => (isNavbarOpen = !isNavbarOpen)} />
	<Collapse isOpen={isNavbarOpen} navbar expand="md" on:update={(event) => (isNavbarOpen = event.detail.isOpen)}>
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="/" active={path === "/"}>Labs</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/tutorials/playground" active={path.startsWith("/tutorials/playground")} data-sveltekit-reload>Sandbox</NavLink>
			</NavItem>
			<!-- Delete this dropdown if you removed /src/routes/playgrounds -->
			<Dropdown nav inNavbar>
				<DropdownToggle nav caret active={path.startsWith("/playgrounds")}>Tools</DropdownToggle>
				<DropdownMenu end>
					{#each $playgrounds as playground}
						<!--
							FIXME: Use "data-sveltekit-reload" so the browser reloads the page, not Svelte.
							This is to avoid cases where going to the Terminal playground, then to the other
							tools' playground makes the CodeMirror instances not responsive to typing, except
							for the backspace character.
						-->
						<DropdownItem href={playground.url} data-sveltekit-reload>
							<div class="d-flex">
								<span>{playground.name}</span>
								<span class="ps-2 text-muted opacity-75 small" style="padding-top:2px;">{playground.description}</span>
							</div>
						</DropdownItem>
					{/each}
				</DropdownMenu>
			</Dropdown>
		</Nav>
	</Collapse>
</Navbar>

<Container class="mt-4">
	<slot />
</Container>

{#if !$page.url.pathname.startsWith("/tutorials/")}
	<footer class="container pt-3 mt-5 mb-5 text-muted border-top small">
		Adapted from <a href="https://sandbox.bio" target="_blank" rel="noreferrer">sandbox.bio</a>, MIT licensed.
	</footer>
{/if}

<style>
:global(.navbar-brand) {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}
.brand-mark {
	height: 30px;
	width: auto;
	display: block;
}
.brand-name {
	font-weight: 700;
	color: #36393b;
}
.brand-sub {
	font-size: 10px;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #6a6a70;
}
:global(.btn-primary) {
	--bs-btn-bg: #d22030;
	--bs-btn-border-color: #d22030;
	--bs-btn-hover-bg: #a81826;
	--bs-btn-hover-border-color: #a81826;
	--bs-btn-active-bg: #a81826;
	--bs-btn-active-border-color: #a81826;
}
:global(a) {
	color: #d22030;
}
:global(a:hover) {
	color: #a81826;
}
</style>
