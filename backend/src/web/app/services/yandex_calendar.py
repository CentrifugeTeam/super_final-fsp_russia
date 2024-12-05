import uuid
from datetime import datetime, timedelta

from caldav import DAVClient, Calendar
import icalendar


class YandexCalendar:
    """
    Yandex Calendar API
    """

    def __init__(self, email: str, password: str):
        self.client = DAVClient(url="https://caldav.yandex.ru/", username=email, password=password)

    def get_principal(self, username, leg_token):
        client = DAVClient(url="https://caldav.yandex.ru/", username=username, password=leg_token)
        principal = client.principal()
        # my_principal = get_principal(response['default_email'], 'gsxsyriilompmelx')
        # return principal

    def add_event(self, calendar: Calendar, title: str, start: datetime, end: datetime):

        caldata = icalendar.Calendar()
        caldata.add('prodid', '-//Yandex.ru//NONSGML CalDAV Server//RU')
        caldata.add('version', '2.0')
        event = icalendar.Event()
        uid = uuid.uuid1()
        event.add('summary', title)
        event.add('dtstamp', start)
        event.add('dtstart', start)
        event.add('dtend', end)
        event.add('uid', uid)
        event.add('description', 'Event created by Yandex.ru CalDAV Server')
        event.add('location', 'Yandex.ru')
        # event.add('status', 'CONFIRMED')
        caldata.add_component(event)

        alarm = icalendar.Alarm()
        alarm.add('action', 'DISPLAY')
        alarm.add('trigger', timedelta(minutes=-1))
        alarm.add('summary', 'Reminder')
        event.add_component(alarm)

        attendees = [self.client.principal().get_vcal_address()]
        calendar.save_with_invites(caldata, attendees)


