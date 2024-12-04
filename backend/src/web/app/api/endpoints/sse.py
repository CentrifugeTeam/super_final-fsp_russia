import asyncio

from fastapi import APIRouter, status, Request
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel

from shared.storage.cache.redis_client import RedisClient
from ...conf import connection_pool

r = APIRouter()

STREAM_DELAY = 1  # second
RETRY_TIMEOUT = 15000  # millisecond


class EventData(BaseModel):
    error: str | None = None
    msg: str


@r.get('/events', responses={
    status.HTTP_200_OK: {
        "descriptions": 'sse events',
        'content': {
            'text/event-stream': {
                "examples": {
                    'new_message': {
                        'summary': '',
                        'value': {
                            "event": "new_message",
                            "id": "message_id",
                            "retry": RETRY_TIMEOUT,
                            "data": EventData(msg='value').model_dump_json(),
                        }

                    },
                    'something': {
                        'summary': '',
                        'value': {
                            "event": "new_message",
                            "id": "message_id",
                            "retry": RETRY_TIMEOUT,
                            "data": EventData(msg='value').model_dump_json(),
                        }

                    }
                }
            }
        }

    }
})
async def events(request: Request):
    async def stream():
        async with RedisClient(connection_pool=connection_pool) as redis:
            while True:
                if await request.is_disconnected():
                    break

                yield {
                    "event": "new_message",
                    "retry": RETRY_TIMEOUT,
                    "data": EventData(msg='value').model_dump_json()
                }
                await asyncio.sleep(STREAM_DELAY)

    return EventSourceResponse(stream())
