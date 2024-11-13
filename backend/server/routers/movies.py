from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..util import DB, newId
from ..dependencies import auth, admin

router = APIRouter()


# ---------------------------------------------------------------------------- #
#                                    Models                                    #
# ---------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #

# HINT: The MovieShowing databases use a URL safe short ID instead of a UUID, so you need
# to use newId("short") to generate a new ID for a movie or showing.


@router.get("/movies")
async def movies(user_id: str = Depends(auth)):
    results = await DB.query(
        "SELECT `id`, `title`, `release_date` as `showings_start`, `poster_url` FROM `MovieShowing`"
    )
    return results
