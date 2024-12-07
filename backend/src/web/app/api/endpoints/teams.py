from typing import Callable, Any

from fastapi import Depends

from ...utils.crud import MockCrudAPIRouter, CrudAPIRouter
from ...schemas.teams import TeamCreate, TeamRead, TeamUpdate, RegisterTeamToYandexCalendar
from shared.storage.db.models import Team
from ...services.yandex_calendar import YandexCalendar
from ...utils.users import authenticator
from ...managers.team import TeamManager


class TeamsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(TeamRead, TeamManager(), TeamCreate, TeamUpdate, resource_identifier='team')

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
