from typing import Callable, Any

from fastapi import Depends

from ....managers import BaseManager
from shared.storage.db.models.teams import TeamSolution
from ....utils.crud import CrudAPIRouter
from ....schemas.team_solution import ReadTeamSolution, CreateTeamSolution, UpdateTeamSolution
from ....utils.users import authenticator


class TeamSolutionsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadTeamSolution, BaseManager(TeamSolution), CreateTeamSolution, UpdateTeamSolution)

    def _create(self):
        @self.post('/score', dependencies=[Depends(authenticator.get_user())])
        async def func(team= Depends(self.get_or_404())):
            pass

        @self.post('/')
        async def func(
                obj: CreateTeamSolution,
                team= Depends(self.get_or_404()),
                       ):
            pass

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._update,
            self._create,
        ]
