from typing import List, Any, Iterable

from fastapi_sqlalchemy_toolkit import ModelManager
from logging import getLogger

from sqlalchemy import UnaryExpression, Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

logger = getLogger("managers")


class BaseManager(ModelManager):

    async def get_or_create(self,
                            session: AsyncSession,
                            options: List[Any] | Any | None = None,
                            order_by: InstrumentedAttribute | UnaryExpression | None = None,
                            where: Any | None = None,
                            base_stmt: Select | None = None,
                            simple_filters: dict[str, Any] = None,
                            refresh_attribute_names: Iterable[str] | None = None,
                            *,
                            commit: bool = True,
                            **attrs: Any,
                            ):
        if simple_filters:
            obj = await self.get(session, options, order_by, where, base_stmt, **simple_filters)
        else:
            obj = await self.get(session, options, order_by, where, base_stmt)

        if not obj:
            return await self.create(session, options, refresh_attribute_names, commit, **attrs)
        return obj
