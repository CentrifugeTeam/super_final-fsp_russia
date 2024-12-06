from bs4 import BeautifulSoup
from .schemas import BlockRegionalRepresentation


async def parse_moscow(soup: BeautifulSoup):
    """
    Функция для парсинга данных о Москве.
    Возвращает данные о Москве в формате словаря.
    """
    moscov_name = soup.find('div', class_="cont sub")
    moscov_name = moscov_name.find('p', class_='white_region') if moscov_name else None

    moscov_lider = soup.find('div', class_="cont ruk")
    moscov_lider = moscov_lider.find('p', class_='white_region') if moscov_lider else None

    moscov_contact = soup.find('div', class_="cont con")
    moscov_contact = moscov_contact.find('p', class_='white_region') if moscov_contact else None

    if moscov_name and moscov_lider and moscov_contact:
        return BlockRegionalRepresentation(**{
            'federal_district': None,
            'region_name': moscov_name.text.strip(),
            'leader': moscov_lider.text.strip(),
            'contacts': moscov_contact.text.strip()
        })
    return None
