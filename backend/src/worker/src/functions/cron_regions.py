import aiohttp
from bs4 import BeautifulSoup
from sqlalchemy.ext.asyncio import AsyncSession
from logging import getLogger
from backend.src.worker.src.functions.cron_regions_functions import parse_federal_district, parse_region, save_region_to_db, parse_moscow

logger = getLogger(__name__)


async def fetch_and_store_regions_data(session: AsyncSession):
	url = "https://fsp-russia.com/region/regions/"
	async with aiohttp.ClientSession() as aio_session:
		async with aio_session.get(url, ssl=False) as response:
			if response.status == 200:
				page_content = await response.text()
				soup = BeautifulSoup(page_content, 'html.parser')

				regions_data = []

				# Получаем данные о Москве
				moscow_data = await parse_moscow(soup)
				if moscow_data:
					regions_data.append(moscow_data)

				# Получаем список федеральных округов
				federal_districts = await parse_federal_district(soup)

				# Парсим регионы по федеральным округам
				for federal_district_name in federal_districts:
					federal_district_block = soup.find('div', class_='accordion-item')
					region_blocks = federal_district_block.find_all('div', class_='cont')

					for block in region_blocks:
						region_data = await parse_region(block, federal_district_name)
						if region_data:
							await save_region_to_db(session, region_data)
							regions_data.append(region_data)

				return regions_data
			else:
				logger.error(f"Ошибка при получении данных с сайта: {response.status}")
				return None
