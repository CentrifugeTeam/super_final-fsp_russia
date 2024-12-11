from pydantic import BaseModel

from .users import ReadUser
from datetime import date
from .representation import ReadRepresentation, RepresentationBase
from service_calendar.app.schemas.event import EventRead


class ReadRegionRepresentationBase(BaseModel):
    id: int
    representation: ReadRepresentation
    leader: ReadUser

class MonthStatistics(BaseModel):
    date: date
    count_participants: int

class ReadCardRepresentation(BaseModel):
    RegionRepresentation: ReadRegionRepresentationBase
    federal_name: str
    team_count: int
    users_count: int
    events_count: int | None
    last_events: list[EventRead] | None
    top_months: list[MonthStatistics]
