from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship, mapped_column, Mapped
from .base import Base, IDMixin


class Area(IDMixin, Base):
    __tablename__ = 'areas'
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    photo_url: Mapped[str] = mapped_column(String, nullable=True)
    contacts: Mapped[str] = mapped_column(String, nullable=True)
    leader_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    district_id: Mapped[int] = mapped_column(ForeignKey('districts.id'), nullable=False)

    district: Mapped['District'] = relationship(back_populates='areas')
    leader: Mapped['User'] = relationship(back_populates='region_representation')
    teams: Mapped[list['Team']] = relationship(back_populates='area')


class District(IDMixin, Base):
    __tablename__ = 'districts'
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    areas: Mapped[list['Area']] = relationship(back_populates='district')
    # users: Mapped[list['User']] = relationship(back_populates='representation')
    teams: Mapped[list['Team']] = relationship(back_populates='district', secondary='areas')

    def __repr__(self):
        return f"<Representation(region_name={self.name}"
