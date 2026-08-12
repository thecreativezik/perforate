"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowSquareOut,
  Check,
  Copy,
  DownloadSimple,
  Images,
  Plus,
  Trash,
  X,
} from "@phosphor-icons/react";
import { DialPanel } from "./dial-panel";
import { InfiniteBoard } from "./infinite-board";
import { StudioLogo } from "./studio-logo";
import { buildStickerPrompt } from "@/lib/prompt";
import { createSeedStickers, gradePresets } from "@/lib/sticker-data";
import { loadBoard, nextOpenPosition, saveBoard } from "@/lib/board-storage";
import type { DialValues, Grade, StickerItem, StudioMode } from "@/lib/types";

const DEFAULT_VALUES: DialValues = {
  brief: { description: "A young creative balancing everyday expenses with style.", headline: "Budget Acrobat", caption: "You’re balancing rent, transport, and family support with style.", grade: "C" },
  scene: { hero: "a stylish young Ghanaian creative", supportingCast: "personified rent, transport, groceries and data bundle", setting: "Accra city", mood: "hopeful hustle", composition: "balanced tableau" },
  artDirection: { illustrationStyle: "mid-century editorial cartoon", palette: "grade-coded", primaryInk: "#28754b", accentInk: "#d7b22c", detail: 68, characterEnergy: 58 },
  stamp: { orientation: "portrait 3:4", imageArea: 72, perforation: 18, borderWidth: 28, cornerRadius: 16, copyLayout: "headline below image" },
  type: { personality: "bold grotesk", headlineScale: 82, gradeStyle: "wax seal badge", showLabel: true, showIcons: true },
  print: { paperAge: 22, grain: 46, distress: 30, inkSpread: 18, contrast: 76, saturation: 72 },
};

export function StickerStudio({ mode }: { mode: StudioMode }) {
  const assetBaseUrl = useMemo(() => {
    if (typeof window !== "undefined" && window.__PERFORATE_BASE_URL__) return window.__PERFORATE_BASE_URL__;
    return "";
  }, []);
  const seedItems = useMemo(() => createSeedStickers(assetBaseUrl), [assetBaseUrl]);
  const [items, setItems] = useState<StickerItem[]>(seedItems);
  const [selectedId, setSelectedId] = useState<string | null>(seedItems[2]?.id ?? null);
  const [values, setValues] = useState<DialValues>(DEFAULT_VALUES);
  const [notice, setNotice] = useState<string | null>(null);
  const [showStandaloneGuide, setShowStandaloneGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageIdsRef = useRef<string[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const saved = loadBoard();
    const privateItems = window.openai?.widgetState?.privateContent?.items;
    // Widget and local-storage hydration intentionally happens once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Array.isArray(privateItems) && privateItems.length) setItems(privateItems as StickerItem[]);
    else if (saved?.length) setItems(saved);
    if (mode === "chatgpt" && window.openai?.displayMode !== "fullscreen") {
      void window.openai?.requestDisplayMode?.({ mode: "fullscreen" });
    }
  }, [mode]);

  useEffect(() => {
    saveBoard(items);
    window.openai?.setWidgetState?.({
      modelContent: {
        app: "Perforate",
        stickerCount: items.length,
        selectedSticker: items.find((item) => item.id === selectedId)?.title ?? null,
        activeRecipe: { grade: values.brief.grade, headline: values.brief.headline, description: values.brief.description },
      },
      privateContent: { items },
      imageIds: imageIdsRef.current,
    });
  }, [items, selectedId, values.brief.description, values.brief.grade, values.brief.headline]);

  const flash = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  }, []);

  const copyPrompt = useCallback(async (current: DialValues) => {
    await navigator.clipboard.writeText(buildStickerPrompt(current));
    flash("Art brief copied");
  }, [flash]);

  const generate = useCallback(async (current: DialValues) => {
    const prompt = buildStickerPrompt(current);
    if (window.openai?.sendFollowUpMessage) {
      await window.openai.sendFollowUpMessage({ prompt, scrollToBottom: true });
      flash("Brief sent — ChatGPT is creating your sticker");
      return;
    }
    await navigator.clipboard.writeText(prompt);
    setShowStandaloneGuide(true);
  }, [flash]);

  const addFromFile = useCallback((imageUrl: string, title: string, grade: Grade) => {
    setItems((current) => {
      const position = nextOpenPosition(current);
      return [...current, {
        id: `sticker-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: title.replace(/\.[^.]+$/, "") || "Untitled sticker",
        imageUrl,
        ...position,
        width: 320,
        rotation: ((current.length % 5) - 2) * 1.2,
        grade,
        accent: gradePresets[grade].primary,
        createdAt: Date.now(),
      }];
    });
  }, []);

  const importFromChatGPT = useCallback(async () => {
    if (!window.openai?.selectFiles || !window.openai?.getFileDownloadUrl) {
      fileInputRef.current?.click();
      return;
    }
    const files = await window.openai.selectFiles();
    let imported = 0;
    for (const file of files) {
      if (file.mimeType && !file.mimeType.startsWith("image/")) continue;
      const { downloadUrl } = await window.openai.getFileDownloadUrl({ fileId: file.fileId });
      imageIdsRef.current = Array.from(new Set([...imageIdsRef.current, file.fileId]));
      addFromFile(downloadUrl, file.fileName ?? "ChatGPT sticker", values.brief.grade);
      imported += 1;
    }
    flash(imported ? `${imported} sticker${imported === 1 ? "" : "s"} added to canvas` : "Choose an image from your Library");
  }, [addFromFile, flash, values.brief.grade]);

  const selected = items.find((item) => item.id === selectedId);

  const duplicateSelected = useCallback(() => {
    if (!selected) return;
    const copy = { ...selected, id: `sticker-${Date.now()}`, x: selected.x + 48, y: selected.y + 48, rotation: -selected.rotation, createdAt: Date.now() };
    setItems((current) => [...current, copy]);
    setSelectedId(copy.id);
    flash("Sticker duplicated");
  }, [flash, selected]);

  const downloadSelected = useCallback(() => {
    if (!selected) return;
    const link = document.createElement("a");
    link.href = selected.imageUrl;
    link.download = `${selected.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    link.target = "_blank";
    link.click();
  }, [selected]);

  return (
    <main className="studio-shell">
      <header className="topbar">
        <StudioLogo />
        <div className="edition-note"><span>GHANA MONEY MOODS</span><strong>COLLECTION 01</strong></div>
        <div className="top-actions">
          {selected && <div className="selection-actions"><span>{selected.title}</span><button onClick={duplicateSelected} aria-label="Duplicate selected sticker"><Copy size={16} /></button><button onClick={downloadSelected} aria-label="Download selected sticker"><DownloadSimple size={16} /></button><button onClick={() => { setItems((current) => current.filter((item) => item.id !== selected.id)); setSelectedId(null); }} aria-label="Delete selected sticker"><Trash size={16} /></button></div>}
          <button className="library-button" onClick={importFromChatGPT}><Images size={17} weight="bold" />{mode === "chatgpt" ? "Add from Library" : "Add artwork"}</button>
        </div>
      </header>

      <section className="studio-workspace">
        <div className="canvas-column">
          <InfiniteBoard items={items} selectedId={selectedId} onSelect={setSelectedId} onMove={(id, x, y) => setItems((current) => current.map((item) => item.id === id ? { ...item, x, y } : item))} />
          <div className="canvas-label"><span>INFINITE CANVAS</span><strong>{items.length.toString().padStart(2, "0")} EDITIONS</strong></div>
        </div>
        <DialPanel onValues={setValues} onGenerate={generate} onCopyPrompt={copyPrompt} />
      </section>

      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => {
        Array.from(event.target.files ?? []).forEach((file) => addFromFile(URL.createObjectURL(file), file.name, values.brief.grade));
        event.currentTarget.value = "";
      }} />

      <AnimatePresence>{notice && <motion.div className="toast" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}><Check size={16} weight="bold" />{notice}</motion.div>}</AnimatePresence>

      <AnimatePresence>{showStandaloneGuide && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setShowStandaloneGuide(false)}>
          <motion.div className="standalone-modal" initial={{ y: 18, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 18, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowStandaloneGuide(false)} aria-label="Close"><X size={18} /></button>
            <span className="modal-stamp"><Plus size={24} weight="bold" /></span>
            <p className="eyebrow">YOUR BRIEF IS READY</p>
            <h2>Finish the edition in ChatGPT</h2>
            <p>The art brief is on your clipboard. Open ChatGPT, paste it, and generate with the image access included in your plan. Install this app in ChatGPT for the one-click flow.</p>
            <a className="generate-button" href="https://chatgpt.com" target="_blank" rel="noreferrer"><ArrowSquareOut size={19} weight="bold" /><span>Open ChatGPT<small>Paste and generate</small></span></a>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </main>
  );
}
