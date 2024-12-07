from typing import Callable, Any, Literal

from fastapi import Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession

from crud.openapi_responses import missing_token_or_inactive_user_response, forbidden_response
from ...utils.crud import PermissionCrudAPIRouter, CrudAPIRouter
from shared.storage.db.models import Suggestion
from fastapi_sqlalchemy_toolkit import ordering_depends
from ...schemas.suggestions import UpdateSuggestion, ReadSuggestion, BaseSuggestion
from ...managers import BaseManager
from ...dependencies import get_session
from ...utils.permissions import Permission

manager = BaseManager(Suggestion)

order_by = {'status': Suggestion.status}


class Router(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadSuggestion,
                         manager, BaseSuggestion, UpdateSuggestion)

    def _get_all(self):
        @self.get('/', response_model=list[ReadSuggestion])
        async def func(order_by: ordering_depends(order_by),
                       session=Depends(get_session)):
            return await manager.list(session, order_by)

    def _update(self, *args: Any, **kwargs: Any):
        update_schema = self.update_schema

        async def func(id: int, scheme: update_schema,
                       session: AsyncSession = Depends(self.get_session)):
            model = await self.manager.get_or_404(session, id=id)
            return await self.manager.update(session, model, scheme)

        @self.patch(
            '/{id}',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response
                       }
        )
        async def route(resource=Permission('edit', func)):
            return resource

        async def func(id: int, status: Literal['accepted', 'rejected'] = Body(embed=True),
                       session: AsyncSession = Depends(self.get_session)):
            model = await self.manager.get_or_404(session, id=id)
            model.status = status
            session.add(model)
            await session.commit()
            return model

        @self.patch(
            '/{id}/status',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response
                       }
        )
        async def route(resource=Permission('set_status', func)):
            # уведомление на почту
            return resource

    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all,
            self._get_one,
            self._create,
            self._update,
        ]