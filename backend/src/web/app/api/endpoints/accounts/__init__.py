from fastapi import APIRouter
from . import user_password, verify

r = APIRouter()
r.include_router(user_password.r, prefix="/password")
r.include_router(verify.r, prefix="/verify")
