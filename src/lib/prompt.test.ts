import { describe, expect, it } from "vitest";
import { buildStickerPrompt } from "./prompt";
import type { DialValues } from "./types";

const values: DialValues = {
  brief: { description: "a renter chased by bills", headline: "Premium Struggle", caption: "Still swimming.", grade: "E" },
  scene: { hero: "a tired wallet", supportingCast: "rent and data bundle", setting: "financial battlefield", mood: "comic pressure", composition: "ensemble chase" },
  artDirection: { illustrationStyle: "vintage comic book", palette: "coral & oxblood", primaryInk: "#de4c37", accentInk: "#f5b575", detail: 80, characterEnergy: 90 },
  stamp: { orientation: "portrait 3:4", imageArea: 72, perforation: 18, borderWidth: 28, cornerRadius: 16, copyLayout: "headline below image" },
  type: { personality: "bold grotesk", headlineScale: 82, gradeStyle: "wax seal badge", showLabel: true, showIcons: false },
  print: { paperAge: 22, grain: 46, distress: 30, inkSpread: 18, contrast: 76, saturation: 72 },
};

describe("buildStickerPrompt", () => {
  it("captures exact copy, grade, style and output requirements", () => {
    const prompt = buildStickerPrompt(values);
    expect(prompt).toContain("Generate the image now");
    expect(prompt).toContain("Financial grade: E");
    expect(prompt).toContain("exact headline “Premium Struggle”");
    expect(prompt).toContain("exact caption “Still swimming.”");
    expect(prompt).toContain("portrait 3:4");
    expect(prompt).toContain("Do not add a pictogram row");
  });

  it("asks ChatGPT to write copy when fields are blank", () => {
    const prompt = buildStickerPrompt({ ...values, brief: { ...values.brief, headline: "", caption: "" } });
    expect(prompt).toContain("Invent a sharp");
    expect(prompt).toContain("Write one dry");
  });
});
