from asyncpg.pgproto.pgproto import timedelta
from fastapi_users.authentication.backend import AuthenticationBackend
from fastapi_users.authentication.transport.bearer import BearerTransport
from ..auth.authenticator import Authenticator
from ..auth.strategy import JWTStrategy
from ..conf import settings
from ..managers.users import UsersManager
from ..dependencies.session import get_session

transport = BearerTransport('auth/jwt/login')


def get_strategy():
    return JWTStrategy(secret=settings.JWT_PRIVATE_KEY, lifetime_seconds=timedelta(minutes=30), refresh_token_lifetime=timedelta(days=30))


backend = AuthenticationBackend(name='jwt', get_strategy=get_strategy, transport=transport)
user_manager = UsersManager()

authenticator = Authenticator(backend, get_session)
