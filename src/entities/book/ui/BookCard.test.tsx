import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeBook } from "../lib/makeBook.fixture";
import { BookCard } from "./BookCard";

const book = makeBook({
  id: "MS-2041",
  title: "The Cartographer's Index",
  author: "Inés Marchetti",
  genre: "Literary Fiction",
  wordCount: 92400,
  chapters: 24,
  deadline: "2026-06-02",
  progress: 8,
  editor: { id: "mr", name: "M. Reyes" },
});

const card = () => screen.getByRole("article");

describe("BookCard", () => {
  it("shows the manuscript details", () => {
    render(<BookCard book={book} />);

    expect(screen.getByText("№ MS-2041")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Cartographer's Index" })).toBeInTheDocument();
    expect(screen.getByText("Inés Marchetti")).toBeInTheDocument();
    expect(screen.getByText("Jun 02")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Production progress" })).toHaveAttribute("value", "8");
    expect(screen.getByText("Literary Fiction")).toBeInTheDocument();
    expect(screen.getByText("92.4k w")).toBeInTheDocument();
    expect(screen.getByText("24 ch")).toBeInTheDocument();
    expect(screen.getByTitle("M. Reyes")).toBeInTheDocument();
  });

  it("marks an urgent book: label, solid accent edge, accent progress", () => {
    render(<BookCard book={{ ...book, flag: "urgent" }} />);

    expect(screen.getByText("urgent")).toBeInTheDocument();
    expect(card()).toHaveClass("border-l-accent", "[border-left-style:solid]");
    expect(screen.getByRole("progressbar")).toHaveClass("[&::-webkit-progress-value]:bg-accent");
  });

  it("marks a book in review", () => {
    render(<BookCard book={{ ...book, flag: "review" }} />);

    expect(screen.getByText(/review/)).toBeInTheDocument();
    expect(screen.queryByText("urgent")).not.toBeInTheDocument();
    expect(card()).not.toHaveClass("border-l-accent");
  });

  it("hides the editor chip when nobody is assigned", () => {
    render(<BookCard book={{ ...book, editor: undefined }} />);

    expect(screen.queryByTitle("M. Reyes")).not.toBeInTheDocument();
  });

  it("reports its id when clicked", () => {
    const onSelect = vi.fn();
    render(<BookCard book={book} onSelect={onSelect} />);

    fireEvent.click(card());

    expect(onSelect).toHaveBeenCalledWith("MS-2041");
  });

  it("outlines the selected card", () => {
    render(<BookCard book={book} isSelected />);

    expect(card()).toHaveClass("outline", "outline-ink");
  });
});
