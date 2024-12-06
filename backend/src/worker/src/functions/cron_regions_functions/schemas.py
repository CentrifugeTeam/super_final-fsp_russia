from pydantic import BaseModel, Field
from typing import Optional


class FederalDistrictBase(BaseModel):
    district_name: str

    class Config:
        orm_mode = True


class BlockRegionalRepresentation(BaseModel):
    region_name: str = Field(serialization_alias='name')
    leader: Optional[str] = None
    contacts: Optional[str] = None
    federal_district: str | None = None


class RegionalUsersBase(BaseModel):
    representation_id: int
    user_id: int
