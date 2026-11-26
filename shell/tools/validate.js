#!/usr/bin/env node
/* Runs each sub-hub's lecture validator across every subject in subjects.json. */
"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const RUNS = [
  /* HUB:BEGIN */
  /* HUB:END */
];

let failed = false;
RUNS.forEach((r) => {
  console.log("=== " + r.label + " ===");
  const res = spawnSync(process.execPath, r.args, { cwd: r.cwd, stdio: "inherit" });
  if (res.status !== 0) failed = true;
});

process.exit(failed ? 1 : 0);
