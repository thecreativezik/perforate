import { describe, expect, it } from "vitest";
import { nextOpenPosition } from "./board-storage";
import { createSeedStickers } from "./sticker-data";

describe("reference collection", () => {
  it("contains one reference for every grade", () => {
    const stickers = createSeedStickers("https://example.com");
    expect(stickers).toHaveLength(6);
    expect(stickers.map((sticker) => sticker.grade)).toEqual(["A", "B", "C", "D", "E", "F"]);
    expect(stickers.every((sticker) => sticker.imageUrl.startsWith("https://example.com/references/"))).toBe(true);
  });

  it("places imported stickers on a repeatable open grid", () => {
    expect(nextOpenPosition([])).toEqual({ x: -720, y: -440 });
    expect(nextOpenPosition(createSeedStickers())).toEqual({ x: -360, y: 0 });
  });
});
