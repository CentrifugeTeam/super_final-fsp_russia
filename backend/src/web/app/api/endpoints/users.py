from typing import Callable, Any, cast, Annotated

from fastapi import Depends, UploadFile, Form, File, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from starlette import status

from crud.openapi_responses import bad_request_response
from shared.crud import missing_token_or_inactive_user_response, forbidden_response, not_found_response
from shared.storage.db.models import User, Area, Team
from ...exceptions import FileDoesntSave
from ...managers.files import _save_file_to_static
from ...schemas import ReadRepresentation

from ...utils.crud import CrudAPIRouter
from ...schemas.users import ReadUser, CreateUser, UpdateUser
from ...schemas.teams import ReadUserMe
from ...utils.users import user_manager, backend, authenticator


class UsersRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadUser, user_manager, CreateUser, UpdateUser, resource_identifier='username')

    def _get_one(self):
        @self.get(
            '/{%s}' % self.resource_identifier,
            response_model=ReadUserMe,
            responses={**not_found_response}

        )
        async def func(response=Depends(
            self.get_or_404(options=[joinedload(User.teams), joinedload(User.area)], unique=True))):
            return self._response_me(response, response.area, response.teams)

    def _create(self):
        create_schema = self.create_schema

        @self.post(
            '/register',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response, **bad_request_response},
            status_code=201,

        )
        async def func(
                username: Annotated[str, Form()],
                first_name: Annotated[str, Form()],
                last_name: Annotated[str, Form()],
                password: Annotated[str, Form()],
                email: Annotated[str, Form()],
                middle_name: Annotated[str | None, Form()] = None,
                about: Annotated[str | None, Form()] = None,
                photo: UploadFile | None = None,
                session: AsyncSession = Depends(self.get_session),
        ):
            """
            This function is used to create a new user. It takes in the following parameters:
            - username: The username of the user.
            - first_name: The first name of the user.
            - last_name: The last name of the user.
            - password: The password of the user.
            - email: The email of the user.
            - middle_name: The middle name of the user.
            - photo: The photo of the user.
            - session: The database session.

            It returns the created user.
            """
            try:
                user = create_schema(username=username, first_name=first_name, middle_name=middle_name,
                                     last_name=last_name,
                                     email=email, password=password, about=about)
            except ValidationError as e:
                raise HTTPException(status_code=422, detail=e.errors())
            return await user_manager.create_user(session, user, file=photo)

    @staticmethod
    def _response_me(user: User, representation: Area, teams: list[Team] | None):
        if not teams:
            teams = None
        if representation:
            representation = ReadRepresentation.model_validate({**representation._asdict(), 'type': 'region'},
                                                               from_attributes=True)
        return ReadUserMe.model_validate({'representation': representation,
                                          'teams': teams,
                                          **user._asdict()}, from_attributes=True)

    def _me(self):
        @self.get('/me', response_model=ReadUserMe,
                  responses={**missing_token_or_inactive_user_response})
        async def func(user=Depends(authenticator.get_user())):
            representation = await user.awaitable_attrs.area
            teams = await user.awaitable_attrs.teams
            return self._response_me(user, representation, teams)

        @self.patch('/me', response_model=ReadUser,
                    responses={**missing_token_or_inactive_user_response, **bad_request_response})
        async def func(
                username: str = Form(None),
                first_name: str = Form(None),
                last_name: str = Form(None),
                email: str = Form(None),
                middle_name: str = Form(None),
                about: str = Form(None),
                file: UploadFile | None = None,
                session: AsyncSession = Depends(self.get_session),
                user_in_db: User = Depends(authenticator.get_user()),

        ):
            """
            This function is used to update the current user. It takes in the following parameters:
            - username: The username of the user.
            - first_name: The first name of the user.
            - last_name: The last name of the user.
            - email: The email of the user.
            - middle_name: The middle name of the user.
            - about: The about of the user.
            - file: The file of the user.
            - session: The database session.
            """

            try:
                if file:
                    file = await _save_file_to_static(file)

                user = self.update_schema(username=username, first_name=first_name, middle_name=middle_name,
                                          last_name=last_name,
                                          photo_url=file,
                                          email=email, about=about)
            except ValidationError as e:
                raise HTTPException(status_code=422, detail=e.errors())
            except FileDoesntSave as e:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Could not upload file')

            user = await user_manager.update(session, user_in_db, user, refresh_attribute_names=['area'])
            representation = await user.awaitable_attrs.area
            teams = await user.awaitable_attrs.teams
            return self._response_me(user, representation, teams)


    def _patch_user(self):
        @self.patch('/{%s}' % self.resource_identifier, response_model=ReadUserMe,
                    responses={**missing_token_or_inactive_user_response, **bad_request_response,
                               **not_found_response})
        async def func(
                username: str,
                first_name: str = Form(None),
                last_name: str = Form(None),
                email: str = Form(None),
                middle_name: str = Form(None),
                about: str = Form(None),
                file: UploadFile | None = None,
                session: AsyncSession = Depends(self.get_session),
                patcher: User = Depends(authenticator.get_user()),

        ):
            user_in_db = await self.manager.get_or_404(session, username=username)
            try:
                if file:
                    file = await _save_file_to_static(file)

                user = self.update_schema(username=username, first_name=first_name, middle_name=middle_name,
                                          last_name=last_name,
                                          photo_url=file,
                                          email=email, about=about)
            except ValidationError as e:
                raise HTTPException(status_code=422, detail=e.errors())
            except FileDoesntSave as e:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Could not upload file')

            user = await user_manager.update(session, user_in_db, user, refresh_attribute_names=['area'])
            representation = await user.awaitable_attrs.area
            teams = await user.awaitable_attrs.teams
            return self._response_me(user, representation, teams)

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [self._me, self._create, self._get_one, self._get_all, self._patch_user]

    def get_or_404(self, *args, **kwargs):
        async def wrapper(username: str, session: AsyncSession = Depends(self.get_session)):
            return await self.manager.get_or_404(session, username=username, *args, **kwargs)

        return wrapper


r = UsersRouter()
