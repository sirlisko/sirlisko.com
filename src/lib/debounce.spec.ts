import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("runs the callback once the wait elapses", () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced("a");
		vi.advanceTimersByTime(99);
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(fn).toHaveBeenCalledExactlyOnceWith("a");
	});

	test("keeps only the last call of a burst", () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced("a");
		vi.advanceTimersByTime(50);
		debounced("b");
		vi.advanceTimersByTime(50);
		debounced("c");
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledExactlyOnceWith("c");
	});

	test("cancel drops a pending call", () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced("a");
		debounced.cancel();
		vi.advanceTimersByTime(500);

		expect(fn).not.toHaveBeenCalled();
	});
});
