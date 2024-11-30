from fastapi import APIRouter, Depends, HTTPException, Request, status, Body
from ...auth.auth2 import google_sso


r = APIRouter()


@r.get('/login', status_code=status.HTTP_303_SEE_OTHER, responses={})
async def login(request: Request):
    async with google_sso:
        return await google_sso.get_login_redirect(params={"prompt": "consent", "access_type": "offline"})


@r.get('/google/callback')
async def callback(request: Request, code: str):
    access_token = await google_sso.get_access_token(code, 'http://localhost:8000/api/oauth/google/callback')

    info = await google_sso.get_id_email(access_token)
    return info
