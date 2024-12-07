from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from shared.storage.db.models.representations import Representation


async def get_or_create_federal(session: AsyncSession, federal_district_name: str):
    """
    Получаем ID федерального округа по его названию.
    """
    result = await session.execute(select(Representation).filter_by(name=federal_district_name, type='federation'))
    federal_district = result.scalars().first()

    if not federal_district:
        # Если федеральный округ не найден, создаем его
        repr = Representation(name=federal_district_name, type='federation')
        session.add(repr)
        await session.flush()
        return repr

    return federal_district
