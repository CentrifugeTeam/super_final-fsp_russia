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
    photo_url: Mapped[str] = mapped_column(String)
    about: Mapped[str] = mapped_column(String(length=100), nullable=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    oauth_accounts: Mapped[list['OAuthAccount']] = relationship(back_populates='user')
    files: Mapped[list['File']] = relationship(back_populates='user', secondary='user_files', cascade='all, delete')
    roles: Mapped[list['Role']] = relationship(secondary='user_roles', back_populates='users')
    type_events: Mapped[list['EventType']] = relationship(back_populates='users', secondary='user_settings')

    async def get_principals(self):
        roles = await self.awaitable_attrs.roles
        roles = [role.name for role in roles]
        if self.is_superuser:
            roles.append('superuser')
        if self.is_verified:
            roles.append('verified')
        return roles

    # leader: Mapped['RegionalRepresentation'] = relationship(back_populates='leader')


class UserSettings(IDMixin, Base):
    __tablename__ = 'user_settings'
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    type_event_id: Mapped[int] = mapped_column(ForeignKey('event_types.id', ondelete='CASCADE'))
