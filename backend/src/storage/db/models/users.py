from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship, mapped_column, Mapped


class User(IDMixin, Base):
    """
    User model
    """
    __tablename__ = 'users'
    username = mapped_column(String, unique=True)
    password = mapped_column(String, nullable=True)
    provider = Column(String, default=None, nullable=True)

    __table_args__ = (UniqueConstraint('username', 'provider', name='unique_username_per_provider'),)
