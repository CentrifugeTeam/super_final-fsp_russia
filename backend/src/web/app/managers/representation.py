from datetime import datetime, date
from typing import Callable, Any, List

from fastapi import HTTPException
from fastapi_pagination.bases import BasePage
from fastapi_sqlalchemy_toolkit.model_manager import ModelT
from sqlalchemy import UnaryExpression, Select, Row, select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload, aliased
from starlette import status

from service_calendar.app.schemas.event import OneItemReadEvent, EventRead
from shared.storage.db.models.teams import UserTeams, TeamParticipation
from .base import BaseManager
from shared.storage.db.models import District, Area, Team, User, SportEvent, Location, EventType
from ..schemas import ReadCardRepresentation, MonthStatistics, ReadRegionRepresentationBase
from ..schemas.representation import ReadRegionsCard, FullFederalRepresentation, ReadRepresentation, \
    ReadStatisticsDistrict, LeaderBase, DistrictStatistic, MonthStatistic, ReadAreaCard

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

    async def _district_statictics(self, session: AsyncSession, district_id: int):
        now = datetime.now()
        total_events = (select(func.count(SportEvent.id))
                        .join(TeamParticipation, TeamParticipation.event_id == SportEvent.id)
                        .join(Team, Team.id == TeamParticipation.team_id)
                        .join(Area, Area.id == Team.area_id)
                        .join(District, District.id == Area.district_id)).where(District.id == district_id
                                                                                ).scalar_subquery()
        completed_events = (select(func.count(SportEvent.id))
                            .join(TeamParticipation, TeamParticipation.event_id == SportEvent.id)
                            .join(Team, Team.id == TeamParticipation.team_id)
                            .join(Area, Area.id == Team.area_id)
                            .join(District, District.id == Area.district_id)
                            .where(District.id == district_id)
                            .where(SportEvent.end_date < now)
                            ).scalar_subquery()
        current_events = (select(func.count(SportEvent.id))
                          .join(TeamParticipation, TeamParticipation.event_id == SportEvent.id)
                          .join(Team, Team.id == TeamParticipation.team_id)
                          .join(Area, Area.id == Team.area_id)
                          .join(District, District.id == Area.district_id)
                          .where(District.id == district_id, SportEvent.end_date >= now,
                                 SportEvent.start_date <= now)
                          ).scalar_subquery()
        upcoming_events = (select(func.count(SportEvent.id))
                           .join(TeamParticipation, TeamParticipation.event_id == SportEvent.id)
                           .join(Team, Team.id == TeamParticipation.team_id)
                           .join(Area, Area.id == Team.area_id)
                           .join(District, District.id == Area.district_id)
                           .where(District.id == district_id, SportEvent.end_date >= now
                                  )).scalar_subquery()

        stmt = select(total_events.label('total_events')
                      , completed_events.label('completed_events'),
                      current_events.label('current_events'), upcoming_events.label('upcoming_events'))
        results = (await session.execute(stmt)).mappings()
        return DistrictStatistic(**next(results))

    async def statistics(self, session: AsyncSession, district_id: int):
        district = await self.get_or_404(session, id=district_id)
        max_count_participants_in_district = (select(
            func.count(TeamParticipation.team_id), Area.id)
                                              .join(Team, Team.id == TeamParticipation.team_id)
                                              .join(Area, Area.id == Team.area_id)
                                              .join(District, District.id == Area.district_id)
                                              .group_by(Area.id)
                                              .where(District.id == district_id))

        result = (await session.execute(max_count_participants_in_district)).all()
        if not result:
            count = 0
            areas = await district.awaitable_attrs.areas
            if not areas:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Areas not found')
            area_id = areas[0].id
        else:
            count, area_id = result[0]

        stmt = (select(Area, User)
                .join(User, and_(User.area_id == Area.id, User.is_leader == True))
                .where(Area.id == area_id)
                )

        the_best_district = (await session.execute(stmt)).unique().all()
        if not the_best_district:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='District not found')

        the_best_district = the_best_district[0]
        representation = ReadRepresentation.model_validate({**the_best_district[0]._asdict(), 'type': 'federal'},
                                                           from_attributes=True)
        leader = LeaderBase.model_validate(the_best_district[1], from_attributes=True)

        team_stmt = (
            select(func.count(Team.id))
            .filter(Team.area_id == area_id)
            .scalar_subquery()
        )

        user_stmt = (
            select(func.count(UserTeams.id))
            .join(Team, UserTeams.team_id == Team.id)
            .where(Team.area_id == area_id)
            .scalar_subquery()
        )

        stmt = (
            select(team_stmt.label("team_count"), user_stmt.label("users_count"))
        )

        result = (await session.execute(stmt)).mappings()

        if not result:
            raise HTTPException(status_code=404, detail="Representation not found")
        try:
            result = next(result)
        except StopIteration:
            raise HTTPException(status_code=404, detail="Representation not found")

        region_card = ReadAreaCard(representation=representation, leader=leader, **result)
        distinct_statistics = await self._district_statictics(session, district_id)

        current_date = datetime.now().date()
        month_stmt = (
            select(func.extract('month', SportEvent.start_date), func.count(TeamParticipation.id))
            .join(TeamParticipation, TeamParticipation.event_id == SportEvent.id)
            .join(Team, Team.id == TeamParticipation.team_id)
            .join(Area, Area.id == Team.area_id)
            .join(District, District.id == Area.district_id)
            .group_by(func.extract('month', SportEvent.start_date))
            .where(District.id == district_id)
            .where(func.extract('year', SportEvent.start_date) == current_date.year)

        )
        result = await session.execute(month_stmt)
        months = [MonthStatistic(date=date(month=int(month), year=current_date.year, day=current_date.day),
                                 count_participants=count)
                  for
                  month, count in result]

        two_events_from_area = (
            select(SportEvent)
            .join(TeamParticipation, TeamParticipation.event_id == SportEvent.id)
            .join(Team, Team.id == TeamParticipation.team_id)
            .where(Area.id == area_id, SportEvent.end_date <= current_date)
            .options(joinedload(SportEvent.type_event), joinedload(SportEvent.location))
            .limit(2)
        )
        events = [EventRead.model_validate(event, from_attributes=True) for event in
                  (await session.scalars(two_events_from_area)).unique()
                  ]

        return ReadStatisticsDistrict(region=region_card, months=months, statistics=distinct_statistics, events=events)

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
        # TODO
        distinct_select = (select(District)
                           .options(joinedload(District.areas).subqueryload(Area.leader))
                           .join(Area, Area.district_id == District.id)
                           .where(Area.id == id))

        district = (await session.scalar(distinct_select))
        if not district:
            raise HTTPException(status_code=404, detail="Representation not found")
        stmt = (
            select(team_stmt.label("team_count"), user_stmt.label("users_count"))
        )

        team_count, users_count = (await session.execute(stmt)).all()[0]
        region = district.areas[0]
        representation = ReadRepresentation.model_validate({'type': 'region', **region._asdict()},
                                                           from_attributes=True)
        leader = self._handle_leader_response(region)
        if leader is None:
            raise HTTPException(status_code=404, detail="Leader not found")

        region_representation = ReadRegionRepresentationBase.model_validate(
            {'id': district.id, 'leader': leader,
             'representation': representation}, from_attributes=True)

        federal_name = district.name
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
                 'team_count': team_count,
                 'users_count': users_count,
                 'federal_name': federal_name, 'RegionRepresentation': region_representation},
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
             'federal_name': federal_name, 'team_count': team_count,
             'users_count': users_count, 'RegionRepresentation': region_representation},
            from_attributes=True)
