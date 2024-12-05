from gigachat import GigaChat
from ...conf import settings

model = GigaChat(
    credentials=settings.GIGACHAT_CREDENTIALS,
    scope='GIGACHAT_API_PERS', verify_ssl_certs=False
)

