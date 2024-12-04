import json
from datetime import datetime
from typing import Annotated

from fastapi import UploadFile, File
from fastapi_sqlalchemy_toolkit import make_partial_model
from fastapi_permissions import Authenticated, Deny, Allow, All
from pydantic import BaseModel, Field, ConfigDict, EmailStr


class BaseUser(BaseModel):
    username: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    email: EmailStr | None = None

    def __acl__(self):
        return [
            # (Allow, f'user:{self.login}', 'view'),
            # (Allow, 'role:admin', All),
            # (Allow, f'user:{self.login}', All)
        ]


class CreateUser(BaseUser):
    password: str




class ReadUser(BaseUser):
    id: int
    photo_url: str
    # is_superuser: bool


UpdateUser = make_partial_model(CreateUser)


class UserCredentials(BaseModel):
    login: str
    password: str