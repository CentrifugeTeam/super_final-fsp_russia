import logging
from fastapi import FastAPI, Request
from sqlalchemy.orm import DeclarativeBase

from .api.api import api
from .conf import engine, async_session_maker
from contextlib import asynccontextmanager
from fastapi_pagination import add_pagination
from starlette_admin.contrib.sqla import Admin, ModelView
from shared.storage.db import models
from shared.storage.db.models import Base
from inspect import isclass

from worker.src.functions.cron_regions_functions.parse_and_save import parse_and_save
from worker.src.functions.events_archive.function import cron_job


@asynccontextmanager
async def lifespan(app):
    ctx = {"async_session_maker": async_session_maker}
    await parse_and_save(ctx)
    await cron_job(ctx)
    yield


admin = Admin(engine, title='Панель Администрирования', base_url='/admin')
for model in models.__dict__.values():
    if isclass(model) and issubclass(model, Base) and model is not Base:
        admin.add_view(ModelView(model))
logging.basicConfig(level=logging.INFO)

app = FastAPI(root_path='/api', lifespan=lifespan)

app.include_router(api)

admin.mount_to(app)
add_pagination(app)
