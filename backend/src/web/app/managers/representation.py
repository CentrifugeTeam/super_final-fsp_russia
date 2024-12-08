from typing import Callable, Any, List

from fastapi import HTTPException
from fastapi_pagination.bases import BasePage
from fastapi_sqlalchemy_toolkit.model_manager import ModelT
from sqlalchemy import UnaryExpression, Select, Row, select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload, aliased

from .base import BaseManager
from shared.storage.db.models import Representation, RegionRepresentation, Team, User
from ..schemas import ReadCardRepresentation


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
            .filter(Team.region_representation_id == id)
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
        federal_name = result['RegionRepresentation'].federation_representation.name

        return ReadCardRepresentation.model_validate({'federal_name': federal_name, **result}, from_attributes=True)
