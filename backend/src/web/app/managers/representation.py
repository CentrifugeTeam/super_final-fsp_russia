from typing import Callable, Any, List

from fastapi import HTTPException
from fastapi_pagination.bases import BasePage
from fastapi_sqlalchemy_toolkit.model_manager import ModelT
from sqlalchemy import UnaryExpression, Select, Row, select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload, aliased

from .base import BaseManager
from shared.storage.db.models import Representation, RegionRepresentation, Team, User, SportEvent, Location, EventType
from ..schemas import ReadCardRepresentation, MonthStatistics


class RepresentationManager(BaseManager):

    def __init__(self):
        super().__init__(Representation)

    async def paginated_list(
            self,
            session: AsyncSession,
            order_by: InstrumentedAttribute | UnaryExpression | None = None,
            filter_expressions: dict[InstrumentedAttribute | Callable, Any] | None = None,
            nullable_filter_expressions: (
                    dict[InstrumentedAttribute | Callable, Any] | None
            ) = None,
            options: List[Any] | Any | None = None,
            where: Any | None = None,
            base_stmt: Select | None = None,
            transformer: Callable | None = None,
            **simple_filters: Any,
    ) -> BasePage[ModelT | Row]:
        """
        Paginated list all representations.
        """
        return await super().paginated_list(
            session,
            order_by=order_by,
            filter_expressions=filter_expressions,
            nullable_filter_expressions=nullable_filter_expressions,
            options=[joinedload(Representation.regions).subqueryload(RegionRepresentation.leader),
                     joinedload(Representation.regions).subqueryload(RegionRepresentation.representation)],
            where=where,
            base_stmt=base_stmt,
            transformer=transformer,
            **simple_filters,
        )

    async def federations(self, session: AsyncSession):
        return await super().list(session, filter_expressions={Representation.type: 'federation'})

    async def list(
            self,
            session: AsyncSession,
            order_by: InstrumentedAttribute | UnaryExpression | None = None,
            filter_expressions: dict[InstrumentedAttribute | Callable, Any] | None = None,
            nullable_filter_expressions: (
                    dict[InstrumentedAttribute | Callable, Any] | None
            ) = None,
            options: List[Any] | Any | None = None,
            where: Any | None = None,
            base_stmt: Select | None = None,
            *,
            unique: bool = False,
            **simple_filters: Any,
    ) -> List[ModelT] | List[Row]:
        """
        List all representations.
        """
        return await super().list(
            session,
            order_by=order_by,
            filter_expressions=filter_expressions,
            nullable_filter_expressions=nullable_filter_expressions,
            options=[joinedload(Representation.regions).subqueryload(RegionRepresentation.leader),
                     joinedload(Representation.regions).subqueryload(RegionRepresentation.representation)],
            where=where,
            base_stmt=base_stmt,
            unique=True,
            **simple_filters,
        )

    async def get_region_card(self, session: AsyncSession, id: int):
        team_stmt = (
            select(func.count(Team.id))
            .filter(Team.federal_representation_id == id)
            .scalar_subquery()
        )

        user_stmt = (
            select(func.count(User.id)).
            where(User.representation_id == id)
            .scalar_subquery()
        )

        stmt = (
            select(RegionRepresentation, team_stmt.label("team_count"), user_stmt.label("users_count"))
        )

        stmt = self.assemble_stmt(stmt, options=[joinedload(RegionRepresentation.leader),
                                                 joinedload(RegionRepresentation.representation),
                                                 joinedload(RegionRepresentation.federation_representation)],
                                  where=RegionRepresentation.id == id)
        result = (await session.execute(stmt)).mappings().unique()
        if not result:
            raise HTTPException(status_code=404, detail="Representation not found")
        result = next(result)
        representation = result['RegionRepresentation'].representation
        region = representation.name.split(' ')
        if len(region) != 2:
            raise HTTPException(status_code=404, detail="Representation not found")

        last_events_stmt = (
            select(SportEvent)
            .options(joinedload(SportEvent.location), joinedload(SportEvent.type_event))
            .where(Location.region.ilike(f"%{region[0]}%"))
            .order_by(SportEvent.start_date.desc())
            .limit(6)
        )
        event_count_stmt = (select(
            func.count(SportEvent.id))
                            .join(Location, Location.id == SportEvent.location_id)
                            .where(Location.region.ilike(f"%{region[0]}%"))
                            )

        federal_name = result['RegionRepresentation'].federation_representation.name
        last_events = await session.scalars(last_events_stmt)
        event_count = await session.scalar(event_count_stmt)

        top_month_stmt = (
            select(SportEvent.start_date, func.count(Team.id))
            .join(Team, Team.event_id == SportEvent.id)
            .where(Team.federal_representation_id == result['RegionRepresentation'].federation_representation.id)
            .group_by(func.date(SportEvent.start_date))
            .order_by(func.count(Team.id).desc())
            .limit(3)
        )

        top_month = await session.execute(top_month_stmt)
        top_months = [MonthStatistics(date=month[0], count_participants=month[1]) for month in top_month]
        return ReadCardRepresentation.model_validate(
            {'top_months': top_months, 'events_count': event_count, 'last_events': last_events,
             'federal_name': federal_name, **result},
            from_attributes=True)
