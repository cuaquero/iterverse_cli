<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>tn5_count.txt</code> contains the correct count",
	checks: [{
		type: "file",
		path: "tn5_count.txt",
		action: "contents",
		commandExpected: "fqgrep -c 'AGATGTGTATAAGAGACAG' reads.fastq"
	}]
}];

const hints = [
	"The Tn5 mosaic end sequence is AGATGTGTATAAGAGACAG",
	"Use fqgrep with the -c flag",
	"Search in reads.fastq"
];
</script>

ATAC-seq and many tagmentation-based library preps leave Tn5 transposase mosaic end sequences in the reads.

> Count how many reads in `reads.fastq` contain the Tn5 mosaic end sequence `AGATGTGTATAAGAGACAG`, and save the output to a file named `tn5_count.txt`.

<Exercise {criteria} {hints} />
