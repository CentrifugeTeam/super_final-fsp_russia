from fastapi_sqlalchemy_toolkit import make_partial_model
from pydantic import BaseModel


class TeamSolutionBase(BaseModel):
    team_repository: str
    solution: str


class CreateTeamSolution(TeamSolutionBase):
    pass

class ReadTeamSolution(TeamSolutionBase):
    id: int
    score: int | None
    team_id: int


UpdateTeamSolution = make_partial_model(TeamSolutionBase)
