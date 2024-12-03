from typing import Callable, Any

from fastapi import Depends

from ...utils.crud import MockCrudAPIRouter
from ...schemas.teams import TeamCreate, TeamRead, TeamUpdate, RegisterTeamToYandexCalendar
from shared.storage.db.models import Team
from ...services.yandex_calendar import YandexCalendar
from ...utils.users import authenticator


class TeamsRouter(MockCrudAPIRouter):

    def _register_team_to_yandex_calendar(self):
        """

        """
        get_or_404 = self.get_or_404

        @self.post('/{id}/yandex/calendar',
                   deprecated=True,
                   description='Регистрация команды в Yandex Calendar для дальнейшей отправки событий в календарь команды',
                   dependencies=[Depends(authenticator.get_user_token())])
        async def register_team_to_yandex_calendar(credentials: RegisterTeamToYandexCalendar,
                                                   team: Team = Depends(get_or_404())):
            calendar = YandexCalendar(credentials.email, credentials.password)

            if credentials.calendar_name is None:
                calendar_name = team.name
            else:
                calendar_name = credentials.calendar_name

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [self._register_team_to_yandex_calendar]


r = TeamsRouter(TeamRead, TeamCreate, TeamUpdate)
