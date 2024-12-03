from pydantic import BaseModel


class UserLoginSession(BaseModel):
    session: str