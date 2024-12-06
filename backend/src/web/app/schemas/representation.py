from pydantic import BaseModel
from typing import Optional


class FederalDistrictBase(BaseModel):
	district_name: str

	class Config:
		orm_mode = True

class RegionalRepresentationBase(BaseModel):
	region_name: str
	leader_id: Optional[int] = None
	contacts: Optional[str] = None
	federal_district_id: int

	class Config:
		orm_mode = True

class RegionalUsersBase(BaseModel):
	representation_id: int
	user_id: int
	is_staff: bool

	class Config:
		orm_mode = True
