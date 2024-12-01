from typing import Optional, Sequence, cast, Callable
from fastapi import status, Depends, HTTPException
from fastapi_users.authentication import AuthenticationBackend, Strategy
from fastapi_users.authentication.authenticator import Authenticator as _Authenticator, DuplicateBackendNamesError, \
    EnabledBackendsDependency, name_to_variable_name, name_to_strategy_variable_name
from logging import getLogger

from storage.db.models import User

logger = getLogger(__name__)



class Authenticator:
    """
    A helper class to authenticate users.
    """

    def __init__(
            self,
            backends: Sequence[AuthenticationBackend],
            get_session
    ):
        self.get_session = get_session
        self.backends = backends

    async def authenticate(self, *args,
                            optional: bool = False,
                            active: bool = False,
                            verified: bool = False,
                            superuser: bool = False,
                            session, **kwargs) -> tuple[Optional[User], Optional[str]]:

        """
        Authenticate a user.
        :param args:
        :param optional:
        :param active:
        :param verified:
        :param superuser:
        :param session:
        :param kwargs:
        :return:
        """

        user: User | None = None
        token: Optional[str] = None
        enabled_backends: Sequence[AuthenticationBackend] = (
            kwargs.get("enabled_backends", self.backends)
        )

        for backend in self.backends:
            if backend in enabled_backends:
                logger.info('kwargs is %s', kwargs)
                token = kwargs[name_to_variable_name(backend.name)]
                logger.info('token is %s', token)
                strategy: Strategy = kwargs[
                    name_to_strategy_variable_name(backend.name)
                ]
                logger.info('strategy is %s', strategy)
                if token is not None:
                    user = await strategy.read_token(token, session)

                    if user:
                        break

        status_code = status.HTTP_401_UNAUTHORIZED
        if user:
            status_code = status.HTTP_403_FORBIDDEN
            if active and not user.is_active:
                status_code = status.HTTP_401_UNAUTHORIZED
                user = None
            elif (
                    verified and not user.is_verified or superuser and not user.is_superuser
            ):
                user = None
        if not user and not optional:
            raise HTTPException(status_code=status_code)

        return user, token

    async def _authenticate(self):
        pass

