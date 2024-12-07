from .base import BaseManager

from shared.storage.db.models import Suggestion, SportEvent

class SuggestionManager(BaseManager):



    async def create_event_from_suggestion(self, suggestion: Suggestion):
        event = SportEvent(
            start_date=suggestion.start_date,
            end_date=suggestion.end_date,
            participant_count=suggestion.count_participants,
            category='FSP',



        )