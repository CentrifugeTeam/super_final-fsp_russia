from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from .base import Base, IDMixin
from .users import User

class FederalDistrict(IDMixin, Base):
    __tablename__ = 'federal_districts'

    district_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)


    # Связь с регионами
    regions: Mapped[list['RegionalRepresentation']] = relationship(back_populates='federal_district')

    def __repr__(self):
        return f"<FederalDistrict(district_name={self.district_name})>"

class RegionalRepresentation(IDMixin, Base):
    __tablename__ = 'regional_representations'

    region_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    region_url: Mapped[str] = mapped_column(String, nullable=True)
    leader_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    contacts: Mapped[str] = mapped_column(String, nullable=True)
    federal_district_id: Mapped[int] = mapped_column(ForeignKey('federal_districts.id'), nullable=False)

    leader: Mapped['User'] = relationship(back_populates='leader')
    federal_district: Mapped['FederalDistrict'] = relationship(back_populates='regions')

    def __repr__(self):
        return f"<RegionalRepresentation(region_name={self.region_name}, leader={self.leader_id}, federal_district={self.federal_district.district_name})>"

class RegionalUsers(IDMixin, Base):
    __tablename__ = 'regional_users'

    representation_id: Mapped[int] = mapped_column(ForeignKey('regional_representations.id', ondelete='CASCADE'))
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))

    # region: Mapped['RegionalRepresentation'] = relationship('RegionalRepresentation', back_populates='users')
    # user: Mapped['User'] = relationship('User', back_populates='regions')

# RegionalRepresentation.users = relationship('RegionalUsers', back_populates='region')
# User.regions = relationship('RegionalUsers', back_populates='user')
