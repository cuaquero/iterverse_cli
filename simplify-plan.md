# cli_box — simplification patch

Target: keep **Terminal Basics**, **Terminal Exercises** (Carpentries), and the **open sandbox terminal**. Remove the other tutorials, Google/Supabase auth, progress tracking, the mailing list, IGV, and the "Explore" linkouts. Rebrand to BTECH.

Work on a branch:

```bash
git checkout -b simplify-labs
```

Every file below is given in full — replace the file contents wholesale.

---

## 1. Delete files

```bash
# Tutorials: keep terminal-basics, carpentries-shell-novice, playground, _template, Tutorial.svelte
cd src/content
ls -d */ | grep -vE '^(terminal-basics|carpentries-shell-novice|playground|_template)/$' | xargs rm -rf
cd ../..

# _template loses its bioinformatics data and steps (rewritten in section 9)
rm -rf src/content/_template/data src/content/_template/steps src/content/_template/exercises

# Auth
rm src/components/Login.svelte src/components/LoginWithGoogle.svelte
rm src/stores/user.js src/stores/progress.js
rm -rf src/routes/redirect

# Mailing list
rm src/components/MailingList.svelte
rm -rf src/routes/api/v1/mailinglist

# IGV
rm -rf src/components/igv

# Pages that no longer apply
rm -rf src/routes/community src/routes/about
rm src/components/TutorialList.svelte src/components/Listings.svelte

# Unused static assets
rm static/screenshot-rosalind.png static/screenshot-cli.png

# Add the BTECH logo mark (official asset, do not redraw or recolor it).
# Copy logo-mark.png from BTECH Marketing's brand assets into static/logo-mark.png
# before running the app; src/routes/+layout.svelte references /logo-mark.png.

# Rebuild static/data so it only contains the two labs' data
rm -rf static/data && ./bin/build.sh
```

Optional, if the awk/jq/grep/sed playgrounds aren't wanted either — they are kept in this patch:

```bash
rm -rf src/routes/playgrounds src/routes/studio src/components/IDE.svelte
```

(If you delete them, also drop the `playgrounds` export from `src/stores/tutorials.js` in section 2 and the `Playgrounds` nav dropdown in section 4.)

---

## 2. `src/stores/tutorials.js`

```js
import { readable } from "svelte/store";
import { config as _template } from "$content/_template/config.js";
import { config as terminalBasics } from "$content/terminal-basics/config.js";
import { config as terminalExercises } from "$content/carpentries-shell-novice/config.js";
import { config as playground } from "$content/playground/config.js";

// All tutorials the router can resolve
export const tutorials = readable([playground, terminalBasics, terminalExercises, _template]);

// Labs shown on the home page, in order. Add new labs here.
export const labs = readable([terminalBasics, terminalExercises]);

// Tool playgrounds (delete this export if you removed /src/routes/playgrounds)
export const playgrounds = readable([
	{
		name: "Awk",
		description: "Filter and wrangle tabular data",
		url: "/playgrounds/awk",
		tags: ["awk"]
	},
	{
		name: "Jq",
		description: "Filter and wrangle JSON data",
		url: "/playgrounds/jq",
		tags: ["jq", "json"]
	},
	{
		name: "Grep",
		description: "Search and filter utility",
		url: "/playgrounds/grep",
		tags: ["grep", "regex"]
	},
	{
		name: "Sed",
		description: "Search and replace utility",
		url: "/playgrounds/sed",
		tags: ["sed", "regex"]
	}
]);
```

---

## 3. `src/components/LabList.svelte` (new)

Replaces `TutorialList.svelte`. No progress, no login, no mailing list.

```svelte
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
```

---

## 4. `src/routes/+page.svelte`

The home page: two lab cards plus the sandbox tile. No hero, no category grid.

```svelte
<script>
import { Button } from "sveltestrap";
import { labs } from "$stores/tutorials";
import LabList from "$components/LabList.svelte";
</script>

<svelte:head>
	<title>cli_box</title>
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
```

---

## 5. `src/routes/+layout.svelte`

Auth, the login modal, the "log in to save progress" toast, the Community link, and the sandbox.bio branding all come out.

```svelte
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
```

Google Analytics was also removed from `<svelte:head>` above. Put it back if you want it.

---

## 6. `src/routes/+layout.js`

```js
// No auth, no server-side progress: nothing to load before the page renders.
export const load = async () => {
	return { tutorial: {} };
};
```

---

## 7. `src/utils.js`

Remove the Supabase client, the `t()` table helper, and the `user` import. The local-state key prefix becomes a constant.

Replace the top of the file (everything above `export const STATE_FS`) with:

```js
import localforage from "localforage";
import { LOGGING, LOGGING_DEBUG } from "$src/config";
```

Change the key prefix inside `LocalState`:

```js
	static async getKey(state, description = "") {
		return `local:${state}:${description}`;
	}
```

And delete the `t()` function near the bottom:

```js
// DELETE THIS:
// export function t(tableName) {
// 	if (env.PUBLIC_ENVIRONMENT !== "prd") return `${tableName}_stg`;
// 	return tableName;
// }
```

Everything else in the file (`LocalState`, `log`, `strToChars`) stays as is.

---

## 8. `src/content/Tutorial.svelte`

Two edits: drop the progress store, drop IGV.

Replace the `<script>` block with:

```svelte
<script>
import { onMount } from "svelte";
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

// Handle analytics
async function logStep(from, to) {
	try {
		fetch(`/api/v1/ping`, {
			method: "POST",
			mode: "no-cors",
			body: JSON.stringify({ from, to, tutorial: tutorial.id })
		});
	} catch (error) {
		console.error(error);
	}
}

// When first visit a lab
onMount(() => {
	logStep(null, step);
});
</script>
```

Then in the markup, delete the IGV branch so the terminal is the only right-hand pane — replace:

```svelte
		{#if tutorial.igv === true}
			{@const config = { ...tutorial.igvConfig.default, ...tutorial.igvConfig[step] }}
			<IGV options={config} />
		{:else if tutorial.id != null}
```

with:

```svelte
		{#if tutorial.id != null}
```

And in the "does not exist" `<Alert>`, change the help link and the button:

```svelte
				<Alert color="warning">
					<p><strong>This lab does not exist.</strong></p>
					<p>The link may be out of date. Please let your instructor know how you got here.</p>
				</Alert>
				<Button color="primary" href="/">Browse labs &rarr;</Button>
```

Also change the Help badge link (it points at sandbox.bio discussions) to your own support URL, or delete the `<a>`.

---

## 9. `_template`: the scaffold for future labs

`src/content/_template/config.js`:

```js
// Steps
import Intro from "./steps/Intro.md";
import Step1 from "./steps/Step1.md";

export const config = {
	id: "_template",
	name: "Lab Template",
	icon: "terminal",
	description: "Copy this folder to start a new lab.",
	tags: ["template"],
	tools: ["ls", "cat", "grep"],
	difficulty: ["beginner"],
	steps: [
		{ name: "Lab Template", component: Intro },
		{ name: "Getting started", component: Step1, subtitle: "First commands", header: true }
	],
	// Files placed in ./data/ that should be preloaded into the terminal
	files: []
};
```

`src/content/_template/steps/Intro.md`:

```markdown
This is the introduction step. Describe what the student will do and what they should already know.
```

`src/content/_template/steps/Step1.md`:

```markdown
<script>
import Execute from "$components/Execute.svelte";
</script>

List the files in the lab folder:

<Execute command={"ls -l"} />

> Use a blockquote for a takeaway you want to emphasize.
```

Available components inside step Markdown: `Execute` (run-this-command button), `Exercise` (checked criteria + hints), `Quiz` (multiple choice), `Note`, `Image`, `Link`.

---

## 10. `src/routes/tutorials/+page.svelte`

The old `/tutorials` index is now the home page, so redirect.

```svelte
<script>
import { onMount } from "svelte";
import { goto } from "$app/navigation";

onMount(() => goto("/"));
</script>
```

Also update the two remaining page titles:

- `src/routes/tutorials/+layout.svelte` — `<title>Labs - cli_box</title>`
- `src/routes/tutorials/[tutorial]/[[step]]/+page.svelte` — replace both `sandbox.bio` strings with `cli_box`.

---

## 11. `package.json`

Drop `@supabase/supabase-js` and `igv`, and rename the project.

```json
{
	"name": "cli_box",
	"version": "2.0.0",
	"private": true,
	"scripts": {
		"dev": "vite dev",
		"build": "./bin/build.sh && vite build",
		"preview": "vite preview",
		"test": "playwright test",
		"test:unit": "vitest"
	},
	"devDependencies": {
		"@playwright/test": "^1.28.1",
		"@sveltejs/adapter-cloudflare": "^2.3.2",
		"@sveltejs/kit": "^1.30.4",
		"eslint": "^8.28.0",
		"eslint-config-prettier": "^8.5.0",
		"eslint-plugin-svelte": "^2.26.0",
		"prettier": "^2.8.0",
		"prettier-plugin-svelte": "^2.8.1",
		"svelte": "^3.59.2",
		"svelte-preprocess-markdown": "^2.7.3",
		"vite": "^4.5.2",
		"vitest": "^0.25.3"
	},
	"type": "module",
	"dependencies": {
		"@biowasm/aioli": "^3.1.0",
		"@codemirror/commands": "^6.0.1",
		"@codemirror/lang-json": "^6.0.0",
		"@codemirror/state": "^6.0.1",
		"ansi_up": "^5.1.0",
		"codemirror": "^6.0.0",
		"localforage": "^1.10.0",
		"lodash": "^4.17.21",
		"marked": "^4.2.12",
		"pretty-bytes": "^6.0.0",
		"showdown": "^2.1.0",
		"svelte-autosize": "^1.0.1",
		"svelte-watch-resize": "^1.0.3",
		"sveltestrap": "^5.11.2",
		"xterm": "^5.3.0",
		"xterm-addon-fit": "^0.8.0",
		"xterm-addon-serialize": "^0.11.0",
		"xterm-addon-web-links": "^0.9.0"
	}
}
```

Then:

```bash
rm -rf node_modules package-lock.json && npm install
```

If you deleted `/src/routes/playgrounds` and `/src/routes/studio`, the `@codemirror/*`, `codemirror`, `svelte-autosize` and `showdown` dependencies can go too.

---

## 12. `bin/setup.sh`

Remove the Supabase mock env vars:

```bash
# Set up mock .env file
echo "Setting up env file..."
cat > .env <<EOF
PUBLIC_USE_PRD_ASSETS=true
EOF
```

And change the last line so it opens the home page:

```bash
npm run dev -- --open /
```

`PUBLIC_USE_PRD_ASSETS=true` must stay — `src/components/Terminal.svelte` uses it to pull the Linux disk image and tool binaries from `assets.sandbox.bio`. Keep `URL_ASSETS` in `src/config.js` pointing there unless you plan to host those assets yourself.

---

## 13. `README.md`

```markdown
# cli_box

Browser-based command line labs for Bridgerland Technical College. Each lab runs a real Linux shell compiled to WebAssembly, so students need nothing installed and cannot damage anything.

Adapted from [sandbox.bio](https://sandbox.bio) (MIT licensed).

## Labs

| Lab | Folder |
| --- | --- |
| Terminal Basics | `src/content/terminal-basics` |
| Terminal Exercises | `src/content/carpentries-shell-novice` |
| Sandbox terminal | `src/content/playground` |

## Local development

```bash
git clone https://github.com/mfoster-stem/cli_box.git
cd cli_box
./bin/setup.sh
```

## Adding a lab

1. Copy the template:

   ```bash
   LAB_ID=my-new-lab
   cp -r ./src/content/_template "./src/content/$LAB_ID"
   ```

2. Edit `src/content/$LAB_ID/config.js`: set `id` to `$LAB_ID`, plus `name`, `description`, `tools`, `difficulty`, and the `steps` array.
3. Write one Markdown file per step in `steps/`. Any data files go in `data/` and get listed in `files`.
4. Register the lab in `src/stores/tutorials.js`: import its config, then add it to both `tutorials` and `labs`.
5. `./bin/build.sh` to copy the new `data/` files into `static/`, then `npm run dev`.

### Step Markdown

Steps are Markdown with Svelte components available:

- `<Execute command={"ls -l"} />` — a button that pastes and runs a command in the student's terminal.
- `<Exercise criteria={[...]} hints={[...]} />` — checked criteria with progressive hints.
- `<Quiz ... />` — multiple choice (radio if one answer, checkboxes if several).
- `> text` — an emphasized callout box.

`tools` lists the command-line binaries the lab needs; they are fetched at load time, so only list what the lab actually uses.
```

---

## 14. Verify

```bash
npm run test:unit   # exercise + quiz definition checks
npm run dev
```

Then click through: home page → each lab (first and last step) → sandbox terminal. Watch the console for imports left behind (`$stores/user`, `$stores/progress`, `supabaseAnon`, `IGV`) — a stale one will throw on load.

```bash
grep -rn "stores/user\|stores/progress\|supabaseAnon\|components/igv\|MailingList\|LoginWithGoogle" src/
```

That grep should return nothing.
