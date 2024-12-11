"""empty message

Revision ID: 2f4d3535b183
Revises: f2d9ff5e1056
Create Date: 2024-12-08 02:35:00.809931

"""
import asyncio
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from faker import Faker
from polyfactory import Ignore, Use

from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from shared.storage.db.models import Team, Representation, SportEvent, EventType, User, TeamSolution
from web.app.managers.representation import RepresentationManager
from fastapi_sqlalchemy_toolkit import ModelManager
from web.app.schemas.users import CreateUser
from web.app.managers.users import UsersManager
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from polyfactory.factories.pydantic_factory import ModelFactory
from sqlalchemy import select
from web.app.conf import async_session_maker


async def seed_db(session: AsyncSession):
    federation_ids = [federation.id for federation in await RepresentationManager().federations(session)]
    if not federation_ids:
        return
    stmt = select(SportEvent.id).join(EventType, SportEvent.type_event_id == EventType.id).where(
        EventType.sport == 'Спортивное программирование')
    sport_ids = list(await session.scalars(stmt))

    faker = Faker('ru_RU')

    class UserFactory(SQLAlchemyFactory):
        __model__ = User
        __session__ = session
        id: Ignore()
        username = faker.unique.user_name
        first_name = faker.first_name
        middle_name = faker.middle_name
        last_name = faker.last_name
        email = faker.unique.email
        representation_id = Ignore()
        team_id = Ignore()

    class TeamSolutionFactory(SQLAlchemyFactory):
        __model__ = TeamSolution
        id: Ignore()
        score = Use(faker.pyint, min_value=0, max_value=100)

    class Factory(SQLAlchemyFactory):
        __model__ = Team
        __session__ = session
        name: faker.unique.word
        id: Ignore()

    class UserModelFactory(ModelFactory):
        __model__ = CreateUser
        email = faker.unique.email

    usual_user = UserModelFactory.build(username='user', password='password')
    region_user = UserModelFactory.build(username='region', password='password')
    federation_user = UserModelFactory.build(username='federation', password='password')
    users_manager = UsersManager()

    await users_manager.create_user(session, usual_user)
    await users_manager.create_user(session, region_user)
    await users_manager.create_user(session, federation_user)

    for i in range(40):
        users = [UserFactory.build() for i in range(3)]
        team = Factory.build(federal_representation_id=Factory.__random__.choice(federation_ids)
                             , event_id=Factory.__random__.choice(sport_ids),
                             users=users)

        session.add(team)

        try:
            await session.commit()
            solution = TeamSolutionFactory.build(team_id=team.id)
            session.add(solution)
            await session.commit()

        except Exception as e:
            await session.rollback()


async def main():
    async with async_session_maker() as session:
        await seed_db(session)


if __name__ == '__main__':
    asyncio.run(main())
