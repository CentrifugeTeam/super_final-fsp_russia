from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from .base import Base, IDMixin


class FederalRegionRepresentation(IDMixin, Base):
    __tablename__ = 'federation_region_representations'
    federal_district_id: Mapped[int] = mapped_column(ForeignKey('representations.id'), nullable=False)
    region_representation_id: Mapped[int] = mapped_column(ForeignKey('region_representations.id'), nullable=False)
    # Связь с регионами


class RegionalRepresentation(IDMixin, Base):
    __tablename__ = 'region_representations'
    representation_id: Mapped[int] = mapped_column(ForeignKey('representations.id', ondelete='CASCADE'))
    leader_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    # leader: Mapped['User'] = relationship(back_populates='regions')


class Representation(IDMixin, Base):
    __tablename__ = 'representations'
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    photo_url: Mapped[str] = mapped_column(String, nullable=True)
    contacts: Mapped[str] = mapped_column(String, nullable=True)
    type: Mapped[str] = mapped_column(String)

    def __repr__(self):
        return f"<Representation(region_name={self.name}"


class RepresentationStuff(IDMixin, Base):
    __tablename__ = 'representation_stuff'
    representation_id: Mapped[int] = mapped_column(ForeignKey('representations.id', ondelete='CASCADE'))
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    is_logged_in: Mapped[bool] = mapped_column(default=False)

    # region: Mapped['RegionalRepresentation'] = relationship('RegionalRepresentation', back_populates='users')
    # user: Mapped['User'] = relationship('User', back_populates='regions')
