import asyncio
from saq import CronJob, Queue
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from logging import getLogger, basicConfig, INFO, DEBUG

from .settings import settings as conf_settings

from .functions.cron_pdf import cron_update_calendar_table
from .functions.cron_regions_functions.parse_and_save import parse_and_save

logger = getLogger(__name__)


# all functions take in context dict and kwargs
async def test(ctx, *, a):
    await asyncio.sleep(0.5)
    # result should be json serializable
    # custom serializers and deserializers can be used through Queue(dump=,load=)
    return {"x": a}


async def startup(ctx):
    logger.info('ctx %s', ctx)
    logger.info('settings %s', conf_settings)
    engine = create_async_engine(conf_settings.SQLALCHEMY_DATABASE_URL, echo=False)
    async_session_maker = async_sessionmaker(engine, expire_on_commit=False)
    ctx["async_session_maker"] = async_session_maker



async def shutdown(ctx):
    pass
    # await ctx["db"].disconnect()


async def before_process(ctx):
    ctx["job"].timeout = None
    # logger.info("job %s and its timeout %d", ctx['job'], ctx["job"].timeout)


async def after_process(ctx):
    pass


queue = Queue.from_url(f'redis://{conf_settings.REDIS_HOST}')

settings = {
    "queue": queue,
    "functions": [test],
    "concurrency": 10,
    "cron_jobs": [CronJob(cron_update_calendar_table, cron="* * * * * */50"),
                  CronJob(parse_and_save, cron="* * * * * */30")],
    "startup": startup,
    "shutdown": shutdown,
    "before_process": before_process,
    "after_process": after_process,
}
