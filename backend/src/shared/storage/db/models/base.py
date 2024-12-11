from datetime import datetime, date
from uuid import UUID, uuid4

from sqlalchemy import DateTime, func, Integer, Date
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
)


class Base(AsyncAttrs, DeclarativeBase):


    def _asdict(self):
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }


class UUIDMixin:
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )


class IDMixin:
    id: Mapped[int] = mapped_column(Integer, primary_key=True)


class CreatedAtMixin:
    created_at: Mapped[date] = mapped_column(
        Date, server_default=func.now()
    )
