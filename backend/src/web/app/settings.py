from shared.settings import Settings as _Settings


class Settings(_Settings):
    """
    Settings for the Google OAuth2 provider.
    """
    YANDEX_CLIENT_ID: str
    YANDEX_CLIENT_SECRET: str
    VK_CLIENT_ID: str
    VK_CLIENT_SECRET: str
    GIGACHAT_CREDENTIALS: str