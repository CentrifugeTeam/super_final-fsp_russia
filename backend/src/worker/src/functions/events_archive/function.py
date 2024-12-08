from ...parser.parser_events_archive import fetch_calendar_data, EventArchive, logger

from .save_parsed import save


async def cron_job(ctx):
    try:
        async_session_maker = ctx["async_session_maker"]
        events_archive: list[EventArchive] = await fetch_calendar_data()
        if not events_archive:
            return
        await save(async_session_maker, events_archive)

    except Exception as e:
        logger.exception('cron_job', exc_info=e)
