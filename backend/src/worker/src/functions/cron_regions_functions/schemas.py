from pydantic import BaseModel
from typing import Optional


class FederalDistrictBase(BaseModel):
    district_name: str

    class Config:
        orm_mode = True


class BlockRegionalRepresentation(BaseModel):
    region_name: str
    leader: Optional[str] = None
    contacts: Optional[str] = None
    federal_district: str | None = None


class RegionalUsersBase(BaseModel):
    representation_id: int
    user_id: int
    is_staff: bool

    class Config:
        orm_mode = True
