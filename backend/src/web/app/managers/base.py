from typing import List, Any, Iterable

from fastapi_sqlalchemy_toolkit import ModelManager
from logging import getLogger

from fastapi_sqlalchemy_toolkit.model_manager import CreateSchemaT
from sqlalchemy import UnaryExpression, Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

logger = getLogger("managers")


class BaseManager(ModelManager):

    async def get_or_create(self,
                            session: AsyncSession,
                            in_obj: CreateSchemaT | None = None,
                            refresh_attribute_names: Iterable[str] | None = None,
                            *,
                            commit: bool = True,
                            **attrs: Any,
                            ):
        obj = await self.get(session, **in_obj.model_dump())

        if not obj:
            return await self.create(session, in_obj=in_obj, refresh_attribute_names=refresh_attribute_names,
                                     commit=commit, **attrs)
        return obj
