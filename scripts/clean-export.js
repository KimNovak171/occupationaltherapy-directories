const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
      continue;
    }
    if (!ent.isFile()) continue;

    const lower = ent.name.toLowerCase();
    if (lower.endsWith(".txt") && lower !== "robots.txt") {
      fs.unlinkSync(full);
    }
  }
}

if (!fs.existsSync(OUT_DIR)) {
  process.exit(0);
}

const stat = fs.statSync(OUT_DIR);
if (!stat.isDirectory()) {
  process.exit(0);
}

walk(OUT_DIR);
