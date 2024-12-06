import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.src.shared.storage.db.models.representations import Representation
from worker.src.functions.cron_regions_functions.schemas import FederalDistrictBase
from ...utils import _create_if_dont_exist


async def get_federal_district_id(session: AsyncSession, federal_district_name: str):
    """
    Получаем ID федерального округа по его названию.
    """
    result = await session.execute(select(Representation).filter_by(district_name=federal_district_name))
    federal_district = result.scalars().first()

    if not federal_district:
        # Если федеральный округ не найден, создаем его

        federal_district = Representation(district_name=federal_district)
        session.add(federal_district)
        await session.commit()

    return federal_district.id
