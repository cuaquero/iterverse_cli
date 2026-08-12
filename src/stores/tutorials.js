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
