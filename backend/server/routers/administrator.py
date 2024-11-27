from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..util import DB, newId
from ..dependencies import auth, admin
from typing import List
from datetime import datetime
import json

router = APIRouter()

# ---------------------------------------------------------------------------- #
#                                    Models                                    #
# ---------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@router.get("/admin")
async def admin_test_route(user_id: str = Depends(admin)):
    admins = await DB.query("SELECT * FROM `User` WHERE role='admin'")
    return admins


class AddShowingRequest(BaseModel):
    title: str
    description: str
    runtime: str  # Runtime in minutes
    cast: str  # Movie cast as a string
    release_date: str  # Release date of the movie
    poster_url: str  # URL for the poster
    showing_start: str  # Start date of availability
    showing_end: str  # End date of availability
    times: List[str]  # List of show times
    price: float  # Price per seat


def convert_time_to_minutes(time_str: str) -> int:
    hours = 0
    minutes = 0

    if "h" in time_str:
        parts = time_str.split("h")
        hours = int(parts[0])
        time_str = parts[1]

    if "m" in time_str:
        minutes = int(time_str.replace("m", "").strip())

    total_minutes = hours * 60 + minutes
    return total_minutes


@router.post("/admin/showing")
async def add_showing(
    body: AddShowingRequest,  # Pydantic model for validation
    user_id: str = Depends(admin),
):
    movie_id = newId("short")  # Generate a unique ID for the movie
    try:
        # Insert the movie details into the MovieShowing table
        runtime_in_minutes = convert_time_to_minutes(body.runtime)
        await DB.execute(
            """
            INSERT INTO `MovieShowing`(
                `id`, `title`, `description`, `runtime`, `cast`, `release_date`, `maturity_rating`,
                `poster_url`, `start_date`, `end_date`, `times`, `seat_price`
            )
            VALUES (
                :id, :title, :description, :runtime, :cast, :release_date, 'undefined',
                :poster_url, :showing_start, :showing_end, :times, :price
            )
            """,
            {
                "id": movie_id,
                "title": body.title,
                "description": body.description,
                "runtime": runtime_in_minutes,
                "cast": body.cast,
                "release_date": datetime.fromisoformat(body.release_date),
                "poster_url": body.poster_url,
                "showing_start": datetime.fromisoformat(body.showing_start),
                "showing_end": datetime.fromisoformat(body.showing_end),
                "times": json.dumps(body.times),
                "price": body.price,
            },
        )

        return {"message": "Showing added successfully", "id": movie_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
