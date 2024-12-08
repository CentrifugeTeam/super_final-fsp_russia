from datetime import date

from pydantic import BaseModel
from fastapi_sqlalchemy_toolkit import make_partial_model

from .representation import ReadFederalRepresentation
from .users import BaseUser, ReadUser


class BaseTeam(BaseModel):
    name: str
    created_at: date
    about: str


class TeamCreate(BaseTeam):
    event_id: int
    federal_representation_id: int


class TeamRead(BaseTeam):
    id: int
    event_id: int
    federal_representation_id: int




class FullTeamRead(BaseTeam):
    users: list[ReadUser]
    event_id: int
    federal_representation: ReadFederalRepresentation


TeamUpdate = make_partial_model(BaseTeam)
