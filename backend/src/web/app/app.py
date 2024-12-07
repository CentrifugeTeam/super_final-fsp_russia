import logging
from fastapi import FastAPI, Request
from sqlalchemy.orm import DeclarativeBase

from .api.api import api
from .conf import engine
from contextlib import asynccontextmanager
from fastapi_pagination import add_pagination
from starlette_admin.contrib.sqla import Admin, ModelView
from shared.storage.db import models
from shared.storage.db.models import Base
from inspect import isclass


@asynccontextmanager
async def lifespan(app):
    yield


admin = Admin(engine, title='Панель Администрирования')
for model in models.__dict__.values():
    if isclass(model) and issubclass(model, Base) and model is not Base:
        admin.add_view(ModelView(model))
logging.basicConfig(level=logging.INFO)
app = FastAPI(root_path='/api', lifespan=lifespan)
app.include_router(api)
add_pagination(app)
admin.mount_to(app)
