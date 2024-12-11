from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from web.app.exceptions import GenerationFileException
from web.app.utils.ai.upload_file import IAFile
from worker.src.functions.cron_regions_functions.schemas import BlockRegionalRepresentation
from sqlalchemy.exc import IntegrityError
from shared.storage.db.models import Representation, RegionRepresentation
from .get_federal_district_id import get_or_create_federal
from logging import getLogger
from ...utils import create_user, _create_if_dont_exist

logger = getLogger(__name__)


async def save_region_to_db(session: AsyncSession, region_data):
    """
    Сохраняет данные о регионе в базу данных.
    """
    try:
        # Валидируем данные для региона
        block = BlockRegionalRepresentation(
            region_name=region_data['region_name'],
            contacts=region_data['contacts'],
            leader=region_data['leader'],
            federal_district=region_data['federal_district'])
    except ValidationError as e:
        logger.error(f"Ошибка валидации данных для региона {region_data['region_name']}: {e}")
        return

    # Ищем или создаем пользователя для лидера
    leader_user = await create_user(session, block.leader, block.contacts)
    if leader_user is None:
        return

    # Создаем регион

    if block.federal_district:
        federal_district_id = (await get_or_create_federal(session, block.federal_district)).id
    else:
        federal_district_id = None

    async def _if_dont_exist_repr(session, _dict, model):
        # prompt = f'сгенерируй изображение без людей, где будет только по центру изображён герб области: {block.region_name}'
        # iafile = IAFile()
        # try:
        #     region_url = await iafile.prompt_for_file(prompt)
        # except (GenerationFileException, Exception):
        #     region_url = None
        region_url = None
        obj = model(**_dict,
                    photo_url=region_url,
                    )
        session.add(obj)
        await session.flush()
        return obj

    repr = await _create_if_dont_exist(session,
                                       {'name': block.region_name, 'contacts': block.contacts,
                                        'type': 'region'}, Representation, _if_dont_exist_repr)

    try:
        region = await _create_if_dont_exist(session, dict(representation_id=repr.id, leader_id=leader_user.id,
                                                           federal_district_id=federal_district_id),
                                             RegionRepresentation)
    except IntegrityError as e:
        logger.error(f"Ошибка сохранения региона {region_data['region_name']}: {e}")
        await session.rollback()
