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
from polyfactory import Ignore, Use, AsyncPersistenceProtocol

from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from shared.storage.db.models import Team, District, SportEvent, EventType, User, TeamSolution, Location, \
    TeamParticipation, Area, UserTeams
from web.app.schemas.users import CreateUser
from web.app.managers.users import UsersManager
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from polyfactory.factories.pydantic_factory import ModelFactory, T
from sqlalchemy import select
from web.app.conf import async_session_maker
from logging import getLogger

logger = getLogger(__name__)

faker = Faker('ru_RU')


class BaseFactory(SQLAlchemyFactory):
    id = Ignore()
    __set_foreign_keys__ = False
    __is_base_factory__ = True


class UserFactory(BaseFactory):
    __model__ = User
    id = Ignore()
    username = Use(faker.unique.user_name)
    first_name = Use(faker.first_name)
    middle_name = Use(faker.middle_name)
    last_name = Use(faker.last_name)
    email = Use(faker.unique.email)
    photo_url = None
    area_id = Ignore()
    team_id = Ignore()


class TeamSolutionFactory(BaseFactory):
    __model__ = TeamSolution
    id = Ignore()
    score = Use(faker.pyint, min_value=0, max_value=100, step=1)


class LocationFactory(BaseFactory):
    __model__ = Location
    id = Ignore()
    city = Use(faker.unique.city)
    country = Use(lambda: "Россия")
    region = Use(faker.unique.region)


class SportFactory(BaseFactory):
    __model__ = SportEvent
    id = Ignore()
    name = Use(faker.unique.word)
    format = Use(LocationFactory.__random__.choice, ['офлайн', 'онлайн', 'оба'])
    type_event_id = Ignore()
    location_id = Ignore()


class Factory(BaseFactory):
    __model__ = Team
    name = Use(faker.unique.word)
    photo_url = None
    id = Ignore()
    area_id = Ignore()


class UserModelFactory(ModelFactory):
    __model__ = CreateUser
    about = None
    photo_url = None
    email = Use(faker.unique.email)


class DistrictFactory(BaseFactory):
    __model__ = District
    id = Ignore()
    name = Use(faker.address)


class AreaFactory(BaseFactory):
    __model__ = Area
    id = Ignore()
    name = Use(faker.city)
    photo_url = None
    contacts = None
    district_id = Ignore()


async def seed(session: AsyncSession):
    users_manager = UsersManager()
    federation_ids = []

    for _ in range(3):
        district = DistrictFactory.build()
        session.add(district)
        await session.commit()
        federation_ids.append(district.id)

    area_ids = []

    for _ in range(3):
        area = AreaFactory.build(district_id=Factory.__random__.choice(federation_ids))
        session.add(area)
        await session.commit()
        leader = UserModelFactory.build(password='password')
        area_ids.append(area.id)
        await users_manager.create_user(session, leader, area_id=area.id,
                                        role_name='region', is_leader=True)

    stmt = select(SportEvent.id).join(EventType, SportEvent.type_event_id == EventType.id).where(
        EventType.sport == 'Спортивное программирование')
    sport_event_ids = list(await session.scalars(stmt))

    if not sport_event_ids:
        event_type = EventType(sport='Спортивное программирование')
        session.add(event_type)
        await session.commit()
        sport_event_ids = [event_type.id]

    sport_ids = []
    for i in range(3):
        location = LocationFactory.build()
        session.add(location)
        await session.commit()
        sport = SportFactory.build(location_id=location.id,
                                   type_event_id=Factory.__random__.choice(sport_event_ids))
        session.add(sport)
        await session.commit()
        sport_ids.append(sport.id)

    usual_user = UserModelFactory.build(username='user', password='password')
    region_user = UserModelFactory.build(username='region', password='password')
    federation_user = UserModelFactory.build(username='federation', password='password')

    await users_manager.create_user(session, usual_user, area_id=Factory.__random__.choice(area_ids))
    await users_manager.create_user(session, region_user, area_id=Factory.__random__.choice(area_ids),
                                    role_name='region')
    await users_manager.create_user(session, federation_user, area_id=Factory.__random__.choice(area_ids),
                                    role_name='federal')

    for i in range(40):
        users = []
        for _ in range(3):
            user = UserModelFactory.build(password='password')
            user = await users_manager.create_user(session, user, area_id=Factory.__random__.choice(area_ids))
            users.append(user)

        team = Factory.build(area_id=Factory.__random__.choice(area_ids),
                             users=users,
                             )
        session.add(team)
        await session.commit()
        participation = TeamParticipation(team_id=team.id, event_id=Factory.__random__.choice(sport_event_ids))
        session.add(participation)
        for user in users:
            user_team = UserTeams(user_id=user.id, team_id=team.id)
            session.add(user_team)
            user.area_id = team.area_id
            session.add(user)
        solution = TeamSolutionFactory.build(team_id=team.id, event_id=Factory.__random__.choice(sport_ids))
        session.add(solution)
        await session.commit()


async def main():
    async with async_session_maker() as session:
        await seed(session)


if __name__ == '__main__':
    asyncio.run(main())
