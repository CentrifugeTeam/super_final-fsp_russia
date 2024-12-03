from fastapi import APIRouter
from .endpoints import oauth2, teams

api = APIRouter()
api.include_router(oauth2.r, prefix='/oauth', tags=['oauth'])
api.include_router(teams.r, prefix='/teams', tags=['teams'])
