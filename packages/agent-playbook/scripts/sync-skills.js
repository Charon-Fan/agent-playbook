"use strict";

const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");
const sourceDir = path.join(repoRoot, "skills");
const targetDir = path.join(packageRoot, "skills");

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function copySkills() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Skills source not found: ${sourceDir}`);
    process.exit(1);
  }

  removeDir(targetDir);
  fs.cpSync(sourceDir, targetDir, { recursive: true });
}

function cleanSkills() {
  removeDir(targetDir);
}

const mode = process.argv[2] || "copy";
if (mode === "clean") {
  cleanSkills();
} else {
  copySkills();
}
