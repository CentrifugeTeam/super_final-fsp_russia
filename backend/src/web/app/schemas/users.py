import json
from datetime import datetime
from typing import Annotated

from fastapi import UploadFile, File
from fastapi_sqlalchemy_toolkit import make_partial_model
from fastapi_permissions import Authenticated, Deny, Allow, All
from pydantic import BaseModel, Field, ConfigDict, EmailStr


class BaseUser(BaseModel):
    """
    Это базовый класс для данных пользователя. Он содержит следующие поля:
    - username: Имя пользователя.
    - first_name: Имя пользователя.
    - middle_name: Отчество пользователя.
    - last_name: Фамилия пользователя.
    - email: Электронная почта пользователя.

    Метод __acl__ используется для определения списка контроля доступа для пользователя.
    """
    username: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    email: EmailStr
    is_superuser: bool
    is_verified: bool

    def __acl__(self):
        return [
            # (Allow, f'user:{self.login}', 'view'),
            # (Allow, 'role:admin', All),
            # (Allow, f'user:{self.login}', All)
        ]


class CreateUser(BaseUser):
    """
    Этот класс представляет данные, необходимые для создания нового пользователя. Он содержит следующие поля:
    - username: Имя пользователя.
    - first_name: Имя пользователя.
    - middle_name: Отчество пользователя.
    - last_name: Фамилия пользователя.
    - email: Электронная почта пользователя.
    - password: Пароль пользователя.
    """
    password: str


class ReadUser(BaseUser):
    """
    Этот класс представляет данные, возвращаемые при чтении пользователя. Он содержит следующие поля:
    - id: Идентификатор пользователя.
    - photo_url: URL фотографии пользователя.
    # is_superuser: Булево значение, указывающее, является ли пользователь суперпользователем.
    """
    id: int
    photo_url: str
    # is_superuser: bool


_UpdateUser = make_partial_model(BaseUser)


class UpdateUser(_UpdateUser):
    photo_url: str | None


class UserCredentials(BaseModel):
    """
    Этот класс представляет учетные данные, необходимые для аутентификации пользователя. Он содержит следующие поля:
    - login: Имя пользователя или электронная почта пользователя.
    - password: Пароль пользователя.
    """
    login: str
    password: str
