from pydantic import BaseModel
from sqlalchemy import select, insert
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import Generic, TypeVar

from shared.settings import Settings
from logging import getLogger

conf_settings = Settings()


logger = getLogger(__name__)

DBModel = TypeVar('DBModel', bound=DeclarativeBase)





async def _create_if_dont_exist[DBModel](session: AsyncSession, _dict: dict, model: type[DBModel]) -> DBModel:
    stmt = select(model)
    for key, value in _dict.items():
        if isinstance(value, str):
            value = value.strip()

        model_key = getattr(model, key)
        stmt = stmt.where(model_key == value)

    obj = await session.scalar(stmt)
    if obj is None:
        return await _create_model(session, _dict, model)

    return obj


async def _create_model(session, _dict, model):
    obj = model(**_dict)
    session.add(obj)
    await session.commit()
    return obj


async def save_event_and_related_data(session: AsyncSession):
    try:
        pass


    except SQLAlchemyError as e:
        logger.exception("Mistake in row %s",  exc_info=e)
        await session.rollback()  # Откатываем сессию в случае ошибки
