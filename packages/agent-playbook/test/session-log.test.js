"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const binPath = path.resolve(__dirname, "..", "bin", "agent-playbook.js");

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agent-playbook-"));
}

test("session-log writes summary with commands and questions", () => {
  const tempDir = makeTempDir();
  const transcriptPath = path.join(tempDir, "transcript.jsonl");
  const sessionDir = path.join(tempDir, "sessions");

  const events = [
    { role: "user", content: "Create a PRD" },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "Run:\n```bash\nls -la\n```\nWhat next?",
        },
      ],
    },
  ];

  fs.writeFileSync(transcriptPath, events.map((event) => JSON.stringify(event)).join("\n"));

  const result = spawnSync(
    process.execPath,
    [
      binPath,
      "session-log",
      "--transcript-path",
      transcriptPath,
      "--cwd",
      tempDir,
      "--session-dir",
      sessionDir,
    ],
    { encoding: "utf8", input: "" }
  );

  assert.strictEqual(result.status, 0);

  const files = fs.readdirSync(sessionDir).filter((file) => file.endsWith(".md"));
  assert.strictEqual(files.length, 1);

  const content = fs.readFileSync(path.join(sessionDir, files[0]), "utf8");
  assert.match(content, /Commands detected: 1/);
  assert.match(content, /ls -la/);
  assert.match(content, /What next\?/);
});
