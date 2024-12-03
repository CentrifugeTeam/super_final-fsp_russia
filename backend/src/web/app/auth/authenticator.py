from typing import Optional, Sequence, Annotated
from fastapi import status, HTTPException, Depends
from fastapi_users.authentication import AuthenticationBackend
from .strategy import JWTStrategy
from .transport import AppTransport
from logging import getLogger
from fastapi.security import OAuth2PasswordBearer, HTTPAuthorizationCredentials

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
            get_session
    ):
        self.get_session = get_session
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
                token: Annotated[HTTPAuthorizationCredentials, Depends(scheme)],
                session: AsyncSession = Depends(self.get_session),
                strategy: JWTStrategy = Depends(self.backend.get_strategy),
        ):

            user = await strategy.read_token(token.credentials, session)
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

            return user, token

        return wrapped
