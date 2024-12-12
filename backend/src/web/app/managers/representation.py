from typing import Callable, Any, List

from fastapi import HTTPException
from fastapi_pagination.bases import BasePage
from fastapi_sqlalchemy_toolkit.model_manager import ModelT
from sqlalchemy import UnaryExpression, Select, Row, select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload, aliased

from shared.storage.db.models.teams import UserTeams, TeamParticipation
from .base import BaseManager
from shared.storage.db.models import District, Area, Team, User, SportEvent, Location, EventType
from ..schemas import ReadCardRepresentation, MonthStatistics, ReadRegionRepresentationBase
from ..schemas.representation import ReadRegionsCard, FullFederalRepresentation, ReadRepresentation

area_manager = BaseManager(Area)


class RepresentationManager(BaseManager):

    def __init__(self):
        super().__init__(District)

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
            options=[joinedload(District.areas).subqueryload(Area.leader)],
            where=where,
            base_stmt=base_stmt,
            transformer=transformer,
            **simple_filters,
        )

    async def federations(self, session: AsyncSession):
        return await super().list(session)

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
        result = await super().list(
            session,
            order_by=order_by,
            filter_expressions=filter_expressions,
            nullable_filter_expressions=nullable_filter_expressions,
            options=[joinedload(District.areas).subqueryload(Area.leader)],
            where=where,
            base_stmt=base_stmt,
            unique=True,
            **simple_filters,
        )
        response = []
        for item in result:
            regions = []
            for region in item.areas:
                representation = ReadRepresentation.model_validate({'type': 'region', **region._asdict()},
                                                                   from_attributes=True)
                leader = self._handle_leader_response(region)
                regions.append(
                    ReadRegionsCard.model_validate({'leader': leader, 'representation': representation},
                                                   from_attributes=True))
            response.append(FullFederalRepresentation.model_validate({'name': item.name, 'regions': regions},
                                                                     from_attributes=True))

        return response

    @staticmethod
    def _handle_leader_response(area: Area):
        return area.leader[0] if area.leader else None

    async def get_region_card(self, session: AsyncSession, id: int):
        team_stmt = (
            select(func.count(Team.id))
            .filter(Team.area_id == id)
            .scalar_subquery()
        )

        user_stmt = (
            select(func.count(UserTeams.id))
            .join(Team, UserTeams.team_id == Team.id)
            .where(Team.area_id == id)
            .scalar_subquery()
        )

        stmt = (
            select(District, team_stmt.label("team_count"), user_stmt.label("users_count"))
        )

        stmt = self.assemble_stmt(stmt, options=[joinedload(District.areas).subqueryload(Area.leader)],
                                  where=Area.id == id)
        result = (await session.execute(stmt)).mappings().unique()

        if not result:
            raise HTTPException(status_code=404, detail="Representation not found")
        result = next(result)
        region = result['District'].areas[0]
        representation = ReadRepresentation.model_validate({'type': 'region', **region._asdict()},
                                                           from_attributes=True)
        leader = self._handle_leader_response(region)
        region_representation = ReadRegionRepresentationBase.model_validate(
            {'id': result['District'].id, 'leader': leader,
             'representation': representation}, from_attributes=True)


        federal_name = result['District'].name
        top_month_stmt = (
            select(SportEvent.start_date, func.count(TeamParticipation.id))
            .join(TeamParticipation, TeamParticipation.event_id == SportEvent.id)
            .join(Team, Team.id == TeamParticipation.team_id)
            .where(Team.area_id == id)
            .group_by(func.date(SportEvent.start_date))
            .limit(3)
        )

        top_month = await session.execute(top_month_stmt)
        top_months = [MonthStatistics(date=month[0], count_participants=month[1]) for month in top_month]

        region = region.name.split(' ')
        if len(region) != 2:
            return ReadCardRepresentation.model_validate(
                {'top_months': top_months, 'events_count': None, 'last_events': None,
                 'federal_name': federal_name, **result, 'RegionRepresentation': region_representation},
                from_attributes=True)

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


        last_events = await session.scalars(last_events_stmt)
        event_count = await session.scalar(event_count_stmt)

        return ReadCardRepresentation.model_validate(
            {'top_months': top_months, 'events_count': event_count, 'last_events': last_events,
             'federal_name': federal_name, **result, 'RegionRepresentation': region_representation},
            from_attributes=True)
