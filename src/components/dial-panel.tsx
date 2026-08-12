"use client";

import { DialRoot, useDialKitController } from "dialkit";
import { ArrowCounterClockwise, ImageSquare, MagicWand, Sparkle } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { gradePresets } from "@/lib/sticker-data";
import type { DialValues, Grade } from "@/lib/types";

const dialConfig = {
  brief: {
    description: { type: "text" as const, default: "A young creative in Accra balancing rent, transport, data bundles, groceries and family support with more optimism than money.", placeholder: "Describe the sticker scene..." },
    headline: { type: "text" as const, default: "Budget Acrobat", placeholder: "Leave blank for ChatGPT" },
    caption: { type: "text" as const, default: "You’re balancing rent, transport, and family support with style.", placeholder: "Leave blank for ChatGPT" },
    grade: { type: "select" as const, options: ["A", "B", "C", "D", "E", "F"], default: "C" },
  },
  scene: {
    _collapsed: true,
    hero: { type: "text" as const, default: "a stylish young Ghanaian creative" },
    supportingCast: { type: "text" as const, default: "personified rent, transport, groceries and data bundle" },
    setting: { type: "select" as const, options: ["Accra city", "home interior", "market street", "abstract stage", "financial battlefield", "lush garden"], default: "Accra city" },
    mood: { type: "select" as const, options: ["calm confidence", "hopeful hustle", "comic pressure", "full chaos", "quiet relief"], default: "hopeful hustle" },
    composition: { type: "select" as const, options: ["hero centered", "ensemble chase", "balanced tableau", "editorial split", "objects orbiting hero"], default: "balanced tableau" },
  },
  artDirection: {
    _collapsed: true,
    illustrationStyle: { type: "select" as const, options: ["mid-century editorial cartoon", "vintage comic book", "soft gouache storybook", "retro travel poster", "textured character illustration"], default: "mid-century editorial cartoon" },
    palette: { type: "select" as const, options: ["grade-coded", "garden green & gold", "cobalt & cream", "burnt orange & ochre", "coral & oxblood", "custom inks"], default: "grade-coded" },
    primaryInk: { type: "color" as const, default: "#28754b" },
    accentInk: { type: "color" as const, default: "#d7b22c" },
    detail: [68, 20, 100, 1] as [number, number, number, number],
    characterEnergy: [58, 0, 100, 1] as [number, number, number, number],
  },
  backing: {
    _collapsed: true,
    show: true,
    color: { type: "color" as const, default: "#28754b" },
    opacity: [100, 0, 100, 1] as [number, number, number, number],
    padding: [12, 0, 42, 1] as [number, number, number, number],
    offsetX: [0, -60, 60, 1] as [number, number, number, number],
    offsetY: [0, -60, 60, 1] as [number, number, number, number],
    rotation: [0, -12, 12, 0.5] as [number, number, number, number],
    cornerRadius: [0, 0, 48, 1] as [number, number, number, number],
    shadow: [24, 0, 70, 1] as [number, number, number, number],
  },
  paper: {
    _collapsed: true,
    show: true,
    orientation: { type: "select" as const, options: ["portrait 3:4", "portrait 4:5", "square 1:1"], default: "portrait 3:4" },
    color: { type: "color" as const, default: "#f7f0df" },
    opacity: [100, 0, 100, 1] as [number, number, number, number],
    padding: [18, 0, 56, 1] as [number, number, number, number],
    perforation: [12, 0, 30, 1] as [number, number, number, number],
    perforationSpacing: [22, 12, 44, 1] as [number, number, number, number],
    cornerRadius: [0, 0, 36, 1] as [number, number, number, number],
  },
  artwork: {
    _collapsed: true,
    show: true,
    backgroundColor: { type: "color" as const, default: "#d8e9cf" },
    imageArea: [72, 52, 88, 1] as [number, number, number, number],
    inset: [0, 0, 36, 1] as [number, number, number, number],
    cornerRadius: [16, 0, 36, 1] as [number, number, number, number],
    fit: { type: "select" as const, options: ["cover", "contain", "fill"], default: "cover" },
    zoom: [136, 50, 260, 1] as [number, number, number, number],
    cropX: [50, 0, 100, 1] as [number, number, number, number],
    cropY: [22, 0, 100, 1] as [number, number, number, number],
    rotation: [0, -10, 10, 0.5] as [number, number, number, number],
    opacity: [100, 0, 100, 1] as [number, number, number, number],
    tintColor: { type: "color" as const, default: "#28754b" },
    tintOpacity: [0, 0, 100, 1] as [number, number, number, number],
  },
  footer: {
    _collapsed: true,
    show: true,
    backgroundColor: { type: "color" as const, default: "#f7f0df" },
    padding: [10, 0, 36, 1] as [number, number, number, number],
    gap: [8, 0, 28, 1] as [number, number, number, number],
    layout: { type: "select" as const, options: ["A: copy left, grade right", "grade left, copy right", "copy only", "grade only"], default: "A: copy left, grade right" },
    showDivider: true,
    dividerColor: { type: "color" as const, default: "#28754b" },
  },
  type: {
    _collapsed: true,
    personality: { type: "select" as const, options: ["bold grotesk", "soft condensed sans", "editorial slab serif", "hand-lettered poster"], default: "bold grotesk" },
    showHeadline: true,
    headlineColor: { type: "color" as const, default: "#171914" },
    headlineScale: [88, 40, 160, 1] as [number, number, number, number],
    headlineWeight: [850, 300, 950, 50] as [number, number, number, number],
    headlineAlign: { type: "select" as const, options: ["left", "center", "right"], default: "left" },
    showCaption: true,
    captionColor: { type: "color" as const, default: "#4e584a" },
    captionScale: [100, 50, 180, 1] as [number, number, number, number],
    showGrade: true,
    gradeStyle: { type: "select" as const, options: ["oversized letter", "wax seal badge", "perforated ticket", "coin medallion"], default: "oversized letter" },
    gradeColor: { type: "color" as const, default: "#28754b" },
    gradeScale: [110, 50, 180, 1] as [number, number, number, number],
    showLabel: true,
    labelText: { type: "text" as const, default: "FINANCIAL HEALTH" },
    labelColor: { type: "color" as const, default: "#28754b" },
    showIcons: true,
    iconColor: { type: "color" as const, default: "#28754b" },
  },
  print: {
    _collapsed: true,
    paperAge: [22, 0, 100, 1] as [number, number, number, number],
    grain: [46, 0, 100, 1] as [number, number, number, number],
    distress: [30, 0, 100, 1] as [number, number, number, number],
    inkSpread: [18, 0, 100, 1] as [number, number, number, number],
    contrast: [76, 40, 100, 1] as [number, number, number, number],
    saturation: [72, 0, 100, 1] as [number, number, number, number],
    brightness: [100, 50, 150, 1] as [number, number, number, number],
  },
};

const paletteInks: Record<string, { primaryInk: string; accentInk: string }> = {
  "garden green & gold": { primaryInk: "#176a43", accentInk: "#d7b22c" },
  "cobalt & cream": { primaryInk: "#245cb8", accentInk: "#f3c450" },
  "burnt orange & ochre": { primaryInk: "#d86a17", accentInk: "#f2c66d" },
  "coral & oxblood": { primaryInk: "#9d3027", accentInk: "#ef7258" },
};

export function DialPanel({ onValues, onGenerate, onReplaceArtwork, selectedTitle, selectedId, initialValues }: { onValues: (values: DialValues) => void; onGenerate: (values: DialValues) => void; onReplaceArtwork: () => void; selectedTitle?: string; selectedId: string; initialValues: DialValues }) {
  const controller = useDialKitController("Sticker recipe", dialConfig, { id: `perforate-sticker-${selectedId}`, persist: { key: `perforate:dials:${selectedId}`, storage: "localStorage", presets: true } });
  const values = controller.values as unknown as DialValues;
  const previousGrade = useRef(values.brief.grade);
  const previousPalette = useRef(values.artDirection.palette);
  const hydratedInput = useRef(false);
  const hydratedSelection = useRef(false);

  useEffect(() => onValues(values), [onValues, values]);

  useEffect(() => {
    if (hydratedSelection.current) return;
    hydratedSelection.current = true;
    controller.setValues(initialValues);
  }, [controller, initialValues]);

  useEffect(() => {
    if (hydratedInput.current) return;
    hydratedInput.current = true;
    const initial = window.openai?.toolInput;
    if (!initial) return;
    controller.setValues({
      brief: {
        ...(typeof initial.brief === "string" ? { description: initial.brief } : {}),
        ...(typeof initial.headline === "string" ? { headline: initial.headline } : {}),
        ...(["A", "B", "C", "D", "E", "F"].includes(String(initial.grade)) ? { grade: initial.grade as Grade } : {}),
      },
    });
  }, [controller]);

  useEffect(() => {
    if (previousGrade.current === values.brief.grade) return;
    previousGrade.current = values.brief.grade;
    const preset = gradePresets[values.brief.grade];
    controller.setValues({
      artDirection: { palette: preset.palette, primaryInk: preset.primary, accentInk: preset.accent },
      backing: { color: preset.primary },
      artwork: { tintColor: preset.primary },
      footer: { dividerColor: preset.primary },
      type: { gradeColor: preset.primary, labelColor: preset.primary, iconColor: preset.primary },
      scene: { mood: preset.mood },
    });
  }, [controller, values.brief.grade]);

  useEffect(() => {
    if (previousPalette.current === values.artDirection.palette) return;
    previousPalette.current = values.artDirection.palette;
    const inks = paletteInks[values.artDirection.palette];
    if (inks) controller.setValues({ artDirection: inks });
  }, [controller, values.artDirection.palette]);

  return (
    <aside className="settings-panel" aria-label="Sticker settings">
      <div className="settings-intro">
        <div><span className="eyebrow"><Sparkle size={12} weight="fill" />A-style live template</span><h2>{selectedTitle ? `Editing ${selectedTitle}` : "Select a sticker"}</h2></div>
        <button className="icon-button" onClick={controller.resetValues} aria-label="Reset all settings"><ArrowCounterClockwise size={17} /></button>
      </div>
      <div className="dialkit-shell"><DialRoot mode="inline" theme="dark" productionEnabled /></div>
      <div className="generation-dock">
        <div className="grade-readout"><span>Current grade</span><strong style={{ color: values.artDirection.primaryInk }}>{values.brief.grade as Grade}</strong></div>
        <div className="live-status"><span className="live-status-dot" />Changes apply to the selected sticker instantly</div>
        <button className="generate-button" onClick={() => onGenerate(values)}><MagicWand size={19} weight="fill" /><span>Regenerate artwork<small>Runs inside ChatGPT · canvas stays open</small></span></button>
        <button className="secondary-button" onClick={onReplaceArtwork} disabled={!selectedTitle}><ImageSquare size={16} /><span>Replace selected image</span></button>
      </div>
    </aside>
  );
}
