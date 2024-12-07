"""empty message

Revision ID: bcb97535106e
Revises: 7c64d125f0e5
Create Date: 2024-12-07 14:32:28.886303

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory

#class Factory(SQLAlchemyFactory):
#    __model__ =
#    __set_relationships__ = True


# revision identifiers, used by Alembic.
revision: str = 'bcb97535106e'
down_revision: Union[str, None] = '7c64d125f0e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('suggestions',
    sa.Column('competition', sa.String(length=200), nullable=False),
    sa.Column('location', sa.String(length=200), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('format', sa.String(length=20), nullable=False),
    sa.Column('count_participants', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
    async def seed_db(connection: AsyncConnection):
        session = AsyncSession(bind=connection)
#       Factory.__async_session__ = session
#       await Factory.create_batch_async(10)


    op.run_async(seed_db)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('suggestions')
    # ### end Alembic commands ###
