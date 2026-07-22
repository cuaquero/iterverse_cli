<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>iupac_count.txt</code> contains the correct count",
	checks: [{
		type: "file",
		path: "iupac_count.txt",
		action: "contents",
		commandExpected: "fqgrep -c -F --iupac expand 'ACGTNNNNTGCA' reads.fastq"
	}]
}];

const hints = [
	"The --iupac flag requires a specific matching mode to be enabled first",
	"Check the IUPAC step for the available modes"
];
</script>

Your colleague designed a primer with the degenerate sequence `ACGTNNNNTGCA` and wants to know how many reads contain it. Rather than translating the IUPAC codes to regex by hand, use fqgrep's built-in IUPAC support.

> Use fqgrep's `--iupac` flag to count reads in `reads.fastq` matching the degenerate barcode `ACGTNNNNTGCA`, and save the output to a file named `iupac_count.txt`.

<Exercise {criteria} {hints} />
