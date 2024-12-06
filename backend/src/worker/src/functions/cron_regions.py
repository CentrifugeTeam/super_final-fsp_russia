import aiohttp
from bs4 import BeautifulSoup
from sqlalchemy.ext.asyncio import AsyncSession
from logging import getLogger
from cron_regions_functions import fetch_regions_data

logger = getLogger(__name__)


async def cron_regions():
    regions_data = await fetch_regions_data()
    if regions_data is None:
        return