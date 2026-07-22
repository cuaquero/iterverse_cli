<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>protein_count.txt</code> contains the correct count",
	checks: [{
		type: "file",
		path: "protein_count.txt",
		action: "contents",
		commandExpected: "fqgrep -c --protein 'HHHHHH' proteins.fastq"
	}]
}];

const hints = [
	"fqgrep needs to know the input contains amino acids, not DNA",
	"The protein data file is proteins.fastq"
];
</script>

You have a FASTQ file from a protein sequencing experiment and need to check for polyhistidine (His) tag contamination.

> Count how many reads in `proteins.fastq` contain a 6xHis tag (`HHHHHH`), and save the output to a file named `protein_count.txt`.

<Exercise {criteria} {hints} />
