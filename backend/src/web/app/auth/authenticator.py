from typing import Optional, Sequence, Annotated
from fastapi import status, HTTPException, Depends
from fastapi_users.authentication import AuthenticationBackend
from .strategy import JWTStrategy
from .transport import AppTransport
from logging import getLogger
from fastapi.security import OAuth2PasswordBearer, HTTPAuthorizationCredentials
from ..dependencies.session import get_session
from sqlalchemy.ext.asyncio import AsyncSession

from shared.storage.db.models import User

logger = getLogger(__name__)


class Authenticator:
    """
    A helper class to authenticate users.
    """

    def __init__(
            self,
            backend: AuthenticationBackend,
    ):
        self.backend = backend

    def get_user_token(self, optional: bool = False,
                       active: bool = False,
                       verified: bool = False,
                       superuser: bool = False,
                       ):
        """
        Authenticate a user.
        """

        scheme = self.backend.transport.scheme

        async def wrapped(
                cred: Annotated[HTTPAuthorizationCredentials, Depends(scheme)],
                session: AsyncSession = Depends(get_session),
                strategy: JWTStrategy = Depends(self.backend.get_strategy),
        ):
            user = await strategy.read_token(cred.credentials, session)
            status_code = status.HTTP_401_UNAUTHORIZED
            # if user:
            #     status_code = status.HTTP_403_FORBIDDEN
            #     if active and not user.is_active:
            #         status_code = status.HTTP_401_UNAUTHORIZED
            #         user = None
            #     elif (
            #             verified and not user.is_verified or superuser and not user.is_superuser
            #     ):
            #         user = None

            if not user and not optional:
                raise HTTPException(status_code=status_code)

            return user, cred.credentials

        return wrapped

    def get_user(self, optional: bool = False,
                       active: bool = False,
                       verified: bool = False,
                       superuser: bool = False,
                       ):
        """
        Authenticate a user.
        """

        scheme = self.backend.transport.scheme

        async def wrapped(
                cred: Annotated[HTTPAuthorizationCredentials, Depends(scheme)],
                session: AsyncSession = Depends(get_session),
                strategy: JWTStrategy = Depends(self.backend.get_strategy),
        ):
            user = await strategy.read_token(cred.credentials, session)
            status_code = status.HTTP_401_UNAUTHORIZED
            # if user:
            #     status_code = status.HTTP_403_FORBIDDEN
            #     if active and not user.is_active:
            #         status_code = status.HTTP_401_UNAUTHORIZED
            #         user = None
            #     elif (
            #             verified and not user.is_verified or superuser and not user.is_superuser
            #     ):
            #         user = None

            if not user and not optional:
                raise HTTPException(status_code=status_code)

            return user

        return wrapped
