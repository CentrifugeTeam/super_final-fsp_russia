from typing import Callable, Any

from fastapi import Depends
from sqlalchemy.orm import joinedload

from shared.crud import not_found_response
from ...dependencies import get_session

from ...utils.crud import CrudAPIRouter
from ...schemas import ReadRegionRepresentationBase
from ...schemas.representation import FederalRepresentation
from ...managers.representation import RepresentationManager

reps_manager = RepresentationManager()

class RepresentationAPIRouter(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadRegionRepresentationBase, reps_manager , ReadRegionRepresentationBase, ReadRegionRepresentationBase)

    def _get_all(self) -> Callable[..., Any]:
        @self.get('/', response_model=list[FederalRepresentation])
        async def func(
                session = Depends(get_session)
        ):
            return await reps_manager.list(session)


    async def _get_one(self):
        @self.get(
            '/{%s}' % self.resource_identifier,
            response_model=self.schema,
            responses={**not_found_response}

        )
        async def func(id: int, session = Depends(get_session)):
            return await reps_manager.get_region_card(session, id)

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all
        ]
