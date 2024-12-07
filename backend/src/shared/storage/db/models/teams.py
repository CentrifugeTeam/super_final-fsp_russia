from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from fastapi_permissions import Allow, All


class Team(IDMixin, Base):
    __tablename__ = 'teams'
    name: Mapped[str] = mapped_column(String, unique=True)
    region_representation_id: Mapped[int] = mapped_column(Integer, ForeignKey('region_representations.id'))
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey('events.id'))
    users: Mapped[list['User']] = relationship(back_populates='team')
    created_at: Mapped[str] = mapped_column(String)
    about: Mapped[str] = mapped_column(String)


class TeamSolution(IDMixin, Base):
    __tablename__ = 'team_solutions'
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey('teams.id'))
    score: Mapped[int] = mapped_column(Integer)
