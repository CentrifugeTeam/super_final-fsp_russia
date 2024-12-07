from typing import Callable, Any

from ...utils.crud import MockCrudAPIRouter
from ...schemas import ReadRegionRepresentationBase, ReadFederalRepresentation
from ...schemas.representation import FederalRepresentation
from polyfactory.factories.pydantic_factory import ModelFactory

F2 = ModelFactory().create_factory(ReadFederalRepresentation)
F3 = ModelFactory().create_factory(FederalRepresentation)


class Representation(MockCrudAPIRouter):

    def __init__(self):
        super().__init__(ReadRegionRepresentationBase, ReadRegionRepresentationBase, ReadRegionRepresentationBase)

    def _get_all(self) -> Callable[..., Any]:
        @self.get('/', response_model=list[F3.__model__])
        async def func():
            return F3.batch(10)


    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all
        ]
