from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.storage.db.models import EventType, SportEvent, TeamParticipation, UserTeams
from web.app.utils.users import user_manager

from .factories import UserModelFactory, Factory, SportFactory, TeamSolutionFactory


async def seed_users(session: AsyncSession):
    usual_user = UserModelFactory.build(username='user', password='password')
    region_user = UserModelFactory.build(username='region', password='password')
    federation_user = UserModelFactory.build(username='federation', password='password')

    users = []
    for seed in [(usual_user, 'usual'), (region_user, 'region'), (federation_user, 'federation')]:
        user = await user_manager.create_user(session, seed[0], role_name=seed[1])
        users.append(user)

    return users


async def seed_events(session, location_ids: list[int]):
    stmt = select(EventType).where(EventType.sport == 'Спортивное программирование')
    event_type = await session.scalar(stmt)
    sports = []
    for _ in range(10):
        sport = SportFactory.build(location_id=SportFactory.__random__.choice(location_ids),
                                   type_event_id=event_type.id)
        session.add(sport)
        await session.commit()
        sports.append(sport)
    return sports


async def seed_teams(session, sports: list[SportEvent], area_ids: list[int]):
    for i in range(40):
        users = []
        for _ in range(3):
            user = UserModelFactory.build(password='password')
            user = await user_manager.create_user(session, user, area_id=Factory.__random__.choice(area_ids))
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
