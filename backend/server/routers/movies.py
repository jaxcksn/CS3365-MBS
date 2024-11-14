from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from ..util import DB, newId
from ..dependencies import auth, admin

router = APIRouter()

# Temporary in-memory storage for reviews
reviews_store = {}

# ---------------------------------------------------------------------------- #
#                                    Models                                    #
# ---------------------------------------------------------------------------- #
class CreateMovieReviewRequest(BaseModel):
    movie_id: str
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    content: Optional[str] = Field(None, max_length=250, description="Optional content about the movie")
    

# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #

# HINT: The MovieShowing databases use a URL safe short ID instead of a UUID, so you need
# to use newId("short") to generate a new ID for a movie or showing.


@router.get("/movies")
async def movies(user_id: str = Depends(auth)):
    results = await DB.query(
        "SELECT `id`, `title`, `release_date` AS `showings_start`, `poster_url` FROM `MovieShowing`"
    )
    # Check for existing reviews for each movie in the results for this user
    for movie in results:
        review_key = f"{user_id}:{movie['id']}"
        movie["user_review"] = reviews_store.get(review_key)
    return results

@router.post("/movie/review", status_code=200)
async def create_movie_review(
    review: CreateMovieReviewRequest,
    user_id: str = Depends(auth),
):
    # Create a unique key to identify a review by this user for this movie
    review_key = f"{user_id}:{review.movie_id}"

    # Check if the user has already reviewed this movie
    if review_key in reviews_store:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this movie."
        )

    # If not, add the review to the temporary in-memory storage
    reviews_store[review_key] = {
        "movie_id": review.movie_id,
        "user_id": user_id,
        "rating": review.rating,
        "content": review.content
    }

    return {"message": "Review submitted successfully", "review": reviews_store[review_key]}