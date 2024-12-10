from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ...schemas.email import UserSettings, Email
from crud.openapi_responses import bad_request_response
from ...managers import BaseManager
from ...dependencies.session import get_session
from shared.storage.db.models import User
from ...conf import smtp_message
from logging import getLogger

from ...utils.email_sender import Message

users_manager = BaseManager(User)
logger = getLogger(__name__)
r = APIRouter()


@r.post('/register', responses={**bad_request_response}, status_code=204)
async def email(settings: UserSettings,
                session: AsyncSession = Depends(get_session)
                ):
    """
    Обрабатывает запрос на регистрацию пользователя.

    :param settings: Настройки пользователя.
    :param session: Асинхронная сессия SQLAlchemy.
    :return: Ответ без содержимого тела.
    """
    async with session.begin():
        email = Email(email=settings.email)
        await users_manager.create(session, email, type_events=[settings.event_types_id], commit=False)
        try:
            await smtp_message.asend_email(email.email, Message(text=f'Вы подписались на уведомления', title='', text_on_button='кнопка', url_for_button='https://centrifugo.tech/calendar/'))
        except Exception as e:
            await session.rollback()
            logger.exception('exc in emailer ', exc_info=e)
            raise HTTPException(status_code=400)
        return Response(status_code=204)
