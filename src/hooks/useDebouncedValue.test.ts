import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebouncedValue("a", 500));
        expect(result.current).toBe("a");
    });

    it("does not update until the delay elapses, even across rapid changes", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebouncedValue(value, 500),
            { initialProps: { value: "a" } }
        );

        rerender({ value: "ab" });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        rerender({ value: "abc" });
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // Neither intermediate value should have committed yet — each
        // keystroke resets the timer, matching real debounce behavior.
        expect(result.current).toBe("a");

        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(result.current).toBe("abc");
    });
});
