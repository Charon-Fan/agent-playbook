#!/usr/bin/env node
"use strict";

const path = require("path");
const { main } = require("../src/cli");

const argv = process.argv.slice(2);
const cliPath = path.resolve(__dirname, "agent-playbook.js");

main(argv, { cliPath }).catch((error) => {
  const message = error && error.stack ? error.stack : String(error || "Unknown error");
  console.error(message);
  process.exit(1);
});
