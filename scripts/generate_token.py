import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jose import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.environ.get("JWT_SECRET")
TENANT_ID = os.environ.get("TEST_TENANT_ID", "214095f6-c64f-4640-9096-4cca4dc6c883")

token = jwt.encode(
    {
        "sub": TENANT_ID,
        "name": "MedNote",
        "plan": "pro",
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    },
    JWT_SECRET,
    algorithm="HS256"
)
print(token)
