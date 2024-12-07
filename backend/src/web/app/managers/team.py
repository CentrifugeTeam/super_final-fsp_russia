from .base import BaseManager
from shared.storage.db.models import Team

class TeamManager(BaseManager):

    def __init__(self):
        super().__init__(Team)
