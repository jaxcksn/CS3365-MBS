from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from ..util import DB, newId
from ..dependencies import auth, admin
import os

router = APIRouter()

import stripe

hasStripe = False
if os.getenv("STRIPE_API") is not None:
    hasStripe = True
    stripe.api_key = os.getenv("STRIPE_API")


# ---------------------------------------------------------------------------- #
#                                    Models                                    #
# ---------------------------------------------------------------------------- #


class OrderInfo(BaseModel):
    movieId: str
    movieName: str
    theater: str
    time: str
    date: str
    quantity: int


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@router.post("/payment/intent")
async def create_payment_intent(body: OrderInfo, user_id: str = Depends(auth)):
    if hasStripe == False:
        print("Stripe API not configured! Payment processing will not work properly.")
        raise HTTPException(status_code=501, detail="Stripe API not configured")
    result = await DB.queryOne(
        "SELECT * FROM `Showing` WHERE `movie` = :movieId", {"movieId": body.movieId}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Movie not found")
    price = round(result["seat_price"] * 100) * int(body.quantity)
    try:
        intent = stripe.PaymentIntent.create(
            amount=price,
            currency="usd",
            payment_method_types=["card"],
            metadata={
                "user_id": user_id,
                "movie_id": body.movieId,
                "showing_id": result["id"],
                "movie_name": body.movieName,
                "theater": body.theater,
                "time": body.time,
                "date": body.date,
                "quantity": body.quantity,
            },
        )
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=501, detail=str(e))
    return {"client_secret": intent.client_secret}


@router.post("/payment/webhook")
async def stripe_webhook(request: Request):
    if hasStripe == False:
        raise HTTPException(status_code=501, detail="Stripe API not configured")
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        transactionId = newId()
        tDateTime = datetime.fromtimestamp(payment_intent["created"]).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        try:
            await DB.execute(
                """
                INSERT INTO `Transaction`(`id`, `amount`, `timestamp`, `method`, `billing_address`, `was_successful`)
                VALUES(:id, :amount, :timestamp, :method, :billing_address, :was_successful)
                """,
                {
                    "id": transactionId,
                    "amount": payment_intent["amount"] / 100,
                    "timestamp": tDateTime,
                    "method": "Stripe",
                    "billing_address": "N/A",
                    "was_successful": True,
                },
            )
            metadata = payment_intent["metadata"]
            await DB.execute(
                """
                INSERT INTO `Ticket`(`id`, `showing`, `user`, `quantity`, `date`, `time`, `theater`, `transaction`)
                VALUES(:id, :showing, :user, :quantity, :date, :time, :theater, :transaction)
                """,
                {
                    "id": newId(),
                    "showing": metadata["showing_id"],
                    "user": metadata["user_id"],
                    "quantity": metadata["quantity"],
                    "date": datetime.strptime(
                        metadata["date"], "%a, %d %b %Y %H:%M:%S %Z"
                    ).strftime("%Y-%m-%d"),
                    "time": metadata["time"],
                    "theater": metadata["theater"],
                    "transaction": transactionId,
                },
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return {"status": "success"}
