from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import Date, String, Integer

from .base import Base, IDMixin


class Suggestion(IDMixin, Base):
    __tablename__ = 'suggestions'
    name: Mapped[str] = mapped_column(String(length=200), nullable=False)
    competition: Mapped[str] = mapped_column(String(length=200), nullable=False)
    location: Mapped[str] = mapped_column(String(length=200), nullable=False)
    start_date: Mapped[str] = mapped_column(Date, nullable=False)
    end_date: Mapped[str] = mapped_column(Date, nullable=False)
    age: Mapped[str] = mapped_column(String(length=100), nullable=False)
    format: Mapped[str] = mapped_column(String(length=20), nullable=False)
    count_participants: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(length=20), default='pending')


