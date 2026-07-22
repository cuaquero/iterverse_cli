<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>barcode_count.txt</code> contains the correct count",
	checks: [{
		type: "file",
		path: "barcode_count.txt",
		action: "contents",
		commandExpected: "fqgrep -c 'ACGT....TGCA' reads.fastq"
	}]
}];

const hints = [
	"You need a regular expression to match the variable region",
	"Remember which regex character matches any single character"
];
</script>

Your library uses barcodes with the structure `ACGT-NNNN-TGCA` where `NNNN` represents 4 variable bases (a "degenerate" region).

> Count how many reads in `reads.fastq` contain a barcode matching `ACGT` followed by any 4 bases followed by `TGCA`, and save the output to a file named `barcode_count.txt`.

<Exercise {criteria} {hints} />
