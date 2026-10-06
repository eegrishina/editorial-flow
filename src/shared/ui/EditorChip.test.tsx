import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EditorChip } from "./EditorChip";

describe("EditorChip", () => {
  it.each([
    ["M. Reyes", "MR"],
    ["Idris al-Mansouri", "IA"],
    ["  wren   ahmadi ", "WA"],
    ["Anna Maria Lopez", "AM"],
  ])("shows initials of %j as %s", (name, initials) => {
    render(<EditorChip name={name} />);

    expect(screen.getByText(initials)).toBeInTheDocument();
  });

  it("shows the full name on hover", () => {
    render(<EditorChip name="M. Reyes" />);

    expect(screen.getByTitle("M. Reyes")).toHaveTextContent("MR");
  });

  it("lets className override the default size", () => {
    render(<EditorChip name="M. Reyes" className="size-6.5" />);

    const chip = screen.getByText("MR");
    expect(chip).toHaveClass("size-6.5");
    expect(chip).not.toHaveClass("size-5.5");
  });
});
