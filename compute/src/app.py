import asyncio

from fastapi import FastAPI
from fastapi.routing import APIRoute
from typing import Optional

from src.core.startup import init_storage

from .modules.ingestion.router import router as ingestion_router

from .core.ws.router import router as ws_router
from .core.ws.listener import redis_listener
from .core.rabbit import connection as rabbit_connection
from .core.rabbit import setup_exchanges as rabbit_setup_exchanges

app = FastAPI()

app.include_router(ingestion_router)
app.include_router(ws_router)

for route in app.routes:
    if isinstance(route, APIRoute):
        print(route.path)

listener_task: Optional[asyncio.Task] = None


@app.on_event("startup")
async def on_startup():
    global listener_task
    await rabbit_connection.connect()
    await rabbit_setup_exchanges.setup()
    init_storage()
    listener_task = asyncio.create_task(redis_listener())


@app.on_event("shutdown")
async def shutdown():
    await rabbit_connection.disconnect()
    if listener_task is not None:
        listener_task.cancel()
        try:
            await listener_task
        except asyncio.CancelledError:
            pass
