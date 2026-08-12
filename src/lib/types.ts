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
  stamp: { orientation: string; imageArea: number; perforation: number; borderWidth: number; cornerRadius: number; copyLayout: string };
  type: { personality: string; headlineScale: number; gradeStyle: string; showLabel: boolean; showIcons: boolean };
  print: { paperAge: number; grain: number; distress: number; inkSpread: number; contrast: number; saturation: number };
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
