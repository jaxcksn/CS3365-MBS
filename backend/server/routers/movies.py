from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..util import DB
from ..dependencies import auth, admin

router = APIRouter()

# ---------------------------------------------------------------------------- #
#                                    Models                                    #
# ---------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@router.get("/movies")
async def movies(user_id: str = Depends(auth)):
    results = await DB.query(
        "SELECT `id`, `title`, `release_date` as `showings_start`, `poster_url` FROM `Movie`"
    )
    return results
