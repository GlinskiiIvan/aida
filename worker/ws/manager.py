from collections import defaultdict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.connections: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, task_id: str):
        await websocket.accept()
        self.connections[task_id].append(websocket)

    def disconnect(self, websocket: WebSocket, task_id: str):
        if task_id not in self.connections:
            return

        self.connections[task_id].remove(websocket)

        if not self.connections[task_id]:
            del self.connections[task_id]

    async def send_personal_message(self, task_id: str, data: dict):
        if task_id not in self.connections:
            return
        
        for ws in self.connections[task_id]:
            await ws.send_json(data)

    async def broadcast(self, data: dict):
        for connection in self.connections:
            for ws in connection:
                await ws.send_json(data)

ws_manager = ConnectionManager()
