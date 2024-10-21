import bcrypt
import jwt
import datetime
import uuid
import os
from fastapi import Depends, FastAPI, HTTPException, Response, status, Cookie
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from .util import DB
from .dependencies import auth, admin
from .routers import administrator, users, movies

# ---------------------------------------------------------------------------- #
#                             Server Initialization                            #
# ---------------------------------------------------------------------------- #

load_dotenv()
app = FastAPI()

# Add routers here!
app.include_router(users.router)
app.include_router(movies.router)
app.include_router(administrator.router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@app.get("/")
async def home():
    result = await DB.queryOne("SELECT * FROM `App`")
    return result


@app.get("/test/protected")
def protected_route(user_id: str = Depends(auth)):
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    else:
        return {"message": "This is a protected route! You are logged in."}


@app.get("/test/admin")
def admin_route(user_id: str = Depends(admin)):
    return {"message": "This is an admin route! You are an admin."}
