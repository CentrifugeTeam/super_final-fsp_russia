import string
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import TypeVar, Callable

from service_calendar.app.utils.email_sender import SMTPMessage, Message
from worker.src.parser.parser_pdf.parser import Row
from .settings import settings as conf_settings, settings

from shared.storage.db.models import EventType, SportEvent, AgeGroup, Location, Competition, User, Role, Area
from logging import getLogger
from web.app.schemas.users import CreateUser
from web.app.utils.users import user_manager
import random

smtp_message = SMTPMessage(sender=conf_settings.SMTP_SENDER, host=conf_settings.SMTP_HOST,
                           port=conf_settings.SMTP_PORT,
                           password=conf_settings.SMTP_PASSWORD)

logger = getLogger(__name__)

DBModel = TypeVar('DBModel', bound=DeclarativeBase)


async def update_db(sessionmaker, rows: list[Row]):
    async with sessionmaker() as session:
        session: AsyncSession
        for row in rows:
            await save_event_and_related_data(session, row)


async def _create_model(session, _dict, model):
    obj = model(**_dict)
    session.add(obj)
    await session.commit()
    return obj


async def _create_if_dont_exist[DBModel](session: AsyncSession, _dict: dict, model: type[DBModel],
                                         if_dont_exist: Callable = _create_model) -> DBModel:
    stmt = select(model)
    for key, value in _dict.items():
        if isinstance(value, str):
            value = value.strip()

        model_key = getattr(model, key)
        stmt = stmt.where(model_key == value)

    obj = await session.scalar(stmt)
    if obj is None:
        return await if_dont_exist(session, _dict, model)

    return obj


async def save_event_and_related_data(session: AsyncSession, row: Row):
    user_events = {}
    try:
        # Сначала сохраняем или получаем существующее место
        stmt = select(Location).where(Location.city == row.location.city).where(
            Location.region == row.location.region).where(Location.country == row.location.country)
        location = await session.scalar(stmt)
        if location is None:
            location = Location(city=row.location.city, country=row.location.country, region=row.location.region)
            session.add(location)
            await session.commit()

        # Теперь создаем или находим EventType
        stmt = select(EventType).where(EventType.sport == row.event_type.sport)
        event_type = await session.scalar(stmt)
        if event_type is None:
            event_type = await _create_model(session, {**row.event_type.model_dump(by_alias=True)}, EventType)

        stmt = select(SportEvent).where(SportEvent.id == row.event.id)
        event = await session.scalar(stmt)
        if event is None:
            event = await _create_model(session, {**row.event.model_dump(by_alias=True), 'location_id': location.id,
                                                  'type_event_id': event_type.id}, SportEvent)
            if event.name.isprintable():
                users: list[User] = await event_type.awaitable_attrs.users
                for user in users:
                    if not getattr(user_events, user.email):
                        user_events[user.email] = [event.name]
                    else:
                        user_events[user.email].append(event.name)

        # Сохраняем возрастные группы (AgeGroup)
        for sex in row.sexes:
            stmt = select(AgeGroup).where(AgeGroup.name == sex.name).where(AgeGroup.age_from == sex.start).where(
                AgeGroup.age_to == sex.end)
            obj = await session.scalar(stmt)
            if obj is None:
                await _create_model(session, {**sex.model_dump(by_alias=True), 'event_id': event.id}, AgeGroup)

        # Сохраняем дисциплины (Competition)
        for competition in row.competitions:
            stmt = select(Competition).where(Competition.name == competition.name).where(
                Competition.type == competition.type)
            obj = await session.scalar(stmt)
            if obj is None:
                await _create_model(session, {**competition.model_dump(by_alias=True), 'event_id': event.id},
                                    Competition)



    except SQLAlchemyError as e:
        await session.rollback()  # Откатываем сессию в случае ошибки
        logger.exception('error while saving event and related data', exc_info=e)
    else:
        for user_email, event_names in user_events.items():
            await smtp_message.asend_email(user_email,
                                           Message(title=f"Новое мероприятие по вашему любимому типу спорта!",
                                                   url_for_button=f'{settings.DOMAIN_URL}/calendar/',
                                                   text=f"Новые события по данным спорту: {" ".join(event_names)}\n",
                                                   text_on_button='Подробнее')
                                           )


def generate_unique_username() -> str:
    """
    Генерируем уникальный username на основе email.
    """

    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))  # Рандомный суффикс


def generate_random_password(length: int = 12) -> str:
    """
    Генерируем случайный пароль.
    """
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choices(characters, k=length))


async def create_user(session: AsyncSession, full_name: str, email: str, area: Area):
    """
    Получаем пользователя по имени или создаем нового, если его нет в базе.
    """
    # Разбиваем полное имя на компоненты
    name_parts = full_name.split()
    if not name_parts:
        first_name = '<Неизвестно>'
        middle_name = '<Неизвестно>'
        last_name = '<Неизвестно>'
    else:
        first_name = name_parts[1]
        last_name = name_parts[0]
        middle_name = name_parts[2] if len(name_parts) > 2 else None

    # Генерируем username на основе email (если он есть)
    username = email.split('@')[0]
    user = await session.scalar(select(User).filter(User.username == username))

    if user:
        return user

    # Если пароль не передан, генерируем случайный
    # password = generate_random_password()
    password = 'password'

    try:
        about = None
        if email == 'fsp_lnr@mail.ru сайт: www.fsp-lnr.ru':
            email = 'fsp_lnr@mail.ru'
            about = 'Наш сайт: www.fsp-lnr.ru'

        # Валидируем данные пользователя через Pydantic
        user_data = CreateUser(
            username=username,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            email=email,
            about=about,
            password=password
        )
    except ValidationError as e:
        logger.error(f"Ошибка валидации данных пользователя: {e}")
        return None  # Если данные невалидны, возвращаем None

    # Проверяем, есть ли уже пользователь с таким именем

    # Если пользователя нет, создаем его через user_manager
    async with session.begin_nested():
        async def _if_dont_exist(session, _dict, model):
            obj = model(**_dict)
            await session.commit()
            return obj

        user: User = await user_manager.create_user(session, in_obj=user_data, commit=True,
                                                    refresh_attribute_names=['roles'], is_leader=True, area_id=area.id)
        role2 = await _create_if_dont_exist(session, {'name': 'region'}, Role, _if_dont_exist)
        user.roles = [role2]
        await session.commit()
        return user
