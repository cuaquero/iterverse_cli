# Subdomain/name rename plan: cli.iterverse.net -> terminal.iterverse.net

Backlogged branding fix. `cli.iterverse.net` reads awkwardly with the dot
removed. Decided name: subdomain **terminal.iterverse.net**, display name
**"Iterverse Terminal"** (replacing "Iterverse CLI"). Chosen because the
Iterverse lineup uses short descriptive nouns (`reader`, `labs`, `sims`,
`packets`, `scripts`, `helpdesk`, `type`) rather than technical acronyms,
and this repo's own lab names ("Terminal Basics", "Terminal Exercises")
already use that word internally.

**Status (2026-09-11): done.** Deployed, login verified working
end-to-end on `terminal.iterverse.net`, old route/wrangler.toml migration
comments cleaned up, and the old Access Application has been deleted from
the Zero Trust dashboard. Nothing left on this checklist.

## 1. Cloudflare Access

- [x] New Access Application created for `terminal.iterverse.net`
  (`terminal.iterverse.net/auth/access*`). `ACCESS_AUD` in `wrangler.toml`
  updated to its AUD tag.
- [x] Deployed. Login verified working end-to-end on
  `terminal.iterverse.net`. As expected, this same deploy broke login on
  `cli.iterverse.net` (its Access Application still issued the *old* aud,
  which the worker then rejected) - that hostname's route has since been
  removed from `wrangler.toml` and redeployed (see item 2).
- [x] Old `cli.iterverse.net` Access Application deleted from the Zero
  Trust dashboard by the user.
- [ ] **Still open, dashboard-only:** delete the old `cli.iterverse.net`
  Access Application in the Zero Trust dashboard (Access -> Applications)
  - don't leave it dangling. Its AUD was
  `3f035bae1ea2f3231d3f73b68ea099cdc620d49304adb1481f66d4bdb78b076d`.

## 2. Custom domain route

- [x] Added `terminal.iterverse.net` as a new `[[routes]]` entry in
  `wrangler.toml`, deployed alongside the AUD swap, verified working.
- [x] Removed the old `cli.iterverse.net` `[[routes]]` entry and the
  migration comments in `wrangler.toml`, and redeployed - that hostname no
  longer routes to this Worker at all.

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
  `iterverse_hub/worker/public/index.html` product card label/CTA - no
  `worker/public/admin.js` labels found. That card's `href` and this
  repo's own README live-link now point at `terminal.iterverse.net` too,
  updated once the cutover was verified. GitHub repo URLs updated to
  `iterverse_terminal` across all seven repos once the rename landed (see
  item 5).
- [x] Caught one spot the initial grep sweep missed:
  `src/routes/+layout.svelte`'s navbar wordmark had " CLI" appended in its
  own `<span>`, so "Iterverse CLI" never appeared as one literal string. A
  follow-up agent swept the whole repo for other split/dynamic brand-name
  strings and found none.
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

- [x] `grep -r "cli.iterverse.net"` across all seven repos, done twice
  (once before cutover, once after login was verified to catch the two
  remaining *live* links - this repo's README and the Hub product card -
  that were deliberately left pointing at the old hostname until cutover
  was confirmed working). Remaining hits are all intentional history
  (RENAME-PLAN.md itself, `wrangler.toml`'s and
  `ad_labs/docs/unified-access-vision.md`'s narrative comments,
  `Terminal.svelte`'s `environments` map, which still needs the old
  hostname's entry as long as anyone has the old URL bookmarked/cached).

## Suggested execution order

1. ~~Create new Access Application + AUD.~~ Done.
2. ~~Add new route.~~ Done.
3. ~~Deploy, confirm login works on `terminal.iterverse.net`.~~ Done -
   confirmed working 2026-09-11.
4. ~~Update sibling READMEs and this repo's README/display name.~~ Done.
5. ~~Sweep for remaining hardcoded links.~~ Done.
6. ~~Retire the old route and the old Access Application.~~ Done - route
   removed from `wrangler.toml` and redeployed; Access Application deleted
   from the Zero Trust dashboard by the user.

Rename complete.
