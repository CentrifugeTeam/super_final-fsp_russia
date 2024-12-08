from typing import Callable, Any

from fastapi import Depends, HTTPException

from shared.storage.db.models import Representation, SportEvent, User
from ...dependencies import get_session
from ...utils.crud import MockCrudAPIRouter, CrudAPIRouter
from ...schemas.teams import TeamCreate, TeamRead, TeamUpdate
from ...managers.team import TeamManager
from ...utils.users import authenticator


class TeamsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(TeamRead, TeamManager(), TeamCreate, TeamUpdate, resource_identifier='team')

    def _get_all(self):
        @self.get("/", response_model=list[TeamRead])
        async def get_all_teams(
                event_name: str | None = None,
                session=Depends(get_session)
        ):
            return await self.manager.list(session, filter_expressions={SportEvent.name: event_name})

    def _create(self):
        @self.post("/", response_model=TeamRead)
        async def create_team(
                team: TeamCreate,
                user: User = Depends(authenticator.get_user()),
                session=Depends(get_session)
        ):
            if not user.representation_id:
                raise HTTPException
            # check that region type is not federation
            return await self.manager.create(session, team)

    def _attach_to_team(self):
        @self.post('{%s}/attach' % self.resource_identifier, response_model=TeamRead)
        async def attach_to_team(
                user_id: int,

        ):
            pass

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all, self._get_one, self._create
        ]
