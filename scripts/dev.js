#!/usr/bin/env node
/**
 * TravelOS — Unified Dev Launcher
 * ================================
 * RULES (do not change without updating MEMORY.md):
 *
 * 1. PORTS        — Frontend: 9200  |  Backend: 9201
 * 2. PACKAGE MGR  — Use `npm run` ONLY. Never mix pnpm + npm in this script.
 * 3. BACKEND      — Run via `npm run dev --workspace=apps/travel-os` from SharedCore/ root.
 *                   SharedCore is an npm workspace; ts-node-dev is in SharedCore/node_modules/.bin.
 * 4. FRONTEND     — Run `npm run dev` with PORT env var (NOT -p flag; Next.js 14 uses PORT).
 * 5. TRANSPILE    — Backend uses --transpile-only to skip @types/pg dual-version TS conflict.
 * 6. LOGS         — Written to .dev-logs/backend.log and .dev-logs/frontend.log
 *
 * Commands:
 *   npm run dev:all      → stop ports 9200/9201, then start both
 *   npm run stop:all     → kill both ports
 *   npm run restart:all  → stop then start
 */

const { execSync, spawn } = require('child_process');
const path = require('path');

const ROOT          = path.resolve(__dirname, '..');
const FRONTEND      = path.join(ROOT, 'travelOS-web');
const SHAREDCORE    = path.join(ROOT, 'SharedCore');          // npm workspace root
const FRONTEND_PORT = 9200;
const BACKEND_PORT  = 9201;
const LOG_DIR     = path.join(ROOT, '.dev-logs');

const fs = require('fs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

// ── Kill a port ──────────────────────────────────────────────
function killPort(port) {
  try {
    const pids = execSync(`lsof -ti tcp:${port} 2>/dev/null`, { encoding: 'utf8' }).trim();
    if (pids) {
      pids.split('\n').forEach(pid => {
        try { execSync(`kill -9 ${pid}`); } catch {}
      });
      console.log(`  [stop] killed port ${port} (PID ${pids.replace(/\n/g, ',')})`);
    } else {
      console.log(`  [stop] port ${port} is free`);
    }
  } catch {
    console.log(`  [stop] port ${port} is free`);
  }
}

function stopAll() {
  console.log('\n🛑  Stopping TravelOS...');
  killPort(FRONTEND_PORT);
  killPort(BACKEND_PORT);
  console.log('✅  All stopped.\n');
}

function startAll() {
  console.log(`\n🚀  Starting TravelOS...`);
  console.log(`    Frontend  → http://localhost:${FRONTEND_PORT}`);
  console.log(`    Backend   → http://localhost:${BACKEND_PORT}/api/v1`);
  console.log(`    Logs      → ${LOG_DIR}/\n`);

  const backendLog  = fs.openSync(path.join(LOG_DIR, 'backend.log'),  'a');
  const frontendLog = fs.openSync(path.join(LOG_DIR, 'frontend.log'), 'a');

  // ── Backend (npm workspace — SharedCore root) ────────────
  const api = spawn('npm', ['run', 'dev', '--workspace=apps/travel-os'], {
    cwd: SHAREDCORE,
    env: { ...process.env, PORT: String(BACKEND_PORT) },
    stdio: ['ignore', backendLog, backendLog],
    detached: false,
  });
  console.log(`▶   Backend  started  (PID ${api.pid})`);

  // Wait 2s for backend to bind before starting frontend
  setTimeout(() => {
    // ── Frontend (npm run dev in travelOS-web) ────────────
    const web = spawn('npm', ['run', 'dev'], {
      cwd: FRONTEND,
      env: { ...process.env, PORT: String(FRONTEND_PORT) },
      stdio: ['ignore', frontendLog, frontendLog],
      detached: false,
    });
    console.log(`▶   Frontend started  (PID ${web.pid})`);
    console.log(`\n✅  Both running. Press Ctrl+C to stop.`);
    console.log(`    tail -f ${LOG_DIR}/backend.log`);
    console.log(`    tail -f ${LOG_DIR}/frontend.log\n`);

    const shutdown = () => {
      console.log('\n⛔  Shutting down...');
      api.kill();
      web.kill();
      process.exit(0);
    };
    process.on('SIGINT',  shutdown);
    process.on('SIGTERM', shutdown);

    web.on('exit', code => { if (code !== 0 && code !== null) console.error(`[frontend] exited with code ${code}`); });
    api.on('exit', code => { if (code !== 0 && code !== null) console.error(`[backend]  exited with code ${code}`); });
  }, 2000);
}

// ── Entry ────────────────────────────────────────────────────
const cmd = process.argv[2] ?? 'start';

if (cmd === 'stop') {
  stopAll();
} else if (cmd === 'restart') {
  stopAll();
  setTimeout(startAll, 1000);
} else {
  stopAll();
  startAll();
}
