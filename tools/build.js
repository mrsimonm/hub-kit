#!/usr/bin/env node
/* Hub Kit build: copies the shared hub shell (hub-kit/shell/) into a family hub and fills in its own values.

   node tools/build.js <hubDir>          build one hub (e.g. ../margo-hub), then run its `tools/hub.js sync`
   node tools/build.js all               build every hub listed in hubs.json
   node tools/build.js <hubDir|all> --check [--diff]
                                         report which shell files would change (and show the diff); writes nothing

   Each hub needs hub.json (name, short, prefix, ...) and subjects.json next to its index.html.
   Placeholders like {{HUB_NAME}} in shell files are filled from hub.json. Lists generated from
   subjects.json (between HUB:BEGIN / HUB:END markers) are left to the hub's own `tools/hub.js sync`. */
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const KIT = path.resolve(__dirname, "..");
const SHELL = path.join(KIT, "shell");
const HEADER = "Generated from hub-kit/shell, edit there (then run: node ~/Projects/hub-kit/tools/build.js all).";
const TEXT_EXT = new Set([".js", ".html", ".webmanifest", ".json", ".rules", ".md", ""]);
const BAD_CHARS = /["<>\\`]/;

function walk(dir, base = dir, out = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((ent) => {
    if (ent.name === ".DS_Store" || /\.(orig|rej|bak)$|~$/.test(ent.name)) return; // skip editor/patch leftovers
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, base, out);
    else if (ent.isFile()) out.push(path.relative(base, full).split(path.sep).join("/"));
  });
  return out.sort();
}

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch (e) { throw new Error("Cannot read " + p + ": " + e.message); }
}

function placeholders(hub) {
  const need = ["id", "name", "short", "prefix", "description", "tagline", "school"];
  need.forEach((k) => {
    if (typeof hub[k] !== "string" || !hub[k]) throw new Error('hub.json is missing "' + k + '"');
    if (BAD_CHARS.test(hub[k])) throw new Error('hub.json "' + k + '" must not contain " < > \\ or `');
  });
  if (!/^[a-z][A-Za-z0-9]*$/.test(hub.prefix)) throw new Error('hub.json "prefix" must look like "studyHub"');
  if (!/^[a-z0-9-]+$/.test(hub.id)) throw new Error('hub.json "id" must look like "study-hub"');
  const colors = hub.colors || {};
  return {
    HUB_NAME: hub.name,
    HUB_SHORT: hub.short,
    PREFIX: hub.prefix,
    ID: hub.id,
    DESCRIPTION: hub.description,
    TAGLINE: hub.tagline,
    SCHOOL: hub.school,
    BG_COLOR: colors.background || "#10161A",
    THEME_COLOR: colors.theme || colors.background || "#10161A"
  };
}

function fill(text, vals, rel) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => {
    if (!(k in vals)) throw new Error("Unknown placeholder " + m + " in shell/" + rel);
    return vals[k];
  });
}

/* Put the "generated" note on the first line (after a shebang or doctype), in the file's own comment style. */
function addHeader(text, rel) {
  const ext = path.extname(rel);
  let note;
  if (ext === ".js") note = "/* " + HEADER + " */";
  else if (ext === ".html") note = "<!-- " + HEADER + " -->";
  else if (ext === ".rules") note = "// " + HEADER;
  else if (rel === ".gitignore") note = "# " + HEADER;
  else return text; // JSON and empty marker files cannot hold a comment
  const lines = text.split("\n");
  const at = (lines[0].startsWith("#!") || /^<!doctype/i.test(lines[0])) ? 1 : 0;
  lines.splice(at, 0, note);
  return lines.join("\n");
}

/* For --check: keep the hub's current generated lists and cache version, so only real shell changes show. */
function keepGenerated(fresh, current) {
  const re = /(\/\* HUB:BEGIN \*\/|<!-- HUB:BEGIN -->)[\s\S]*?(\/\* HUB:END \*\/|<!-- HUB:END -->)/g;
  const blocks = current.match(re) || [];
  let i = 0;
  let out = fresh.replace(re, (m) => (i < blocks.length ? blocks[i++] : m));
  const v = /^const V = "[^"]*";/m.exec(current);
  if (v) out = out.replace(/^const V = "[^"]*";/m, v[0]);
  return out;
}

function render(rel, vals) {
  const src = path.join(SHELL, rel);
  if (!TEXT_EXT.has(path.extname(rel))) return fs.readFileSync(src); // icons: copied as they are
  return Buffer.from(addHeader(fill(fs.readFileSync(src, "utf8"), vals, rel), rel), "utf8");
}

function buildHub(hubDir, opts) {
  const dir = path.resolve(hubDir);
  const label = path.basename(dir);
  ["hub.json", "subjects.json"].forEach((f) => {
    if (!fs.existsSync(path.join(dir, f))) throw new Error(label + ": missing " + f);
  });
  const vals = placeholders(readJson(path.join(dir, "hub.json")));
  readJson(path.join(dir, "subjects.json"));

  const changed = [];
  walk(SHELL).forEach((rel) => {
    const dest = path.join(dir, rel);
    const exists = fs.existsSync(dest);
    let want = render(rel, vals);
    const have = exists ? fs.readFileSync(dest) : null;
    if (opts.check && have && TEXT_EXT.has(path.extname(rel))) {
      want = Buffer.from(keepGenerated(want.toString("utf8"), have.toString("utf8")), "utf8");
    }
    if (have && have.equals(want)) return;
    changed.push(rel);
    if (opts.check) {
      if (opts.diff) showDiff(rel, have, want);
      return;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, want);
    if (rel.startsWith("tools/")) fs.chmodSync(dest, 0o755);
  });

  if (opts.check) {
    console.log((changed.length ? "⚠ " : "✓ ") + label + ": " + (changed.length
      ? changed.length + " shell file(s) would change: " + changed.join(", ")
      : "matches the shell"));
    return changed.length;
  }

  console.log("✓ " + label + ": wrote " + changed.length + " shell file(s)" + (changed.length ? " (" + changed.join(", ") + ")" : ""));
  const res = spawnSync(process.execPath, [path.join(dir, "tools", "hub.js"), "sync"], { cwd: dir, stdio: "inherit" });
  if (res.status !== 0) throw new Error(label + ": tools/hub.js sync failed");
  return changed.length;
}

function showDiff(rel, have, want) {
  if (!have) { console.log("--- new file: " + rel); return; }
  if (!TEXT_EXT.has(path.extname(rel))) { console.log("--- binary differs: " + rel); return; }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "hubkit-"));
  const a = path.join(tmp, "current"), b = path.join(tmp, "shell");
  fs.writeFileSync(a, have);
  fs.writeFileSync(b, want);
  const r = spawnSync("diff", ["-u", "--label", "hub/" + rel, "--label", "shell/" + rel, a, b], { encoding: "utf8" });
  process.stdout.write(r.stdout);
  fs.rmSync(tmp, { recursive: true, force: true });
}

function main() {
  const args = process.argv.slice(2);
  const opts = { check: args.includes("--check"), diff: args.includes("--diff") };
  const target = args.find((a) => !a.startsWith("--"));
  if (!target) {
    console.error("Usage: node tools/build.js <hubDir|all> [--check [--diff]]");
    process.exit(1);
  }
  const dirs = target === "all"
    ? readJson(path.join(KIT, "hubs.json")).map((d) => path.resolve(KIT, d))
    : [path.resolve(target)];

  let pending = 0;
  try {
    dirs.forEach((d) => { pending += buildHub(d, opts); });
  } catch (e) {
    console.error("✗ " + e.message);
    process.exit(1);
  }
  if (opts.check && pending) process.exit(2);
}

main();
