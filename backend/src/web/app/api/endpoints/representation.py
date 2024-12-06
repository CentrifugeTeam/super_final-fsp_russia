from typing import Callable, Any

from ...utils.crud import MockCrudAPIRouter
from ...schemas import RegionRepresentationBase, ReadRegionRepresentation, ReadFederalRepresentation
from polyfactory.factories.pydantic_factory import ModelFactory

F2 = ModelFactory().create_factory(ReadFederalRepresentation)


class Representation(MockCrudAPIRouter):

    def __init__(self):
        super().__init__(RegionRepresentationBase, RegionRepresentationBase, RegionRepresentationBase)

    def _get_all(self) -> Callable[..., Any]:
        @self.get(
            path='/regions',
            response_model=list[self.schema],

        )
        async def func():
            return self.factory.batch(10)

        @self.get(
            path='/federations/',
            response_model=list[F2.__model__],
        )
        async def func():
            return F2.batch(10)

        return func

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all()
        ]
