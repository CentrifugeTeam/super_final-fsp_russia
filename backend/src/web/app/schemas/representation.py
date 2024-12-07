from pydantic import BaseModel
from typing import Optional, Literal

class RepresentationBase(BaseModel):
    name: str
    photo_url: str | None
    contacts: str | None
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
    leader: LeaderBase


class FederalRepresentation(BaseModel):
    regions: list[ReadRegionsCard]
    name: str
