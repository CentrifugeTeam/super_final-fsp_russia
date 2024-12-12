from ..conf import settings

def create_staticfiles_url(url: str):
    return f'{settings.DOMAIN_URI}/staticfiles/{url}'