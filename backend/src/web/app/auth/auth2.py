from httpx_oauth.clients.google import GoogleOAuth2
from httpx_oauth.oauth2 import BaseOAuth2
from fastapi_sso.sso.google import GoogleSSO
from ..conf import settings


google_sso = GoogleSSO(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET,
                       redirect_uri='http://127.0.0.1:8000/api/auth/google/callback')


class YandexOAuth2(BaseOAuth2):
    def __init__(self, client_id: str, client_secret: str, authorize_endpoint: str, access_token_endpoint: str):
        super().__init__(client_id, client_secret, authorize_endpoint, access_token_endpoint)