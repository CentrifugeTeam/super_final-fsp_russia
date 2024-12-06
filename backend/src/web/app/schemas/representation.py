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


class RegionRepresentationBase(BaseModel):
    representation: ReadRepresentation
    leader: ReadUser


class ReadRegionRepresentation(RegionRepresentationBase):
    id: int


class ReadFederalRepresentation(BaseModel):
    representation: ReadRepresentation
