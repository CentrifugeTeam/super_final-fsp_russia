from pydantic import BaseModel
from typing import Optional

class RegionalRepresentationBase(BaseModel):
	region_name: str
	leader_id: Optional[int] = None
	contacts: Optional[str] = None

	class Config:
		orm_mode = True

class RegionalUsersBase(BaseModel):
	representation_id: int
	user_id: int
	is_staff: bool

	class Config:
		orm_mode = True
