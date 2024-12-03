from typing import Callable, Any

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from shared.crud import missing_token_or_inactive_user_response, forbidden_response
from ...auth.strategy import JWTStrategy
from ...auth.transport import TransportResponse
from ...utils.crud import CrudAPIRouter
from ...schemas.users import ReadUser, CreateUser, UpdateUser
from ...utils.users import user_manager, backend


class UsersRouter(CrudAPIRouter):

    def _create(self):
        create_schema = self.create_schema

        @self.post(
            '/register',
            response_model=TransportResponse,
            responses={**missing_token_or_inactive_user_response, **forbidden_response}
        )
        async def func(objs: create_schema, session: AsyncSession = Depends(self.get_session),
                       strategy: JWTStrategy = Depends(backend.get_strategy),
                       ):
            user = await self.manager.create(session, objs)
            return await backend.login(strategy, user)

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [self._create]


r = UsersRouter(ReadUser, user_manager, CreateUser, UpdateUser)
