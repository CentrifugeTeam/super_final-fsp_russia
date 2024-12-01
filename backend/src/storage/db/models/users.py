from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship, mapped_column, Mapped


class User(IDMixin, Base):
    """
    User model
    """
    __tablename__ = 'users'
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)

    oauth_accounts: Mapped[list['OAuthAccount']] = relationship(back_populates='user')
