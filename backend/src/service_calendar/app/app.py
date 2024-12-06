import logging
from fastapi import FastAPI, Request
from .api.api import api
from contextlib import asynccontextmanager
from fastapi_pagination import add_pagination


@asynccontextmanager
async def lifespan(app):
    yield


logging.basicConfig(level=logging.INFO)
app = FastAPI(lifespan=lifespan,
              root_path="/calendar/api",
              )

app.include_router(api)
add_pagination(app)
