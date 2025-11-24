#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then PY=python3; elif command -v python >/dev/null 2>&1; then PY=python; else echo "Python not found"; exit 1; fi
if [ ! -d ".venv" ]; then "$PY" -m venv .venv; fi
VENV_PY="./.venv/bin/python"
"$VENV_PY" -m pip install -U pip websockets
if ! lsof -ti:8000 >/dev/null 2>&1; then nohup "$VENV_PY" -m http.server 8000 >/dev/null 2>&1 & fi
IP="$($VENV_PY - <<'PYCODE'
import socket
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
try:
    s.connect(('8.8.8.8',80))
    print(s.getsockname()[0])
except Exception:
    print('localhost')
finally:
    s.close()
PYCODE
)"
echo "Relay URL: ws://$IP:8787"
exec "$VENV_PY" server.py
