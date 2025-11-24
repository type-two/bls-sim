import asyncio
import json
import websockets
import socket

SESSIONS = {}
STOP = None

async def handler(ws):
    session_id = None
    try:
        async for msg in ws:
            try:
                data = json.loads(msg)
            except Exception:
                continue
            t = data.get('type')
            if t == 'join':
                session_id = data.get('sessionId') or 'default'
                SESSIONS.setdefault(session_id, set()).add(ws)
                await ws.send(json.dumps({'type':'joined','sessionId':session_id}))
            elif t == 'state':
                sid = data.get('sessionId') or session_id or 'default'
                payload = data.get('payload')
                for peer in list(SESSIONS.get(sid, set())):
                    if peer is not ws:
                        try:
                            await peer.send(json.dumps({'type':'state','payload':payload}))
                        except Exception:
                            pass
            elif t in ('whoami','detect_ip'):
                # Determine the host's primary LAN IP without external calls
                ip = '127.0.0.1'
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                    s.connect(('8.8.8.8', 80))
                    ip = s.getsockname()[0]
                    s.close()
                except Exception:
                    ip = socket.gethostbyname(socket.gethostname())
                try:
                    await ws.send(json.dumps({'type':'detect_ip','ip': ip}))
                except Exception:
                    pass
            elif t == 'shutdown':
                try:
                    ra = ws.remote_address[0] if ws.remote_address else None
                except Exception:
                    ra = None
                local_ip = '127.0.0.1'
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                    s.connect(('8.8.8.8', 80))
                    local_ip = s.getsockname()[0]
                    s.close()
                except Exception:
                    try:
                        local_ip = socket.gethostbyname(socket.gethostname())
                    except Exception:
                        local_ip = '127.0.0.1'
                if ra in ('127.0.0.1', '::1', local_ip):
                    try:
                        await ws.send(json.dumps({'type':'shutdown_ack'}))
                    except Exception:
                        pass
                    if STOP and not STOP.done():
                        STOP.set_result(True)
            elif t == 'ping':
                await ws.send(json.dumps({'type':'pong'}))
    finally:
        if session_id and ws in SESSIONS.get(session_id, set()):
            SESSIONS[session_id].discard(ws)

async def main():
    global STOP
    STOP = asyncio.Future()
    print('Starting BLS relay on ws://0.0.0.0:8787')
    async with websockets.serve(handler, '0.0.0.0', 8787, ping_interval=20, ping_timeout=20):
        await STOP

if __name__ == '__main__':
    asyncio.run(main())
