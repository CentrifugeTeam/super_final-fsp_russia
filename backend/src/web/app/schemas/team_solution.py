from fastapi_sqlalchemy_toolkit import make_partial_model
from pydantic import BaseModel


class TeamSolutionBase(BaseModel):
    team_repository: str
    solution: str
    score: int


class CreateTeamSolution(TeamSolutionBase):
    team_id: int


class ReadTeamSolution(TeamSolutionBase):
    id: int
    team_id: int


UpdateTeamSolution = make_partial_model(TeamSolutionBase)
