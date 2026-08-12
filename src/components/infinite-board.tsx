"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { ArrowsOutSimple, Hand, MagnifyingGlassMinus, MagnifyingGlassPlus } from "@phosphor-icons/react";
import type { StickerItem } from "@/lib/types";

type Camera = { x: number; y: number; zoom: number };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function InfiniteBoard({
  items,
  selectedId,
  onSelect,
  onMove,
}: {
  items: StickerItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 0.68 });
  const [isPanning, setIsPanning] = useState(false);
  const panOrigin = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });

  const fitBoard = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const xs = items.flatMap((item) => [item.x, item.x + item.width]);
    const ys = items.flatMap((item) => [item.y, item.y + item.width * 1.34]);
    if (!xs.length || !ys.length) return;
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const zoom = clamp(Math.min((viewport.clientWidth - 190) / (maxX - minX), (viewport.clientHeight - 150) / (maxY - minY)), 0.28, 0.8);
    setCamera({ x: -(minX + maxX) / 2, y: -(minY + maxY) / 2, zoom });
  }, [items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.metaKey || event.ctrlKey) {
        setCamera((current) => ({ ...current, zoom: clamp(current.zoom * Math.exp(-event.deltaY * 0.0014), 0.2, 1.65) }));
      } else {
        setCamera((current) => ({ ...current, x: current.x - event.deltaX / current.zoom, y: current.y - event.deltaY / current.zoom }));
      }
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.key === "0" && (event.metaKey || event.ctrlKey)) || event.key.toLowerCase() === "f") fitBoard();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fitBoard]);

  const worldStyle = useMemo(() => ({
    transform: `translate(calc(50% + ${camera.x * camera.zoom}px), calc(50% + ${camera.y * camera.zoom}px)) scale(${camera.zoom})`,
  }), [camera]);

  return (
    <div
      ref={viewportRef}
      className={`board-viewport ${isPanning ? "is-panning" : ""}`}
      onPointerDown={(event) => {
        if (event.button !== 0 || (event.target as HTMLElement).closest(".sticker-object")) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        panOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, x: camera.x, y: camera.y };
        setIsPanning(true);
        onSelect(null);
      }}
      onPointerMove={(event) => {
        if (!isPanning) return;
        setCamera((current) => ({ ...current, x: panOrigin.current.x + (event.clientX - panOrigin.current.pointerX) / current.zoom, y: panOrigin.current.y + (event.clientY - panOrigin.current.pointerY) / current.zoom }));
      }}
      onPointerUp={() => setIsPanning(false)}
      onPointerCancel={() => setIsPanning(false)}
    >
      <div className="board-origin" style={worldStyle}>
        {items.map((item) => (
          <StickerObject key={item.id} item={item} selected={selectedId === item.id} zoom={camera.zoom} onSelect={onSelect} onMove={onMove} />
        ))}
      </div>

      <div className="board-hint"><Hand size={14} weight="bold" />Drag anywhere to roam · pinch or ⌘ scroll to zoom</div>
      <div className="zoom-controls" aria-label="Canvas zoom controls">
        <button onClick={() => setCamera((v) => ({ ...v, zoom: clamp(v.zoom - 0.1, 0.2, 1.65) }))} aria-label="Zoom out"><MagnifyingGlassMinus size={16} /></button>
        <span>{Math.round(camera.zoom * 100)}%</span>
        <button onClick={() => setCamera((v) => ({ ...v, zoom: clamp(v.zoom + 0.1, 0.2, 1.65) }))} aria-label="Zoom in"><MagnifyingGlassPlus size={16} /></button>
        <button onClick={fitBoard} aria-label="Fit all stickers"><ArrowsOutSimple size={16} /></button>
      </div>
    </div>
  );
}

function StickerObject({ item, selected, zoom, onSelect, onMove }: { item: StickerItem; selected: boolean; zoom: number; onSelect: (id: string) => void; onMove: (id: string, x: number, y: number) => void }) {
  const x = useMotionValue(item.x);
  const y = useMotionValue(item.y);

  useEffect(() => { x.set(item.x); y.set(item.y); }, [item.x, item.y, x, y]);

  return (
    <motion.button
      type="button"
      className={`sticker-object ${selected ? "is-selected" : ""}`}
      style={{ x, y, width: item.width, rotate: item.rotation, "--sticker-accent": item.accent } as unknown as React.CSSProperties}
      drag
      dragMomentum={false}
      dragElastic={0}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={() => onSelect(item.id)}
      onDragStart={() => onSelect(item.id)}
      onDragEnd={() => onMove(item.id, x.get(), y.get())}
      whileDrag={{ scale: 1.025 / Math.max(zoom, 0.45), rotate: 0, zIndex: 20 }}
    >
      {/* File-library URLs are temporary and not eligible for Next Image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.imageUrl} alt={`${item.title}, grade ${item.grade} sticker`} draggable={false} />
      <span className="sticker-caption"><strong>{item.grade}</strong>{item.title}</span>
    </motion.button>
  );
}
