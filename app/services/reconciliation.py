from app.database import get_pool
from app.redis_client import get_redis
from app.services.cost import calculate_cost
from app.config import settings

_langfuse = None

def get_langfuse():
    global _langfuse
    if _langfuse is None and settings.LANGFUSE_PUBLIC_KEY:
        from langfuse import Langfuse
        _langfuse = Langfuse(
            public_key=settings.LANGFUSE_PUBLIC_KEY,
            secret_key=settings.LANGFUSE_SECRET_KEY,
            host=settings.LANGFUSE_BASE_URL,
        )
    return _langfuse

async def reconcile(
    tenant_id: str,
    model: str,
    input_tokens: int,
    output_tokens: int,
    latency_ms: int,
    query_text: str,
    response_text: str,
    query_embedding: list,
    cached: bool
):
    cost = calculate_cost(model, input_tokens, output_tokens)

    pool = await get_pool()

    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO audit_log
                (tenant_id, model, input_tokens, output_tokens,
                 cost_usd, latency_ms, cached)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """, tenant_id, model, input_tokens, output_tokens,
             cost, latency_ms, cached)

    if not cached and query_embedding:
        async with pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO semantic_cache
                    (tenant_id, query_embedding, query_text,
                     response_text, model)
                VALUES ($1, $2::vector, $3, $4, $5)
            """, tenant_id, str(query_embedding),
                 query_text, response_text, model)

    lf = get_langfuse()
    if lf:
        try:
            generation = lf.start_generation(
            name="llm-completion",
            model=model,
            input=query_text,
            output=response_text,
            usage_details={
                "input": input_tokens,
                "output": output_tokens,
            },
            metadata={
                "tenant_id": tenant_id,
                "cached": cached,
                "cost_usd": cost,
                "latency_ms": latency_ms
            }
        )
            generation.end()
            lf.flush()
            print(f"LangFuse trace sent for tenant {tenant_id}")
        except Exception as e:
            print(f"LangFuse error: {e}")

    r = await get_redis()
    credits_to_deduct = max(1, int(cost * 1000))
    await r.decrby(f"tenant:{tenant_id}:credits", credits_to_deduct - 1)