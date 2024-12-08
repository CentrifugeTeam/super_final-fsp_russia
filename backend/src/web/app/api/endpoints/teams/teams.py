from typing import Callable, Any

from fastapi import Depends, HTTPException
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import NullableQuery
from starlette import status

from shared.crud import not_found_response, missing_token_or_inactive_user_response
from shared.crud.openapi_responses import bad_request_response
from shared.storage.db.models import Representation, SportEvent, User, RegionRepresentation, Team, TeamSolution
from web.app.dependencies import get_session
from web.app.utils.crud import MockCrudAPIRouter, CrudAPIRouter
from web.app.schemas.teams import TeamCreate, TeamRead, TeamUpdate, FullTeamRead
from web.app.managers.team import TeamManager
from ....managers import BaseManager
from ....managers.representation import RepresentationManager
from web.app.utils.users import authenticator


class TeamsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(TeamRead, TeamManager(), TeamCreate, TeamUpdate, resource_identifier='team')

    def _get_all(self):
        @self.get("/")
        async def get_all_teams(
                event_name: str | None = None,
                score: int | NullableQuery | None = None,
                session=Depends(get_session)
        ) -> Page[FullTeamRead]:
            return await self.manager.paginated_list(session, filter_expressions={SportEvent.name: event_name},
                                                     nullable_filter_expressions={TeamSolution.score: score})


    def _set_score(self):
        pass


    def _attach_to_team(self):
        @self.post('{%s}/attach' % self.resource_identifier, response_model=TeamRead)
        async def attach_to_team(
                user_id: int,
        ):
            # check limit in event
            pass

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all, self._get_one, self._create
        ]
