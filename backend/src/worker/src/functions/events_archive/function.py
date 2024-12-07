from ...parser.parser_events_archive import fetch_calendar_data

async def cron_job():
    await fetch_calendar_data()
