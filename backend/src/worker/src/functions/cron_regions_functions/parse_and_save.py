from .fetch import fetch_regions_data
from bs4 import BeautifulSoup
from sqlalchemy.ext.asyncio import AsyncSession

from . import (
    parse_federal_district, parse_region, parse_moscow)

from .utils import generate_random_password, save_region
from .schemas import BlockRegionalRepresentation


async def parse_and_save(ctx):
    page_content = await fetch_regions_data()
    soup = BeautifulSoup(page_content, 'html.parser')
    async_session_maker = ctx["async_session_maker"]
    async with async_session_maker() as session:
        # Получаем данные о Москве
        moscow_data = parse_moscow(soup)
        if moscow_data:
            await save_region(session, moscow_data)

        # Получаем список федеральных округов
        federal_districts = parse_federal_district(soup)

        # Парсим регионы по федеральным округам
        for federal_district_name in federal_districts:
            federal_district_block = soup.find('div', class_='accordion-item')
            region_blocks = federal_district_block.find_all('div', class_='cont')

            for block in region_blocks:
                region_data = parse_region(block, federal_district_name)
                if region_data:
                    await save_region(session, region_data)
