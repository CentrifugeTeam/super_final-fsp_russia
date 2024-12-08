from fastapi import HTTPException
from redis.asyncio import Redis
from starlette import status


class RedisClient(Redis):
    channel = 'accounts'

    async def listen(self, names: list[str]):
        ids = {name: '$' for name in names}
        while True:
            response = await self.xread(ids, count=1, block=0)
            key, messages = response[0]
            last_id, payload = messages[0]
            ids[key] = last_id
            yield key, payload

    async def forgot_password(self, token: str, user):
        await self.set(token, user.id)

    async def reset_password(self, token: str):
        user_id = await self.get(token)
        if not user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid token')
        user_id = int(user_id)
        await self.delete(token)
        return user_id
