from datetime import datetime, timezone
from logging import getLogger
from typing import Optional
import jwt
from asyncpg.pgproto.pgproto import timedelta
from fastapi import HTTPException
from fastapi_users import models
from fastapi_users.jwt import SecretType
from fastapi_users.authentication.strategy import JWTStrategy as _JWTStrategy
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from shared.storage.db.models import User

logger = getLogger(__name__)


class InvalidTokenException(Exception):
    pass


class JWTStrategy(_JWTStrategy):

    def __init__(
            self,
            secret: SecretType,
            refresh_token_lifetime: timedelta,
            lifetime_seconds: timedelta,
            token_audience: list[str] = ["fastapi-users:auth"],
            algorithm: str = "HS256",
            public_key: Optional[SecretType] = None,
    ):
        """
        Инициализирует JWTStrategy.

        :param secret: Секретный ключ для подписи токенов.
        :param refresh_token_lifetime: Время жизни токена обновления.
        :param lifetime_seconds: Время жизни доступного токена.
        :param token_audience: Аудитория токена.
        :param algorithm: Алгоритм подписи токена.
        :param public_key: Публичный ключ для проверки подписи токена.
        """
        super().__init__(secret, None, token_audience, algorithm, public_key)
        self.lifetime_seconds = lifetime_seconds
        self.refresh_token_lifetime = refresh_token_lifetime

    async def refresh_token(self, refresh_token: str):
        """
        Обновляет токен.

        :param refresh_token: Токен обновления.
        :return: Обновленные токены.
        """
        payload = self._decode_token(refresh_token)
        if payload is None:
            return payload

        access_token, refresh_token = self.generate_pair_of_tokens(payload)

        return {'access_token': access_token, 'refresh_token': refresh_token}

    def generate_pair_of_tokens(self, payload: dict):

        """
        Генерирует пару токенов.

        :param payload: Пейлоад для создания токенов.
        :return: Обновленные токены.
        """
        payload['exp'] = datetime.now(timezone.utc) + self.lifetime_seconds
        access_token = jwt.encode(payload.copy(), self.encode_key, algorithm=self.algorithm)
        payload['exp'] = datetime.now(timezone.utc) + self.refresh_token_lifetime
        refresh_token = jwt.encode(payload.copy(), self.encode_key, algorithm=self.algorithm)
        return access_token, refresh_token

    async def read_token(
            self, access_token: Optional[str], session: AsyncSession,
    ) -> Optional[models.UP]:
        """
        Читает токен.

        :param access_token: Доступный токен.
        :param session: Асинхронная сессия SQLAlchemy.
        :return: Пользователь, связанный с токеном.
        """
        if access_token is None:
            return None

        res = self._decode_token(access_token)

        if res is None:
            return res
        return await session.get(User, res['sub'])

    def _decode_token(self, token: str):
        """
        Декодирует токен.

        :param token: Токен для декодирования.
        :return: Декодированный токен.
        """
        try:
            payload = jwt.decode(
                token, self.decode_key, audience=self.token_audience, algorithms=[self.algorithm]
            )
            payload['sub'] = int(payload.get("sub"))

        except (jwt.PyJWTError, ValueError, jwt.ExpiredSignatureError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token or inactive user."
            )
        return payload

    async def destroy_token(self, access_token: str, user: models.UP) -> None:
        """
        Уничтожает токен.

        :param access_token: Доступный токен.
        :param user: Пользователь, связанный с токеном.
        """
        res = self._decode_token(access_token)
        if res is None:
            return res

    async def write_token(self, user: User) -> dict:
        """
        Записывает токен.

        :param user: Пользователь, для которого записывается токен.
        :return: Объект токена.
        """
        roles = await user.get_principals()
        payload = {"sub": str(user.id), "aud": self.token_audience, 'roles': list(roles)}
        access_token, refresh_token = self.generate_pair_of_tokens(payload)

        return {'access_token': access_token, 'refresh_token': refresh_token}