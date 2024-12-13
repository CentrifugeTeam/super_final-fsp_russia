from datetime import datetime
from typing import Callable, Any, Annotated

from fastapi_pagination.ext.sqlalchemy import paginate
from pydantic import ValidationError
from fastapi import Depends, HTTPException, UploadFile, Form, Response
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import NullableQuery
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from starlette import status

from crud.openapi_responses import bad_request_response, invalid_response
from service_calendar.app.api.endpoints.events import event_manager
from shared.crud import not_found_response, missing_token_or_inactive_user_response
from shared.storage.db.models import SportEvent, Team, TeamSolution, District, User, TeamParticipation, UserTeams, \
    ParticipationApplication, Area
from web.app.dependencies import get_session
from web.app.schemas.representation import ReadFederalRepresentation
from web.app.utils.crud import MockCrudAPIRouter, CrudAPIRouter
from web.app.schemas.teams import TeamCreate, TeamRead, TeamUpdate, FullTeamRead, ReadCommandAndRatings
from web.app.managers.team import TeamManager
from web.app.utils.users import authenticator
from ....managers.representation import area_manager


class TeamsRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(TeamRead, TeamManager(), TeamCreate, TeamUpdate, resource_identifier='id')

    def _create(self):

        @self.post('/register', responses={**not_found_response, **bad_request_response},
                   status_code=status.HTTP_204_NO_CONTENT)
        async def register_team(event_id: int,
                                user=Depends(authenticator.get_user()),
                                session=Depends(get_session)):
            event = await event_manager.get_or_404(session, id=event_id)
            teams = await user.awaitable_attrs.teams
            if not teams:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
            team = teams[0]
            participation = ParticipationApplication(team_id=team.id, event_id=event.id)
            session.add(participation)
            await session.commit()
            return Response(status_code=status.HTTP_204_NO_CONTENT)

        @self.post("/", response_model=TeamRead,
                   responses={**invalid_response, **not_found_response, **missing_token_or_inactive_user_response},
                   status_code=status.HTTP_201_CREATED)
        async def create_team(

                name: Annotated[str, Form()],
                event_id: Annotated[int, Form()],
                area_id: Annotated[int, Form()],
                about: Annotated[str | None, Form()] = None,
                photo: UploadFile | None = None,
                user=Depends(authenticator.get_user()),
                session=Depends(get_session)
        ) -> TeamRead:
            """
            Создание команды.
            """
            area = await area_manager.get_or_404(session, id=area_id)
            event = await event_manager.get_or_404(session, id=event_id)
            try:
                team = self.create_schema(name=name, about=about,
                                          area_id=area_id)
            except ValidationError as e:
                raise HTTPException(status_code=422, detail=e.errors())
            self.manager: TeamManager
            async with session.begin_nested():
                team = await self.manager.create_team(session, team, photo, created_at=datetime.now().date())
                participation = TeamParticipation(team_id=team.id, event_id=event.id)
                user_team = UserTeams(user_id=user.id, team_id=team.id)
                session.add(user_team)
                session.add(participation)
                user.area_id = area.id
                session.add(user)
            await session.commit()
            return team

    def _is_scored_transformer(self, solutions: list[TeamSolution], is_scored: bool):
        results = []
        for solution in solutions:
            if is_scored:
                if solution.score is not None:
                    results.append(solution)
            else:
                if solution.score is None:
                    results.append(solution)

        return results

    def _get_all(self):

        @self.get('/sports', responses={**not_found_response})
        async def teams(team_id: int | None = None,
                        sport_id: int | None = None,
                        is_scored: bool | None = None,
                        session=Depends(get_session)
                        ) -> Page[ReadCommandAndRatings]:

            def _transformer(items: list[Team]) -> list[ReadCommandAndRatings]:
                results = []
                for item in items:
                    result = ReadCommandAndRatings.model_validate(item, from_attributes=True)
                    solutions = self._is_scored_transformer(item.solutions, is_scored)
                    result.solutions = solutions
                    results.append(result)
                return results

            stmt = select(Team)
            if team_id:
                stmt = stmt.where(Team.id == team_id)
            if sport_id:
                stmt = (stmt
                        .join(TeamParticipation, TeamParticipation.team_id == Team.id)
                        .join(SportEvent, SportEvent.id == TeamParticipation.event_id)
                        .where(SportEvent.id == sport_id)
                        )

            stmt = stmt.options(joinedload(Team.district), joinedload(Team.solutions), joinedload(Team.events))
            if is_scored:
                stmt = (stmt
                        .join(TeamSolution, TeamSolution.team_id == Team.id)
                        .where(TeamSolution.score != None)
                        )
            elif is_scored is None:
                pass
            else:
                stmt = (stmt
                        .join(TeamSolution, TeamSolution.team_id == Team.id)
                        .where(TeamSolution.score == None)
                        )

            return await paginate(session, stmt, transformer=_transformer)

        @self.get("/")
        async def get_all_teams(
                federal_name: str | None = None,
                score: int | NullableQuery | None = None,
                is_scored: bool = True,
                session=Depends(get_session)
        ) -> Page[FullTeamRead]:
            """
            Получение всех команд.

            :param federal_name: Название федерации.
            :param score: Оценка команды.
            :param session: Сессия базы данных.
            :return: Страница с командами.
            """

            def _transformer(items: list[Team]) -> list[FullTeamRead]:
                result = []
                for item in items:
                    federal = ReadFederalRepresentation.model_validate(item.district[0], from_attributes=True)
                    solutions = self._is_scored_transformer(item.solutions, is_scored)
                    result.append(FullTeamRead.model_validate(
                        {'federal': federal, 'solutions': solutions, 'users': item.users, **item._asdict()},
                        from_attributes=True))
                return result

            stmt = select(Team)
            if federal_name:
                stmt = (stmt
                        .join(Area, Area.id == Team.area_id)
                        .join(District, Area.district_id == District.id)
                        .where(District.name == federal_name)
                        )
            stmt = stmt.join(TeamSolution, TeamSolution.team_id == Team.id)
            if is_scored:
                stmt = stmt.where(TeamSolution.score != None)
            else:
                stmt = stmt.where(TeamSolution.score == None)
            stmt = stmt.options(joinedload(Team.district), joinedload(Team.solutions), joinedload(Team.users))
            return await paginate(session, stmt, transformer=_transformer)

    def _get_team(self):
        @self.get("/{id}", response_model=FullTeamRead, responses={**not_found_response})
        async def get_team(
                id: int,
                session=Depends(get_session)
        ) -> FullTeamRead:
            """
            Получение команды по id.

            :param id: Id команды.
            :param session: Сессия базы данных.
            :return: Команда.
            """
            item = await self.manager.get_or_404(session,
                                                 options=[joinedload(Team.district), joinedload(Team.solutions),
                                                          joinedload(Team.users)], id=id)
            federal = ReadFederalRepresentation.model_validate(item.district[0], from_attributes=True)
            return FullTeamRead.model_validate(
                {'federal': federal, 'solutions': item.solutions, 'users': item.users, **item._asdict()},
                from_attributes=True)

    def _attach_to_team(self):
        @self.post('/{id}/attach', response_model=TeamRead, responses={**not_found_response,
                                                                       **bad_request_response})
        async def attach_to_team(
                session=Depends(get_session),
                user_in_db: User = Depends(authenticator.get_user()),
                team: Team = Depends(self.get_or_404(options=[joinedload(Team.district), joinedload(Team.users)]))
        ):
            """
            Присоединение пользователя к команде.

            :param session: Сессия базы данных.
            :param user_in_db: Пользователь, который присоединяется к команде.
            :param team: Команда, к которой присоединяется пользователь.
            :return: Присоединенная команда.
            """
            if len(team.users) > 5:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Team is full')

            team.users.append(user_in_db)
            session.add(team)
            await session.commit()
            # return TeamRead.model_validate(team._asdict(), from_attributes=True)
            return team

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all, self._get_team, self._create, self._attach_to_team
        ]
