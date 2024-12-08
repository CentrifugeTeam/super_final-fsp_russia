from fastapi_permissions import Authenticated, Everyone

from web.app.schemas.representation import RepresentationBase
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
    email: Mapped[str] = mapped_column(String, nullable=False)
    photo_url: Mapped[str] = mapped_column(String, nullable=True)
    about: Mapped[str] = mapped_column(String(length=100), nullable=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    representation_id: Mapped[int] = mapped_column(ForeignKey('representations.id'), nullable=True)
    team_id: Mapped[int] = mapped_column(ForeignKey('teams.id'), nullable=True, default=None)

    team: Mapped['Team'] = relationship(back_populates='users')
    oauth_accounts: Mapped[list['OAuthAccount']] = relationship(back_populates='user')
    files: Mapped[list['File']] = relationship(back_populates='user', secondary='user_files', cascade='all, delete')
    roles: Mapped[list['Role']] = relationship(secondary='user_roles', back_populates='users')
    type_events: Mapped[list['EventType']] = relationship(back_populates='users', secondary='user_settings')
    region_representation: Mapped['RegionRepresentation'] = relationship(back_populates='leader')
    representation: Mapped[list['Representation']] = relationship(back_populates='users')
    suggestions: Mapped[list['Suggestion']] = relationship(back_populates='user')

    async def get_principals(self):
        rep = await self.awaitable_attrs.representation
        principals = set()
        if rep is not None:
            principals.add(f'representation:{rep.name}')
        for role in await self.awaitable_attrs.roles:
            principals.add(f"role:{role.name}")
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
