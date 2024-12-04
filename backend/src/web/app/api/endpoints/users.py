from typing import Callable, Any, cast, Annotated

from fastapi import Depends, UploadFile, Form, File, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from shared.crud import missing_token_or_inactive_user_response, forbidden_response

from ...auth.strategy import JWTStrategy
from ...auth.transport import TransportResponse
from ...managers.users import UsersManager
from ...utils.crud import CrudAPIRouter
from ...schemas.users import ReadUser, CreateUser, UpdateUser
from ...utils.users import user_manager, backend


class UsersRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadUser, user_manager, CreateUser, UpdateUser)

    def _create(self):
        create_schema = self.create_schema

        @self.post(
            '/register',
            response_model=TransportResponse,
            responses={**missing_token_or_inactive_user_response, **forbidden_response}
        )
        async def func(
                username: Annotated[str, Form()],
                first_name: Annotated[str, Form()],
                middle_name: Annotated[str, Form()],
                last_name: Annotated[str, Form()],
                email: Annotated[str, Form()],
                password: Annotated[str, Form()],
                session: AsyncSession = Depends(self.get_session),
                photo: UploadFile = File(...),
                strategy: JWTStrategy = Depends(backend.get_strategy),
        ):
            try:
                user = create_schema(username=username, first_name=first_name, middle_name=middle_name, last_name=last_name,
                                 email=email, password=password)
            except ValidationError as e:
                raise HTTPException(status_code=422, detail=e.errors())
            user = await user_manager.create_user(session, user, file=photo)
            return await backend.login(strategy, user)

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [self._create, self._get_one, self._get_all, self._update]


r = UsersRouter()
