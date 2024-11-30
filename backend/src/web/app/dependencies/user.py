from httpx_oauth.integrations.fastapi import OAuth2AuthorizeCallback, OAuth2Token
from fastapi import Depends
from ..auth.auth2 import google_sso


oauth2_authorize_callback = OAuth2AuthorizeCallback(google_sso, "oauth-callback")


async def get_user(access_token_state: OAuth2Token = Depends(OAuth2AuthorizeCallback)):
    access_token, state = access_token_state


