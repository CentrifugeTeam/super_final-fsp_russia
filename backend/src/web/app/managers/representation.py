from typing import Callable, Any, List

from fastapi_pagination.bases import BasePage
from fastapi_sqlalchemy_toolkit.model_manager import ModelT
from sqlalchemy import UnaryExpression, Select, Row
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload

from .base import BaseManager
from shared.storage.db.models import Representation, RegionRepresentation


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