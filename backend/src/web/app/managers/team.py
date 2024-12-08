from .base import BaseManager
from shared.storage.db.models import Team

class TeamManager(BaseManager):

    def __init__(self):
        super().__init__(Team)


    async def get_federal_representation(self, representation_id: int):
        pass