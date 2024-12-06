import aiohttp
import asyncio
from bs4 import BeautifulSoup
from logging import getLogger

logger = getLogger(__name__)

async def fetch_calendar_data():
	url = "https://fsp-russia.com/calendar/archive/"
	async with aiohttp.ClientSession() as session:
		async with session.get(url) as response:
				if response.status == 200:
					page_content = await response.text()

					soup = BeautifulSoup(page_content, 'html.parser')

					data = []

					# Находим все элементы с классом 'archive_item'
					desktop = soup.find('div', class_='archive_events desktop')
					if desktop:
						archive_items = desktop.find_all('div', class_='archive_item')

						for archive_item in archive_items:
							title = None
							date_min = None
							city = None
							discipline = None
							mens = None

							name_div = archive_item.find('div', class_='name col_2')
							if name_div:
								title_div = name_div.find('div', class_='title')
								if title_div:
									title = title_div.get_text(strip=True)

							# Извлечение даты (date_min)
							location_div = archive_item.find('div', class_='location')
							if location_div:
								date_min_div = location_div.find('div', class_='date_min')
								if date_min_div:
									date_min = date_min_div.get_text(strip=True)

								city_div = location_div.find('div', class_='city')
								if city_div:
									city = city_div.get_text(strip=True)

							# Извлечение дисциплины (discipline)
							discipline_div = archive_item.find('div', class_='discipline col_3')
							if discipline_div:
								discipline = discipline_div.get_text(strip=True)

							# Извлечение категории (mens)
							mens_div = archive_item.find('div', class_='mens col_4')
							if mens_div:
								mens = mens_div.get_text(strip=True)

							# Сохранение данных в словарь
							if title or date_min or city or discipline or mens:
								data.append({
									'title': title if title else "Не указано",
									'date_min': date_min if date_min else "Не указано",
									'city': city if city else "Не указано",
									'discipline': discipline if discipline else "Не указано",
									'mens': mens if mens else "Не указано"
								})
					else:
						logger.error("Не удалось найти элементы с классом 'archive_events desktop'.")
						return []

					return data
				else:
					logger.error(f"Ошибка при запросе: {response.status}")
					return []
