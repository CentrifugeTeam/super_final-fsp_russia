from fastapi_users.authentication.transport.bearer import BearerTransport as _BearerTransport
from fastapi_users.openapi import OpenAPIResponseType
from fastapi import Response, Request, status, HTTPException

from crud.openapi_responses import no_content_response
from pydantic import BaseModel


class TokenResponse(BaseModel):
    token_type: str = 'refresher'
    access_token: str
    refresh_token: str


class BearerTransport(_BearerTransport):

    async def get_logout_response(self) -> Response:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    def get_openapi_logout_responses_success(self) -> OpenAPIResponseType:
        return no_content_response
