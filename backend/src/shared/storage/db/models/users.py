from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship, mapped_column, Mapped


class User(IDMixin, Base):
    """
    User model
    """
    __tablename__ = 'users'
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String, nullable=True) # if user registered with oauth2 provider
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    middle_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    photo_url: Mapped[str] = mapped_column(String)
    # is_active: Mapped[bool] = mapped_column(Integer, default=1)
    # is_admin: Mapped[bool] = mapped_column(Integer, default=0)
    # is_superuser: Mapped[bool] = mapped_column(Integer, default=0)
    # is_staff: Mapped[bool] = mapped_column(Integer, default=0)
    # groups: Mapped[list['Group']] = relationship('Group', secondary='users_groups')
    oauth_accounts: Mapped[list['OAuthAccount']] = relationship(back_populates='user')
    files: Mapped[list['File']] = relationship(back_populates='user', secondary='user_files', cascade='all, delete')
    roles: Mapped[list['Role']] = relationship(secondary='user_roles', back_populates='users')
