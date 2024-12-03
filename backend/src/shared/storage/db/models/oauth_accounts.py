from .base import Base, IDMixin
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column


class OAuthAccount(IDMixin, Base):
    """
    A user's OAuth account
    """
    __tablename__ = 'oauth_accounts'
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    provider: Mapped[str] = mapped_column(String(255), nullable=False)
    access_token: Mapped[str] = mapped_column(String(255), nullable=False)
    refresh_token: Mapped[str] = mapped_column(String(255), nullable=False)
    user: Mapped['User'] = relationship(back_populates='oauth_accounts')
