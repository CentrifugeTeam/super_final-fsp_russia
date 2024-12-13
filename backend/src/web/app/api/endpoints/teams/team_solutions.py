from typing import Callable, Any

from fastapi import Depends
from starlette.exceptions import HTTPException

from service_calendar.app.api.endpoints.events import event_manager
from shared.crud import not_found_response
from shared.crud.openapi_responses import bad_request_response
from ....dependencies import get_session
from ....managers import BaseManager
from shared.storage.db.models.teams import TeamSolution
from ....utils.crud import CrudAPIRouter
from ....schemas.team_solution import ReadTeamSolution, CreateTeamSolution, UpdateTeamSolution
from ....utils.users import authenticator


class TeamSolutionsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadTeamSolution, BaseManager(TeamSolution), CreateTeamSolution, UpdateTeamSolution)

    def _create(self):
        @self.post('/{%s}/score' % self.resource_identifier, dependencies=[Depends(authenticator.get_user())])
        async def func(team_solution=Depends(self.get_or_404())):
            pass

        @self.post('/events/{id}/', responses={**not_found_response, **bad_request_response},
                   response_model=ReadTeamSolution)
        async def func(
                id: int,
                obj: CreateTeamSolution,
                session=Depends(get_session),
                user=Depends(authenticator.get_user())
        ):
            event = await event_manager.get_or_404(session, id=id)
            teams = await user.awaitable_attrs.teams
            if not teams:
                raise HTTPException(status_code=400, detail='User has no teams')

            return await self.manager.create(session, obj, team_id=teams[0].id, event_id=event.id)

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._create,
        ]
