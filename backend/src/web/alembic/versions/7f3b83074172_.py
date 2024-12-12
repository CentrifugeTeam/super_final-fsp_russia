"""empty message

Revision ID: 7f3b83074172
Revises: 6197cee554c4
Create Date: 2024-12-11 23:25:52.815926

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
revision: str = '7f3b83074172'
down_revision: Union[str, None] = '6197cee554c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('areas_leader_id_fkey', 'areas', type_='foreignkey')
    op.drop_column('areas', 'leader_id')
    op.add_column('users', sa.Column('is_leader', sa.Boolean(), nullable=False))
    op.add_column('users', sa.Column('area_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'users', 'areas', ['area_id'], ['id'])
    # ### end Alembic commands ###
    async def seed_db(connection: AsyncConnection):
        session = AsyncSession(bind=connection)
#       Factory.__async_session__ = session
#       await Factory.create_batch_async(10)


    op.run_async(seed_db)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='foreignkey')
    op.drop_column('users', 'area_id')
    op.drop_column('users', 'is_leader')
    op.add_column('areas', sa.Column('leader_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key('areas_leader_id_fkey', 'areas', 'users', ['leader_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###