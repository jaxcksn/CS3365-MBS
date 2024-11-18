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
    new_review_id = newId()  # Use your newId function to generate a unique review ID

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

 
@router.get("/movie/{id}", status_code=200)
async def fetchMovieInformation(
    _id: str
):
    
    

    #get the MovieBooking entry and check for error
    showingData = await DB.queryOne(
        "SELECT * FROM `MovieShowing`       \
        WHERE `id` = :_id",
        {"_id": _id}
    )

    #if no data, then return error
    if showingData is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provided ID doesn't match any database records"
        )
    
    #get the MovieBooking entry and check for error
    reviews = await DB.query(
        "SELECT * FROM `Review`       \
        WHERE `id` = :_id",
        {"_id": _id}
    )

    #for did_review field
    didReview = True
    if reviews is None:
        didReview = False

    #format data for frontend 
    result = {
        "id": showingData[0],
        "title": showingData[1],
        "description": showingData[2],
        "rating": showingData[4],
        "runtime": showingData[3],
        "cast": showingData[5],
        "release_date": showingData[6],
        "poster_url": showingData[7],
        "reviews": [
            {"published": review[0], "rating": review[1], "text": review[2]}
            for review in reviews
        ],
        "did_review": didReview,
        "showing": {
            "start_date": showingData[8],
            "end_date": showingData[9],
            "show_times": [
                {"string": data}
                for data in showingData[10]
            ],
    "showing_id": showingData[11],
    "price": 0
  }
}
    return (result)