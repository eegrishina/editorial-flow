import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dashed } from "./Dashed";

describe("Dashed", () => {
  it("is decorative and hidden from assistive technology", () => {
    const { container } = render(<Dashed />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("is a horizontal line by default", () => {
    const { container } = render(<Dashed />);

    expect(container.firstChild).toHaveClass("h-px", "w-full");
  });

  it("can be vertical", () => {
    const { container } = render(<Dashed vertical />);

    expect(container.firstChild).toHaveClass("w-px", "self-stretch");
    expect(container.firstChild).not.toHaveClass("h-px");
  });
});
