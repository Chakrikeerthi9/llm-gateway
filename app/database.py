import os
import asyncpg
from app.config import settings

_pool = None

async def create_pool():
    global _pool
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    is_internal = "oregon-postgres.render.com" not in db_url
    ssl_setting = False if is_internal else "require"
    _pool = await asyncpg.create_pool(
        db_url,
        min_size=2,
        max_size=10,
        ssl=ssl_setting
    )
    return _pool

async def get_pool():
    global _pool
    if _pool is None:
        await create_pool()
    return _pool

async def close_pool():
    global _pool
    if _pool:
        await _pool.close()

async def get_db():
    pool = await get_pool()
    async with pool.acquire() as connection:
        yield connection