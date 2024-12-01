from fastapi_users.authentication.transport.bearer import BearerTransport as _BearerTransport
from fastapi_users.openapi import OpenAPIResponseType
from fastapi import Response, status

from shared.crud.openapi_responses import no_content_response


class BearerTransport(_BearerTransport):

    async def get_logout_response(self) -> Response:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    def get_openapi_logout_responses_success(self) -> OpenAPIResponseType:
        return no_content_response
