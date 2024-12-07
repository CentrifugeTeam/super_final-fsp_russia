from pydantic import BaseModel
from typing import Optional, Literal

from . import ReadUser


class RepresentationBase(BaseModel):
    name: str
    photo_url: str | None
    contacts: str | None
    type: Literal['region', 'federal']


class ReadRepresentation(RepresentationBase):
    id: int


class ReadRegionRepresentationBase(BaseModel):
    id: int
    representation: ReadRepresentation
    leader: ReadUser


class UserRegion(BaseModel):
    leader: str
    region_name: str
    contacts: str


class LeaderBase(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    username: str


class ReadRegionsCard(BaseModel):
    name: str
    leader: LeaderBase


class FederalRepresentation(BaseModel):
    regions: list[ReadRegionsCard]
    name: str
