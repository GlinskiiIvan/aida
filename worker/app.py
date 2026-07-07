import asyncio
from fastapi import WebSocket

from fastapi import FastAPI
from sqlmodel import SQLModel

from src.core.db import engine
from src.core.startup import init_storage

from .modules.ingestion.router import router as ingestion_router
from .modules.inference.router import router as inference_router
from .modules.ws.router import router as ws_router

from .modules.ws.listener import redis_listener

app = FastAPI()

app.include_router(ingestion_router)
app.include_router(inference_router)
app.include_router(ws_router)

for route in app.routes:
    print(type(route).__name__, route.path)

listener_task = None


@app.on_event("startup")
async def on_startup():
    SQLModel.metadata.create_all(engine)
    init_storage()
    listener_task = asyncio.create_task(redis_listener())


@app.on_event("shutdown")
async def shutdown():
    listener_task.cancel()
    try:
        await listener_task
    except asyncio.CancelledError:
        pass
