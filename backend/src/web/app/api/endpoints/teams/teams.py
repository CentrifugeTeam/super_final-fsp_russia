from typing import Callable, Any
from sqlalchemy import select
from fastapi import Depends, HTTPException
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import NullableQuery
from sqlalchemy.orm import joinedload

from shared.crud import not_found_response
from shared.storage.db.models import SportEvent, Team, TeamSolution, District
from web.app.dependencies import get_session
from web.app.schemas.representation import ReadFederalRepresentation
from web.app.utils.crud import MockCrudAPIRouter, CrudAPIRouter
from web.app.schemas.teams import TeamCreate, TeamRead, TeamUpdate, FullTeamRead
from web.app.managers.team import TeamManager


class TeamsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(TeamRead, TeamManager(), TeamCreate, TeamUpdate, resource_identifier='id')

    def _get_all(self):
        @self.get("/")
        async def get_all_teams(
                federal_name: str | None = None,
                score: int | NullableQuery | None = None,
                session=Depends(get_session)
        ) -> Page[FullTeamRead]:
            def _transformer(items: list[Team]) -> list[FullTeamRead]:
                result = []
                for item in items:
                    federal = ReadFederalRepresentation.model_validate(item.district[0], from_attributes=True)
                    result.append(FullTeamRead.model_validate(
                        {'federal': federal, 'solutions': item.solutions, 'users': item.users, **item._asdict()},
                        from_attributes=True))
                return result

            result = await self.manager.paginated_list(session,
                                                       options=[joinedload(Team.district), joinedload(Team.solutions),
                                                                joinedload(Team.users)],
                                                       filter_expressions={District.name: federal_name},
                                                       nullable_filter_expressions={TeamSolution.score: score},
                                                       transformer=_transformer)

            return result

    def _get_team(self):
        @self.get("/{%s}" % self.resource_identifier, response_model=FullTeamRead, responses={**not_found_response})
        async def get_team(
                id: int,
                session=Depends(get_session)
        ) -> FullTeamRead:
            item = await self.manager.get_or_404(session,
                                                 options=[joinedload(Team.district), joinedload(Team.solutions),
                                                          joinedload(Team.users)], id=id)
            federal = ReadFederalRepresentation.model_validate(item.district[0], from_attributes=True)
            return FullTeamRead.model_validate(
                {'federal': federal, 'solutions': item.solutions, 'users': item.users, **item._asdict()},
                from_attributes=True)

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
            self._get_all, self._get_team, self._create
        ]
