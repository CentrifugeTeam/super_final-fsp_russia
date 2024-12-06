import aiohttp
from bs4 import BeautifulSoup
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from logging import getLogger
from pydantic import ValidationError
from shared.storage.db.models import RegionalRepresentation, RegionalUsers
from ..utils import get_or_create_user
from ..record_regional_data.schemas import RegionalRepresentationBase

logger = getLogger(__name__)

async def fetch_and_store_regions_data(session: AsyncSession):
	url = "https://fsp-russia.com/region/regions/"
	async with aiohttp.ClientSession() as aio_session:
			async with aio_session.get(url, ssl=False) as response:
				if response.status == 200:
					page_content = await response.text()
					soup = BeautifulSoup(page_content, 'html.parser')

					regions_data = []
					region_blocks = soup.find_all('div', class_='cont')

					for block in region_blocks:
						region_name = None
						leader = None
						contacts = None

						# Извлекаем данные из блока
						if block.find('p', class_='hide_region') and block.find('p', class_='hide_region').text == "Субъект РФ":
							region_name_tag = block.find('a')
							if region_name_tag:
								region_name = region_name_tag.get_text(strip=True)

						if block.find('p', class_='hide_region') and block.find('p', class_='hide_region').text == "Руководитель":
							leader_tag = block.find('a')
							if leader_tag:
								leader = leader_tag.get_text(strip=True)

						if block.find('p', class_='hide_region') and block.find('p', class_='hide_region').text == "Контакты":
							contact_tag = block.find('p', class_='white_region')
							if contact_tag:
								contacts = contact_tag.get_text(strip=True)

						# Проверяем, собраны ли все данные для региона
						if region_name and contacts:
							# Валидируем данные для региона через Pydantic
							try:
								region_data = RegionalRepresentationBase(region_name=region_name, contacts=contacts)
							except ValidationError as e:
								logger.error(f"Ошибка валидации данных для региона {region_name}: {e}")
								continue  # Если валидация не прошла, пропускаем этот регион

							# Ищем или создаем пользователя для лидера
							leader_user = await get_or_create_user(session, leader, contacts)

							# Сохраняем регион
							region = RegionalRepresentation(region_name=region_data.region_name, leader_id=leader_user.id, contacts=region_data.contacts)

							try:
								session.add(region)
								await session.commit()
							except IntegrityError:
								await session.rollback()
								logger.warning(f"Регион {region_name} уже существует в базе данных.")
							else:
								# Сохраняем пользователя, связанного с регионом
								region_users = RegionalUsers(region_id=region.id, user_id=leader_user.id, is_staff=True)
								session.add(region_users)
								await session.commit()

							regions_data.append({
								'region_name': region_name,
								'leader': leader,
								'contacts': contacts
							})
					return regions_data
				else:
					logger.error(f"Ошибка при получении данных с сайта: {response.status}")
					return None
