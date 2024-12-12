"""seed-data

Revision ID: 6774e624ca40
Revises: 751d26523b9c
Create Date: 2024-12-12 01:09:16.976571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from web.alembic.seed import seed,main
#class Factory(SQLAlchemyFactory):
#    __model__ =
#    __set_relationships__ = True


# revision identifiers, used by Alembic.
revision: str = '6774e624ca40'
down_revision: Union[str, None] = '751d26523b9c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('areas', 'district_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###
    async def wrapper(connection: AsyncConnection):
        session = AsyncSession(bind=connection, expire_on_commit=False, autoflush=False, autocommit=False)
        await seed(session)


#       Factory.__async_session__ = session
#       await Factory.create_batch_async(10)


    op.run_async(wrapper)



def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('areas', 'district_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###
