import schemathesis
from schemathesis import Case
from .utils import app, calendar_app, web_api_client

schemathesis.experimental.OPEN_API_3_1.enable()
schema = schemathesis.from_asgi("/openapi.json", app)


class Auth:

    def get(self, case, ctx):
        web_api_client.get('/')
        return 'dima'

    def set(self, case: Case, data, ctx):
        case.headers = case.headers or {}
        case.headers['api_key'] = data


@schema.auth(Auth)
@schema.exclude(path_regex=r'^/api/accounts').exclude(path_regex=r'^/api/oauth2') .parametrize()
def test_api(case: Case):
    case.call_and_validate()


# calendar_schema = schemathesis.from_asgi("/openapi.json", calendar_app)
#
#
# @calendar_schema.parametrize()
# def test_calendar_api(case: Case):
#     case.call_and_validate()
