from .base import Base, IDMixin

class Notification(IDMixin, Base):
    __tablename__ = 'notifications'
