export const debounce = <T extends unknown[]>(
	fn: (...args: T) => void,
	wait: number,
) => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const debounced = (...args: T) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), wait);
	};
	debounced.cancel = () => clearTimeout(timer);
	return debounced;
};
