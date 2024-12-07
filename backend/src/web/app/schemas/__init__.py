from pydantic import BaseModel

from .users import ReadUser


from .representation import ReadRepresentation, RepresentationBase



class ReadRegionRepresentationBase(BaseModel):
    id: int
    representation: ReadRepresentation
    leader: ReadUser



class ReadCardRepresentation(BaseModel):
    RegionRepresentation: ReadRegionRepresentationBase
    team_count: int
    users_count: int