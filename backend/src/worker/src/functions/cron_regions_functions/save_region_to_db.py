from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from ...record_regional_data.schemas import RegionalRepresentationBase, FederalDistrictBase
from sqlalchemy.exc import IntegrityError
from shared.storage.db.models import RegionalRepresentation, RegionalUsers
from .get_federal_district_id import get_federal_district_id
from logging import getLogger
from ...utils import get_or_create_user


logger = getLogger(__name__)


async def save_region_to_db(session: AsyncSession, region_data):
	"""
	Сохраняет данные о регионе в базу данных.
	"""
	try:
		# Валидируем данные для региона
		region_data_valid = RegionalRepresentationBase(
			region_name=region_data['region_name'],
			contacts=region_data['contacts']
		)
	except ValidationError as e:
		logger.error(f"Ошибка валидации данных для региона {region_data['region_name']}: {e}")
		return

	# Ищем или создаем пользователя для лидера
	leader_user = await get_or_create_user(session, region_data['leader'], region_data['contacts'])

	# Создаем регион
	federal_district_id = await get_federal_district_id(session, region_data['federal_district'])

	region = RegionalRepresentation(
		region_name=region_data_valid.region_name,
		leader_id=leader_user.id,
		contacts=region_data_valid.contacts,
		federal_district_id=federal_district_id
	)

	try:
		session.add(region)
		await session.commit()
	except IntegrityError:
		await session.rollback()
		logger.warning(f"Регион {region_data['region_name']} уже существует в базе данных.")
	else:
		# Сохраняем пользователя, связанного с регионом
		region_users = RegionalUsers(region_id=region.id, user_id=leader_user.id, is_staff=True)
		session.add(region_users)
		await session.commit()
