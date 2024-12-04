from secrets import token_urlsafe

from fastapi import APIRouter, Request, Depends, HTTPException, status
from httpx_oauth.oauth2 import GetAccessTokenError
from fastapi.responses import RedirectResponse
from logging import getLogger

from sqlalchemy.ext.asyncio import AsyncSession
from ...auth.strategy import JWTStrategy
from ...dependencies.session import get_session
from ...auth.transport import TransportResponse
from ...utils.users import backend
from ...services.oauth import YandexOAuth2, VKOAuth2
from ...services.oauth.base import GetUserInfoError
from ...utils.users import user_manager

yandex_oauth2 = YandexOAuth2()
vk_oauth2 = VKOAuth2()
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


@r.get('/vk')
async def vk_login(request: Request):
    """
    Получение ссылки для входа в VK
    :param request:
    :return:
    """
    url = await vk_oauth2.get_authorization_url(redirect_uri=vk_oauth2.redirect_uri, code_challenge=token_urlsafe(),
                                                code_challenge_method='S256')
    return RedirectResponse(url)


@r.get("/vk/callback", description="Callback после входа в VK", responses={
    status.HTTP_400_BAD_REQUEST:
        {"description": "OAUTH2 error"},
}, response_model=TransportResponse, deprecated=True)
async def vk_callback(request: Request, code: str,
                      code_verifier: str,
                      device_id: str,
                      session: AsyncSession = Depends(get_session),
                      strategy: JWTStrategy = Depends(backend.get_strategy),
                      ):
    """
    Callback после входа в VK и получение refresh и access токена пользователя
    :param request:
    :param code:
    :return:
    """
    try:
        oauth2_response = await vk_oauth2.get_access_token(code, code_verifier, device_id)
    except GetAccessTokenError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='OAUTH2 error')

    try:
        user_info = await vk_oauth2.get_user_info(oauth2_response.access_token)
    except GetUserInfoError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='OAUTH2 error')

    user = await user_manager.create_vk_user(session, user_info, oauth2_response)

    return await backend.login(strategy, user)
