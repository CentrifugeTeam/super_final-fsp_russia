from ...parser.parser_events_archive import EventArchive
from web.app.managers.suggestion import create_if_dont_exist
from shared.storage.db.models import EventType, SportEvent, Location


async def save(maker, rows: list[EventArchive]):
    async with maker() as session:
        for row in rows:
            location = await create_if_dont_exist(session, dict(country='Российская Федерация', region=None,
                                                                city=row.city), Location)
            event_type = await create_if_dont_exist(session, dict(sport='FSP'), EventType)
            months_count_dict = {
                1: 'январь',
                2: 'февраль',
                3: 'март',
                4: 'апрель',
                5: 'май',
                6: 'июнь',
                7: 'июль',
                8: 'август',
                9: 'сентябрь',
                10: 'октябрь',
                11: 'ноябрь',
                12: 'декабрь',
            }
            reverse_months_count_dict = {v: k for k, v in months_count_dict.items()}

            first_chunk, second_chunk = [text.strip() for text in row.date_min.split('-')]
            start_date = f''
            end_date = f'{second_chunk}'
            event = await create_if_dont_exist(session, dict(
                name=row.name,
                start_date=start_date,
                end_date=end_date,
                participants_count=10,
                category='Основной',
                format=None,
                location_id=location.id,
                type_event_id=event_type.id,
            ), SportEvent)
            age_group = await create_if_dont_exist(session, dict(age_from=None, age_to=None, name=suggestion.age,
                                                                 event_id=event.id),
            competition = await create_if_dont_exist(session, dict(type='discipline', name=suggestion.competition,
                                                                   event_id=event.id),

