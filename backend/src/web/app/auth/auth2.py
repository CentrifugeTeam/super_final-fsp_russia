from fastapi_sso.sso.google import GoogleSSO
from ..conf import settings


google_sso = GoogleSSO(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET,
                       redirect_uri='http://127.0.0.1:8000/api/auth/google/callback')


