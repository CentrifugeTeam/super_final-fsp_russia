from datetime import datetime

from sqlalchemy.exc import IntegrityError

from ...parser.parser_events_archive import EventArchive, logger
from web.app.managers.suggestion import create_if_dont_exist
from shared.storage.db.models import EventType, SportEvent, Location, AgeGroup, Competition


async def save(maker, rows: list[EventArchive]):
    """
    Функция для сохранения данных из списка объектов EventArchive в базу данных.

    :param maker: Функция для создания сессии базы данных.
    :param rows: Список объектов EventArchive, которые нужно сохранить.
    :return: None
    """
    async with maker() as session:
        for row in rows:
            try:
                location = await create_if_dont_exist(session, dict(country='Российская Федерация',
                                                                    city=row.city), Location)
                event_type = await create_if_dont_exist(session, dict(sport='Спортивное программирование'), EventType)
                months_count_dict = {
                    1: 'января',
                    2: 'февраля',
                    3: 'марта',
                    4: 'апреля',
                    5: 'мая',
                    6: 'июня',
                    7: 'июля',
                    8: 'августа',
                    9: 'сентября',
                    10: 'октября',
                    11: 'ноября',
                    12: 'декабря',
                }
                reverse_months_count_dict = {v: k for k, v in months_count_dict.items()}

                first_chunk, second_chunk = [text.strip() for text in row.date_min.split('-')]
                day, month, year, _ = second_chunk.split(' ')
                month = str(reverse_months_count_dict[month]).rjust(2, '0')
                start_date = datetime.strptime(f'{first_chunk}/{month}/{year}', "%d/%m/%Y")
                end_date = datetime.strptime(f'{day}/{month}/{year}', "%d/%m/%Y")
                event = await create_if_dont_exist(session, dict(
                    name=row.title,
                    start_date=start_date,
                    end_date=end_date,
                    participants_count=10,
                    category='Основной',
                    format=None,
                    location_id=location.id,
                    type_event_id=event_type.id,
                ), SportEvent)
                age_group = await create_if_dont_exist(session, dict(age_from=None, age_to=None, name=row.age_group,
                                                                     event_id=event.id), AgeGroup)
                competition = await create_if_dont_exist(session,
                                                         dict(type='discipline',
                                                              name=row.discipline,
                                                              event_id=event.id), Competition)
                await session.commit()
            except IntegrityError as e:
                await session.rollback()
                logger.exception("IntegrityError", exc_info=e)
