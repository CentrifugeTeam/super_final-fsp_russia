from typing import Callable, Any

from ....managers import BaseManager
from shared.storage.db.models.teams import TeamSolution
from ....utils.crud import CrudAPIRouter
from ....schemas.team_solution import ReadTeamSolution, CreateTeamSolution, UpdateTeamSolution


class TeamSolutionsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadTeamSolution, BaseManager(TeamSolution), CreateTeamSolution, UpdateTeamSolution)

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._update,
            self._create,
        ]
