from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from src.modules.ws.manager import ws_manager

router = APIRouter()


@router.websocket("/ws/tasks/{task_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    task_id: str,
):
    await ws_manager.connect(
        task_id=task_id,
        websocket=websocket,
    )

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, task_id)
