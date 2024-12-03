import string
from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from httpx_oauth.oauth2 import GetAccessTokenError
from logging import getLogger
from random import choices

from sqlalchemy.ext.asyncio import AsyncSession

from ...dependencies.session import get_session
from ...utils.users import user_manager

from ...services.yandex_oauth import YandexOAuth2

yandex_oauth2 = YandexOAuth2()
r = APIRouter()

logger = getLogger(__name__)


@r.get("/yandex/login", description="Перенаправление на Yandex для входа", response_class=RedirectResponse)
async def yandex_login(request: Request):
    url = await yandex_oauth2.get_authorization_url(request.url_for('yandex_callback'),
                                                    extras_params={"force_confirm": 1})
    return RedirectResponse(url)


@r.get("/yandex/callback", description="Callback после входа в Yandex", responses={
    status.HTTP_400_BAD_REQUEST:
        {"description": "Could not get access token"},
})
async def yandex_callback(request: Request, code: str,
                          session: AsyncSession = Depends(get_session),
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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Could not get access token')

    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(choices(characters))
    response = await yandex_oauth2.get_user_info(oauth2_response.access_token)
    user = await user_manager.create(session,
                                     response.model_dump(include={'first_name', 'last_name', 'default_email', 'login'},
                                                         by_alias=True), password=password)
    return response
