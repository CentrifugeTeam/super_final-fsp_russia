from fastapi import APIRouter
from .endpoints import oauth2

api = APIRouter()
api.include_router(oauth2.r, prefix='/oauth', tags=['oauth'])
