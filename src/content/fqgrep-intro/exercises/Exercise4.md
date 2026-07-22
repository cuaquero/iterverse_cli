<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>paired_count.txt</code> contains the correct count",
	checks: [{
		type: "file",
		path: "paired_count.txt",
		action: "contents",
		commandExpected: "fqgrep -c --paired 'AGATCGGAAGAGC' reads_R1.fastq reads_R2.fastq"
	}]
}];

const hints = [
	"You need a flag that treats two input files as paired",
	"The paired files are reads_R1.fastq and reads_R2.fastq"
];
</script>

You need to find all read pairs where **either** R1 or R2 contains adapter contamination.

> Count how many **read pairs** have Illumina adapter contamination (`AGATCGGAAGAGC`) in either R1 or R2. Use the files `reads_R1.fastq` and `reads_R2.fastq`, and save the output to a file named `paired_count.txt`.

<Exercise {criteria} {hints} />
