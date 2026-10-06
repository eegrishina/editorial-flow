import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("gets its accessible name and tooltip from label", () => {
    render(
      <IconButton label="Close">
        <svg aria-hidden />
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveAttribute("title", "Close");
    expect(button).toHaveAttribute("type", "button");
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<IconButton label="Close" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
