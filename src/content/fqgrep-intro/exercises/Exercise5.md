<script>
import Exercise from "$components/Exercise.svelte";

const criteria = [{
	name: "File <code>names_count.txt</code> contains the correct count",
	checks: [{
		type: "file",
		path: "names_count.txt",
		action: "contents",
		commandExpected: "fqgrep -c -N read_names.txt reads.fastq"
	}]
}];

const hints = [
	"There's a flag specifically for filtering by read name from a file",
	"Check the Read Name Filtering step for the right flag"
];
</script>

A colleague has given you a list of read names in `read_names.txt` that they want to inspect more closely. Extract just those reads and count them.

> Count how many reads in `reads.fastq` match the names listed in `read_names.txt`, and save the output to a file named `names_count.txt`.

<Exercise {criteria} {hints} />
