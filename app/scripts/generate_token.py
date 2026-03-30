from jose import jwt
from datetime import datetime, timedelta, timezone
from app.config import settings

token = jwt.encode(
    {
        "sub": "214095f6-c64f-4640-9096-4cca4dc6c883",
        "name": "MedNote",
        "plan": "pro",
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    },
    settings.JWT_SECRET,
    algorithm="HS256"
)
print(token)