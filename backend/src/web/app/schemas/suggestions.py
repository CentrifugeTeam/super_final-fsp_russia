from datetime import date
from typing import Literal

from fastapi_sqlalchemy_toolkit import make_partial_model
from pydantic import BaseModel


class BaseSuggestion(BaseModel):
    competition: str
    location: str
    start_date: date
    end_date: date
    format: Literal['online', 'offline', 'both']
    count_participants: int


class ReadSuggestion(BaseSuggestion):
    id: int


UpdateSuggestion = make_partial_model(BaseSuggestion)
