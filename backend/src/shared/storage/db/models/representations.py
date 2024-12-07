from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship, mapped_column, Mapped
from .base import Base, IDMixin


class RegionRepresentation(IDMixin, Base):
    __tablename__ = 'region_representations'
    representation_id: Mapped[int] = mapped_column(ForeignKey('representations.id', ondelete='CASCADE'))
    leader_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    federal_district_id: Mapped[int] = mapped_column(ForeignKey('representations.id'), nullable=True)
    leader: Mapped['User'] = relationship(back_populates='region_representation')
    representation: Mapped['Representation'] = relationship(
        back_populates='region',
        foreign_keys=[representation_id]
    )
    federation_representation: Mapped['Representation'] = relationship(
        back_populates='regions',
        foreign_keys=[federal_district_id]
        # primaryjoin="and_(RegionRepresentation.federation_representation_id == Representation.id, Representation.type == 'federation')",
    )


class Representation(IDMixin, Base):
    __tablename__ = 'representations'
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    photo_url: Mapped[str] = mapped_column(String, nullable=True)
    contacts: Mapped[str] = mapped_column(String, nullable=True)
    type: Mapped[str] = mapped_column(String)
    regions: Mapped[list['RegionRepresentation']] = relationship(back_populates='federation_representation',
                                                                 foreign_keys='RegionRepresentation.federal_district_id')
    region: Mapped['RegionRepresentation'] = relationship(back_populates='representation',
                                                          foreign_keys='RegionRepresentation.representation_id')
    users: Mapped[list['User']] = relationship(back_populates='representation')

    def __repr__(self):
        return f"<Representation(region_name={self.name}"
