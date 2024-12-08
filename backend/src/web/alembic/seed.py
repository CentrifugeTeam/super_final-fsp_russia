"""empty message

Revision ID: 2f4d3535b183
Revises: f2d9ff5e1056
Create Date: 2024-12-08 02:35:00.809931

"""
import asyncio
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from shared.storage.db.models import Team, Representation, SportEvent, EventType
from web.app.managers.representation import RepresentationManager
from fastapi_sqlalchemy_toolkit import ModelManager
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from sqlalchemy import select
from web.app.conf import async_session_maker


async def seed_db(session: AsyncSession):
    federation_ids = [federation.id for federation in await RepresentationManager().federations(session)]
    stmt = select(SportEvent.id).join(EventType, SportEvent.type_event_id == EventType.id).where(
        EventType.sport == 'Спортивное программирование')
    sport_ids = list(await session.scalars(stmt))

    class Factory(SQLAlchemyFactory):
        __model__ = Team
        __session__ = session
        __set_relationships__ = True

    factory = Factory()

    for i in range(100):
        await factory.create_async(federal_representation_id=factory.__random__.choice(federation_ids)
                                   , event_id=factory.__random__.choice(sport_ids))


async def main():
    async with async_session_maker() as session:
        await seed_db(session)


if __name__ == '__main__':
    asyncio.run(main())
