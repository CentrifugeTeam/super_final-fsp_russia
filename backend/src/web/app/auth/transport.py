from fastapi.security.utils import get_authorization_scheme_param
from fastapi_users.authentication.transport import Transport
from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
from fastapi_users.openapi import OpenAPIResponseType
from fastapi.responses import JSONResponse
from fastapi import Response, status, HTTPException
from pydantic import BaseModel
from starlette.requests import Request

from shared.crud.openapi_responses import no_content_response


class TransportResponse(BaseModel):
    access_token: str
    refresh_token: str


class SecurityScheme(HTTPBearer):
    async def __call__(
        self, request: Request
    ):
        authorization = request.headers.get("Authorization")
        scheme, credentials = get_authorization_scheme_param(authorization)
        if not (authorization and scheme and credentials):
            raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token or inactive user."
                )
        if scheme.lower() != "bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing token or inactive user.",
                )
        return HTTPAuthorizationCredentials(scheme=scheme, credentials=credentials)


class AppTransport(Transport):
    scheme: SecurityScheme

    def __init__(self):
        self.scheme = SecurityScheme(auto_error=True)

    async def get_login_response(self, token: dict) -> Response:
        return token

    @staticmethod
    def get_openapi_login_responses_success() -> OpenAPIResponseType:
        return {
            status.HTTP_200_OK: {
                "model": TransportResponse,
                "content": {
                    "application/json": {
                        "example": {
                            "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1"
                                            "c2VyX2lkIjoiOTIyMWZmYzktNjQwZi00MzcyLTg2Z"
                                            "DMtY2U2NDJjYmE1NjAzIiwiYXVkIjoiZmFzdGFwaS"
                                            "11c2VyczphdXRoIiwiZXhwIjoxNTcxNTA0MTkzfQ."
                                            "M10bjOe45I5Ncu_uXvOmVV8QxnL-nZfcH96U90JaocI",
                            "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1"
                                             "c2VyX2lkIjoiOTIyMWZmYzktNjQwZi00MzcyLTg2Z"
                                             "DMtY2U2NDJjYmE1NjAzIiwiYXVkIjoiZmFzdGFwaS"
                                             "11c2VyczphdXRoIiwiZXhwIjoxNTcxNTA0MTkzfQ."
                                             "M10bjOe45I5Ncu_uXvOmVV8QxnL-nZfcH96U90JaocI",

                        }
                    }
                },
            },
        }

    async def get_logout_response(self) -> Response:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def get_openapi_logout_responses_success() -> OpenAPIResponseType:
        return no_content_response
