from .fetch import fetch_regions_data
from bs4 import BeautifulSoup
from . import parse_moscow

from .save_region_to_db import save_region_to_db
from logging import getLogger

logger = getLogger(__name__)


async def parse_and_save(ctx):
    """
    Функция для парсинга и сохранения данных о регионах.

    :param ctx: Контекст, содержащий асинхронный сеанс базы данных.
    """
    try:
        page_content = await fetch_regions_data()
        soup = BeautifulSoup(page_content, 'html.parser')
        async_session_maker = ctx["async_session_maker"]
        async with async_session_maker() as session:
            # Получаем данные о Москве
            moscow_data = parse_moscow(soup)
            if moscow_data:
                pass

            # Получаем список федеральных округов
            # Парсим регионы по федеральным округам

            federal_district_blocks = soup.find_all('div', class_='accordion-item')

            for federal_district_block in federal_district_blocks:
                accordion_headers = federal_district_block.find('div', class_='accordion-header')
                h4 = accordion_headers.find('h4') if accordion_headers else None
                if h4:
                    federal_district_name = h4.text.strip()
                region_blocks = federal_district_block.find_all('div', class_='cont')
                region_name = None
                leader = None
                contacts = None
                for block in region_blocks:
                    if block.find('p', class_='hide_region') and block.find('p',
                                                                            class_='hide_region').text == "Субъект РФ":
                        region_name_tag = block.find('a')
                        if region_name_tag:
                            region_name = region_name_tag.get_text(strip=True)

                    if block.find('p', class_='hide_region') and block.find('p',
                                                                            class_='hide_region').text == "Руководитель":
                        leader_tag = block.find('a')
                        if leader_tag:
                            leader = leader_tag.get_text(strip=True)

                    if block.find('p', class_='hide_region') and block.find('p',
                                                                            class_='hide_region').text == "Контакты":
                        contact_tag = block.find('p', class_='white_region')
                        if contact_tag:
                            contacts = contact_tag.get_text(strip=True)

                    if region_name and contacts:
                        await save_region_to_db(session, {
                            'federal_district': federal_district_name,
                            'region_name': region_name,
                            'leader': leader,
                            'contacts': contacts
                        })
                        region_name = None
                        leader = None
                        contacts = None
    except Exception as e:
        logger.exception(e)
