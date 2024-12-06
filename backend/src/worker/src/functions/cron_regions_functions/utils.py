import random
import string

from sqlalchemy.ext.asyncio import AsyncSession
from ...utils import _create_if_dont_exist
from shared.storage.db.models import RegionalRepresentation, FederalRegionRepresentation, FederalRepresentation, \
    Representation
from worker.src.functions.cron_regions_functions.schemas import BlockRegionalRepresentation
from web.app.utils.ai.upload_file import IAFile


async def save_region(session: AsyncSession, block: BlockRegionalRepresentation):
    async def create_if_dont_exist(session, _dict, model):
        prompt = f'сгенерируй изображение без людей, где будет только по центру изображён герб области: {block.region_name}'
        iafile = IAFile()
        region_url = await iafile.prompt_for_file(prompt)

    representation = await _create_if_dont_exist(session, {
        **block.model_dump(by_alias=True, exclude={'leader', 'federal_district', 'photo_url'})},
                                                 Representation, create_if_dont_exist)

    if block.federal_district:

        if block.leader:
            pass
