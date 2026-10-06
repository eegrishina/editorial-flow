import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders an accessible progress bar with the value", () => {
    render(<ProgressBar value={42} label="Production progress" />);

    const bar = screen.getByRole("progressbar", { name: "Production progress" });
    expect(bar).toHaveAttribute("value", "42");
    expect(bar).toHaveAttribute("max", "100");
  });

  it.each([
    [8, "08%"],
    [42, "42%"],
    [100, "100%"],
  ])("shows %i as %s", (value, text) => {
    render(<ProgressBar value={value} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("uses the ink fill by default and the accent fill on request", () => {
    const { rerender } = render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toHaveClass("[&::-webkit-progress-value]:bg-ink");

    rerender(<ProgressBar value={50} accent />);
    expect(screen.getByRole("progressbar")).toHaveClass("[&::-webkit-progress-value]:bg-accent");
  });
});
