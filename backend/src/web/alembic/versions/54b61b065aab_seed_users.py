"""seed-users

Revision ID: 54b61b065aab
Revises: f2d3e2b75281
Create Date: 2024-12-13 15:44:09.096363

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from web.alembic.seeds import seed_users

# class Factory(SQLAlchemyFactory):
#    __model__ =
#    __set_relationships__ = True


# revision identifiers, used by Alembic.
revision: str = '54b61b065aab'
down_revision: Union[str, None] = 'f2d3e2b75281'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('suggestions', sa.Column('task_url', sa.String(), nullable=True))

    # ### end Alembic commands ###
    async def seed_db(connection: AsyncConnection):
        session = AsyncSession(bind=connection, expire_on_commit=False, autoflush=False, autocommit=False)
        await seed_users(session)

    op.run_async(seed_db)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('suggestions', 'task_url')
    # ### end Alembic commands ###
