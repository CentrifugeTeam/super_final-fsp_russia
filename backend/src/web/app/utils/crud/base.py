from fastapi_permissions import has_permission
from fastapi_sqlalchemy_toolkit import ModelManager
from pydantic import BaseModel
from starlette import status

from shared.crud import CRUDTemplate
from shared.crud import (
    missing_token_or_inactive_user_response, not_found_response, forbidden_response,
)
from typing import Any, TypeVar, Type, Callable
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from polyfactory.factories.pydantic_factory import ModelFactory
from shared.crud.openapi_responses import auth_responses
from web.app.dependencies.session import get_session
from web.app.utils.users import authenticator
from typing import TypeVar

Resource = TypeVar('Resource')

class CrudAPIRouter(CRUDTemplate):

    def __init__(self, schema: Type[BaseModel], manager: ModelManager,
                 create_schema: Type[BaseModel], update_schema: Type[BaseModel], **kwargs: Any):
        super().__init__(schema, manager, get_session, create_schema, update_schema, **kwargs)

    def _get_all(self):
        @self.get(
            path='/',
            response_model=list[self.schema],

        )
        async def func(request: Request, session: AsyncSession = Depends(self.get_session), ):
            return await self.manager.list(session)

    def _get_one(self):
        @self.get(
            path='/{id}',
            response_model=self.schema,
            responses={**not_found_response}

        )
        async def func(request: Request, id: int, session: AsyncSession = Depends(self.get_session)):
            return await self.manager.get_or_404(session, id=id)

    def _create(self):
        create_schema = self.create_schema

        @self.post(
            '/',
            response_model=self.schema,
            dependencies=[Depends(authenticator.get_user())],
            responses={**missing_token_or_inactive_user_response, **forbidden_response}
        )
        async def func(request: Request, objs: create_schema, session: AsyncSession = Depends(self.get_session)):
            return await self.manager.create(session, objs)

    def _update(self, *args: Any, **kwargs: Any):
        update_schema = self.update_schema

        @self.patch(
            '/{id}',
            response_model=self.schema,
            dependencies=[Depends(authenticator.get_user())],
            responses={**missing_token_or_inactive_user_response, **forbidden_response
                       }
        )
        async def func(request: Request, id: int, scheme: update_schema,
                       session: AsyncSession = Depends(self.get_session)):
            model = await self.manager.get_or_404(session, id=id)
            return await self.manager.update(session, model, scheme)

    def _delete_all(self, *args: Any, **kwargs: Any):
        @self.delete(
            '/',
            status_code=status.HTTP_204_NO_CONTENT,
            dependencies=[Depends(authenticator.get_user(superuser=True))],
            responses={**auth_responses, **forbidden_response}
        )
        async def route(session: AsyncSession = Depends(self.get_session)):
            for model in await self.manager.list(session):
                await session.delete(model)
            await session.commit()
            return

    def _delete_one(self, *args: Any, **kwargs: Any):
        @self.delete(
            '/{id}',
            status_code=status.HTTP_204_NO_CONTENT,
            dependencies=[Depends(authenticator.get_user(superuser=True))],
            responses={**auth_responses, **not_found_response}
        )
        async def route(id: int, session: AsyncSession = Depends(self.get_session)):
            obj_in_db = await self.manager.get_or_404(session, id=id)
            await self.manager.delete(session, obj_in_db)
            return

