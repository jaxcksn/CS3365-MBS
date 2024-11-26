from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..util import DB, newId
from ..dependencies import auth, admin
from typing import List

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
    runtime: str          # Runtime in minutes
    cast: str             # Movie cast as a string
    release_date: str     # Release date of the movie
    poster_url: str       # URL for the poster
    showing_start: str    # Start date of availability
    showing_end: str      # End date of availability
    times: List[str]      # List of show times
    price: float          # Price per seat
    
def convert_time_to_minutes(time_str: str) -> int:
    hours = 0
    minutes = 0

    if 'h' in time_str:
        parts = time_str.split('h')
        hours = int(parts[0])
        time_str = parts[1]

    if 'm' in time_str:
        minutes = int(time_str.replace('m', '').strip())

    total_minutes = hours * 60 + minutes
    return total_minutes


    
@router.post("/admin/showing")
async def add_showing(
    body: AddShowingRequest,  # Pydantic model for validation
    user_id: str = Depends(auth),
):
    movie_id = newId("short")  # Generate a unique ID for the movie
    try:
        # Insert the movie details into the MovieShowing table
        runtime_in_minutes = convert_time_to_minutes(body.runtime)
        await DB.execute(
            """
            INSERT INTO `MovieShowing`(
                `id`, `title`, `description`, `runtime`, `cast`, `release_date`, 
                `poster_url`, `showing_start`, `showing_end`, `times`, `price`
            )
            VALUES (
                :id, :title, :description, :runtime, :cast, :release_date,
                :poster_url, :showing_start, :showing_end, :times, :price
            )
            """,
            {
                "id": movie_id,
                "title": body.title,
                "description": body.description,
                "runtime": runtime_in_minutes,
                "cast": body.cast,
                "release_date": body.release_date,
                "poster_url": body.poster_url,
                "showing_start": body.showing_start,
                "showing_end": body.showing_end,
                "times": ",".join(body.times),  # Convert list of times to a comma-separated string
                "price": body.price,
            },
        )

        return {"message": "Showing added successfully", "id": movie_id}
    except Exception as e:
        return {"error": str(e)}
    