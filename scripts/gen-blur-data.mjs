import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// maps semantic image slug -> source panel_thumb file in snimki/, used only
// to derive a tiny base64 blurDataURL. Full-size photos already live in public/images.
const map = {
  "beach-01": "imgi_56_panel_thumb_49671_7.jpg",
  "terrace-dappled-shade": "imgi_58_panel_thumb_49671_20.jpg",
  "hammock-golden-hour": "imgi_82_panel_thumb_49671_32.jpg",
  "terrace-blue-curtains": "imgi_32_panel_thumb_49671_14.jpg",
  "villa-porch-bbq": "imgi_40_panel_thumb_49671_11.jpg",
  "bungalow-tree-deck": "imgi_38_panel_thumb_49671_15.jpg",
  "bungalow-mint-curtains": "imgi_36_panel_thumb_49671_10.jpg",
  "terrace-kitchenette-combo": "imgi_42_panel_thumb_49671_12.jpg",
  "terrace-gazebo-bbq": "imgi_34_panel_thumb_49671_9.jpg",
  "kitchen-sink-01": "imgi_52_panel_thumb_49671_5.jpg",
  "kitchen-hotplate-oven": "imgi_44_panel_thumb_49671_13.jpg",
  "kitchen-outdoor-nook": "imgi_46_panel_thumb_49671_16.jpg",
  "kitchen-drawer-detail": "imgi_48_panel_thumb_49671_18.jpg",
  "kitchen-fridge-stove": "imgi_68_panel_thumb_49671_25.jpg",
  "bedroom-beach-mural": "imgi_60_panel_thumb_49671_21.jpg",
  "bedroom-amalfi-mural": "imgi_62_panel_thumb_49671_22.jpg",
  "bedroom-palm-mural": "imgi_64_panel_thumb_49671_23.jpg",
  "bedroom-tv-nook": "imgi_66_panel_thumb_49671_24.jpg",
  "bedroom-floral-01": "imgi_72_panel_thumb_49671_27.jpg",
  "bedroom-floral-twin": "imgi_74_panel_thumb_49671_28.jpg",
  "bedroom-eiffel-print": "imgi_76_panel_thumb_49671_29.jpg",
  "bedroom-geometric-wallpaper": "imgi_78_panel_thumb_49671_30.jpg",
};

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "snimki");
const outFile = path.join(root, "lib", "blur-data.json");

const result = {};
for (const [slug, filename] of Object.entries(map)) {
  const buf = await readFile(path.join(srcDir, filename));
  result[slug] = `data:image/jpeg;base64,${buf.toString("base64")}`;
}

await writeFile(outFile, JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(`Wrote ${Object.keys(result).length} blur placeholders to lib/blur-data.json`);
