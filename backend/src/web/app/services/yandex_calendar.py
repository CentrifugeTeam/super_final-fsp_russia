import uuid
from datetime import datetime, timedelta

import aiofiles
from icalendar import Calendar, Event, Alarm

from ..conf import BASE_PATH
from ..exceptions import FileDoesntSave
from logging import getLogger

logger = getLogger(__name__)


class YandexCalendar:
    """
    Yandex Calendar
    """

    def create_calendar(self):
        calendar = Calendar()
        calendar.add('prodid', '-//Yandex.ru//NONSGML CalDAV Server//RU')
        calendar.add('version', '2.0')
        return calendar

    def add_event_to_calendar(self, calendar: Calendar, title: str, start: datetime, end: datetime,
                              description: str, location: str):
        event = Event()
        uid = uuid.uuid1()
        event.add('summary', title)
        event.add('dtstamp', start)
        event.add('dtstart', start)
        event.add('dtend', end)
        event.add('uid', uid)
        event.add('description', description)
        event.add('location', location)
        # event.add('status', 'CONFIRMED')
        alarm = Alarm()
        alarm.add('action', 'DISPLAY')
        alarm.add('trigger', timedelta(minutes=-5))
        alarm.add('summary', 'Reminder')
        event.add_component(alarm)
        calendar.add_component(event)

    async def save_calendar_to_staticfiles(self, calendar: Calendar, filename: str):
        url = 'calendars/' + filename
        filename = BASE_PATH / 'static' / url
        try:
            async with aiofiles.open(filename, 'wb') as f:
                await f.write(calendar.to_ical())
        except Exception as e:
            logger.exception('Icalendar failed to save to staticfiles', exc_info=e)
            raise FileDoesntSave from e

        return f'/staticfiles/{url}'
