from fastapi import APIRouter
from .endpoints import oauth2, teams, users, auth, sse, accounts, representation, suggestions

api = APIRouter()
api.include_router(oauth2.r, prefix='/oauth', tags=['oauth'])
api.include_router(teams.TeamsRouter(), prefix='/teams', tags=['teams'])
api.include_router(users.r, prefix='/users', tags=['users'])
api.include_router(auth.r, prefix='/auth', tags=['auth'])
api.include_router(sse.r, prefix='/sse', tags=['sse'])
api.include_router(accounts.r, prefix='/accounts', tags=['accounts'])
api.include_router(representation.RepresentationAPIRouter(), prefix='/reps', tags=['representation'])
api.include_router(suggestions.Router(), prefix='/suggestions', tags=['suggestions'])
