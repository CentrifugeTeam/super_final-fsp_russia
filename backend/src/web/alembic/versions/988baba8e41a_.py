"""empty message

Revision ID: 988baba8e41a
Revises: 
Create Date: 2024-11-24 05:15:11.192099

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
revision: str = '988baba8e41a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('event_types',
    sa.Column('sport', sa.String(length=250), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('sport')
    )
    op.create_table('locations',
    sa.Column('city', sa.String(), nullable=False),
    sa.Column('region', sa.String(), nullable=True),
    sa.Column('country', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('city', 'region', 'country', name='unique_city_region_country')
    )
    op.create_table('users',
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('events',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('category', sa.String(length=250), nullable=False),
    sa.Column('name', sa.String(length=700), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('participants_count', sa.Integer(), nullable=False),
    sa.Column('type_event_id', sa.Integer(), nullable=False),
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['location_id'], ['locations.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['type_event_id'], ['event_types.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_settings',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('type_event_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['type_event_id'], ['event_types.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('age_groups',
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('age_from', sa.Integer(), nullable=True),
    sa.Column('age_to', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.BigInteger(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('competitions',
    sa.Column('type', sa.String(length=80), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('event_id', sa.BigInteger(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('type', 'name', name='unique_type_and_name')
    )
    # ### end Alembic commands ###
    async def seed_db(connection: AsyncConnection):
        session = AsyncSession(bind=connection)
#       Factory.__async_session__ = session
#       await Factory.create_batch_async(10)


    op.run_async(seed_db)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('competitions')
    op.drop_table('age_groups')
    op.drop_table('user_settings')
    op.drop_table('events')
    op.drop_table('users')
    op.drop_table('locations')
    op.drop_table('event_types')
    # ### end Alembic commands ###
