import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Counter } from "./Counter";

describe("Counter", () => {
  it.each([
    [{ value: 3 }, "03"],
    [{ value: 14 }, "14"],
    [{ value: 128 }, "128"],
    [{ value: 0 }, "00"],
    [{ value: 7, pad: 3 }, "007"],
    [{ value: 8, suffix: "%" }, "08%"],
  ])("renders %j as %s", (props, text) => {
    render(<Counter {...props} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("lets className override the default color", () => {
    render(<Counter value={2} className="text-accent" />);

    const counter = screen.getByText("02");
    expect(counter).toHaveClass("text-accent", "tabular-nums");
    expect(counter).not.toHaveClass("text-ink-50");
  });
});
