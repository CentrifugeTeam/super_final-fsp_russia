from sqlalchemy import select




async def ping_user(ctx):
    maker = ctx["async_session_maker"]
    async with maker() as session:
        pass



async def _query(session):
    stmt = ()
        # select(UserReplyFrequency)
        # .where()
        #     )
    # pass