from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr
from fastapi import status, Request, Body, Response
from sqlalchemy.ext.asyncio import AsyncSession

from service_calendar.app.utils.email_sender import Message
from shared.storage.cache.redis_client import RedisClient
from web.app.exceptions import InvalidResetPasswordToken
from web.app.schemas import ReadUser
from web.app.utils.users import user_manager

from web.app.dependencies import get_session, get_redis
from shared.crud import not_found_response
from shared.crud.openapi_responses import bad_request_response
from web.app.conf import smtp_message

r = APIRouter()


@r.post(
    "/forgot",
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
    """
    Отправляет письмо с ссылкой для сброса пароля пользователю.

    :param email: Электронная почта пользователя.
    :param session: Асинхронная сессия SQLAlchemy.
    :param redis: Клиент Redis.
    :return: Ответ без содержимого тела.
    """
    user = await user_manager.get_or_404(session, email=email)
    token = await user_manager.forgot_password(user, redis)
    await smtp_message.asend_email(
        email,
        Message(url_for_button=f'https://centrifugo.tech/change_pass/?token={token}', title='Заменить пароль', text_on_button='Кнопка',
                text='Востановление пароля')
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@r.post(
    "/reset",
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
    """
    Сбрасывает пароль пользователя по токену.

    :param token: Токен для сброса пароля.
    :param password: Новый пароль пользователя.
    :param session: Асинхронная сессия SQLAlchemy.
    :param redis: Клиент Redis.
    :return: Объект пользователя после сброса пароля.
    """
    try:
        return await user_manager.reset_password(session, redis, token, password)
    except (InvalidResetPasswordToken,):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid reset password token',
        )

