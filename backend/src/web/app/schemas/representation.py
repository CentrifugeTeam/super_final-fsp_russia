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


class ReadFederalRepresentation(BaseModel):
    representation: ReadRepresentation


class UserRegion(BaseModel):
    leader: str
    region_name: str
    contacts: str


class LeaderBase(BaseModel):
    fio: str
    username: str


class FederalRepresentationBase(BaseModel):
    region_name: str
    leader: LeaderBase
    contacts: str


class ReadFederalRepresentationBase(FederalRepresentationBase):
    id: int


class FederalRepresentation(BaseModel):
    region: ReadFederalRepresentationBase
    name: str
