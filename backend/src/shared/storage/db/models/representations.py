from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from .base import Base, IDMixin


class RegionRepresentation(IDMixin, Base):
    # TODO!
    __tablename__ = 'region_representations'
    representation_id: Mapped[int] = mapped_column(ForeignKey('representations.id', ondelete='CASCADE'))
    leader_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    federal_district_id: Mapped[int] = mapped_column(ForeignKey('representations.id'), nullable=True)
    leader: Mapped['User'] = relationship(back_populates='region_representation')


class Representation(IDMixin, Base):
    __tablename__ = 'representations'
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    photo_url: Mapped[str] = mapped_column(String, nullable=True)
    contacts: Mapped[str] = mapped_column(String, nullable=True)
    type: Mapped[str] = mapped_column(String)
    # regions: Mapped['RegionRepresentation'] = relationship(back_populates='federation_representation')
    # region: Mapped['RegionRepresentation'] = relationship(back_populates='representation')

    def __repr__(self):
        return f"<Representation(region_name={self.name}"


class RepresentationStuff(IDMixin, Base):
    __tablename__ = 'representation_stuff'
    representation_id: Mapped[int] = mapped_column(ForeignKey('representations.id', ondelete='CASCADE'))
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))

    # region: Mapped['RegionalRepresentation'] = relationship('RegionalRepresentation', back_populates='users')
    # user: Mapped['User'] = relationship('User', back_populates='regions')
