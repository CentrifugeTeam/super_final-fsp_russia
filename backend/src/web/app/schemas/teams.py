from datetime import date

from pydantic import BaseModel
from fastapi_sqlalchemy_toolkit import make_partial_model

from web.app.schemas.team_solution import ReadTeamSolution
from .representation import ReadFederalRepresentation
from .users import BaseUser, ReadUser
from service_calendar.app.schemas.event import SmallReadEvent


class BaseTeam(BaseModel):
    name: str
    about: str | None = None


class TeamCreate(BaseTeam):
    area_id: int


class TeamRead(BaseTeam):
    id: int
    area_id: int
    created_at: date
    photo_url: str


class FullTeamRead(BaseTeam):
    id: int
    users: list[ReadUser]
    federal: ReadFederalRepresentation
    solutions: list['ReadTeamSolution']


TeamUpdate = make_partial_model(BaseTeam)


class ReadCommandAndRatings(BaseTeam):
    id: int
    events: list[SmallReadEvent]
    district: list[ReadFederalRepresentation]
    solutions: list[ReadTeamSolution]
