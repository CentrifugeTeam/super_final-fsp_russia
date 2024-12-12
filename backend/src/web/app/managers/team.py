from typing import List, Any, Callable, Iterable

from fastapi import UploadFile
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.bases import BasePage
from fastapi_sqlalchemy_toolkit.model_manager import ModelT, CreateSchemaT
from sqlalchemy import UnaryExpression, Select, Row, Function
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload

from .base import BaseManager
from shared.storage.db.models import Team, District, TeamSolution
from .files import _save_file_to_static


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

    async def create_team(
            self,
            session: AsyncSession,
            in_obj: CreateSchemaT | None = None,
            file: UploadFile | None = None,
            *,
            commit: bool = True,
            refresh_attribute_names: Iterable[str] | None = None,
            **attrs: Any,
    ) -> ModelT:
        create_data = in_obj.model_dump()
        create_data.update(attrs)

        # Добавляем дефолтные значения полей для валидации уникальности
        for field, default in self.defaults.items():
            if field not in create_data:
                create_data[field] = default

        await self.run_db_validation(session, in_obj=create_data)
        if file is not None:
            try:
                photo_url = await _save_file_to_static(file)
                create_data['photo_url'] = photo_url
            except Exception as e:
                pass
        else:
            create_data['photo_url'] = None

        db_obj = self.model(**create_data)
        session.add(db_obj)
        await self.save(session, commit=commit)
        await session.refresh(db_obj, attribute_names=refresh_attribute_names)
        return db_obj


    async def get_federal_representation(self, representation_id: int):
        pass
