import os
from fastapi import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from app.config import settings

ADMIN_ROUTES = ["/tenants", "/audit", "/cache"]

async def auth_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
        
    if request.url.path in ["/health", "/metrics", "/docs", "/openapi.json", "/sentry-debug"]:
        return await call_next(request)

    # Admin routes — require X-Admin-Key header
    is_admin_route = any(
        request.url.path.startswith(r) for r in ADMIN_ROUTES
    )
    if is_admin_route:
        admin_key = request.headers.get("X-Admin-Key")
        if admin_key != settings.ADMIN_API_KEY:
            return JSONResponse(
                status_code=401,
                content={"error": "Invalid admin key", "code": "INVALID_ADMIN_KEY"}
            )
        return await call_next(request)

    # JWT auth for /v1/ routes
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"error": "Missing token", "code": "NO_TOKEN"}
        )

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"]
        )
        request.state.tenant_id = payload["sub"]
        request.state.tenant_name = payload.get("name", "")
        request.state.plan = payload.get("plan", "starter")
    except JWTError:
        return JSONResponse(
            status_code=401,
            content={"error": "Invalid token", "code": "INVALID_TOKEN"}
        )

    return await call_next(request)