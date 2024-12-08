from shared.storage.db.models import Representation
from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey, Date
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import date
from fastapi_permissions import Allow, All


class Team(IDMixin, Base):
    __tablename__ = 'teams'
    name: Mapped[str] = mapped_column(String, unique=True)
    federal_representation_id: Mapped[int] = mapped_column(Integer, ForeignKey('representations.id'))
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey('events.id'))
    users: Mapped[list['User']] = relationship(back_populates='team')
    created_at: Mapped[date] = mapped_column(Date)
    about: Mapped[str] = mapped_column(String(length=255))
    solutions: Mapped[list['TeamSolution']] = relationship(back_populates='team')
    federal: Mapped['Representation'] = relationship(back_populates='teams')



class TeamSolution(IDMixin, Base):
    __tablename__ = 'team_solutions'

    team_id: Mapped[int] = mapped_column(Integer, ForeignKey('teams.id'))
    team_repository: Mapped[str] = mapped_column(String)
    solution: Mapped[str] = mapped_column(String)
    score: Mapped[int] = mapped_column(Integer, nullable=True)
    team: Mapped[Team] = relationship(back_populates='solutions')