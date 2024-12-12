from datetime import date

from pydantic import BaseModel
from fastapi_sqlalchemy_toolkit import make_partial_model

from web.app.schemas.team_solution import ReadTeamSolution
from . import ReadUser
from .representation import ReadFederalRepresentation, ReadRepresentation
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
    photo_url: str | None = None


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



class ReadUserMe(ReadUser):
    representation: ReadRepresentation | None
    teams: list[TeamRead] | None



class ReadUserAndTeam(ReadUser):
    teams: list[TeamRead] | None