import aiohttp
from logging import getLogger

logger = getLogger(__name__)


async def fetch_regions_data():
    url = "https://fsp-russia.ru/region/regions/"
    async with aiohttp.ClientSession() as aio_session:
        async with aio_session.get(url, ssl=False) as response:
            if response.status == 200:
                page_content = await response.text()
                return page_content

            else:
                logger.error(f"Ошибка при получении данных с сайта: {response.status}")
                return None
