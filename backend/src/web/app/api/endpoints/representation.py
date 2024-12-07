from typing import Callable, Any

from fastapi import Depends
from fastapi_pagination import Page
from sqlalchemy.orm import joinedload

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
        @self.get('/')
        async def func(
                session = Depends(get_session)
        ) -> Page[FederalRepresentation]:
            return await reps_manager.paginated_list(session)


    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all
        ]
