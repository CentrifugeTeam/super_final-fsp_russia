from secrets import token_urlsafe
from typing import Iterable, Any, Optional

from fastapi.security import OAuth2PasswordRequestForm
from fastapi_sqlalchemy_toolkit.model_manager import CreateSchemaT, ModelT
from fastapi_users.password import PasswordHelperProtocol, PasswordHelper
from sqlalchemy import UnaryExpression, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, joinedload

from shared.storage.cache.redis_client import RedisClient
from shared.storage.db.models import User, Role, OAuthAccount
from .base import BaseManager
from ..schemas.users import UserCredentials
from ..services.oauth import YandexUserInfo
from ..services.oauth.base import OAuth2Response
from ..services.oauth.vk_oauth import VKUserInfo


class UsersManager(BaseManager):

    def __init__(self,
                 default_ordering: InstrumentedAttribute | UnaryExpression | None = None,
                 password_helper: Optional[PasswordHelperProtocol] = None,
                 ) -> None:
        if password_helper is None:
            self.password_helper = PasswordHelper()
        else:
            self.password_helper = password_helper  # pragma: no cover
        super().__init__(User, default_ordering)

    async def create(
            self,
            session: AsyncSession,
            in_obj: CreateSchemaT | None = None,
            refresh_attribute_names: Iterable[str] | None = None,
            *,
            commit: bool = True,
            **attrs: Any,
    ) -> ModelT:
        async with session.begin():
            in_obj.password = self.password_helper.hash(in_obj.password)
            user = await super().create(session, in_obj, commit=False, **attrs)
            # stmt = select(Role).where(Role.name == 'role:costumer')
            # costumer_role = await session.scalar(stmt)
            # user.roles = [costumer_role]

        return user

    async def create_yandex_user(
            self,
            session: AsyncSession,
            user_info: YandexUserInfo,
            yandex_tokens: OAuth2Response,

    ):
        stmt = self.assemble_stmt(username=user_info.login, options=[joinedload(User.oauth_accounts)])
        user = await session.scalar(stmt)
        if user:
            return user

        user = User(username=user_info.login, password=None, first_name=user_info.first_name, middle_name=None,
                    last_name=user_info.last_name,
                    email=user_info.default_email,
                    photo_url=f'https://avatars.yandex.net/get-yapic/{user_info.default_avatar_id}')
        account = OAuthAccount(provider='yandex', access_token=yandex_tokens.access_token,
                               refresh_token=yandex_tokens.refresh_token)
        user.oauth_accounts = [account]
        session.add(user)

        await session.commit()
        return user


    async def create_vk_user(
            self,
            session: AsyncSession,
            user_info: VKUserInfo,
            tokens: OAuth2Response,
    ):
        pass

    async def authenticate(self, session: AsyncSession, credentials: UserCredentials):
        stmt = select(User).where(credentials.login == User.username)
        user = (await session.execute(stmt)).scalar()
        if not user:
            # Run the hasher to mitigate timing attack
            # Inspired from Django: https://code.djangoproject.com/ticket/20760
            self.password_helper.hash(credentials.password)
            return None
        if user.password is None:
            return None

        verified, updated_password_hash = self.password_helper.verify_and_update(
            credentials.password, user.password
        )
        if not verified:
            return None
        # Update password hash to a more robust one if needed
        if updated_password_hash is not None:
            user.password = updated_password_hash
            session.add(user)
            await session.commit()

        return user

    async def _create_partial_user(self, redis: RedisClient, user_info: YandexUserInfo):
        token = self._generate_partial_token()
        await redis.hset(token, mapping=user_info.model_dump())
        return token

    async def create_partial_user(self, redis: RedisClient, access_token: str):
        user_info = await self.get_user_info(access_token)
        return await self._create_partial_user(redis, user_info)

    def _generate_partial_token(self):
        return token_urlsafe()

