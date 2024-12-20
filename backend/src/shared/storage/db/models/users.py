from fastapi_permissions import Authenticated, Everyone

from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey, Boolean
from sqlalchemy.orm import relationship, mapped_column, Mapped


class User(IDMixin, Base):
    """
    User model
    """
    __tablename__ = 'users'
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String, nullable=True)  # if user registered with oauth2 provider
    first_name: Mapped[str] = mapped_column(String, nullable=True)
    middle_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    photo_url: Mapped[str] = mapped_column(String, nullable=True)
    about: Mapped[str] = mapped_column(String(length=100), nullable=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_leader: Mapped[bool] = mapped_column(Boolean, default=False)

    area_id: Mapped[int] = mapped_column(ForeignKey('areas.id'), nullable=True, default=None)

    area: Mapped['Area'] = relationship(back_populates='users', foreign_keys=[area_id])
    teams: Mapped[list['Team']] = relationship(back_populates='users', secondary='user_teams')
    oauth_accounts: Mapped[list['OAuthAccount']] = relationship(back_populates='user')
    files: Mapped[list['File']] = relationship(back_populates='user', secondary='user_files', cascade='all, delete')
    roles: Mapped[list['Role']] = relationship(secondary='user_roles', back_populates='users')
    type_events: Mapped[list['EventType']] = relationship(back_populates='users', secondary='user_settings')
    suggestions: Mapped[list['Suggestion']] = relationship(back_populates='user')

    async def get_principals(self):
        """Права пользователя"""
        principals = set()
        for role in await self.awaitable_attrs.roles:
            principals.add(role.name)
        if self.is_superuser:
            principals.add(f'user:superuser')
        if self.is_verified:
            principals.add(f'user:verified')

        return principals

    @property
    def fio(self):
        return f'{self.last_name} {self.first_name}' + f' {self.middle_name}' if self.middle_name else ''


class UserSettings(IDMixin, Base):
    __tablename__ = 'user_settings'
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    type_event_id: Mapped[int] = mapped_column(ForeignKey('event_types.id', ondelete='CASCADE'))
