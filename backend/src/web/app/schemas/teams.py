from pydantic import BaseModel
from fastapi_sqlalchemy_toolkit import make_partial_model
from .users import BaseUser


class Team(BaseModel):
    name: str
    users: list[BaseUser]


class TeamCreate(Team):
    pass


class TeamRead(Team):
    id: int


TeamUpdate = make_partial_model(Team)


class RegisterTeamToYandexCalendar(BaseModel):
    email: str
    calendar_name: str | None = None
    load_past_events: bool
    password: str


