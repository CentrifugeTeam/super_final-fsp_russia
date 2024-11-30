from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from fastapi_permissions import Allow, All


class UserRole(IDMixin, Base):
    __tablename__ = 'user_roles'
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    role_id: Mapped[int] = mapped_column(ForeignKey('roles.id', ondelete='CASCADE'))


class Role(IDMixin, Base):
    __tablename__ = 'roles'
    name: Mapped[str] = mapped_column(String(length=90), unique=True)
    users: Mapped[list['User']] = relationship(back_populates='roles', secondary='user_roles')

    def __acl__(self):
        return [
            (Allow, f'{self.name}', 'view'),
            (Allow, 'role:admin', All),
        ]
