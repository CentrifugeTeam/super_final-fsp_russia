from fastapi import APIRouter, Depends, HTTPException, Request, status, Body
from fastapi.responses import RedirectResponse

from ...auth.auth2 import google_sso

r = APIRouter()


@r.get('/login', status_code=status.HTTP_303_SEE_OTHER, response_class=RedirectResponse)
async def login(request: Request):
    async with google_sso:
        login_uri = await google_sso.get_login_url(redirect_uri=None,
                                                   params={"prompt": "consent", "access_type": "offline"}, state=None)
        response = RedirectResponse(login_uri, 303)
        return response


@r.get('/google/callback')
async def callback(request: Request, code: str):
    try:
        async with google_sso:
            user = await google_sso.verify_and_process(request)
    #     user_stored = db_crud.get_user(db, user.email, provider=user.provider)
    #     if not user_stored:
    #         user_to_add = UserSignUp(
    #             username=user.email,
    #             fullname=user.display_name
    #         )
    #         user_stored = db_crud.add_user(db, user_to_add, provider=user.provider)
    #     access_token = create_access_token(username=user_stored.username, provider=user.provider)
    #     response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    #     return response
    # except db_crud.DuplicateError as e:
    #     raise HTTPException(status_code=403, detail=f"{e}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"{e}")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred. Report this message to support: {e}")
