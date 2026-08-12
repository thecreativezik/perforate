import type { StickerItem } from "./types";

const STORAGE_KEY = "perforate:board:v1";

export function loadBoard(): StickerItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as StickerItem[]) : null;
  } catch {
    return null;
  }
}

export function saveBoard(items: StickerItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Temporary file URLs can exceed storage quota; session state still works.
  }
}

export function nextOpenPosition(items: StickerItem[]) {
  const count = items.length;
  return { x: ((count % 5) - 2) * 360, y: (Math.floor(count / 5) - 1) * 440 };
}
