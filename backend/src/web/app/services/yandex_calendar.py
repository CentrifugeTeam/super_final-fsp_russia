import uuid
from datetime import datetime, timedelta

import aiofiles
from icalendar import Calendar, Event, Alarm

from ..conf import BASE_PATH
from ..exceptions import FileDoesntSave
from logging import getLogger

from ..utils.staticfiles import create_staticfiles_url

logger = getLogger(__name__)


class YandexCalendar:
    """
    Класс для работы с календарем Яндекса.
    """

    def create_calendar(self):
        """
        Создает новый календарь.

        :return: Объект календаря.
        """
        calendar = Calendar()
        calendar.add('prodid', '-//Yandex.ru//NONSGML CalDAV Server//RU')
        calendar.add('version', '2.0')
        return calendar

    def add_event_to_calendar(self, calendar: Calendar, title: str, start: datetime, end: datetime,
                              description: str, location: str):
        """
        Добавляет событие в календарь.

        :param calendar: Объект календаря.
        :param title: Название события.
        :param start: Начало события.
        :param end: Конец события.
        :param description: Описание события.
        :param location: Место проведения события.
        """
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
        """
        Сохраняет календарь в файл.

        :param calendar: Объект календаря.
        :param filename: Имя файла.
        :return: URL файла.
        """
        url = 'calendars/' + filename
        filename = BASE_PATH / 'static' / url
        try:
            async with aiofiles.open(filename, 'wb') as f:
                await f.write(calendar.to_ical())
        except Exception as e:
            logger.exception('Icalendar failed to save to staticfiles', exc_info=e)
            raise FileDoesntSave from e

        return create_staticfiles_url(url)
