from typing import Callable, Any, Literal

from fastapi import Depends, Body, HTTPException, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from crud.openapi_responses import missing_token_or_inactive_user_response, forbidden_response
from service_calendar.app.utils.email_sender import Message
from shared.crud.openapi_responses import bad_request_response
from worker.src.exceptions import ResourceExistsException
from ...conf import smtp_message
from ...utils.crud import PermissionCrudAPIRouter, CrudAPIRouter
from shared.storage.db.models import Suggestion
from fastapi_sqlalchemy_toolkit import ordering_depends
from ...schemas.suggestions import UpdateSuggestion, ReadSuggestion, BaseSuggestion
from ...managers.suggestion import SuggestionManager
from ...dependencies import get_session
from ...utils.users import authenticator

manager = SuggestionManager(Suggestion)

order_by = {'status': Suggestion.status}


class Router(CrudAPIRouter):

    def __init__(self):
        super().__init__(ReadSuggestion,
                         manager, BaseSuggestion, UpdateSuggestion)

    def _create(self):
        """
        Создает новую заявку в календаре.

        :param objs: Объекты для создания заявки.
        :param session: Асинхронная сессия SQLAlchemy.
        :param user: Пользователь, создавший заявку.
        :return: Созданная заявка.
        """
        create_schema = self.create_schema

        @self.post(
            '/',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response}
        )
        async def func(objs: create_schema, session: AsyncSession = Depends(self.get_session),
                       user=Depends(authenticator.get_user())):
            return await self.manager.create(session, objs, user_id=user.id)

    def _get_all(self):
        """
        Получает все заявки из календаря.

        :param order_by: Параметры сортировки заявок.
        :param session: Асинхронная сессия SQLAlchemy.
        :return: Список заявок.
        """
        @self.get('/', response_model=list[ReadSuggestion])
        async def func(order_by: ordering_depends(order_by),
                       session=Depends(get_session)):
            return await manager.list(session, order_by)

    def _update(self, *args: Any, **kwargs: Any):
        """
        Обновляет заявку в календаре.

        :param id: Идентификатор заявки.
        :param scheme: Объект для обновления заявки.
        :param session: Асинхронная сессия SQLAlchemy.
        :return: Обновленная заявка.
        """
        update_schema = self.update_schema

        @self.patch(
            '/{id}',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response
                       }
        )
        async def func(id: int, scheme: update_schema,
                       session: AsyncSession = Depends(self.get_session)):
            model = await self.manager.get_or_404(session, id=id)
            return await self.manager.update(session, model, scheme)

        @self.patch(
            '/{id}/status',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response,
                       **bad_request_response,
                       }
        )
        async def func(id: int, status: Literal['accepted', 'rejected'] = Body(embed=True),
                       text: str = Body(embed=True),
                       session: AsyncSession = Depends(self.get_session)):
            model: Suggestion = await self.manager.get_or_404(session, id=id, options=[joinedload(Suggestion.user)])
            if status == model.status:
                raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST,
                                    detail=f'Статус {status} уже установлен')
            if status == 'accepted':
                try:
                    await manager.create_event_from_suggestion(session, model)
                    model.status = status
                    session.add(model)
                    await session.commit()
                except ResourceExistsException:
                    raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST,
                                           detail='Такая заявка уже существует')


            await smtp_message.asend_email(model.user.email,
                                           Message(url_for_button=f'https://centrifugo.tech/suggestions/{id}',
                                                   title='На вашу заявку отреагировали! Смотрите подробнее:',
                                                   text_on_button='Заявка', text=text)
                                           )

            return model

    def _register_routes(self) -> list[Callable[..., Any]]:
        """
        Регистрирует все маршруты для работы с заявками.

        :return: Список маршрутов.
        """
        return [
            self._get_all,
            self._get_one,
            self._create,
            self._update,
        ]

