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
