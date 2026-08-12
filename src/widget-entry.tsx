import { createRoot } from "react-dom/client";
import { StickerStudio } from "./components/sticker-studio";
import "./app/globals.css";
import "dialkit/styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Perforate widget root is missing");
createRoot(root).render(<StickerStudio mode="chatgpt" />);
