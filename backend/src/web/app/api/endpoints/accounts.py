from fastapi import APIRouter, Depends, HTTPException
from fastapi_users.router import reset
from pydantic import EmailStr
from fastapi import status, Request, Body, Response
from sqlalchemy.ext.asyncio import AsyncSession

from shared.storage.cache.redis_client import RedisClient
from ...exceptions import InvalidResetPasswordToken
from ...schemas import ReadUser
from ...utils.users import user_manager

from ...dependencies import get_session, get_redis
from shared.crud import not_found_response
from shared.crud.openapi_responses import bad_request_response
from ...conf import smtp_message

r = APIRouter()


@r.post(
    "/forgot-password",
    status_code=status.HTTP_204_NO_CONTENT,
    name="reset:forgot_password",
    responses={
        **not_found_response,
    }
)
async def forgot_password(
        email: EmailStr = Body(..., embed=True),
        session: AsyncSession = Depends(get_session),
        redis: RedisClient = Depends(get_redis),
):
    user = await user_manager.get_or_404(session, email=email)
    token = await user_manager.forgot_password(user, redis)
    await smtp_message.asend_email(
        email,
        token,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@r.post(
    "/reset-password",
    name="reset:reset_password",
    responses={
        **bad_request_response,
    },
    response_model=ReadUser,
)
async def reset_password(
        token: str = Body(...),
        password: str = Body(...),
        session: AsyncSession = Depends(get_session),
        redis: RedisClient = Depends(get_redis),
):
    try:
        return await user_manager.reset_password(session, redis, token, password)
    except (InvalidResetPasswordToken,):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid reset password token',
        )
