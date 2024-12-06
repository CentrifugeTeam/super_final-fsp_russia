from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from .base import Base, IDMixin
from .users import User

class RegionalRepresentation(IDMixin, Base):
    __tablename__ = 'regional_representations'

    region_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    leader_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    contacts: Mapped[str] = mapped_column(String, nullable=True)

    leader: Mapped['User'] = relationship('User', back_populates='regions', foreign_keys=[leader_id])

    def __repr__(self):
        return f"<RegionalRepresentation(region_name={self.region_name}, leader={self.leader_id})>"

class RegionalUsers(IDMixin, Base):
    __tablename__ = 'regional_users'

    representation_id: Mapped[int] = mapped_column(ForeignKey('regional_representations.id', ondelete='CASCADE'))
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    is_staff: Mapped[bool] = mapped_column(Integer, default=False)

    region: Mapped['RegionalRepresentation'] = relationship('RegionalRepresentation', back_populates='users')
    user: Mapped['User'] = relationship('User', back_populates='regions')

RegionalRepresentation.users = relationship('RegionalUsers', back_populates='region')
User.regions = relationship('RegionalUsers', back_populates='user')
