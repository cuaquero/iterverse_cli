# Subdomain/name rename plan: cli.iterverse.net -> terminal.iterverse.net

Backlogged branding fix. `cli.iterverse.net` reads awkwardly with the dot
removed. Decided name: subdomain **terminal.iterverse.net**, display name
**"Iterverse Terminal"** (replacing "Iterverse CLI"). Chosen because the
Iterverse lineup uses short descriptive nouns (`reader`, `labs`, `sims`,
`packets`, `scripts`, `helpdesk`, `type`) rather than technical acronyms,
and this repo's own lab names ("Terminal Basics", "Terminal Exercises")
already use that word internally.

**Status (2026-09-11):** display-name text, GitHub repo rename, and the
Access App/AUD swap are all done. What's left: deploy, verify login on
the new hostname, then retire the old Access Application and route - see
the per-item notes below.

## 1. Cloudflare Access

- [x] New Access Application created for `terminal.iterverse.net`
  (`terminal.iterverse.net/auth/access*`). `ACCESS_AUD` in `wrangler.toml`
  updated to its AUD tag (was
  `3f035bae1ea2f3231d3f73b68ea099cdc620d49304adb1481f66d4bdb78b076d`, the
  `cli.iterverse.net`-scoped app - not yet deleted, see below).
- [ ] **Not deployed yet.** Deploying now would apply the new AUD
  worker-wide - `cli.iterverse.net`'s Access Application issues JWTs with
  the *old* aud, so as soon as this ships, login on the old hostname
  breaks (401, JWT aud mismatch) even though the old route/Access App
  still exist. There's no way to run both AUDs at once with a single
  `ACCESS_AUD` var - deploying is the cutover moment, not a gradual one.
  Plan the deploy for that, then verify login on `terminal.iterverse.net`
  immediately after.
- [ ] Once verified, retire the old `cli.iterverse.net` Access
  Application - don't leave it dangling.

## 2. Custom domain route

- [x] Added `terminal.iterverse.net` as a new `[[routes]]` entry in
  `wrangler.toml` alongside the existing `cli.iterverse.net` one.
- [ ] Not deployed yet - see item 1: deploying this ships the new AUD too,
  so treat "deploy" as the actual cutover moment, not routine prep.
  `wrangler deploy` provisions the custom domain binding itself (no
  separate DNS step - see `ad_labs/docs/unified-access-vision.md`'s
  account of the original `cli-box.itstem.org` move).
- Remove the old `cli.iterverse.net` route once cut over.

## 3. Product key - recommend NOT changing it

- Keep the roster product key as `"cli"` in `iterverse_hub`'s
  `PRODUCT_KEYS` (`worker/src/db.ts`) even though the hostname/display
  name change.
- Renaming the key would require migrating every existing
  `courses`/`course_products` row from `"cli"` to a new key - the exact
  class of mismatch that caused the false-no-access bug fixed earlier.
  Not worth the risk for a display-name change alone.

## 4. Display name: "Iterverse CLI" -> "Iterverse Terminal"

- [x] This repo's `README.md`, page `<title>`s, `Terminal.svelte`'s
  environments map + export label, `package.json` name
  (`cli_box` -> `iterverse-terminal`).
- [x] Sibling-list link text (`[CLI]` -> `[Terminal]`) updated in
  `iterverse_hub`, `koodo-bridge`, `iterverse_simulations`,
  `btech-ticketing`, `ad_labs`, `iterverse_type` READMEs, and the
  `iterverse_hub/worker/public/index.html` product card label/CTA.
  URLs left pointing at `iterverse_cli`/`cli.iterverse.net` until items 1,
  2, and 5 land (see below) - no `worker/public/admin.js` labels found.
- [x] Added a follow-up line to `ad_labs/docs/unified-access-vision.md`
  noting the pending rename, without editing the historical entry.

## 5. This repo itself

- [x] GitHub repo renamed `iterverse_cli` -> `iterverse_terminal` (done by
  the user via the GitHub web UI - no `gh` CLI/API token was available
  here). Local `origin` remote updated to match; the
  `github.com/cuaquero/iterverse_terminal` URL is now live in this repo's
  README and all six sibling repos' READMEs (GitHub still redirects the
  old `iterverse_cli` clone URL).
- Local folder name `cli_box`/`iterverse_cli` is cosmetic only - decided
  not to rename it locally.

## 6. Sweep for hardcoded links

- `grep -r "cli.iterverse.net"` across all seven repos to catch anything
  not covered above (config, tests, docs, CSS comments - `ad_labs` and
  `iterverse_hub` had several incidental mentions). Done as of
  2026-09-11 - remaining hits are all intentional (still-live route/links,
  pending items 1/2/5 above).

## Suggested execution order

1. ~~Create new Access Application + AUD.~~ Done.
2. ~~Add new route.~~ Done - not yet deployed.
3. **Next:** Deploy, then immediately confirm login works on
   `terminal.iterverse.net` (and be aware `cli.iterverse.net` login breaks
   at that same moment - see item 1).
4. ~~Update sibling READMEs and this repo's README/display name.~~ Done.
5. ~~Sweep for remaining hardcoded links.~~ Done.
6. Retire the old Access Application and the old route.
