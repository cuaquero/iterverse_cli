# Subdomain/name rename plan: cli.iterverse.net -> terminal.iterverse.net

Backlogged branding fix. `cli.iterverse.net` reads awkwardly with the dot
removed. Decided name: subdomain **terminal.iterverse.net**, display name
**"Iterverse Terminal"** (replacing "Iterverse CLI"). Chosen because the
Iterverse lineup uses short descriptive nouns (`reader`, `labs`, `sims`,
`packets`, `scripts`, `helpdesk`, `type`) rather than technical acronyms,
and this repo's own lab names ("Terminal Basics", "Terminal Exercises")
already use that word internally.

Nothing below has been executed yet. This is a checklist for when the
migration is actually carried out.

## 1. Cloudflare Access

- Create a new Zero Trust Access Application for `terminal.iterverse.net`.
- Copy the new Application Audience (AUD) tag into `ACCESS_AUD` in
  `wrangler.toml` (currently
  `3f035bae1ea2f3231d3f73b68ea099cdc620d49304adb1481f66d4bdb78b076d`).
- Verify login works end-to-end on the new hostname, *then* retire the old
  `cli.iterverse.net` Access Application - don't leave it dangling.

## 2. Custom domain route

- Add `terminal.iterverse.net` as a new `[[routes]]` entry in
  `wrangler.toml` (currently `pattern = "cli.iterverse.net"`), and wire up
  the DNS/custom domain binding in Cloudflare.
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

- This repo's `README.md`: title, alt text, sibling list.
- Update the sibling-product reference (and any live link to
  `cli.iterverse.net`) in each of: `iterverse_hub` (including
  `worker/public/index.html`'s product card, `worker/public/admin.js`'s
  labels if any), `koodo-bridge`, `iterverse_simulations`,
  `btech-ticketing`, `ad_labs`, `iterverse_type`. These READMEs were all
  touched recently for an unrelated fix (adding the "Type" product), so
  current formatting is fresh in git history as a template.
- `ad_labs/docs/unified-access-vision.md` also documents the migration
  history (`cli-box.itstem.org` -> `cli.iterverse.net` (Iterverse CLI,
  `cli_box`)) - worth a follow-up line noting the rename, for the
  historical record.

## 5. This repo itself

- GitHub repo is already named `iterverse_cli` (per the README clone
  URL) - that rename is done. Local folder name `cli_box` is cosmetic
  only; rename it locally if full consistency is wanted, not required.
- Consider whether `iterverse_cli` should also become
  `iterverse_terminal` on GitHub for consistency - optional, adds
  another link to fix everywhere.

## 6. Sweep for hardcoded links

- `grep -r "cli.iterverse.net"` across all seven repos to catch anything
  not covered above (config, tests, docs, CSS comments - `ad_labs` and
  `iterverse_hub` had several incidental mentions).

## Suggested execution order

1. Create new Access Application + AUD.
2. Add new route, verify DNS/custom domain.
3. Deploy, confirm login works on `terminal.iterverse.net`.
4. Update sibling READMEs and this repo's README/display name.
5. Sweep for remaining hardcoded links.
6. Retire the old Access Application and the old route.
