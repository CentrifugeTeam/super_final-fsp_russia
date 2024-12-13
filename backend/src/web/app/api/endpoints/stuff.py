from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from sqlalchemy import select
from starlette import status

from shared.storage.db.models import Location, Area, SportEvent, EventType
from web.alembic.seeds import seed_teams, seed_events
from web.app.dependencies import get_session

r = APIRouter()


@r.post("/", status_code=status.HTTP_204_NO_CONTENT)
async def stuff(
        seed: int = 20,
        session: AsyncSession = Depends(get_session)

):
    stmt = select(Location)
    locations = (await session.scalars(stmt)).all()

    stmt = select(Area)
    areas = (await session.scalars(stmt)).all()
    stmt = select(SportEvent).join(EventType, EventType.id == SportEvent.type_event_id).where(
        EventType.sport == 'Спортивное программирование')
    events = (await session.scalars(stmt)).all()
    await seed_teams(session, events, areas)
    events = await seed_events(session, locations, seed)
    await seed_teams(session, events, areas)
