from typing import List, Any, Iterable

from fastapi import HTTPException
from fastapi_sqlalchemy_toolkit import ModelManager
from logging import getLogger

from fastapi_sqlalchemy_toolkit.model_manager import CreateSchemaT, ModelT
from sqlalchemy import UnaryExpression, Select, Row
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from starlette import status

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


    async def get(
            self,
            session: AsyncSession,
            options: List[Any] | Any | None = None,
            order_by: InstrumentedAttribute | UnaryExpression | None = None,
            where: Any | None = None,
            base_stmt: Select | None = None,
            unique: bool | None = None,
            **simple_filters: Any,
    ) -> ModelT | Row | None:
        """
        Получение одного экземпляра модели при существовании

        :param session: сессия SQLAlchemy

        :param options: параметры для метода .options() загрузчика SQLAlchemy

        :param order_by: поле для сортировки

        :param where: выражение, которое будет передано в метод .where() SQLAlchemy

        :param base_stmt: объект Select для SQL запроса. Если передан, то метод вернёт
        экземпляр Row, а не ModelT.
        Примечание: фильтрация и сортировка по связанным моделям скорее всего
        не будут работать вместе с этим параметром.

        :param simple_filters: параметры для фильтрации по точному соответствию,
        аналогично методу .filter_by() SQLAlchemy

        :returns: экземпляр модели, Row или None, если подходящего нет в БД
        """
        stmt = self.assemble_stmt(base_stmt, order_by, options, where, **simple_filters)

        result = await session.execute(stmt)
        if base_stmt is None:
            if order_by is not None:
                return result.scalars().first()
            if unique:
                return result.unique().scalar_one_or_none()
            return result.scalar_one_or_none()
        if unique:
            return result.unique().first()
        return result.first()

    async def get_or_404(
            self,
            session: AsyncSession,
            options: List[Any] | Any | None = None,
            order_by: InstrumentedAttribute | UnaryExpression | None = None,
            where: Any | None = None,
            base_stmt: Select | None = None,
            unique: bool | None = None,
            **simple_filters: Any,
    ) -> ModelT | Row:
        """
        Получение одного экземпляра модели или вызов HTTP исключения 404.

        :param session: сессия SQLAlchemy

        :param options: параметры для метода .options() загрузчика SQLAlchemy

        :param order_by: поле для сортировки

        :param where: выражение, которое будет передано в метод .where() SQLAlchemy

        :param base_stmt: объект Select для SQL запроса. Если передан, то метод вернёт
        экземпляр Row, а не ModelT.

        :param simple_filters: параметры для фильтрации по точному соответствию,
        аналогично методу .filter_by() SQLAlchemy

        :returns: экземпляр модели или Row

        :raises: fastapi.HTTPException 404
        """

        db_obj = await self.get(
            session,
            options=options,
            order_by=order_by,
            where=where,
            base_stmt=base_stmt,
            unique=unique,
            **simple_filters,
        )
        if not db_obj:
            attrs_str = ", ".join(
                [f"{key}={value}" for key, value in simple_filters.items()]
            )
            if where is not None:
                attrs_str += f", {where}"
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.model.__tablename__} with {attrs_str} not found",
            )
        return db_obj