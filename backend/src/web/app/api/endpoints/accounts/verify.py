from fastapi import APIRouter, Body, Depends, HTTPException, Request, status, Response
from pydantic import EmailStr

from sqlalchemy.ext.asyncio import AsyncSession

from service_calendar.app.utils.email_sender import Message
from shared.storage.cache.redis_client import RedisClient
from web.app.exceptions import InvalidResetPasswordToken, UserAlreadyVerifiedException
from web.app.schemas import ReadUser
from web.app.utils.users import user_manager

from web.app.dependencies import get_session, get_redis
from shared.crud import not_found_response
from shared.crud.openapi_responses import bad_request_response, ErrorModel
from web.app.conf import smtp_message, settings

r = APIRouter()


@r.post(
    "/request",
    status_code=status.HTTP_204_NO_CONTENT,
    name="verify:request-token",
    responses={
        **not_found_response,
        **bad_request_response
    }
)
async def request_verify_token(
        request: Request,
        email: EmailStr = Body(..., embed=True),
        session: AsyncSession = Depends(get_session),
        redis: RedisClient = Depends(get_redis),
):
    """
    Отправляет письмо с инструкциями по верификации на указанный email.

    :param email: Email пользователя.
    :param session: Сессия базы данных.
    :param redis: Клиент Redis.
    """
    user = await user_manager.get_or_404(session, email=email)
    if user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='VERIFY_USER_ALREADY_VERIFIED')
    token = await user_manager.forgot_password(user, redis)
    await smtp_message.asend_email(
        email,
        Message(url_for_button=f'{settings.DOMAIN_URI}/email_verified/?token={token}', title='Форма для подтверждения почты',
                text_on_button='Подтвердить почту', text='Подтвердить почту')
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@r.post(
    "/",
    response_model=ReadUser,
    name="verify:verify",
    responses={
        **not_found_response,
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorModel,
            "content": {
                "application/json": {
                    "examples": {
                        'VERIFY_USER_ALREADY_VERIFIED': {
                            "summary": "The user is already verified.",
                            "value": {
                                "detail": 'VERIFY_USER_ALREADY_VERIFIED'
                            },
                        },
                    }
                }
            },
        }
    },
)
async def verify(
        request: Request,
        token: str = Body(..., embed=True),
        session: AsyncSession = Depends(get_session),
        redis: RedisClient = Depends(get_redis),
):
    """
    Верифицирует пользователя по токену.

    :param token: Токен для верификации.
    :param session: Сессия базы данных.
    :param redis: Клиент Redis.
    :return: Объект пользователя после верификации.
    """
    try:
        return await user_manager.verify(session, redis, token)
    except UserAlreadyVerifiedException:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='VERIFY_USER_ALREADY_VERIFIED')
