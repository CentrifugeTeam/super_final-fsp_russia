from .base import Base, IDMixin, CreatedAtMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey, Date
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import date
from fastapi_permissions import Allow, All


class Team(IDMixin, CreatedAtMixin, Base):
    __tablename__ = 'teams'
    name: Mapped[str] = mapped_column(String, unique=True)
    photo_url: Mapped[str] = mapped_column(String, nullable=True)
    about: Mapped[str] = mapped_column(String(length=255), nullable=True)

    area_id: Mapped[int] = mapped_column(Integer, ForeignKey('areas.id'))
    solutions: Mapped[list['TeamSolution']] = relationship(back_populates='team')
    users: Mapped[list['User']] = relationship(back_populates='teams', secondary='user_teams')
    area: Mapped['Area'] = relationship(back_populates='teams')
    events: Mapped[list['SportEvent']] = relationship(back_populates='teams', secondary='team_participation')
    district: Mapped[list['District']] = relationship(back_populates='teams', secondary='areas')

    # participation: Mapped[list['TeamParticipation']] = relationship(back_populates='team')

class UserTeams(IDMixin, Base):
    __tablename__ = 'user_teams'
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey('teams.id'))


class TeamParticipation(IDMixin, Base):
    __tablename__ = 'team_participation'
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey('teams.id'))
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey('events.id'))

    # team: Mapped[Team] = relationship(back_populates='participation')
    # event: Mapped['SportEvent'] = relationship(back_populates='participation')


class TeamSolution(IDMixin, Base):
    __tablename__ = 'team_solutions'

    team_id: Mapped[int] = mapped_column(Integer, ForeignKey('teams.id'))
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey('events.id'))

    team_repository: Mapped[str] = mapped_column(String)
    solution: Mapped[str] = mapped_column(String)
    score: Mapped[int] = mapped_column(Integer, nullable=True)
    team: Mapped[Team] = relationship(back_populates='solutions')
