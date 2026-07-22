<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>adapter_count.txt</code> contains the correct adapter count",
	checks: [{
		type: "file",
		path: "adapter_count.txt",
		action: "contents",
		commandExpected: `fqgrep -c 'AGATCGGAAGAGC' reads.fastq`
	}]
}];

const hints = [
    "Use the -c flag to count matches",
    "The Illumina TruSeq adapter sequence is AGATCGGAAGAGC",
    "The file you need is reads.fastq"
];
</script>

You've received a new batch of sequencing data and need to assess the level of Illumina adapter contamination.

> Count how many reads in `reads.fastq` contain the Illumina TruSeq adapter sequence `AGATCGGAAGAGC`, and save the count to a new file named `adapter_count.txt`.

<Exercise {criteria} {hints} />
