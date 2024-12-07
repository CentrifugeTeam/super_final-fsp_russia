from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import Date
from .base import Base, IDMixin


class Suggestion(IDMixin, Base):
    __tablename__ = 'suggestions'
    competition: Mapped[str] = mapped_column(nullable=False)
    location: Mapped[str] = mapped_column(nullable=False)
    start_date: Mapped[str] = mapped_column(nullable=False)
    end_date: Mapped[str] = mapped_column(nullable=False)
