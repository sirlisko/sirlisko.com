import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import Ghost from "./Ghost";
import styles from "./Ghost.module.scss";

describe("Ghost Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders initial lives correctly", () => {
    render(<Ghost />);

    const hearts = screen.getAllByTestId("heart");
    expect(hearts).toHaveLength(3);

    const ghost = screen.getByRole("figure");
    expect(ghost).toHaveStyle({
      left: "-164px",
      top: "-164px",
    });
  });

  test("reduces life on mouseover", () => {
    render(<Ghost />);

    const ghost = screen.getByRole("figure");
    fireEvent.mouseOver(ghost);

    const hearts = screen.getAllByTestId("heart");
    expect(hearts).toHaveLength(2);
  });

  test("displays game over when life reaches 0", () => {
    render(<Ghost />);

    const ghost = screen.getByRole("figure");
    fireEvent.mouseOver(ghost);
    fireEvent.mouseOver(ghost);
    fireEvent.mouseOver(ghost);

    expect(screen.getByText("-Game Over-")).toBeInTheDocument();
  });

  test("updates ghost position on mouse move", () => {
    render(<Ghost />);

    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
      vi.advanceTimersByTime(100);
    });

    const ghost = screen.getByRole("figure");
    expect(ghost).toHaveStyle({
      left: "36px", // 100 - 64 (GHOST_WIDTH)
      top: "136px", // 200 - 64 (GHOST_WIDTH)
    });
  });

  test("flips ghost direction based on mouse position", () => {
    render(<Ghost />);

    act(() => {
      fireEvent.mouseMove(document, { clientX: 50, clientY: 100 });
      vi.advanceTimersByTime(100);
    });

    const ghost = screen.getByRole("figure");
    expect(ghost).toHaveClass(styles.ghostFlipped as string);

    act(() => {
      fireEvent.mouseMove(document, { clientX: 200, clientY: 100 });
      vi.advanceTimersByTime(100);
    });

    expect(ghost).not.toHaveClass(styles.ghostFlipped as string);
  });

  test("does not move ghost on touch devices", () => {
    Object.defineProperty(window, "ontouchstart", {
      value: true,
      writable: true,
    });

    render(<Ghost />);

    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
      vi.advanceTimersByTime(100);
    });

    const ghost = screen.getByRole("figure");
    expect(ghost).toHaveStyle({
      left: "-164px",
      top: "-164px",
    });
  });
});
