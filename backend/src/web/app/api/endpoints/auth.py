"""Generate a router with login/logout routes for an authentication backend."""
from fastapi import APIRouter, Depends, HTTPException, Request, status, Body
from fastapi.security import OAuth2PasswordRequestForm

from fastapi_users import models
from fastapi_users.authentication.transport.bearer import BearerResponse
from fastapi_users.router.common import ErrorCode, ErrorModel
from typing import Annotated

from ...auth.strategy import JWTStrategy
from ...utils.users import authenticator, backend, user_manager
from ...dependencies.session import get_session

r = APIRouter()

get_current_user_token = authenticator.authenticate(
    active=True,
)



@r.post(
    "/login",
    name=f"auth:{backend.name}.login",
    response_model=BearerResponse,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorModel,
            "content": {
                "application/json": {
                    "examples": {
                        ErrorCode.LOGIN_BAD_CREDENTIALS: {
                            "summary": "Bad credentials or the user is inactive.",
                            "value": {"detail": ErrorCode.LOGIN_BAD_CREDENTIALS},
                        },
                        # ErrorCode.LOGIN_USER_NOT_VERIFIED: {
                        #     "summary": "The user is not verified.",
                        #     "value": {"detail": ErrorCode.LOGIN_USER_NOT_VERIFIED},
                        # },
                    }
                }
            },
        },
        **backend.transport.get_openapi_login_responses_success(),
    },
)
async def login(
        request: Request,
        credentials: OAuth2PasswordRequestForm = Depends(),
        session=Depends(get_session),
        strategy: JWTStrategy = Depends(backend.get_strategy),
):
    user = await user_manager.authenticate(session, credentials)

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.LOGIN_BAD_CREDENTIALS,
        )

    # if not user.is_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail=ErrorCode.LOGIN_USER_NOT_VERIFIED,
    #     )
    response = await backend.login(strategy, user)
    return response


@r.post(
    "/logout", name=f"auth:{backend.name}.logout", responses={
        **{
            status.HTTP_401_UNAUTHORIZED: {
                "description": "Missing token or inactive user."
            }
        },
        **backend.transport.get_openapi_logout_responses_success(),
    },
    status_code=status.HTTP_204_NO_CONTENT,

)
async def logout(
        user_token: tuple[models.UP, str] = Depends(get_current_user_token),
        strategy: JWTStrategy = Depends(backend.get_strategy),
):
    user, token = user_token
    return await backend.logout(strategy, user, token)


@r.post(
    "/refresh_token", name=f"auth:{backend.name}.refresh",
    responses={**backend.transport.get_openapi_login_responses_success()},
    response_model=BearerResponse
)
async def refresh(refresh_token: Annotated[str, Body(embed=True)],
                  strategy: JWTStrategy = Depends(backend.get_strategy), ):
    strategy: JWTStrategy
    return await strategy.refresh_token(refresh_token)
