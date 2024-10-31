import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
import time
import datetime
from .util import DB


# --------------------- User Authentication Dependencies --------------------- #

bearer_scheme = HTTPBearer()


def verify_jwt_token(token: str):
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="EXPIRED TOKEN"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="TOKEN INVALID"
        )


def generate_access_token(user_id):
    expires = time.time() + datetime.timedelta(hours=2).total_seconds()
    payload = {"user_id": user_id, "exp": expires}
    return (jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256"), expires)


def generate_refresh_token(user_id):
    expires = time.time() + datetime.timedelta(days=7).total_seconds()
    payload = {"user_id": user_id, "exp": expires}
    try:
        token = jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")
        return (token, expires)
    except Exception as err:
        print(err)
        raise Exception("Could not insert refresh token into the database")


async def auth(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    user_id = payload["user_id"]

    result = await DB.queryOne(
        "SELECT id FROM `User` WHERE id=:user", {"user": user_id}
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    else:
        return user_id


async def admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    user_id = payload.get("user_id")
    result = await DB.queryOne(
        "SELECT `role` FROM `User` WHERE id=:user", {"user": user_id}
    )

    if result["role"] == "admin":
        return user_id
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
