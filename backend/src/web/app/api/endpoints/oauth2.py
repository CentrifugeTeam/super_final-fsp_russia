from fastapi import APIRouter, Request, Depends, HTTPException, status
from httpx_oauth.oauth2 import GetAccessTokenError
from logging import getLogger

from sqlalchemy.ext.asyncio import AsyncSession
from shared.storage.cache.redis_client import RedisClient
from ...auth.strategy import JWTStrategy
from ...dependencies import get_redis
from ...dependencies.session import get_session
from ...auth.transport import TransportResponse
from ...utils.users import backend
from ...services.oauth import YandexOAuth2
from ...services.oauth.yandex_oauth import GetUserInfoError
from ...schemas.session import UserLoginSession
from ...utils.users import user_manager


yandex_oauth2 = YandexOAuth2()
r = APIRouter()

logger = getLogger(__name__)

@r.post("/yandex", description="Callback после входа в Yandex", responses={
    status.HTTP_400_BAD_REQUEST:
        {"description": "OAUTH2 error"},
}, response_model=TransportResponse)
async def yandex_callback(request: Request, code: str,
                          session: AsyncSession = Depends(get_session),
                        strategy: JWTStrategy = Depends(backend.get_strategy),
                          ):
    """
    Callback после входа в Yandex и получение refresh и access токена пользователя
    :param request:
    :param code:
    :return:
    """
    try:
        oauth2_response = await yandex_oauth2.get_access_token(code)
    except GetAccessTokenError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='OAUTH2 error')

    try:
        user_info = await yandex_oauth2.get_user_info(oauth2_response.access_token)
    except GetUserInfoError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='OAUTH2 error')

    user = await user_manager.create_yandex_user(session, user_info, oauth2_response)

    return await backend.login(strategy, user)


@r.post("/vk", description="Callback после входа в VK", responses={
    status.HTTP_400_BAD_REQUEST:
        {"description": "OAUTH2 error"},
}, response_model=TransportResponse)
async def yandex_callback(request: Request, code: str,
                          session: AsyncSession = Depends(get_session),
                        strategy: JWTStrategy = Depends(backend.get_strategy),
                          ):
    """
    Callback после входа в Yandex и получение refresh и access токена пользователя
    :param request:
    :param code:
    :return:
    """
    try:
        oauth2_response = await yandex_oauth2.get_access_token(code)
    except GetAccessTokenError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='OAUTH2 error')

    try:
        user_info = await yandex_oauth2.get_user_info(oauth2_response.access_token)
    except GetUserInfoError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='OAUTH2 error')

    user = await user_manager.create_yandex_user(session, user_info, oauth2_response)

    return await backend.login(strategy, user)





