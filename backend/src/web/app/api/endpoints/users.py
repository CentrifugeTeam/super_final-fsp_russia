from typing import Callable, Any

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from crud.openapi_responses import missing_token_or_inactive_user_response, forbidden_response
from ...utils.crud import CrudAPIRouter, Context


class UsersRouter(CrudAPIRouter):

    def _create(self):
        create_schema = self.create_schema

        @self.post(
            '/register',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response}
        )
        async def func(objs: create_schema, session: AsyncSession = Depends(self.get_session)):
            return await self.manager.create(session, objs)


    def _register_routes(self) -> list[Callable[..., Any]]:
        return [self._create]



