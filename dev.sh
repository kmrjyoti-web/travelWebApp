#!/usr/bin/env bash
# ============================================================
# TravelOS — unified dev launcher
# Usage:  ./dev.sh          (start both)
#         ./dev.sh stop     (stop both)
#         ./dev.sh restart  (stop then start)
# ============================================================

FRONTEND_PORT=9200
BACKEND_PORT=9201
FRONTEND_DIR="$(cd "$(dirname "$0")/travelOS-web" && pwd)"
BACKEND_DIR="$(cd "$(dirname "$0")/SharedCore/apps/travel-os" && pwd)"
LOG_DIR="$(dirname "$0")/.dev-logs"

mkdir -p "$LOG_DIR"

# ── helpers ──────────────────────────────────────────────────
kill_port() {
  local port=$1
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "  [stop] killing PID(s) $pids on port $port"
    echo "$pids" | xargs kill -9 2>/dev/null
    sleep 0.5
  else
    echo "  [stop] port $port is free"
  fi
}

stop_all() {
  echo ""
  echo "🛑  Stopping TravelOS..."
  kill_port "$FRONTEND_PORT"
  kill_port "$BACKEND_PORT"
  echo "✅  All stopped."
}

start_all() {
  echo ""
  echo "🚀  Starting TravelOS..."
  echo "    Frontend  → http://localhost:${FRONTEND_PORT}"
  echo "    Backend   → http://localhost:${BACKEND_PORT}/api/v1"
  echo "    Logs      → ${LOG_DIR}/"
  echo ""

  # ── Backend (Express + ts-node-dev) ──────────────────────
  echo "▶   Starting backend on :${BACKEND_PORT}..."
  (
    cd "$BACKEND_DIR" || exit 1
    pnpm run dev >> "$LOG_DIR/backend.log" 2>&1
  ) &
  BACKEND_PID=$!
  echo "    backend PID: $BACKEND_PID"

  # wait a moment for backend to bind before starting frontend
  sleep 2

  # ── Frontend (Next.js) ───────────────────────────────────
  echo "▶   Starting frontend on :${FRONTEND_PORT}..."
  (
    cd "$FRONTEND_DIR" || exit 1
    pnpm run dev -- -p "$FRONTEND_PORT" >> "$LOG_DIR/frontend.log" 2>&1
  ) &
  FRONTEND_PID=$!
  echo "    frontend PID: $FRONTEND_PID"

  echo ""
  echo "✅  Both services started."
  echo "    Tail logs:  tail -f ${LOG_DIR}/backend.log"
  echo "                tail -f ${LOG_DIR}/frontend.log"
  echo ""
  echo "Press Ctrl+C to stop both."

  # trap Ctrl+C and kill both
  trap 'echo ""; stop_all; exit 0' INT TERM

  # keep script alive
  wait $BACKEND_PID $FRONTEND_PID
}

# ── main ─────────────────────────────────────────────────────
case "${1:-start}" in
  stop)
    stop_all
    ;;
  restart)
    stop_all
    sleep 1
    start_all
    ;;
  start|*)
    stop_all
    start_all
    ;;
esac
