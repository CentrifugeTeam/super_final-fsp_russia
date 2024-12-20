import datetime

from pydantic import BaseModel
from typing import Optional, Literal
from service_calendar.app.schemas.event import EventRead, OneItemReadEvent


class BaseArea(BaseModel):
    name: str
    photo_url: str | None
    contacts: str | None


class ReadArea(BaseArea):
    id: int


class RepresentationBase(BaseArea):
    type: Literal['region', 'federal']


class ReadRepresentation(RepresentationBase):
    id: int


class UserRegion(BaseModel):
    leader: str
    region_name: str
    contacts: str


class LeaderBase(BaseModel):
    first_name: str
    middle_name: str | None
    last_name: str
    username: str


class ReadRegionsCard(BaseModel):
    representation: ReadRepresentation
    leader: LeaderBase | None


class ReadAreaCard(ReadRegionsCard):
    team_count: int
    users_count: int


class FullFederalRepresentation(BaseModel):
    regions: list[ReadRegionsCard]
    name: str


class ReadFederalRepresentation(BaseModel):
    id: int
    name: str


class MonthStatistic(BaseModel):
    date: datetime.date
    count_participants: int


class DistrictStatistic(BaseModel):
    total_events: int
    completed_events: int
    current_events: int
    upcoming_events: int


class ReadStatisticsDistrict(BaseModel):
    region: ReadAreaCard
    months: list[MonthStatistic]
    statistics: DistrictStatistic
    events: list[EventRead]
