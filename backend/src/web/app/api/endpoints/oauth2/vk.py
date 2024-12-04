import base64
import hashlib
import os
import re
from secrets import token_urlsafe

from fastapi import APIRouter, Request, Depends, HTTPException, status
from httpx_oauth.oauth2 import GetAccessTokenError
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from ....auth.strategy import JWTStrategy
from ....dependencies.session import get_session
from ....auth.transport import TransportResponse
from ....utils.users import backend
from ....services.oauth import YandexOAuth2, VKOAuth2
from ....services.oauth.base import GetUserInfoError
from ....utils.users import user_manager

r = APIRouter()

vk_oauth2 = VKOAuth2()


@r.get('/')
async def vk_login(request: Request):
    """
    Получение ссылки для входа в VK
    :param request:
    :return:
    """
    code_verifier = base64.urlsafe_b64encode(os.urandom(40)).decode('utf-8')
    code_verifier = re.sub('[^a-zA-Z0-9]+', '', code_verifier)
    code_challenge = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    code_challenge = base64.urlsafe_b64encode(code_challenge).decode('utf-8')
    code_challenge = code_challenge.replace('=', '')
    url = await vk_oauth2.get_authorization_url(redirect_uri=vk_oauth2.redirect_uri, code_challenge=code_challenge,
                                                code_challenge_method='S256', state=code_verifier)
    return RedirectResponse(url)


@r.get("/callback", description="Callback после входа в VK", responses={
    status.HTTP_400_BAD_REQUEST:
        {"description": "OAUTH2 error"},
}, response_model=TransportResponse)
async def vk_callback(request: Request, code: str,
                      state: str,
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
        oauth2_response = await vk_oauth2.get_access_token(code, state, device_id)
    except GetAccessTokenError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    try:
        user_info = await vk_oauth2.get_user_info(oauth2_response.access_token)
    except GetUserInfoError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='OAUTH2 error')

    user = await user_manager.create_vk_user(session, user_info, oauth2_response)

    return await backend.login(strategy, user)
