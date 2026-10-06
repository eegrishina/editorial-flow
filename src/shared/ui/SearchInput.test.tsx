import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("is a labelled search box showing the current value", () => {
    render(
      <SearchInput
        value="quiet"
        onChange={() => {}}
        label="Search manuscripts"
        placeholder="Search title, author, MS-…"
      />,
    );

    const input = screen.getByRole("searchbox", { name: "Search manuscripts" });
    expect(input).toHaveValue("quiet");
    expect(input).toHaveAttribute("placeholder", "Search title, author, MS-…");
  });

  it("reports the typed text, not the event", () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), {
      target: { value: "MS-19" },
    });

    expect(onChange).toHaveBeenCalledWith("MS-19");
  });

  it("hides and disables the clear button while the box is empty", () => {
    render(<SearchInput value="" onChange={() => {}} />);

    const clear = screen.getByRole("button", { name: "Clear search" });
    expect(clear).toBeDisabled();
    expect(clear).toHaveClass("invisible");
  });

  it("clears the value and returns focus to the input", () => {
    const onChange = vi.fn();
    render(<SearchInput value="quiet" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });
});
