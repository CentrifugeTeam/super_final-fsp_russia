from datetime import date

from pydantic import BaseModel
from fastapi_sqlalchemy_toolkit import make_partial_model
from .users import BaseUser, ReadUser
from service_calendar.app.schemas.event import EventRead


class BaseTeam(BaseModel):
    name: str
    created_at: date
    about: str


class TeamCreate(BaseTeam):
    event_id: int


class TeamRead(BaseTeam):
    id: int
    event_id: int
    representation_id: int


class FullTeamRead(BaseTeam):
    users: list[ReadUser]
    event: EventRead


TeamUpdate = make_partial_model(BaseTeam)
