from pydantic import BaseModel
from fastapi_sqlalchemy_toolkit import make_partial_model
from .users import BaseUser, ReadUser


class BaseTeam(BaseModel):
    name: str
    users: list[ReadUser]


class TeamCreate(BaseTeam):
    pass


class TeamRead(BaseTeam):
    id: int


TeamUpdate = make_partial_model(BaseTeam)


class RegisterTeamToYandexCalendar(BaseModel):
    email: str
    calendar_name: str | None = None
    load_past_events: bool
    password: str


