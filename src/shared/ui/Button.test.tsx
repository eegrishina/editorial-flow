import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("is a non-submitting ghost button by default", () => {
    render(<Button>Filter</Button>);

    const button = screen.getByRole("button", { name: "Filter" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("bg-card", "border-dashed");
  });

  it.each([
    ["solid", "bg-ink"],
    ["accent", "bg-accent"],
    ["subtle", "bg-transparent"],
  ] as const)("applies the %s variant", (variant, className) => {
    render(<Button variant={variant}>Go</Button>);

    expect(screen.getByRole("button")).toHaveClass(className);
  });

  it("passes native props through", () => {
    const onClick = vi.fn();
    render(
      <Button type="submit" onClick={onClick} aria-describedby="hint">
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-describedby", "hint");
  });

  it("does not fire clicks when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Advance stage
      </Button>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });
});
