from fastapi import APIRouter
from . import yandex, vk

r = APIRouter()
r.include_router(yandex.r, prefix="/yandex")
r.include_router(vk.r, prefix="/vk")