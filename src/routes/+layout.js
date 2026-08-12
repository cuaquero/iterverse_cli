// No auth, no server-side progress: nothing to load before the page renders.
export const load = async () => {
	return { tutorial: {} };
};
