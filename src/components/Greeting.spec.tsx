import { render, screen, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import Greeting from "./Greeting";

describe("Greeting Component", () => {
  const descriptions = ["developer", "designer", "engineer"];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders initial description", () => {
    render(<Greeting descriptions={descriptions} />);
    expect(screen.getByText("developer")).toBeInTheDocument();
  });

  test("transitions simulates typing out", () => {
    render(<Greeting descriptions={descriptions} />);

    expect(screen.getByText("developer")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("developer")).not.toBeInTheDocument();
    expect(screen.getByText("develope")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("develope")).not.toBeInTheDocument();
    expect(screen.getByText("develop")).toBeInTheDocument();
  });
});
