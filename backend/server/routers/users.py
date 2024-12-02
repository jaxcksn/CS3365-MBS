import datetime
import os
from typing import Annotated
import uuid
import bcrypt
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
import jwt
from pydantic import BaseModel
from ..util import DB, newId
from ..dependencies import auth, generate_access_token, generate_refresh_token

router = APIRouter()

# ---------------------------------------------------------------------------- #
#                                    Models                                    #
# ---------------------------------------------------------------------------- #


class RegisterInfo(BaseModel):
    email: str
    password: str
    phone_number: str
    lastname: str
    firstname: str
    address: str


class LoginInfo(BaseModel):
    email: str
    password: str


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@router.post("/user/register")
async def register(
    info: RegisterInfo,
    response: Response,
):
    hash = bcrypt.hashpw(info.password.encode("utf-8"), bcrypt.gensalt())
    await DB.execute(
        """INSERT INTO `User` (`id`, `email`, `password`, `phone`, `role`, `firstName`, `lastName`, `address`) 
        VALUES (:id, :email, :password, :phone_number, 'user', :first_name, :last_name, :address)""",
        {
            "id": newId(),
            "email": info.email,
            "password": hash,
            "phone_number": info.phone_number,
            "first_name": info.firstname,
            "last_name": info.lastname,
            "address": info.address,
        },
    )
    response.status_code = status.HTTP_201_CREATED
    return {"message": "User registered successfully"}


@router.post("/user/login")
async def login(
    body: LoginInfo,
    response: Response,
):
    result = await DB.queryOne(
        "SELECT id, password, role, firstName, lastName, address, phone FROM `User` WHERE email=:username",
        {"username": body.email},
    )
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    else:
        if bcrypt.checkpw(
            body.password.encode("utf-8"), result["password"].encode("utf-8")
        ):
            try:
                access = generate_access_token(result["id"])
                refresh = generate_refresh_token(result["id"])
            except Exception as err:
                raise HTTPException(status_code=500, detail=str(err))
            response.set_cookie(
                key="refresh_token", value=refresh[0], httponly=True, expires=refresh[1]
            )
            return {
                "access_token": access[0],
                "expires": datetime.datetime.fromtimestamp(access[1]),
                "role": result["role"],
                "firstname": result["firstName"],
                "lastname": result["lastName"],
                "address": result["address"],
                "phone_number": result["phone"],
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid password")


@router.post("/user/refresh")
async def refresh(
    response: Response,
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    if not refresh_token:
        raise HTTPException(status_code=400, detail="No refresh token provided")
    try:
        payload = jwt.decode(
            refresh_token, os.getenv("JWT_SECRET"), algorithms=["HS256"]
        )
        user_id = payload["user_id"]
        if datetime.datetime.now() > datetime.datetime.fromtimestamp(payload["exp"]):
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return {"error": "Refresh token expired"}
        access = generate_access_token(user_id)
        refresh = generate_refresh_token(user_id)
        roleResult = await DB.queryOne(
            "SELECT role, firstName, lastName, phone, address FROM `User` WHERE id=:id",
            {"id": user_id},
        )

        response.set_cookie(
            key="refresh_token", value=refresh[0], httponly=True, expires=refresh[1]
        )
        return {
            "access_token": access[0],
            "expires": datetime.datetime.fromtimestamp(access[1]),
            "role": roleResult["role"],
            "firstname": roleResult["firstName"],
            "lastname": roleResult["lastName"],
            "address": roleResult["address"],
            "phone_number": roleResult["phone"],
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Refresh token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid refresh token")
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.post("/user/logout")
def logout(response: Response):
    response.delete_cookie(key="refresh_token")
    return {"message": "User logged out successfully"}


@router.get("/user/bookings", status_code=200)
async def get_user_bookings(user: str = Depends(auth)):
    """
    Get bookings for the logged-in user in the required format.
    """
    try:
        # Query the database for user bookings
        bookings = await DB.query(
            """
            SELECT 
                t.id AS ticket_id,
                t.date,
                t.time,
                t.quantity,
                m.title AS movie_title,
                t.theater,
                t.showing,
                t.used,
                m.id AS movie_id,
                m.description,
                m.runtime,
                m.maturity_rating,
                m.cast,
                m.release_date,
                m.poster_url,
                m.start_date,
                m.end_date,
                m.times,
                m.seat_price AS cost
            FROM Ticket t
            JOIN MovieShowing m ON t.showing = m.id
            WHERE t.user=:user_id""",
            {"user_id": user},
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving bookings: {str(err)}",
        )

    # Map the database rows to the required response format
    if not bookings:
        return []
    return [
        {
            "id": booking["ticket_id"],
            "date": booking["date"],
            "time": booking["time"],
            "seats": booking["quantity"],
            "cost": booking["cost"],
            "used": booking["used"],
            "movie": {
                "movie_id": booking["movie_id"],
                "title": booking["movie_title"],
                "description": booking["description"],
                "runtime": booking["runtime"],
                "maturity_rating": booking["maturity_rating"],
                "cast": booking["cast"],
                "date": booking["date"],
                "release_date": booking["release_date"],
                "poster_url": booking["poster_url"],
                "start_date": booking["start_date"],
                "end_date": booking["end_date"],
                "times": booking["times"],
                "cost": booking["cost"],
            },
            "theater": booking["theater"],
        }
        for booking in bookings
    ]
