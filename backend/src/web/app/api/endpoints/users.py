from typing import Callable, Any, cast, Annotated

from fastapi import Depends, UploadFile, Form, File, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from shared.crud import missing_token_or_inactive_user_response, forbidden_response

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
            response_model=create_schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response},
            status_code=201,

        )
        async def func(

                username: Annotated[str, Form()],
                first_name: Annotated[str, Form()],
                middle_name: Annotated[str, Form()],
                last_name: Annotated[str, Form()],
                email: Annotated[str, Form()],
                password: Annotated[str, Form()],
                photo: UploadFile | None = None,
                session: AsyncSession = Depends(self.get_session),

        ):
            try:
                user = create_schema(username=username, first_name=first_name, middle_name=middle_name,
                                     last_name=last_name,
                                     email=email, password=password)
            except ValidationError as e:
                raise HTTPException(status_code=422, detail=e.errors())
            return await user_manager.create_user(session, user, file=photo)

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [self._create, self._get_one, self._get_all, self._update]


r = UsersRouter()
