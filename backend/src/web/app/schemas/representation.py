import datetime

from pydantic import BaseModel
from typing import Optional, Literal


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


class FullFederalRepresentation(BaseModel):
    regions: list[ReadRegionsCard]
    name: str


class ReadFederalRepresentation(BaseModel):
    id: int
    name: str


class MonthStatistic(BaseModel):
    date: datetime.date
    count_participants: int

class ReadStatisticsDistrict(BaseModel):
    region: ReadRegionsCard
    months: list[MonthStatistic]



