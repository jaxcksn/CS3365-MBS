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
from .routers import administrator, users, movies, payment

# ---------------------------------------------------------------------------- #
#                             Server Initialization                            #
# ---------------------------------------------------------------------------- #

load_dotenv()
app = FastAPI()

# Add routers here!
app.include_router(users.router)
app.include_router(movies.router)
app.include_router(administrator.router)
app.include_router(payment.router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
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
    return {"message": "This is an admin route!!!! You are an admin."}

# ---------------------------------------------------------------------------- #
#                                Health Check                                  #
# ---------------------------------------------------------------------------- #

@app.get("/health", status_code=200)
async def health_check(response: Response):
    try:
        # Perform a quick database query to check connectivity
        await DB.queryOne("SELECT 1")
        
        # Set Cache-Control header to prevent caching
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        
        # Return a JSON response indicating the backend is healthy
        return {"backend": True, "api": True}

    except Exception as e:
        # Set Cache-Control header to prevent caching in case of error
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        
        # Raise HTTPException with a 500 status code and an error message
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"status": "unhealthy", "error": "Backend or database connection failed"}
        )
