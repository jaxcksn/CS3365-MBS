from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
import json
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
    content: str = Field(
        ..., max_length=250, description="Content about the movie (required)"
    )


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
            detail="You have already reviewed this movie.",
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
        },
    )

    return {"message": "Review submitted successfully"}


"""
CREATE TABLE  IF NOT EXISTS `Review`(
    `id` CHAR(36) NOT NULL,
    `rating` TINYINT NOT NULL,
    `text` TEXT NOT NULL,
    `created` TIMESTAMP NOT NULL,
    `user` CHAR(36) NOT NULL,
    `movie` CHAR(9) NOT NULL,
    PRIMARY KEY(`id`)
);
"""


@router.get("/movie/{id}", status_code=200)
async def fetchMovieInformation(id: str, user_id: str = Depends(auth)):
    movie = await DB.queryOne(
        """
        SELECT m.*, (SELECT AVG(r.rating) FROM `Review` r WHERE r.movie = m.id) AS average_rating 
        FROM `MovieShowing` m WHERE m.`id` = :id
        """,
        {"id": id},
    )

    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    reviewsQuery = await DB.query(
        """
        SELECT * FROM `Review` WHERE `movie` = :id                             
        """,
        {"id": id},
    )

    has_user_review = await DB.queryOne(
        """
    SELECT * FROM `Review` WHERE `movie` = :id AND `user` = :user_id
    """,
        {"id": id, "user_id": user_id},
    )

    reviews = []
    for review in reviewsQuery:
        reviews.append(
            {
                "rating": review["rating"],
                "text": review["text"],
                "published": review["created"],
            }
        )
    return {
        "id": movie["id"],
        "title": movie["title"],
        "description": movie["description"],
        "rating": movie["average_rating"],
        "runtime": movie["runtime"],
        "cast": movie["cast"],
        "release_date": movie["release_date"],
        "poster_url": movie["poster_url"],
        "did_review": has_user_review is not None,
        "reviews": reviews,
        "showing": {
            "start_date": movie["start_date"],
            "end_date": movie["end_date"],
            "show_times": json.loads(movie["times"]),
            "showing_id": movie["id"],
            "price": movie["seat_price"],
        },
    }
