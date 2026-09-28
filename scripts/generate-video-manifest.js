const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const videoDir = path.join(root, "demo_videos");
const outputPath = path.join(videoDir, "manifest.json");
const outputScriptPath = path.join(videoDir, "manifest.js");
const videoExtensions = new Set([".mp4", ".webm", ".mov", ".m4v", ".ogg"]);

if (!fs.existsSync(videoDir)) {
  throw new Error(`Video directory not found: ${videoDir}`);
}

const videos = fs
  .readdirSync(videoDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => videoExtensions.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  .map((name) => ({
    name,
    src: `demo_videos/${name}`,
  }));

fs.writeFileSync(outputPath, `${JSON.stringify({ videos }, null, 2)}\n`);
fs.writeFileSync(outputScriptPath, `window.DEMO_VIDEOS = ${JSON.stringify(videos, null, 2)};\n`);
console.log(`Wrote ${videos.length} videos to ${path.relative(root, outputPath)} and ${path.relative(root, outputScriptPath)}`);
