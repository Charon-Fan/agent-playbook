"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const PACKAGE_NAME = "@codeharbor/agent-playbook";
const APP_NAME = "agent-playbook";
const SKILLS_DIR_NAME = "skills";
const DEFAULT_SESSION_DIR = "sessions";
const LOCAL_CLI_DIR = "agent-playbook";
const HOOK_SOURCE_VALUE = "agent-playbook";

const packageJson = readJsonSafe(path.join(__dirname, "..", "package.json"));
const VERSION = packageJson.version || "0.0.0";

function main(argv, context) {
  const parsed = parseArgs(argv);
  const command = parsed.command || "help";
  const options = parsed.options;

  switch (command) {
    case "init":
      return handleInit(options, context);
    case "status":
      return handleStatus(options, context);
    case "doctor":
      return handleDoctor(options, context);
    case "repair":
      return handleRepair({ ...options, repair: true }, context);
    case "uninstall":
      return handleUninstall(options, context);
    case "session-log":
      return handleSessionLog(options);
    case "self-improve":
      return handleSelfImprove(options);
    case "help":
    case "--help":
    case "-h":
    default:
      printHelp();
      return Promise.resolve();
  }
}

function printHelp() {
  const text = [
    `${APP_NAME} ${VERSION}`,
    "",
    "Usage:",
    `  ${APP_NAME} init [--project] [--copy] [--overwrite] [--hooks] [--no-hooks] [--session-dir <path>] [--dry-run] [--repo <path>]`,
    `  ${APP_NAME} status [--project] [--repo <path>]`,
    `  ${APP_NAME} doctor [--project] [--repo <path>]`,
    `  ${APP_NAME} repair [--project] [--overwrite] [--repo <path>]`,
    `  ${APP_NAME} uninstall [--project] [--repo <path>]`,
    "",
    "Hook commands:",
    `  ${APP_NAME} session-log [--session-dir <path>]`,
    `  ${APP_NAME} self-improve`,
  ];
  console.log(text.join("\n"));
}

function parseArgs(argv) {
  const valueFlags = new Set(["session-dir", "repo", "transcript-path", "cwd", "hook-source"]);
  const options = {};
  const positionals = [];
  let command = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!command && !arg.startsWith("-")) {
      command = arg;
      continue;
    }

    if (arg.startsWith("--no-")) {
      const key = arg.slice(5);
      options[key] = false;
      continue;
    }

    if (arg.startsWith("--")) {
      const eqIndex = arg.indexOf("=");
      const key = eqIndex === -1 ? arg.slice(2) : arg.slice(2, eqIndex);
      const hasValue = eqIndex !== -1;

      if (hasValue) {
        options[key] = arg.slice(eqIndex + 1);
        continue;
      }

      if (valueFlags.has(key)) {
        const next = argv[i + 1];
        if (next && !next.startsWith("-")) {
          options[key] = next;
          i += 1;
        } else {
          options[key] = "";
        }
        continue;
      }

      options[key] = true;
      continue;
    }

    positionals.push(arg);
  }

  return { command, options, positionals };
}

function handleInit(options, context) {
  const settings = resolveSettings(options, context);
  const hooksEnabled = options.hooks !== false;
  const repoRoot = settings.repoRoot;
  const warnings = [];
  const overwriteState = createOverwriteState(options);

  if (!settings.skillsSource) {
    if (options.repair) {
      warnings.push("Skills directory not found; skipping skill linking.");
    } else {
      throw new Error("Unable to locate skills directory. Run from the agent-playbook repo or pass --repo.");
    }
  }

  ensureDir(settings.claudeSkillsDir, options["dry-run"]);
  ensureDir(settings.codexSkillsDir, options["dry-run"]);

  const manifest = {
    name: APP_NAME,
    version: VERSION,
    installedAt: new Date().toISOString(),
    repoRoot,
    copyMode: Boolean(options.copy),
    links: {
      claude: [],
      codex: [],
    },
  };

  let claudeLinks = { created: [], skipped: [] };
  let codexLinks = { created: [], skipped: [] };
  if (settings.skillsSource) {
    claudeLinks = linkSkills(settings.skillsSource, settings.claudeSkillsDir, options, overwriteState);
    codexLinks = linkSkills(settings.skillsSource, settings.codexSkillsDir, options, overwriteState);
    manifest.links.claude = claudeLinks.created;
    manifest.links.codex = codexLinks.created;

    if (!options["dry-run"]) {
      writeJson(path.join(settings.claudeSkillsDir, ".agent-playbook.json"), manifest);
    }
  }

  if (hooksEnabled) {
    const hookCommandPath = ensureLocalCli(settings, context, options);
    const hookUpdated = updateClaudeSettings(settings, hookCommandPath, options);
    if (hookUpdated === false) {
      warnings.push("Unable to update Claude settings (invalid JSON).");
    }
  }

  updateCodexConfig(settings, options);

  printInitSummary(settings, hooksEnabled, options, claudeLinks, codexLinks, warnings);
  return Promise.resolve();
}

function handleStatus(options, context) {
  const settings = resolveSettings(options, context || {});
  const status = collectStatus(settings);
  printStatus(status);
  return Promise.resolve();
}

function handleDoctor(options, context) {
  const settings = resolveSettings(options, context || {});
  const status = collectStatus(settings);
  const issues = summarizeIssues(status);

  printStatus(status);
  if (issues.length) {
    console.error("\nIssues detected:");
    issues.forEach((issue) => console.error(`- ${issue}`));
    process.exitCode = 1;
  } else {
    console.log("\nNo critical issues detected.");
  }

  return Promise.resolve();
}

function handleUninstall(options, context) {
  const settings = resolveSettings(options, context || {});
  const manifestPath = path.join(settings.claudeSkillsDir, ".agent-playbook.json");
  const manifest = readJsonSafe(manifestPath);

  if (manifest && manifest.links) {
    removeLinks(manifest.links.claude || []);
    removeLinks(manifest.links.codex || []);
    safeUnlink(manifestPath);
  } else {
    console.log("No manifest found. Skipping link removal.");
  }

  removeHooks(settings);
  removeCodexConfig(settings);
  removeLocalCli(settings);
  console.log("Uninstall complete.");
  return Promise.resolve();
}

async function handleSessionLog(options) {
  const input = await readStdinJson();
  const transcriptPath = options["transcript-path"] || input.transcript_path;
  const cwd = options.cwd || input.cwd || process.cwd();
  const sessionId = input.session_id || "unknown";
  const sessionDir = resolveSessionDir(options["session-dir"], cwd);

  ensureDir(sessionDir, false);

  const events = transcriptPath ? readTranscript(transcriptPath) : [];
  const insights = collectTranscriptInsights(events);
  const lastUserPrompt = insights.lastUserPrompt;
  const topic = buildTopic(lastUserPrompt, cwd);
  const fileName = `${formatDate(new Date())}-${topic}.md`;
  const outputPath = resolveUniquePath(path.join(sessionDir, fileName));
  const summary = buildSessionSummary(insights, sessionId, cwd);

  fs.writeFileSync(outputPath, summary, "utf8");
  console.error(`Session log saved to ${outputPath}`);
}

async function handleSelfImprove(options) {
  const input = await readStdinJson();
  const cwd = input.cwd || process.cwd();
  const sessionId = input.session_id || "unknown";
  const transcriptPath = input.transcript_path || "";
  const now = new Date();
  const memoryRoot = path.join(os.homedir(), ".claude", "memory");
  const episodicDir = path.join(memoryRoot, "episodic", String(now.getFullYear()));
  const workingDir = path.join(memoryRoot, "working");

  ensureDir(episodicDir, false);
  ensureDir(workingDir, false);

  const entry = {
    id: `ep-${now.toISOString()}`.replace(/[:.]/g, "-"),
    timestamp: now.toISOString(),
    session_id: sessionId,
    cwd,
    transcript_path: transcriptPath,
    agent_playbook_version: VERSION,
    hook_event: input.hook_event_name || "PostToolUse",
    tool_name: input.tool_name || "",
    tool_input: input.tool_input || "",
  };

  const entryPath = path.join(episodicDir, `${entry.id}.json`);
  fs.writeFileSync(entryPath, JSON.stringify(entry, null, 2));

  const workingPath = path.join(workingDir, "current_session.json");
  fs.writeFileSync(workingPath, JSON.stringify(entry, null, 2));
  console.error(`Self-improvement entry saved to ${entryPath}`);
}

function resolveSettings(options, context) {
  const cwd = process.cwd();
  const repoRoot = options.repo ? path.resolve(options.repo) : findRepoRoot(cwd);
  const cliRoot =
    context && context.cliPath ? path.resolve(path.dirname(context.cliPath), "..") : null;
  const skillsSource = resolveSkillsSource([repoRoot || cwd, cliRoot]);
  const projectMode = Boolean(options.project);

  const envClaudeDir = process.env.AGENT_PLAYBOOK_CLAUDE_DIR;
  const envCodexDir = process.env.AGENT_PLAYBOOK_CODEX_DIR;
  const claudeDir = envClaudeDir
    ? path.resolve(envClaudeDir)
    : projectMode
      ? path.join(repoRoot || cwd, ".claude")
      : path.join(os.homedir(), ".claude");
  const codexDir = envCodexDir
    ? path.resolve(envCodexDir)
    : projectMode
      ? path.join(repoRoot || cwd, ".codex")
      : path.join(os.homedir(), ".codex");

  return {
    cwd,
    repoRoot: repoRoot || cwd,
    skillsSource,
    projectMode,
    cliPath: context && context.cliPath ? context.cliPath : null,
    claudeDir,
    codexDir,
    claudeSkillsDir: path.join(claudeDir, SKILLS_DIR_NAME),
    codexSkillsDir: path.join(codexDir, SKILLS_DIR_NAME),
    claudeSettingsPath: path.join(claudeDir, "settings.json"),
    codexConfigPath: path.join(codexDir, "config.toml"),
  };
}

function findRepoRoot(startDir) {
  let current = startDir;
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, ".git"))) {
      return current;
    }
    current = path.dirname(current);
  }
  return null;
}

function findSkillsSource(startDir) {
  let current = startDir;
  while (current && current !== path.dirname(current)) {
    const candidate = path.join(current, SKILLS_DIR_NAME);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      const routerPath = path.join(candidate, "skill-router", "SKILL.md");
      if (fs.existsSync(routerPath)) {
        return candidate;
      }
    }
    current = path.dirname(current);
  }
  return null;
}

function resolveSkillsSource(candidates) {
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    const found = findSkillsSource(candidate);
    if (found) {
      return found;
    }
  }
  return null;
}

function createOverwriteState(options) {
  return {
    decision: options.overwrite === true ? true : null,
    prompted: false,
    nonInteractive: false,
  };
}

function promptYesNo(question, defaultYes) {
  const suffix = defaultYes ? "[Y/n]" : "[y/N]";
  process.stdout.write(`${question} ${suffix} `);
  let answer = "";
  try {
    answer = readLineSync().toLowerCase();
  } catch (error) {
    if (error && error.code === "EAGAIN") {
      console.error("Warning: unable to read prompt input; skipping overwrite.");
      return defaultYes;
    }
    throw error;
  }
  if (!answer) {
    return defaultYes;
  }
  return answer === "y" || answer === "yes";
}

function readLineSync() {
  const buffer = Buffer.alloc(1024);
  let input = "";
  const ttyPath = process.platform === "win32" ? null : "/dev/tty";
  let fd = 0;
  let shouldClose = false;

  if (ttyPath) {
    try {
      fd = fs.openSync(ttyPath, "r");
      shouldClose = true;
    } catch (error) {
      fd = 0;
    }
  }

  while (true) {
    let bytes = 0;
    try {
      bytes = fs.readSync(fd, buffer, 0, buffer.length, null);
    } catch (error) {
      if (error && error.code === "EAGAIN") {
        continue;
      }
      throw error;
    }
    if (bytes <= 0) {
      break;
    }
    input += buffer.toString("utf8", 0, bytes);
    if (input.includes("\n")) {
      break;
    }
  }
  if (shouldClose) {
    try {
      fs.closeSync(fd);
    } catch (error) {
      return input.trim();
    }
  }
  return input.trim();
}

function shouldOverwriteExisting(options, state, targetPath) {
  if (options.overwrite) {
    state.decision = true;
    return true;
  }
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    state.nonInteractive = true;
    return false;
  }
  if (state.decision !== null) {
    return state.decision;
  }
  state.prompted = true;
  state.decision = promptYesNo(
    `Existing skill found at ${targetPath}. Overwrite all existing skills?`,
    false
  );
  return state.decision;
}

function linkSkills(sourceDir, targetDir, options, overwriteState) {
  const created = [];
  const skipped = [];
  const overwritten = [];
  const state = overwriteState || createOverwriteState(options);
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  entries.forEach((entry) => {
    if (!entry.isDirectory()) {
      return;
    }
    if (entry.name.startsWith(".")) {
      return;
    }

    const skillDir = path.join(sourceDir, entry.name);
    const skillFile = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(skillFile)) {
      return;
    }

    const targetPath = path.join(targetDir, entry.name);
    if (fs.existsSync(targetPath)) {
      if (isSameLink(targetPath, skillDir)) {
        skipped.push({ source: skillDir, target: targetPath, reason: "already linked" });
        return;
      }
      if (!shouldOverwriteExisting(options, state, targetPath)) {
        skipped.push({ source: skillDir, target: targetPath, reason: "exists" });
        return;
      }
      overwritten.push({ source: skillDir, target: targetPath });
      if (!options["dry-run"]) {
        safeUnlink(targetPath);
      }
    }

    if (options["dry-run"]) {
      created.push({ source: skillDir, target: targetPath, mode: options.copy ? "copy" : "link", dryRun: true });
      return;
    }

    if (options.copy) {
      fs.cpSync(skillDir, targetPath, { recursive: true });
      created.push({ source: skillDir, target: targetPath, mode: "copy" });
      return;
    }

    const linkType = process.platform === "win32" ? "junction" : "dir";
    try {
      fs.symlinkSync(skillDir, targetPath, linkType);
      created.push({ source: skillDir, target: targetPath, mode: "link" });
    } catch (error) {
      fs.cpSync(skillDir, targetPath, { recursive: true });
      created.push({ source: skillDir, target: targetPath, mode: "copy", fallback: "symlink_failed" });
    }
  });

  return { created, skipped, overwritten };
}

function ensureLocalCli(settings, context, options) {
  const baseDir = settings.projectMode ? settings.claudeDir : settings.claudeDir;
  const cliRoot = path.join(baseDir, LOCAL_CLI_DIR);
  const targetBin = path.join(cliRoot, "bin", "agent-playbook.js");
  const sourceRoot = path.resolve(__dirname, "..");

  if (options["dry-run"]) {
    return targetBin;
  }

  ensureDir(cliRoot, false);
  fs.cpSync(path.join(sourceRoot, "bin"), path.join(cliRoot, "bin"), { recursive: true });
  fs.cpSync(path.join(sourceRoot, "src"), path.join(cliRoot, "src"), { recursive: true });
  fs.cpSync(path.join(sourceRoot, "package.json"), path.join(cliRoot, "package.json"));

  fs.chmodSync(targetBin, 0o755);
  return targetBin;
}

function updateClaudeSettings(settings, cliPath, options) {
  const settingsPath = settings.claudeSettingsPath;
  const existing = readJsonSafe(settingsPath);
  if (existing === null && fs.existsSync(settingsPath)) {
    console.error("Warning: unable to parse Claude settings.json, skipping hook update.");
    return false;
  }
  const data = existing || {};

  data.hooks = data.hooks || {};

  let sessionCommand = buildHookCommand(cliPath, "session-log");
  sessionCommand = `${sessionCommand} --hook-source ${HOOK_SOURCE_VALUE}`;
  if (options["session-dir"]) {
    const sessionDir = path.resolve(options["session-dir"]);
    sessionCommand = `${sessionCommand} --session-dir \"${sessionDir}\"`;
  }
  const improveCommand = `${buildHookCommand(cliPath, "self-improve")} --hook-source ${HOOK_SOURCE_VALUE}`;

  ensureHook(data.hooks, "SessionEnd", null, sessionCommand);
  ensureHook(data.hooks, "PostToolUse", "*", improveCommand);

  data.agentPlaybook = {
    version: VERSION,
    installedAt: new Date().toISOString(),
    cliPath,
  };

  if (!options["dry-run"]) {
    backupFile(settingsPath);
    ensureDir(path.dirname(settingsPath), false);
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
  }
  return true;
}

function removeHooks(settings) {
  const settingsPath = settings.claudeSettingsPath;
  const data = readJsonSafe(settingsPath);
  if (!data || !data.hooks) {
    return;
  }

  const marker = `--hook-source ${HOOK_SOURCE_VALUE}`;
  data.hooks = removeHookCommand(data.hooks, "SessionEnd", marker);
  data.hooks = removeHookCommand(data.hooks, "PostToolUse", marker);

  delete data.agentPlaybook;

  fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
}

function updateCodexConfig(settings, options) {
  if (options["dry-run"]) {
    return;
  }

  ensureDir(settings.codexDir, false);
  const configPath = settings.codexConfigPath;
  const content = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  const updated = upsertCodexBlock(content, {
    version: VERSION,
    installed_at: new Date().toISOString(),
  });

  backupFile(configPath);
  fs.writeFileSync(configPath, updated);
}

function removeCodexConfig(settings) {
  const configPath = settings.codexConfigPath;
  if (!fs.existsSync(configPath)) {
    return;
  }
  const content = fs.readFileSync(configPath, "utf8");
  const cleaned = removeCodexBlock(content);
  fs.writeFileSync(configPath, cleaned);
}

function removeLocalCli(settings) {
  const cliRoot = path.join(settings.claudeDir, LOCAL_CLI_DIR);
  if (fs.existsSync(cliRoot)) {
    fs.rmSync(cliRoot, { recursive: true, force: true });
  }
}

function removeLinks(links) {
  links.forEach((link) => {
    if (!link || !link.target) {
      return;
    }
    safeUnlink(link.target);
  });
}

function ensureHook(hooks, eventName, matcher, command) {
  hooks[eventName] = hooks[eventName] || [];
  const entries = hooks[eventName];

  let entry = entries.find((item) => (matcher ? item.matcher === matcher : !item.matcher));
  if (!entry) {
    entry = matcher ? { matcher, hooks: [] } : { hooks: [] };
    entries.push(entry);
  }

  entry.hooks = entry.hooks || [];
  const exists = entry.hooks.some((hook) => hook.command === command);
  if (!exists) {
    entry.hooks.push({ type: "command", command });
  }
}

function removeHookCommand(hooks, eventName, command) {
  const entries = hooks[eventName];
  if (!entries) {
    return hooks;
  }

  hooks[eventName] = entries
    .map((entry) => {
      const nextHooks = (entry.hooks || []).filter((hook) => !String(hook.command || "").includes(command));
      return { ...entry, hooks: nextHooks };
    })
    .filter((entry) => (entry.hooks || []).length > 0);

  if (!hooks[eventName].length) {
    delete hooks[eventName];
  }

  return hooks;
}

function upsertCodexBlock(content, values) {
  const cleaned = removeCodexBlock(content);
  const lines = [
    cleaned.trimEnd(),
    "",
    "[agent_playbook]",
    `version = \"${values.version}\"`,
    `installed_at = \"${values.installed_at}\"`,
    "",
  ];
  return lines.join("\n");
}

function removeCodexBlock(content) {
  const pattern = /^\[agent_playbook\][\s\S]*?(?=^\[|\s*$)/m;
  return content.replace(pattern, "").trimEnd();
}

function buildHookCommand(cliPath, subcommand) {
  const quoted = cliPath.includes(" ") ? `\"${cliPath}\"` : cliPath;
  return `${quoted} ${subcommand}`;
}

function resolveSessionDir(explicit, cwd) {
  if (explicit) {
    return path.resolve(explicit);
  }

  const repoRoot = findRepoRoot(cwd);
  if (repoRoot) {
    return path.join(repoRoot, DEFAULT_SESSION_DIR);
  }

  return path.join(os.homedir(), ".claude", DEFAULT_SESSION_DIR);
}

function readTranscript(transcriptPath) {
  if (!fs.existsSync(transcriptPath)) {
    return [];
  }
  const lines = fs.readFileSync(transcriptPath, "utf8").split("\n");
  const events = [];

  lines.forEach((line) => {
    if (!line.trim()) {
      return;
    }
    try {
      events.push(JSON.parse(line));
    } catch (error) {
      return;
    }
  });

  return events;
}

function resolveUniquePath(filePath) {
  if (!fs.existsSync(filePath)) {
    return filePath;
  }
  const parsed = path.parse(filePath);
  let counter = 1;
  let candidate = filePath;
  while (fs.existsSync(candidate)) {
    candidate = path.join(parsed.dir, `${parsed.name}-${counter}${parsed.ext}`);
    counter += 1;
  }
  return candidate;
}

function collectTranscriptInsights(events) {
  const insights = {
    userMessages: [],
    assistantMessages: [],
    commands: [],
    files: [],
    questions: [],
    lastUserPrompt: "",
  };

  events.forEach((event) => {
    const role = getEventRole(event);
    const text = extractEventText(event);

    if (!text) {
      return;
    }

    if (role === "user") {
      insights.userMessages.push(text);
      insights.lastUserPrompt = text;
    }

    if (role === "assistant") {
      insights.assistantMessages.push(text);
      insights.commands.push(...extractCommands(text));
      insights.questions.push(...extractQuestions(text));
    }

    insights.files.push(...extractFilePaths(text));
  });

  insights.commands = uniqueList(insights.commands, 12);
  insights.files = uniqueList(insights.files, 12);
  insights.questions = uniqueList(insights.questions, 8);

  return insights;
}

function getEventRole(event) {
  if (!event) {
    return "";
  }
  if (event.message && typeof event.message.role === "string") {
    return event.message.role;
  }
  if (typeof event.role === "string") {
    return event.role;
  }
  if (event.type === "user" || event.type === "assistant") {
    return event.type;
  }
  return "";
}

function extractEventText(event) {
  if (!event) {
    return "";
  }
  if (event.message) {
    if (event.message.content) {
      return extractText(event.message.content);
    }
    if (event.message.text) {
      return extractText(event.message.text);
    }
  }
  if (event.content) {
    return extractText(event.content);
  }
  if (event.text) {
    return extractText(event.text);
  }
  return "";
}

function extractCommands(text) {
  const commands = [];
  if (!text) {
    return commands;
  }

  const paramRegex = /<parameter name=\"command\">([\s\S]*?)<\/parameter>/g;
  let match = paramRegex.exec(text);
  while (match) {
    commands.push(...splitCommands(match[1]));
    match = paramRegex.exec(text);
  }

  const fenceRegex = /```(?:bash|sh|zsh|shell)?\n([\s\S]*?)```/g;
  match = fenceRegex.exec(text);
  while (match) {
    commands.push(...splitCommands(match[1]));
    match = fenceRegex.exec(text);
  }

  return commands.map((cmd) => cmd.trim()).filter(Boolean);
}

function splitCommands(block) {
  return String(block || "")
    .split("\n")
    .map((line) => line.replace(/^\s*\$\s?/, "").trim())
    .filter((line) => line && !line.startsWith("#"));
}

function extractQuestions(text) {
  if (!text) {
    return [];
  }
  const questions = [];
  const lines = text.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.includes("?") && trimmed.length <= 200) {
      questions.push(trimmed.replace(/^[*-]\s*/, ""));
    }
  });
  return questions;
}

function extractFilePaths(text) {
  if (!text) {
    return [];
  }
  const regex = /\b[\w./~\-]+?\.(?:md|mdx|json|jsonl|js|ts|tsx|jsx|py|sh|toml|yaml|yml|txt|lock)\b/gi;
  const matches = text.match(regex);
  return matches ? matches : [];
}

function extractText(content) {
  if (!content) {
    return "";
  }
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item.text === "string") {
          return item.text;
        }
        return "";
      })
      .join("\n")
      .trim();
  }
  if (content && typeof content.text === "string") {
    return content.text;
  }
  return "";
}

function buildTopic(prompt, cwd) {
  if (prompt) {
    return slugify(prompt).slice(0, 40) || "session";
  }

  return slugify(path.basename(cwd)) || "session";
}

function buildSessionSummary(insights, sessionId, cwd) {
  const now = new Date();
  const date = formatDate(now);
  const repoRoot = findRepoRoot(cwd) || cwd;
  const title = insights.lastUserPrompt ? trimTo(insights.lastUserPrompt, 60) : "Session";
  const actions = insights.commands.length
    ? insights.commands.map((cmd) => `- [x] \`${trimTo(cmd, 120)}\``)
    : ["- [ ] (auto) No commands captured"];
  const relatedFiles = insights.files.length
    ? insights.files.map((file) => `- \`${file}\``)
    : ["- (auto) None captured"];
  const questions = insights.questions.length
    ? insights.questions.map((question) => `- ${question}`)
    : ["- (auto) None captured"];

  const summaryLines = [
    `# Session: ${title}`,
    "",
    `**Date**: ${date}`,
    `**Duration**: unknown`,
    `**Context**: ${repoRoot}`,
    `**Agent Playbook Version**: ${VERSION}`,
    "",
    "## Summary",
    "Auto-generated session log.",
    `- Messages: ${insights.userMessages.length} user, ${insights.assistantMessages.length} assistant`,
    `- Commands detected: ${insights.commands.length}`,
    `- Files referenced: ${insights.files.length}`,
    insights.lastUserPrompt
      ? `- Last user prompt: ${trimTo(insights.lastUserPrompt, 120)}`
      : "- Last user prompt: (not available)",
    "",
    "## Key Decisions",
    "1. (auto) No structured decisions extracted",
    "",
    "## Actions Taken",
    ...actions,
    "",
    "## Technical Notes",
    `Session ID: ${sessionId}`,
    `Working directory: ${cwd}`,
    "",
    "## Open Questions / Follow-ups",
    ...questions,
    "",
    "## Related Files",
    ...relatedFiles,
    "",
  ];

  return summaryLines.join("\n");
}

function collectStatus(settings) {
  const claudeSettings = readJsonSafe(settings.claudeSettingsPath);
  return {
    skillsSource: settings.skillsSource,
    claudeSettingsPath: settings.claudeSettingsPath,
    codexConfigPath: settings.codexConfigPath,
    claudeSkillsDir: settings.claudeSkillsDir,
    codexSkillsDir: settings.codexSkillsDir,
    claudeSettingsReadable: claudeSettings !== null || !fs.existsSync(settings.claudeSettingsPath),
    codexBlockPresent: hasCodexBlock(settings.codexConfigPath),
    hooksInstalled: hasHooks(settings.claudeSettingsPath),
    manifestPresent: fs.existsSync(path.join(settings.claudeSkillsDir, ".agent-playbook.json")),
    localCliPresent: fs.existsSync(path.join(settings.claudeDir, LOCAL_CLI_DIR, "bin", "agent-playbook.js")),
    claudeSkillCount: countSkills(settings.claudeSkillsDir),
    codexSkillCount: countSkills(settings.codexSkillsDir),
  };
}

function hasHooks(settingsPath) {
  const data = readJsonSafe(settingsPath);
  if (!data || !data.hooks) {
    return false;
  }
  const sessionHook = (data.hooks.SessionEnd || []).some((entry) =>
    (entry.hooks || []).some((hook) => String(hook.command || "").includes("session-log"))
  );
  const improveHook = (data.hooks.PostToolUse || []).some((entry) =>
    (entry.hooks || []).some((hook) => String(hook.command || "").includes("self-improve"))
  );
  return sessionHook && improveHook;
}

function summarizeIssues(status) {
  const issues = [];
  if (!status.skillsSource) {
    issues.push("skills source not found (run init from repo or use --repo)");
  }
  if (!status.claudeSettingsReadable) {
    issues.push("unable to parse ~/.claude/settings.json");
  }
  if (!status.manifestPresent) {
    issues.push("missing skill manifest (.agent-playbook.json)");
  }
  if (!status.hooksInstalled) {
    issues.push("hooks not installed");
  }
  if (!status.localCliPresent) {
    issues.push("local CLI not installed under ~/.claude/agent-playbook");
  }
  if (!status.codexBlockPresent) {
    issues.push("Codex config missing agent_playbook block");
  }
  return issues;
}

function printStatus(status) {
  console.log("Agent Playbook Status:");
  console.log(`- Skills source: ${status.skillsSource || "(not found)"}`);
  console.log(`- Claude settings: ${status.claudeSettingsPath}`);
  console.log(`- Codex config: ${status.codexConfigPath}`);
  console.log(`- Claude skills: ${status.claudeSkillsDir}`);
  console.log(`- Codex skills: ${status.codexSkillsDir}`);
  console.log(`- Claude skills count: ${status.claudeSkillCount}`);
  console.log(`- Codex skills count: ${status.codexSkillCount}`);
  console.log(`- Hooks installed: ${status.hooksInstalled ? "yes" : "no"}`);
  console.log(`- Manifest present: ${status.manifestPresent ? "yes" : "no"}`);
  console.log(`- Local CLI present: ${status.localCliPresent ? "yes" : "no"}`);
  console.log(`- Codex config block: ${status.codexBlockPresent ? "yes" : "no"}`);
}

function printInitSummary(settings, hooksEnabled, options, claudeLinks, codexLinks, warnings) {
  console.log("Init complete.");
  console.log(`- Claude skills: ${settings.claudeSkillsDir}`);
  console.log(`- Codex skills: ${settings.codexSkillsDir}`);
  console.log(`- Hooks: ${hooksEnabled ? "enabled" : "disabled"}`);
  console.log(`- Linked skills: ${claudeLinks.created.length + codexLinks.created.length}`);
  const overwrittenCount =
    (claudeLinks.overwritten ? claudeLinks.overwritten.length : 0) +
    (codexLinks.overwritten ? codexLinks.overwritten.length : 0);
  if (overwrittenCount) {
    console.log(`- Overwritten skills: ${overwrittenCount}`);
  }
  if (claudeLinks.skipped.length || codexLinks.skipped.length) {
    console.log("- Some skills were skipped due to existing paths.");
  }
  if (warnings && warnings.length) {
    warnings.forEach((warning) => console.log(`- Warning: ${warning}`));
  }
  if (options["dry-run"]) {
    console.log("- Dry run: no changes written.");
  }
}

function uniqueList(items, limit) {
  const seen = new Set();
  const result = [];
  items.forEach((item) => {
    const value = String(item || "").trim();
    if (!value || seen.has(value)) {
      return;
    }
    seen.add(value);
    result.push(value);
    if (limit && result.length >= limit) {
      return;
    }
  });
  return result;
}

function countSkills(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return 0;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let count = 0;
  entries.forEach((entry) => {
    if (!entry.isDirectory() && !entry.isSymbolicLink()) {
      return;
    }
    const skillPath = path.join(dirPath, entry.name);
    const skillFile = path.join(skillPath, "SKILL.md");
    if (fs.existsSync(skillFile)) {
      count += 1;
    }
  });
  return count;
}

function hasCodexBlock(configPath) {
  if (!fs.existsSync(configPath)) {
    return false;
  }
  const content = fs.readFileSync(configPath, "utf8");
  return /^\[agent_playbook\]/m.test(content);
}

function backupFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const backupPath = `${filePath}.bak`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }
}

function isSameLink(targetPath, sourcePath) {
  try {
    const stat = fs.lstatSync(targetPath);
    if (!stat.isSymbolicLink()) {
      return false;
    }
    const realTarget = fs.realpathSync(targetPath);
    return realTarget === sourcePath;
  } catch (error) {
    return false;
  }
}

function ensureDir(dirPath, dryRun) {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return null;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function safeUnlink(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function trimTo(value, length) {
  const text = String(value || "");
  if (text.length <= length) {
    return text;
  }
  return `${text.slice(0, length - 3)}...`;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function readStdinJson() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve({});
      return;
    }
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => {
      if (!input.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(input));
      } catch (error) {
        resolve({});
      }
    });
  });
}

module.exports = { main };
function handleRepair(options, context) {
  const settings = resolveSettings(options, context);
  const status = collectStatus(settings);
  const warnings = [];
  const overwriteState = createOverwriteState(options);

  if (!settings.skillsSource) {
    warnings.push("Skills directory not found; skipping skill linking.");
  }

  if (!options["dry-run"]) {
    ensureDir(settings.claudeSkillsDir, false);
    ensureDir(settings.codexSkillsDir, false);
  }

  if (!status.localCliPresent) {
    ensureLocalCli(settings, context, options);
  }

  if (!status.hooksInstalled) {
    const updated = updateClaudeSettings(
      settings,
      path.join(settings.claudeDir, LOCAL_CLI_DIR, "bin", "agent-playbook.js"),
      options
    );
    if (updated === false) {
      warnings.push("Unable to update Claude settings (invalid JSON).");
    }
  }

  if (!status.codexBlockPresent) {
    updateCodexConfig(settings, options);
  }

  if (settings.skillsSource) {
    linkSkills(settings.skillsSource, settings.claudeSkillsDir, options, overwriteState);
    linkSkills(settings.skillsSource, settings.codexSkillsDir, options, overwriteState);
    if (!options["dry-run"]) {
      const manifestPath = path.join(settings.claudeSkillsDir, ".agent-playbook.json");
      if (!fs.existsSync(manifestPath)) {
        writeJson(manifestPath, {
          name: APP_NAME,
          version: VERSION,
          installedAt: new Date().toISOString(),
          repairedAt: new Date().toISOString(),
          repoRoot: settings.repoRoot,
          links: { claude: [], codex: [] },
        });
      }
    }
  }

  printInitSummary(settings, true, options, { created: [], skipped: [] }, { created: [], skipped: [] }, warnings);
  return Promise.resolve();
}
