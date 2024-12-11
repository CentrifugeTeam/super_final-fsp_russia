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
    TeamParticipation, Area
from web.app.schemas.users import CreateUser
from web.app.managers.users import UsersManager
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from polyfactory.factories.pydantic_factory import ModelFactory, T
from sqlalchemy import select
from web.app.conf import async_session_maker
from logging import getLogger

logger = getLogger(__name__)


async def seed_db(session: AsyncSession):
    faker = Faker('ru_RU')

    class UserFactory(SQLAlchemyFactory):
        __model__ = User
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
        score = Use(faker.pyint, min_value=0, max_value=100, step=1)

    class LocationFactory(SQLAlchemyFactory):
        __model__ = Location
        id: Ignore()
        city = faker.unique.city
        country = faker.unique.country
        region = faker.unique.region

    class SportFactory(SQLAlchemyFactory):
        __model__ = SportEvent
        id: Ignore()
        name = faker.unique.word
        format = Use(LocationFactory.__random__.choice, ['офлайн', 'онлайн', 'оба'])
        type_event_id = Ignore()
        location_id = Ignore()

    class Factory(SQLAlchemyFactory):
        __model__ = Team
        name: faker.unique.word
        photo_url = None
        id: Ignore()
        area_id = Ignore()

    class UserModelFactory(ModelFactory):
        __model__ = CreateUser
        email = faker.unique.email

    class DistrictFactory(SQLAlchemyFactory):
        __model__ = District
        id: Ignore()
        name = faker.unique.word

    class AreaFactory(SQLAlchemyFactory):
        __model__ = Area
        id: Ignore()
        name = faker.unique.word
        photo_url = None
        district_id = Ignore()

    federation_ids = []
    for _ in range(3):
        district = DistrictFactory.build()
        session.add(district)
        await session.commit()
        federation_ids.append(district.id)
    area_ids = []

    for _ in range(3):
        district = AreaFactory.build(district_id=Factory.__random__.choice(federation_ids))
        session.add(district)
        await session.commit()
        area_ids.append(district.id)

    stmt = select(SportEvent.id).join(EventType, SportEvent.type_event_id == EventType.id).where(
        EventType.sport == 'Спортивное программирование')
    sport_event_ids = list(await session.scalars(stmt))

    if not sport_event_ids:
        try:
            event_type = EventType(sport='Спортивное программирование')
            session.add(event_type)
            await session.commit()
            sport_event_ids.append(event_type.id)
        except Exception as e:
            logger.exception(exc_info=e, msg='exception')

    sport_ids = []
    for i in range(3):
        try:
            location = LocationFactory.build()
            session.add(location)
            await session.commit()
            sport = SportFactory.build(location_id=location.id,
                                       type_event_id=Factory.__random__.choice(sport_event_ids))
            session.add(sport)
            await session.commit()
            sport_ids.append(sport.id)
        except Exception as e:
            logger.exception(exc_info=e, msg='exception')
    try:
        usual_user = UserModelFactory.build(username='user', password='password')
        region_user = UserModelFactory.build(username='region', password='password')
        federation_user = UserModelFactory.build(username='federation', password='password')
        users_manager = UsersManager()

        await users_manager.create_user(session, usual_user, area_id=Factory.__random__.choice(area_ids))
        await users_manager.create_user(session, region_user, area_id=Factory.__random__.choice(area_ids))
        await users_manager.create_user(session, federation_user, area_id=Factory.__random__.choice(area_ids))
    except Exception as e:
        logger.exception(exc_info=e, msg='exception')

    for i in range(40):
        users = [UserFactory.build() for i in range(3)]
        team = Factory.build(area_id=Factory.__random__.choice(area_ids),
                             users=users)

        session.add(team)

        try:
            await session.commit()
            participation = TeamParticipation(team_id=team.id, event_id=Factory.__random__.choice(sport_event_ids))
            session.add(participation)
            solution = TeamSolutionFactory.build(team_id=team.id, event_id=Factory.__random__.choice(sport_ids))
            session.add(solution)
            await session.commit()

        except Exception as e:
            logger.exception(exc_info=e, msg='exception')
            await session.rollback()


async def main():
    async with async_session_maker() as session:
        await seed_db(session)


if __name__ == '__main__':
    asyncio.run(main())
