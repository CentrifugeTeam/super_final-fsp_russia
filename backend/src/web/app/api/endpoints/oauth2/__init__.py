from fastapi import APIRouter
from . import yandex

r = APIRouter()
r.include_router(yandex.r, prefix="/yandex")
