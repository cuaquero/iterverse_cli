<script>
import { page } from "$app/stores";
import { Styles, Navbar, Collapse, Nav, NavItem, NavLink, NavbarBrand, NavbarToggler, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "sveltestrap";
import { playgrounds } from "$stores/tutorials";

let isNavbarOpen;
$: path = $page.url.pathname;
</script>

<svelte:head>
	<title>Iterverse CLI</title>
	<script src="/v86/xterm.js"></script>
</svelte:head>

<!-- Bootstrap CSS and icons -->
<Styles />

<Navbar light container color="white" expand="md" class="border-bottom">
	<NavbarBrand href="/">
		<!-- Inline, not <img src="...svg">: an externally-referenced SVG renders
		     in a sandboxed context with no access to this page's own loaded
		     Roboto, so wordmark text inside it would silently fall back to a
		     system font. -->
		<svg class="brand-mark" viewBox="0 0 92 92" width="26" height="26" role="img" aria-label="Iterverse">
			<polygon points="30,18 62,18 78,46 62,74 30,74 14,46" fill="none" stroke="#d22030" stroke-width="11" stroke-linejoin="miter" />
			<rect x="41.5" y="31" width="9" height="30" fill="#36393b" />
		</svg>
		<span class="brand-name"><span class="wm-iter">iter</span><span class="wm-verse">verse</span> CLI</span>
		<span class="brand-divider" aria-hidden="true" />
		<img class="brand-btech-mark" src="/logo-mark.png" alt="Bridgerland Technical College" />
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
:global(body) {
	font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}
:global(.navbar-brand) {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}
.brand-mark {
	flex: 0 0 auto;
}
.brand-name {
	font-weight: 700;
	color: #36393b;
}
/* Wordmark weight/color split per design-system/assets/iterverse/brand.md:
   lowercase "iterverse", 700 red "iter" + 300 gray "verse" - the only
   emphasis the wordmark gets; the product name after it stays in the
   navbar's normal brand color/weight rather than adding a third one. */
.brand-name .wm-iter {
	font-weight: 700;
	color: #d22030;
}
.brand-name .wm-verse {
	font-weight: 300;
	color: #6a6a70;
}
.brand-divider {
	width: 1px;
	height: 20px;
	background: #e0e0e2;
}
.brand-btech-mark {
	height: 20px;
	width: auto;
	display: block;
}
/* !important throughout this block: sveltestrap's <Styles /> injects the
   Bootstrap CDN <link> into <head> at runtime, after this component's own
   compiled CSS - with equal ".btn-primary"/"a" specificity, source order
   decides, and Bootstrap's link lands later. That made these overrides
   lose to Bootstrap's default blue on the deployed build (confirmed via
   computed style on the live site - not a timing fluke, a real, pre-
   existing bug from before this rebrand, just never caught until now). */
:global(.btn-primary) {
	--bs-btn-bg: #d22030 !important;
	--bs-btn-border-color: #d22030 !important;
	--bs-btn-hover-bg: #a81826 !important;
	--bs-btn-hover-border-color: #a81826 !important;
	--bs-btn-active-bg: #a81826 !important;
	--bs-btn-active-border-color: #a81826 !important;
}
/* :not(.btn) - sveltestrap's <Button href="..."> renders as <a class="btn
   btn-primary">, so an unscoped override here would win over Bootstrap's
   own white button text (same !important-vs-source-order fight as above)
   and make button labels the same red as their background. */
:global(a:not(.btn)) {
	color: #d22030 !important;
}
:global(a:not(.btn):hover) {
	color: #a81826 !important;
}
</style>
