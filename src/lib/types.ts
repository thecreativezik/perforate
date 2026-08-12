export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export type StickerItem = {
  id: string;
  title: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  grade: Grade;
  accent: string;
  createdAt: number;
  recipe?: DialValues;
};

export type StudioMode = "preview" | "chatgpt";

export type DialValues = {
  brief: { description: string; headline: string; caption: string; grade: Grade };
  scene: { hero: string; supportingCast: string; setting: string; mood: string; composition: string };
  artDirection: { illustrationStyle: string; palette: string; primaryInk: string; accentInk: string; detail: number; characterEnergy: number };
  backing: { show: boolean; color: string; opacity: number; padding: number; offsetX: number; offsetY: number; rotation: number; cornerRadius: number; shadow: number };
  paper: { show: boolean; orientation: string; color: string; opacity: number; padding: number; perforation: number; perforationSpacing: number; cornerRadius: number };
  artwork: { show: boolean; backgroundColor: string; imageArea: number; inset: number; cornerRadius: number; fit: string; zoom: number; cropX: number; cropY: number; rotation: number; opacity: number; tintColor: string; tintOpacity: number };
  footer: { show: boolean; backgroundColor: string; padding: number; gap: number; layout: string; showDivider: boolean; dividerColor: string };
  type: { personality: string; showHeadline: boolean; headlineColor: string; headlineScale: number; headlineWeight: number; headlineAlign: string; showCaption: boolean; captionColor: string; captionScale: number; showGrade: boolean; gradeStyle: string; gradeColor: string; gradeScale: number; showLabel: boolean; labelText: string; labelColor: string; showIcons: boolean; iconColor: string };
  print: { paperAge: number; grain: number; distress: number; inkSpread: number; contrast: number; saturation: number; brightness: number };
};

export type OpenAIWidgetState = {
  modelContent?: Record<string, unknown>;
  privateContent?: Record<string, unknown>;
  imageIds?: string[];
};

export type ChatGPTHost = {
  toolInput?: Record<string, unknown>;
  toolOutput?: Record<string, unknown>;
  widgetState?: OpenAIWidgetState | null;
  theme?: "light" | "dark";
  displayMode?: "inline" | "pip" | "fullscreen";
  requestDisplayMode?: (input: { mode: "inline" | "pip" | "fullscreen" }) => Promise<unknown>;
  sendFollowUpMessage?: (input: { prompt: string; scrollToBottom?: boolean }) => Promise<void>;
  selectFiles?: () => Promise<{ fileId: string; fileName?: string; mimeType?: string }[]>;
  getFileDownloadUrl?: (input: { fileId: string }) => Promise<{ downloadUrl: string }>;
  setWidgetState?: (state: OpenAIWidgetState) => void;
  openExternal?: (input: { href: string }) => Promise<void>;
};

declare global {
  interface Window {
    openai?: ChatGPTHost;
    __PERFORATE_BASE_URL__?: string;
  }
}
