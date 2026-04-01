from fastapi import Request
from fastapi.responses import JSONResponse
from app.redis_client import decr_credits, incr_credits, get_credits, get_redis

RATE_LIMIT_PER_MINUTE = 60  # max requests per tenant per minute

async def budget_middleware(request: Request, call_next):
    if request.url.path in ["/health", "/metrics", "/docs", "/openapi.json"]:
        return await call_next(request)

    if not request.url.path.startswith("/v1/"):
        return await call_next(request)

    tenant_id = request.state.tenant_id

    # Rate limiting — per minute window
    r = await get_redis()
    import time
    minute_key = f"ratelimit:{tenant_id}:{int(time.time() // 60)}"
    current = await r.incr(minute_key)
    if current == 1:
        await r.expire(minute_key, 60)

    if current > RATE_LIMIT_PER_MINUTE:
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded",
                "code": "RATE_LIMIT_EXCEEDED",
                "limit": RATE_LIMIT_PER_MINUTE,
                "window": "60 seconds"
            }
        )

    # Budget check
    remaining = await decr_credits(tenant_id)

    if remaining < 0:
        await incr_credits(tenant_id)
        return JSONResponse(
            status_code=429,
            content={
                "error": "Insufficient credits",
                "code": "NO_CREDITS",
                "credits_remaining": 0
            }
        )

    request.state.credits_before = remaining + 1
    return await call_next(request)