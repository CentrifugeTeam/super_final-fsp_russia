from typing import List, Any, Callable

from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.bases import BasePage
from fastapi_sqlalchemy_toolkit.model_manager import ModelT
from sqlalchemy import UnaryExpression, Select, Row, Function
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload

from .base import BaseManager
from shared.storage.db.models import Team, District, TeamSolution


class TeamManager(BaseManager):

    def __init__(self):
        super().__init__(Team)

    async def get(
            self,
            session: AsyncSession,
            options: List[Any] | Any | None = None,
            order_by: InstrumentedAttribute | UnaryExpression | None = None,
            where: Any | None = None,
            base_stmt: Select | None = None,
            unique: bool = False,
            **simple_filters: Any,

    ) -> ModelT | Row | None:
        stmt = self.assemble_stmt(base_stmt, order_by, options, where, **simple_filters)

        result = await session.execute(stmt)
        return result.unique().scalar()

    # async def paginated_list(
    #         self,
    #         session: AsyncSession,
    #         federal_name: str | None = None,
    #         score: int | None = None,
    #         **simple_filters: Any,
    # ) -> BasePage[ModelT | Row]:
    #     options = [joinedload(Team.district), joinedload(Team.solutions)]
    #     filter_expressions = {District.name: federal_name},
    #     nullable_filter_expressions = {TeamSolution.score: score}
    #     self.handle_filter_expressions(filter_expressions)
    #     self.handle_nullable_filter_expressions(nullable_filter_expressions)
    #     filter_expressions = filter_expressions | nullable_filter_expressions
    #
    #     stmt = self.assemble_stmt(None, None, options, None, **simple_filters)
    #     stmt = self.get_joins(
    #         stmt,
    #         options=options,
    #         order_by=None,
    #         filter_expressions=filter_expressions,
    #     )
    #
    #     for filter_expression, value in filter_expressions.items():
    #         if isinstance(filter_expression, InstrumentedAttribute | Function):
    #             stmt = stmt.filter(filter_expression == value)
    #         else:
    #             stmt = stmt.filter(filter_expression(value))
    #
    #     return await paginate(session, stmt, transformer=None)

    async def get_federal_representation(self, representation_id: int):
        pass
