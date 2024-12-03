from .base import Base, IDMixin
from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from fastapi_permissions import Allow, All


class File(IDMixin, Base):
    __tablename__ = 'files'
    name: Mapped[str] = mapped_column(String, nullable=True)
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    user: Mapped[list['User']] = relationship(back_populates='files', secondary='user_files', cascade='all, delete')

    def __acl__(self):
        return [
            (Allow, f'role:owner', 'view'),
            (Allow, 'role:admin', All),
        ]



class UserFile(IDMixin, Base):
    __tablename__ = 'user_files'
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    file_id: Mapped[int] = mapped_column(ForeignKey('files.id', ondelete='CASCADE'))