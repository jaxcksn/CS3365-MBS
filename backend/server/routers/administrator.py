from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..util import DB, newId
from ..dependencies import auth, admin
from typing import List, Optional
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

class EditShowingRequest(BaseModel):
    id: str  # ID of the showing to edit
    title: Optional[str]
    description: Optional[str]
    runtime: Optional[str]  # Runtime in formats like "2h30m", or directly in minutes
    cast: Optional[str]
    release_date: Optional[str]  # ISO format date string (e.g., "2024-11-01")
    poster_url: Optional[str]  # URL for the poster
    showing_start: Optional[str]  # ISO format start date (e.g., "2024-11-01")
    showing_end: Optional[str]  # ISO format end date (e.g., "2024-12-01")
    times: List[str]  # Required list of show times
    price: Optional[float]  # Seat price

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


@router.get("/admin/showings")
async def get_showings(user_id: str = Depends(admin)):
    try:
        showings = await DB.query(
            "SELECT id, title, poster_url, seat_price, release_date FROM `MovieShowing`"
        )

        admin_showings = []
        for showing in showings:
            admin_showings.append(
                {
                    "movie": {
                        "title": showing["title"],
                        "poster_url": showing["poster_url"],
                    },
                    "id": showing["id"],
                    "price": showing["seat_price"],
                    "release_date": showing["release_date"],
                }
            )

        return admin_showings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    
    
@router.put("/admin/showing")
async def edit_showing(
    body: EditShowingRequest,  # Pydantic model for validation
    user_id: str = Depends(admin),
):
    try:
        print("DEBUG: Request payload:", body.dict())
        
        # Build the SQL query dynamically
        update_fields = []
        parameters = {"id": body.id}

        if body.title is not None:
            update_fields.append("`title` = :title")
            parameters["title"] = body.title
        if body.description is not None:
            update_fields.append("`description` = :description")
            parameters["description"] = body.description
        if body.runtime is not None:
            runtime_in_minutes = convert_time_to_minutes(body.runtime)
            update_fields.append("`runtime` = :runtime")
            parameters["runtime"] = runtime_in_minutes
        if body.cast is not None:
            update_fields.append("`cast` = :cast")
            parameters["cast"] = body.cast
        if body.release_date is not None:
            update_fields.append("`release_date` = :release_date")
            parameters["release_date"] = datetime.fromisoformat(body.release_date)
        if body.poster_url is not None:
            update_fields.append("`poster_url` = :poster_url")
            parameters["poster_url"] = body.poster_url
        if body.showing_start is not None:
            update_fields.append("`showing_start` = :showing_start")
            parameters["showing_start"] = datetime.fromisoformat(body.showing_start)
        if body.showing_end is not None:
            update_fields.append("`showing_end` = :showing_end")
            parameters["showing_end"] = datetime.fromisoformat(body.showing_end)
        if body.times is not None:
            update_fields.append("`times` = :times")
            parameters["times"] = json.dumps(body.times)
        if body.price is not None:
            update_fields.append("`price` = :price")
            parameters["price"] = body.price

        # Ensure at least one field is being updated
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields provided for update")

        # Combine the fields into the SQL query
        update_query = f"UPDATE `MovieShowing` SET {', '.join(update_fields)} WHERE `id` = :id"

        # Execute the update query
        result = await DB.execute(update_query, parameters)

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Showing not found")

        return {"message": "Showing updated successfully", "id": body.id}
    except Exception as e:
        return {"error": str(e)}
