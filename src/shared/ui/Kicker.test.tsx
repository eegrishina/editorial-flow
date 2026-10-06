import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kicker } from "./Kicker";

describe("Kicker", () => {
  it("renders its label", () => {
    render(<Kicker>Latest note</Kicker>);

    expect(screen.getByText("Latest note")).toHaveClass("uppercase");
  });

  it("lets className override the default color", () => {
    render(<Kicker className="text-accent">Urgent</Kicker>);

    const kicker = screen.getByText("Urgent");
    expect(kicker).toHaveClass("text-accent");
    expect(kicker).not.toHaveClass("text-ink-50");
  });
});
