from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from shared.storage.db.models.representations import District


async def get_or_create_federal(session: AsyncSession, federal_district_name: str):
    """
    Получаем ID федерального округа по его названию.
    """
    result = await session.execute(select(District).filter_by(name=federal_district_name))
    federal_district = result.scalars().first()

    if not federal_district:
        # Если федеральный округ не найден, создаем его
        repr = District(name=federal_district_name)
        session.add(repr)
        await session.commit()
        return repr

    return federal_district
