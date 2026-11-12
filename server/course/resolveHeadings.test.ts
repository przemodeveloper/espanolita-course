import { describe, expect, it } from "vitest";
import { resolveHeadingMatchHeadings } from "./resolveHeadings";

describe("resolveHeadingMatchHeadings", () => {
  it("prefers content.headings when present", () => {
    const result = resolveHeadingMatchHeadings(
      {
        headings: [
          { label: "A", text: "Uno" },
          { label: "B", text: "Dos" },
        ],
        options: [{ label: "Z", text: "ignored" }],
      },
      [{ options: [{ label: "X", text: "also ignored" }] }],
    );
    expect(result).toEqual([
      { label: "A", text: "Uno" },
      { label: "B", text: "Dos" },
    ]);
  });

  it("falls back to content.options", () => {
    const result = resolveHeadingMatchHeadings(
      {
        options: [
          { label: "a", text: "Alpha" },
          { label: "B", text: "Beta" },
        ],
      },
      [],
    );
    expect(result).toEqual([
      { label: "A", text: "Alpha" },
      { label: "B", text: "Beta" },
    ]);
  });

  it("falls back to unique question options", () => {
    const result = resolveHeadingMatchHeadings(null, [
      {
        options: [
          { label: "A", text: "First" },
          { label: "B", text: "Second" },
        ],
      },
      {
        options: [
          { label: "A", text: "Duplicate" },
          { label: "C", text: "Third" },
        ],
      },
    ]);
    expect(result).toEqual([
      { label: "A", text: "First" },
      { label: "B", text: "Second" },
      { label: "C", text: "Third" },
    ]);
  });

  it("returns empty when nothing available", () => {
    expect(resolveHeadingMatchHeadings({}, [])).toEqual([]);
  });
});
