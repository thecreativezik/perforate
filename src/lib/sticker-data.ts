import type { StickerItem } from "./types";

const sampleSpecs = [
  ["A", "Quietly Fine", "grade-a.png", -650, -370, 278, -3, "#176a43"],
  ["B", "Almost Rich, Emotionally", "grade-b.png", -335, -392, 294, 2, "#245cb8"],
  ["C", "Budget Acrobat", "grade-c.png", -8, -374, 278, -1, "#28754b"],
  ["D", "Pocket on Low Battery", "grade-d.png", -650, 66, 282, 3, "#d86a17"],
  ["E", "Premium Struggle", "grade-e.png", -330, 72, 282, -2, "#de4c37"],
  ["F", "Financial Jollof", "grade-f.png", -7, 64, 282, 2, "#c93724"],
] as const;

export function createSeedStickers(assetBaseUrl = ""): StickerItem[] {
  return sampleSpecs.map(([grade, title, filename, x, y, width, rotation, accent], index) => ({
    id: `reference-${grade.toLowerCase()}`,
    title,
    imageUrl: `${assetBaseUrl}/references/${filename}`,
    x,
    y,
    width,
    rotation,
    grade,
    accent,
    createdAt: index,
  }));
}

export const gradePresets = {
  A: { palette: "garden green & gold", mood: "calm confidence", primary: "#176a43", accent: "#d7b22c" },
  B: { palette: "cobalt & cream", mood: "hopeful hustle", primary: "#245cb8", accent: "#f3c450" },
  C: { palette: "garden green & gold", mood: "hopeful hustle", primary: "#28754b", accent: "#d7b22c" },
  D: { palette: "burnt orange & ochre", mood: "comic pressure", primary: "#d86a17", accent: "#f2c66d" },
  E: { palette: "coral & oxblood", mood: "comic pressure", primary: "#de4c37", accent: "#f5b575" },
  F: { palette: "coral & oxblood", mood: "full chaos", primary: "#c93724", accent: "#f1742a" },
} as const;
