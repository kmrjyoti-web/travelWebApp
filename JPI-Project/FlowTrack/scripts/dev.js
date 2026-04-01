#!/usr/bin/env node

/**
 * FlowTrack Dev Launcher
 *
 * Usage:
 *   node scripts/dev.js              → start both API + UI (kills ports first)
 *   node scripts/dev.js --api-only   → start API only
 *   node scripts/dev.js --ui-only    → start UI only
 *   node scripts/dev.js --stop       → kill both ports
 */

const { execSync, spawn } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const API_DIR = path.join(ROOT, "API");
const UI_DIR = path.join(ROOT, "UI", "flotrak-ui");
const API_PORT = 4000;
const UI_PORT = 3002;

const args = process.argv.slice(2);
const apiOnly = args.includes("--api-only");
const uiOnly = args.includes("--ui-only");
const stopOnly = args.includes("--stop");

// ─── Helpers ──────────────────────────────────────────────────

function killPort(port) {
  let pids = [];
  try {
    pids = execSync(`lsof -ti tcp:${port} 2>/dev/null`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch (_) {
    // lsof found nothing
  }

  if (pids.length === 0) {
    console.log(`  ✓ Port ${port} is free.`);
    return;
  }

  console.log(`  ⚡ Port ${port} in use by PID(s) ${pids.join(", ")} — killing...`);

  // Step 1: SIGTERM (graceful)
  pids.forEach((pid) => {
    try { process.kill(Number(pid), "SIGTERM"); } catch (_) {}
  });
  execSync("sleep 1");

  // Step 2: SIGKILL any survivors
  pids.forEach((pid) => {
    try {
      process.kill(Number(pid), 0); // check if still alive
      process.kill(Number(pid), "SIGKILL");
      console.log(`  ⚡ Force-killed PID ${pid}`);
    } catch (_) {}
  });
  execSync("sleep 1");

  // Step 3: Verify port is actually free now
  try {
    const remaining = execSync(`lsof -ti tcp:${port} 2>/dev/null`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    if (remaining.length > 0) {
      console.error(`  ✗ Port ${port} still in use! Try: kill -9 ${remaining.join(" ")}`);
    } else {
      console.log(`  ✓ Port ${port} freed.`);
    }
  } catch (_) {
    console.log(`  ✓ Port ${port} freed.`);
  }
}

function startProcess(label, cwd, command, env = {}) {
  console.log(`\n▶ Starting ${label} ...`);

  const child = spawn("bash", ["-c", command], {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
    detached: false,
  });

  child.on("error", (err) => {
    console.error(`✗ ${label} failed to start: ${err.message}`);
  });

  child.on("exit", (code, signal) => {
    // 143 = SIGTERM (128+15), null signal = killed — both are normal shutdowns
    const isGraceful = code === 0 || code === 143 || signal === "SIGTERM" || signal === "SIGINT";
    if (!isGraceful && code !== null) {
      console.error(`✗ ${label} exited with code ${code}`);
    }
  });

  return child;
}

// ─── Main ─────────────────────────────────────────────────────

if (stopOnly) {
  console.log("\n🛑 Stopping FlowTrack...");
  killPort(API_PORT);
  killPort(UI_PORT);
  console.log("\n✓ Done.\n");
  process.exit(0);
}

const runApi = !uiOnly;
const runUi = !apiOnly;

console.log("\n🚀 FlowTrack Dev Launcher");
console.log("──────────────────────────");

if (runApi) {
  console.log(`\n⚡ API  → port ${API_PORT}`);
  killPort(API_PORT);
}

if (runUi) {
  console.log(`⚡ UI   → port ${UI_PORT}`);
  killPort(UI_PORT);
}

console.log("\n──────────────────────────");

const children = [];

if (runApi) {
  const api = startProcess("API", API_DIR, "npm run dev", {});
  children.push(api);
}

if (runUi) {
  // Small delay so API gets a head start.
  // Use plain `next dev` (no HTTPS) so browser can reach local API on http.
  setTimeout(() => {
    const ui = startProcess("UI", UI_DIR, `npx next dev -p ${UI_PORT}`, {
      PORT: String(UI_PORT),
      NEXT_PUBLIC_API_URL:   `http://localhost:${API_PORT}/api/v1`,
      NEXT_PUBLIC_TENANT_ID: "588cfa4c-a200-4eb6-b85f-edb08626437c",
    });
    children.push(ui);
  }, runApi ? 2000 : 0);
}

// ─── Graceful shutdown on Ctrl+C ──────────────────────────────

function shutdown() {
  console.log("\n\n🛑 Shutting down...");
  children.forEach((child) => {
    try {
      child.kill("SIGTERM");
    } catch (_) {}
  });
  killPort(API_PORT);
  killPort(UI_PORT);
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
