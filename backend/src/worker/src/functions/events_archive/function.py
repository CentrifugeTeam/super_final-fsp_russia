from ...parser.parser_events_archive import fetch_calendar_data, EventArchive, logger
from web.app.managers.suggestion import create_if_dont_exist
from shared.storage.db.models import EventType, SportEvent


async def cron_job(ctx):
    try:
        async_session_maker = ctx["async_session_maker"]
        events_archive: list[EventArchive] = await fetch_calendar_data()
        if not events_archive:
            return
        for archive in events_archive:
            create_if_dont_exist()
            archive.discipline
            pass
    except Exception as e:
        logger.exception('cron_job', exc_info=e)
