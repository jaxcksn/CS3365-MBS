from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from ..util import DB, newId
from ..dependencies import auth, admin

router = APIRouter()



# ---------------------------------------------------------------------------- #
#                                    Models                                    #
# ---------------------------------------------------------------------------- #
class CreateMovieReviewRequest(BaseModel):
    movie_id: str
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    content: str = Field(..., max_length=250, description="Content about the movie (required)")
    

# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #

# HINT: The MovieShowing databases use a URL safe short ID instead of a UUID, so you need
# to use newId("short") to generate a new ID for a movie or showing.


@router.get("/movies")
async def movies(user_id: str = Depends(auth)):
    results = await DB.query(
        "SELECT id, title, release_date as showings_start, poster_url FROM MovieShowing"
    )
    return results



@router.post("/movie/review", status_code=200)
async def create_movie_review(
    review: CreateMovieReviewRequest,
    user_id: str = Depends(auth),
):
    # Check if the user has already reviewed the movie
    checkForReview = await DB.queryOne(
        "SELECT * FROM `Review` WHERE `user` = :user_id AND `movie` = :movie_id",
        {"user_id": user_id, "movie_id": review.movie_id},
    )
    
    # If a review already exists, return a conflict error
    if checkForReview is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this movie."
        )
    
    # Generate a unique ID for the new review
    new_review_id = newId("short")  # Use your newId function to generate a unique review ID

    # Insert the new review into the Review table
    await DB.execute(
        "INSERT INTO `Review` (`id`, `rating`, `text`, `created`, `user`, `movie`) "
        "VALUES (:id, :rating, :text, NOW(), :user, :movie)",
        {
            "id": new_review_id,
            "rating": review.rating,  # The rating submitted by the user
            "text": review.content,  # The review content
            "user": user_id,  # The user who is submitting the review
            "movie": review.movie_id,  # The movie being reviewed
        }
    )

    return {"message": "Review submitted successfully"}
