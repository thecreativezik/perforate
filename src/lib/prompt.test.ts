import { describe, expect, it } from "vitest";
import { buildStickerPrompt } from "./prompt";
import type { DialValues } from "./types";

const values: DialValues = {
  brief: { description: "a renter chased by bills", headline: "Premium Struggle", caption: "Still swimming.", grade: "E" },
  scene: { hero: "a tired wallet", supportingCast: "rent and data bundle", setting: "financial battlefield", mood: "comic pressure", composition: "ensemble chase" },
  artDirection: { illustrationStyle: "vintage comic book", palette: "coral & oxblood", primaryInk: "#de4c37", accentInk: "#f5b575", detail: 80, characterEnergy: 90 },
  backing: { show: true, color: "#de4c37", opacity: 100, padding: 12, offsetX: 0, offsetY: 0, rotation: 0, cornerRadius: 0, shadow: 24 },
  paper: { show: true, orientation: "portrait 3:4", color: "#f7f0df", opacity: 100, padding: 18, perforation: 12, perforationSpacing: 22, cornerRadius: 0 },
  artwork: { show: true, backgroundColor: "#f5b575", imageArea: 72, inset: 0, cornerRadius: 16, fit: "cover", zoom: 136, cropX: 50, cropY: 22, rotation: 0, opacity: 100, tintColor: "#de4c37", tintOpacity: 0 },
  footer: { show: true, backgroundColor: "#f7f0df", padding: 10, gap: 8, layout: "A: copy left, grade right", showDivider: true, dividerColor: "#de4c37" },
  type: { personality: "bold grotesk", showHeadline: true, headlineColor: "#171914", headlineScale: 88, headlineWeight: 850, headlineAlign: "left", showCaption: true, captionColor: "#4e584a", captionScale: 100, showGrade: true, gradeStyle: "oversized letter", gradeColor: "#de4c37", gradeScale: 110, showLabel: true, labelText: "FINANCIAL HEALTH", labelColor: "#de4c37", showIcons: false, iconColor: "#de4c37" },
  print: { paperAge: 22, grain: 46, distress: 30, inkSpread: 18, contrast: 76, saturation: 72, brightness: 100 },
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
