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


@router.get("/admin")
async def admin_test_route(user_id: str = Depends(admin)):
    admins = await DB.query("SELECT * FROM `User` WHERE role='admin'")
    return admins
