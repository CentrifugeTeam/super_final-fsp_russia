from .settings import Settings
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from pathlib import Path
from redis.asyncio import ConnectionPool
from service_calendar.app.utils.email_sender import SMTPMessage

settings = Settings()
BASE_PATH = Path(__file__).absolute().parent
engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False, autoflush=False, autocommit=False)
connection_pool = ConnectionPool(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)
smtp_message = SMTPMessage(sender=settings.SMTP_SENDER, host=settings.SMTP_HOST,
                           port=settings.SMTP_PORT,
                           password=settings.SMTP_PASSWORD)