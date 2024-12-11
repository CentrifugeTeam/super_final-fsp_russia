from typing import List, Any

from fastapi_sqlalchemy_toolkit.model_manager import ModelT
from sqlalchemy import UnaryExpression, Select, Row
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

from .base import BaseManager
from shared.storage.db.models import Team


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

    async def get_federal_representation(self, representation_id: int):
        pass
