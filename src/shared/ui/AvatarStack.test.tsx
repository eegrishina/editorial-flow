import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarStack } from "./AvatarStack";

const editors = ["M. Reyes", "A. Holloway", "J. Tanaka", "K. Sundgren", "E. Laurent", "P. Nwosu"];

describe("AvatarStack", () => {
  it("shows up to four chips and collapses the rest into +N", () => {
    render(<AvatarStack names={editors} />);

    expect(screen.getByTitle("M. Reyes")).toBeInTheDocument();
    expect(screen.getByTitle("K. Sundgren")).toBeInTheDocument();
    expect(screen.queryByTitle("E. Laurent")).not.toBeInTheDocument();
    expect(screen.getByTitle("E. Laurent, P. Nwosu")).toHaveTextContent("+2");
  });

  it("respects a custom max", () => {
    render(<AvatarStack names={editors} max={2} />);

    expect(screen.getByText("+4")).toBeInTheDocument();
  });

  it("shows no counter when everyone fits", () => {
    render(<AvatarStack names={editors.slice(0, 3)} />);

    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });
});
