from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from fastapi_permissions import Allow, All


class Team(IDMixin, Base):
    __tablename__ = 'teams'
    name: Mapped[str] = mapped_column(String, unique=True)
    max_members: Mapped[int] = mapped_column(Integer)


class UserTeam(IDMixin, Base):
    __tablename__ = 'user_teams'
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey('teams.id'))
