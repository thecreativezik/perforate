import { gradePresets } from "./sticker-data";
import type { DialValues } from "./types";

export function buildStickerPrompt(values: DialValues) {
  const grade = gradePresets[values.brief.grade];
  const requestedCopy = values.brief.headline.trim() ? `Use the exact headline “${values.brief.headline.trim()}”.` : "Invent a sharp, memorable 2–6 word headline.";
  const requestedCaption = values.brief.caption.trim() ? `Use the exact caption “${values.brief.caption.trim()}”.` : "Write one dry, affectionate sentence as the caption.";

  return [
    "Create one finished vertical postage-stamp sticker image. Generate the image now, not a written description.",
    `Creative brief: ${values.brief.description}.`,
    `Financial grade: ${values.brief.grade}. The emotional register is ${grade.mood}.`,
    `Hero subject: ${values.scene.hero}. Supporting cast: ${values.scene.supportingCast}.`,
    `Setting: ${values.scene.setting}. Composition: ${values.scene.composition}. Mood: ${values.scene.mood}.`,
    `Art direction: ${values.artDirection.illustrationStyle}, ${values.artDirection.detail}% visual detail, ${values.artDirection.characterEnergy}% character energy.`,
    `Palette: ${values.artDirection.palette}; dominant ink ${values.artDirection.primaryInk}; accent ${values.artDirection.accentInk}.`,
    `Stamp construction: ${values.paper.orientation}, ${values.artwork.imageArea}% illustration area, ${values.paper.padding}px ${values.paper.color} paper border, ${values.paper.perforation}px rounded perforations, ${values.footer.layout} footer layout.`,
    `Typography: ${values.type.personality}, bold editorial hierarchy, headline scale ${values.type.headlineScale}%. Grade mark style: ${values.type.gradeStyle}.`,
    `${requestedCopy} ${requestedCaption}`,
    `Print finish: paper age ${values.print.paperAge}%, grain ${values.print.grain}%, distress ${values.print.distress}%, ink spread ${values.print.inkSpread}%, contrast ${values.print.contrast}%, saturation ${values.print.saturation}%.`,
    values.type.showLabel ? `Clearly show the label “GRADE ${values.brief.grade}”.` : "Show only the grade letter without the word grade.",
    values.type.showIcons ? "Add a restrained bottom row of simple financial-health pictograms." : "Do not add a pictogram row.",
    `Backing: ${values.backing.show ? `${values.backing.color} outer backing` : "no outer backing"}. Footer: ${values.footer.show ? values.footer.backgroundColor : "none"}. Artwork background: ${values.artwork.backgroundColor}.`,
    "The output must follow the clean Grade-A collectible-stamp template: one perforated paper frame, a large single artwork window, editorial copy beneath it, and the grade on the right. Do not place a second complete stamp inside the artwork window. Keep all lettering legible and spelled correctly. Use a 3:4 portrait aspect ratio.",
  ].join("\n");
}
