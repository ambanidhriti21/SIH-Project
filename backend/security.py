import hashlib, hmac, os
from datetime import datetime, timedelta, timezone
from jose import jwt

SECRET_KEY = os.getenv('JWT_SECRET', 'CHANGE_THIS_IN_PRODUCTION_AGRISMART_2026')
ALGORITHM = 'HS256'
TOKEN_MINUTES = int(os.getenv('TOKEN_MINUTES', '1440'))

def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 180000)
    return f'pbkdf2_sha256$180000${salt.hex()}${digest.hex()}'

def verify_password(password: str, encoded: str) -> bool:
    try:
        _, rounds, salt_hex, digest_hex = encoded.split('$')
        digest = hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt_hex), int(rounds))
        return hmac.compare_digest(digest.hex(), digest_hex)
    except Exception:
        return False

def create_token(user_id: int) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_MINUTES)
    return jwt.encode({'sub': str(user_id), 'exp': exp}, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> int:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return int(payload['sub'])
