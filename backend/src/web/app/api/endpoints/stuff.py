from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from sqlalchemy import select
from starlette import status

from shared.storage.db.models import Location, Area
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
    events = await seed_events(session, locations, seed)
    stmt = select(Area)
    areas = (await session.scalars(stmt)).all()
    await seed_teams(session, events, areas)
