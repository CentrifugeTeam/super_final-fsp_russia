import asyncio
from saq import CronJob, Queue
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from logging import getLogger, basicConfig, INFO, DEBUG

from .settings import settings as conf_settings

from .functions.cron_pdf import cron_update_calendar_table
from .functions.cron_regions_functions.parse_and_save import parse_and_save
from .functions.events_archive.function import cron_job

logger = getLogger(__name__)


# all functions take in context dict and kwargs
async def test(ctx, *, a):
    """
    Функция для тестирования.
    :param ctx: Словарь с контекстом.
    :param a: Параметр функции.
    :return: Результат выполнения функции.
    """
    await asyncio.sleep(0.5)
    # result should be json serializable
    # custom serializers and deserializers can be used through Queue(dump=,load=)
    return {"x": a}


async def startup(ctx):
    """
    Функция для запуска при старте.
    :param ctx: Словарь с контекстом.
    :return: None
    """
    engine = create_async_engine(conf_settings.SQLALCHEMY_DATABASE_URL, echo=False)
    async_session_maker = async_sessionmaker(engine, expire_on_commit=False)
    ctx["async_session_maker"] = async_session_maker


async def shutdown(ctx):
    """
    Функция для завершения работы.
    :param ctx: Словарь с контекстом.
    :return: None
    """
    pass


async def before_process(ctx):
    """
    Функция, выполняемая перед обработкой.
    :param ctx: Словарь с контекстом.
    :return: None
    """
    ctx["job"].timeout = None


async def after_process(ctx):
    """
    Функция, выполняемая после обработки.
    :param ctx: Словарь с контекстом.
    :return: None
    """
    pass


queue = Queue.from_url(f'redis://{conf_settings.REDIS_HOST}')

settings = {
    "queue": queue,
    "functions": [test],
    "concurrency": 10,
    "cron_jobs": [CronJob(cron_update_calendar_table, cron="*/5 * * * *", retries=0),
                  CronJob(parse_and_save, cron="*/1 * * * *", retries=0),
                  CronJob(cron_job, cron="*/3 * * * *", retries=0)],
    "startup": startup,
    "shutdown": shutdown,
    "before_process": before_process,
    "after_process": after_process,
}
