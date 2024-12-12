from typing import Callable, Any

from fastapi import Depends
from sqlalchemy.orm import joinedload

from shared.crud import not_found_response
from ...dependencies import get_session

from ...utils.crud import CrudAPIRouter
from ...schemas import ReadRegionRepresentationBase
from ...schemas.representation import FullFederalRepresentation, ReadFederalRepresentation, ReadRegionsCard, \
    ReadRepresentation, ReadArea
from ...schemas import ReadCardRepresentation
from ...managers.representation import RepresentationManager, area_manager

reps_manager = RepresentationManager()


class RepresentationAPIRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadRegionRepresentationBase, reps_manager, ReadRegionRepresentationBase,
                         ReadRegionRepresentationBase)

    def _get_all(self) -> Callable[..., Any]:
        """
        Получает все представления.

        :param session: Асинхронная сессия SQLAlchemy.
        :return: Список представлений.
        """

        @self.get('/statistics')
        async def func(
                region_id: int | None = None,
        ):
            pass

        @self.get('/', response_model=list[FullFederalRepresentation])
        async def func(
                session=Depends(get_session),

        ):
            return await reps_manager.list(session)

        @self.get('/federations', response_model=list[ReadFederalRepresentation])
        async def func(
                session=Depends(get_session),
        ):
            return await reps_manager.federations(session)

        @self.get('/areas', response_model=list[ReadArea])
        async def func(
                session=Depends(get_session),
        ):
            return await area_manager.list(session)

    def _get_one(self):
        """
        Получает представление по его идентификатору.

        :param id: Идентификатор представления.
        :param session: Асинхронная сессия SQLAlchemy.
        :return: Представление.
        """

        @self.get(
            '/{%s}' % self.resource_identifier,
            response_model=ReadCardRepresentation,
            responses={**not_found_response}

        )
        async def func(id: int, session=Depends(get_session)):
            return await reps_manager.get_region_card(session, id)

    def _register_routes(self) -> list[Callable[..., Any]]:
        """
        Регистрирует все маршруты для работы с представлениями.

        :return: Список маршрутов.
        """
        return [
            self._get_all, self._get_one,
        ]
