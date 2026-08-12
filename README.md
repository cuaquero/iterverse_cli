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
