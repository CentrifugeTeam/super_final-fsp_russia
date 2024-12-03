"""Generate a router with login/logout routes for an authentication backend."""
from fastapi import APIRouter, Depends, HTTPException, Request, status, Body
from fastapi.security import OAuth2PasswordRequestForm

from fastapi_users import models
from fastapi_users.router.common import ErrorCode, ErrorModel
from typing import Annotated

from shared.crud import missing_token_or_inactive_user_response
from shared.crud.openapi_responses import forbidden_response
from ...auth.strategy import JWTStrategy
from ...utils.users import authenticator, backend, user_manager
from ...auth.transport import TransportResponse
from ...dependencies.session import get_session
from ...schemas.users import UserCredentials

r = APIRouter()

get_current_user_token = authenticator.get_user_token(
    active=True
)


@r.post(
    "/login",
    name=f"auth:{backend.name}.login",
    description='Авторизация пользователя',
    response_model=TransportResponse,
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
                    }
                }
            },
        },
        **backend.transport.get_openapi_login_responses_success(),
    },
)
async def login(
        request: Request,
        user_credentials: UserCredentials,
        session=Depends(get_session),
        strategy: JWTStrategy = Depends(backend.get_strategy),
):
    user = await user_manager.authenticate(session, user_credentials)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.LOGIN_BAD_CREDENTIALS,
        )
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
    dependencies=[Depends(get_current_user_token)],
    responses={**backend.transport.get_openapi_login_responses_success(), **missing_token_or_inactive_user_response},
    response_model=TransportResponse
)
async def refresh(refresh_token: Annotated[str, Body(embed=True)],
                  strategy: JWTStrategy = Depends(backend.get_strategy), ):
    strategy: JWTStrategy

    return await strategy.refresh_token(refresh_token)
