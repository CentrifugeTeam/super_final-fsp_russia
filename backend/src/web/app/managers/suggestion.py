from sqlalchemy.ext.asyncio import AsyncSession

from .base import BaseManager

from shared.storage.db.models import Suggestion, SportEvent, EventType, Competition, AgeGroup, Location
from worker.src.utils import _create_if_dont_exist
from worker.src.exceptions import ResourceExistsException
from sqlalchemy.exc import IntegrityError


async def create_if_dont_exist(session: AsyncSession, _dict: dict, model, refresh_attrib: list[str] | None = None):
    async def wrapper(session: AsyncSession, _dict: dict, model, refresh_attrib: list[str] | None = None):
        model = model(**_dict)
        session.add(model)
        await session.flush()
        await session.refresh(model, refresh_attrib)
        return model

    return await _create_if_dont_exist(session, _dict, model, wrapper)


class SuggestionManager(BaseManager):
    async def create_event_from_suggestion(self, session: AsyncSession, suggestion: Suggestion):
        try:

            location = await create_if_dont_exist(session, dict(country='Российская Федерация', region=None,
                                                                city=suggestion.location), Location)
            event_type = await create_if_dont_exist(session, dict(sport='FSP'), EventType)

            event = await create_if_dont_exist(session, dict(
                name=suggestion.name,
                start_date=suggestion.start_date,
                end_date=suggestion.end_date,
                participants_count=suggestion.count_participants,
                category='Основной',
                format=suggestion.format,
                location_id=location.id,
                type_event_id=event_type.id,
            ), SportEvent)
            competition = await create_if_dont_exist(session, dict(type='discipline', name=suggestion.competition,
                                                                   event_id=event.id),
                                                     Competition)
            age_group = await create_if_dont_exist(session, dict(age_from=None, age_to=None, name=suggestion.age,
                                                                 event_id=event.id),
                                                   AgeGroup)

        except IntegrityError:
            raise ResourceExistsException
