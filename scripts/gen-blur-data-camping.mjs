import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// six real Camping-section photos added from the Facebook photo dump;
// unlike gen-blur-data.mjs (which reuses pre-shrunk panel_thumb files),
// these are resized down here directly from the full-size public/images copy.
const slugs = [
  "camping-pitches-overview",
  "camping-caravan-awning",
  "camping-tent-motorcycle",
  "camping-tent-pitch-cars",
  "camping-entrance-gate",
  "camping-sunset-motorhome",
];

const root = path.resolve(import.meta.dirname, "..");
const imagesDir = path.join(root, "public", "images");
const outFile = path.join(root, "lib", "blur-data.json");

const existing = JSON.parse(await readFile(outFile, "utf8"));

for (const slug of slugs) {
  const buf = await sharp(path.join(imagesDir, `${slug}.jpg`))
    .resize(16)
    .jpeg({ quality: 40 })
    .toBuffer();
  existing[slug] = `data:image/jpeg;base64,${buf.toString("base64")}`;
}

await writeFile(outFile, JSON.stringify(existing, null, 2) + "\n", "utf8");
console.log(`Added ${slugs.length} blur placeholders to lib/blur-data.json`);
