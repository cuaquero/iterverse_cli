<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>thorough_count.txt</code> contains the correct count",
	checks: [{
		type: "file",
		path: "thorough_count.txt",
		action: "contents",
		commandExpected: "fqgrep -c -v --reverse-complement -f contaminants.txt reads.fastq"
	}]
}];

const hints = [
	"You need to combine three concepts: inverted matching, reverse complement, and a pattern file",
	"Think about which flags from earlier steps handle each part"
];
</script>

Your lab's `contaminants.txt` file lists contaminant sequences in forward orientation only. But depending on library prep, adapters and Tn5 sequences can appear in either strand.

Perform a thorough screen that accounts for **both orientations** of all contaminants, and count the reads that pass.

> How many reads in `reads.fastq` are free of all contaminant sequences from `contaminants.txt` when checking **both** forward and reverse complement orientations? Save the output to a file named `thorough_count.txt`.

<Exercise {criteria} {hints} />
