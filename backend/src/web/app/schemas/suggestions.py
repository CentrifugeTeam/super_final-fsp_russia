from datetime import date
from typing import Literal

from fastapi_permissions import Authenticated, Allow
from fastapi_sqlalchemy_toolkit import make_partial_model
from pydantic import BaseModel


class BaseSuggestion(BaseModel):
    competition: str
    location: str
    start_date: date
    end_date: date
    format: Literal['online', 'offline', 'both']
    count_participants: int
    age: str
    name: str
    task_url: str | None = None


class ReadSuggestion(BaseSuggestion):
    id: int
    status: Literal['accepted', 'rejected', 'pending']


UpdateSuggestion = make_partial_model(BaseSuggestion)
