"""empty message

Revision ID: 28e25e126dba
Revises: 6120027e965d
Create Date: 2024-12-06 19:26:44.885599

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
revision: str = '28e25e126dba'
down_revision: Union[str, None] = '6120027e965d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('federal_districts',
    sa.Column('district_name', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('district_name')
    )
    op.add_column('regional_representations', sa.Column('federal_district_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'regional_representations', 'federal_districts', ['federal_district_id'], ['id'])
    op.add_column('users', sa.Column('about', sa.String(length=100), nullable=True))
    # ### end Alembic commands ###
    async def seed_db(connection: AsyncConnection):
        session = AsyncSession(bind=connection)
#       Factory.__async_session__ = session
#       await Factory.create_batch_async(10)


    op.run_async(seed_db)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'about')
    op.drop_constraint(None, 'regional_representations', type_='foreignkey')
    op.drop_column('regional_representations', 'federal_district_id')
    op.drop_table('federal_districts')
    # ### end Alembic commands ###
