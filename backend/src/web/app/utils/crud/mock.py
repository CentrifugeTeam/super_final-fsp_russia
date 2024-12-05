from pydantic import BaseModel
from shared.crud import (
    missing_token_or_inactive_user_response, not_found_response, forbidden_response,
)
from typing import Any, TypeVar, Type, Callable
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from polyfactory.factories.pydantic_factory import ModelFactory
from .base import CrudAPIRouter


class MockCrudAPIRouter(CrudAPIRouter):

    def __init__(self, schema: Type[BaseModel],
                 create_schema: Type[BaseModel], update_schema: Type[BaseModel], **kwargs: Any):
        super().__init__(schema, None, create_schema, update_schema, **kwargs)  # type: ignore
        self.factory: ModelFactory = ModelFactory.create_factory(schema)

    def _get_all(self):
        @self.get(
            path='/',
            response_model=list[self.schema],

        )
        async def func(request: Request, session: AsyncSession = Depends(self.get_session), ):
            return self.factory.batch(10)

    def _get_one(self):
        @self.get(
            path='/{id}',
            response_model=self.schema,
            responses={**not_found_response}

        )
        async def func(request: Request, id: int, session: AsyncSession = Depends(self.get_session)):
            return self.factory.build(id=id)

    def get_or_404(self):
        async def wrapper(id: int):
            return self.factory.build(id=id)

        return wrapper

    def _create(self):
        create_schema = self.create_schema

        @self.post(
            '/',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response}
        )
        async def func(request: Request, objs: create_schema, session: AsyncSession = Depends(self.get_session)):
            return self.factory.build(**objs.model_dump())
