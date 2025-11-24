import asyncio
import json
import websockets

SESSIONS = {}

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
            elif t == 'ping':
                await ws.send(json.dumps({'type':'pong'}))
    finally:
        if session_id and ws in SESSIONS.get(session_id, set()):
            SESSIONS[session_id].discard(ws)

async def main():
    print('Starting BLS relay on ws://0.0.0.0:8787')
    async with websockets.serve(handler, '0.0.0.0', 8787, ping_interval=20, ping_timeout=20):
        await asyncio.Future()

if __name__ == '__main__':
    asyncio.run(main())
