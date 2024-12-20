from .models import Base

async def create_db_and_tables(engine):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)



