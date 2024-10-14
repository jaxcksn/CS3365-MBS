<!-- Generator: Widdershins v4.0.1 -->

<h1 id="mbs-backend">MBS Backend v0.0.1</h1>

This defines all the endpoints and routes that should exist in the API. This is meant to be a rough guide and may change as needed.

Base URLs:

- <a href="http://localhost:3030">http://localhost:3030</a>

- <a href="https://api.jaxcksn.dev">https://api.jaxcksn.dev</a>

# Authentication

- HTTP Authentication, scheme: bearer

<h1 id="mbs-backend-default">Default</h1>

## Login the User

<a id="opIduser-login"></a>

`POST /user/login`

Logs the user into the MBS, returning an access token and a refresh token.

> Body parameter

```json
{
  "username": "string",
  "password": "string"
}
```

<h3 id="login-the-user-parameters">Parameters</h3>

| Name       | In   | Type   | Required | Description                        |
| ---------- | ---- | ------ | -------- | ---------------------------------- |
| body       | body | object | false    | none                               |
| » username | body | string | true     | The username for the user          |
| » password | body | string | true     | The unhashed password for the user |

> Example responses

> 200 Response

```json
{
  "token": "string",
  "expires": "2019-08-24T14:15:22Z",
  "refresh": "string",
  "refresh_expires": "2019-08-24T14:15:22Z"
}
```

<h3 id="login-the-user-responses">Responses</h3>

| Status | Meaning                                                          | Description | Schema |
| ------ | ---------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | OK          | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Bad Request | None   |

<h3 id="login-the-user-responseschema">Response Schema</h3>

Status Code **200**

| Name              | Type              | Required | Restrictions | Description                             |
| ----------------- | ----------------- | -------- | ------------ | --------------------------------------- |
| » token           | string            | true     | none         | The access token                        |
| » expires         | string(date-time) | true     | none         | The expiration time of the access token |
| » refresh         | string            | true     | none         | The refresh token                       |
| » refresh_expires | string(date-time) | true     | none         | The time the refresh token expires      |

<aside class="success">
This operation does not require authentication
</aside>

## Register a User

<a id="opIduser-register"></a>

`POST /user/register`

Registers a user for the MBS

> Body parameter

```json
{
  "first_name": "string",
  "email": "user@example.com",
  "password": "pa$$word",
  "phone_number": "string",
  "address": "string",
  "state": "string",
  "zip": "string"
}
```

<h3 id="register-a-user-parameters">Parameters</h3>

| Name           | In   | Type             | Required | Description |
| -------------- | ---- | ---------------- | -------- | ----------- |
| body           | body | object           | false    | none        |
| » first_name   | body | string           | true     | none        |
| » email        | body | string(email)    | true     | none        |
| » password     | body | string(password) | true     | none        |
| » phone_number | body | string           | true     | none        |
| » address      | body | string           | true     | none        |
| » state        | body | string           | true     | none        |
| » zip          | body | string           | true     | none        |

> Example responses

> 201 Response

```json
{
  "token": "string",
  "expires": "string",
  "refresh": "string",
  "refresh_expires": "string"
}
```

<h3 id="register-a-user-responses">Responses</h3>

| Status | Meaning                                                          | Description                                                               | Schema |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Created                                                                   | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Bad Request: Shown if the request is bad.                                 | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)    | Conflict: Shown if an account with the same email address already exists. | None   |

<h3 id="register-a-user-responseschema">Response Schema</h3>

Status Code **201**

| Name              | Type   | Required | Restrictions | Description |
| ----------------- | ------ | -------- | ------------ | ----------- |
| » token           | string | true     | none         | none        |
| » expires         | string | true     | none         | none        |
| » refresh         | string | true     | none         | none        |
| » refresh_expires | string | true     | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

## Logout the User

<a id="opIduser-logout"></a>

`GET /user/logout`

Logs the user out of the MBS and expires all refresh tokens.

<h3 id="logout-the-user-responses">Responses</h3>

| Status | Meaning                                                          | Description | Schema |
| ------ | ---------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | OK          | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Bad Request | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Fetch the User's Bookings

<a id="opIdget-user-bookings"></a>

`GET /user/bookings`

Gets all the tickets for a user within the past year

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "date": "string",
    "time": "string",
    "seats": 0,
    "movie": {
      "title": "string",
      "poster_url": "string",
      "": "string"
    },
    "theater": "string",
    "cost": 0
  }
]
```

<h3 id="fetch-the-user's-bookings-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | OK          | Inline |

<h3 id="fetch-the-user's-bookings-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type   | Required | Restrictions | Description |
| -------------- | ------ | -------- | ------------ | ----------- |
| » id           | string | false    | none         | none        |
| » date         | string | false    | none         | none        |
| » time         | string | false    | none         | none        |
| » seats        | number | false    | none         | none        |
| » movie        | object | false    | none         | none        |
| »» title       | string | false    | none         | none        |
| »» poster_url  | string | false    | none         | none        |
| »» _anonymous_ | string | false    | none         | none        |
| » theater      | string | false    | none         | none        |
| » cost         | number | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Create a Booking

<a id="opIdcreate-booking"></a>

`POST /booking`

Creates a new booking and processes the payment

> Body parameter

```json
{
  "showing_id": "154fdb07-6445-4410-9b23-afa95ba469a4",
  "booking_date": "string",
  "booking_time": "string",
  "transaction_token": "string",
  "seats": 0,
  "theater": "string"
}
```

<h3 id="create-a-booking-parameters">Parameters</h3>

| Name                | In   | Type         | Required | Description                            |
| ------------------- | ---- | ------------ | -------- | -------------------------------------- |
| body                | body | object       | false    | none                                   |
| » showing_id        | body | string(uuid) | true     | none                                   |
| » booking_date      | body | string       | true     | none                                   |
| » booking_time      | body | string       | true     | none                                   |
| » transaction_token | body | string       | true     | Token generated by the payment gateway |
| » seats             | body | number       | true     | none                                   |
| » theater           | body | string       | true     | none                                   |

> Example responses

> 200 Response

```json
{
  "success": true,
  "charge": "string",
  "id": "string"
}
```

<h3 id="create-a-booking-responses">Responses</h3>

| Status | Meaning                                                                    | Description                                                                 | Schema |
| ------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                    | OK                                                                          | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)           | Bad Request: Created if it's not valid to book a ticket for a certain date. | None   |
| 500    | [Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1) | Internal Server Error                                                       | Inline |

<h3 id="create-a-booking-responseschema">Response Schema</h3>

Status Code **200**

| Name      | Type    | Required | Restrictions | Description                                 |
| --------- | ------- | -------- | ------------ | ------------------------------------------- |
| » success | boolean | true     | none         | none                                        |
| » charge  | string  | true     | none         | Charge information from the payment gateway |
| » id      | string  | true     | none         | none                                        |

Status Code **500**

| Name      | Type    | Required | Restrictions | Description                                  |
| --------- | ------- | -------- | ------------ | -------------------------------------------- |
| » success | boolean | true     | none         | none                                         |
| » error   | string  | true     | none         | Various information on why the charge failed |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Fetch a Booking

<a id="opIdget-booking"></a>

`GET /booking`

Gets a certain booking by ID

<h3 id="fetch-a-booking-parameters">Parameters</h3>

| Name | In    | Type   | Required | Description    |
| ---- | ----- | ------ | -------- | -------------- |
| id   | query | string | false    | The booking ID |

> Example responses

> 200 Response

```json
{
  "id": "string",
  "cost": 0,
  "movie": {
    "title": "string",
    "poster_url": "string",
    "id": "string"
  },
  "seats": 0,
  "date": "string",
  "time": "string",
  "theater": "string"
}
```

<h3 id="fetch-a-booking-responses">Responses</h3>

| Status | Meaning                                                        | Description | Schema |
| ------ | -------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | OK          | Inline |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Not Found   | None   |

<h3 id="fetch-a-booking-responseschema">Response Schema</h3>

Status Code **200**

| Name          | Type   | Required | Restrictions | Description |
| ------------- | ------ | -------- | ------------ | ----------- |
| » id          | string | true     | none         | none        |
| » cost        | number | true     | none         | none        |
| » movie       | object | true     | none         | none        |
| »» title      | string | true     | none         | none        |
| »» poster_url | string | true     | none         | none        |
| »» id         | string | true     | none         | none        |
| » seats       | number | true     | none         | none        |
| » date        | string | true     | none         | none        |
| » time        | string | true     | none         | none        |
| » theater     | string | true     | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Fetch Movie Information

<a id="opIdget-movie"></a>

`GET /movie/{id}`

Gets the information for a single movie

<h3 id="fetch-movie-information-parameters">Parameters</h3>

| Name | In   | Type   | Required | Description         |
| ---- | ---- | ------ | -------- | ------------------- |
| id   | path | string | true     | The ID of the movie |

> Example responses

> 200 Response

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "title": "string",
  "description": "string",
  "rating": 0,
  "runtime": "string",
  "cast": "string",
  "release_date": "2019-08-24",
  "poster_url": "http://example.com",
  "reviews": [
    {
      "published": "2019-08-24",
      "rating": 0,
      "content": "string"
    }
  ],
  "did_review": true
}
```

<h3 id="fetch-movie-information-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | OK          | Inline |

<h3 id="fetch-movie-information-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type         | Required | Restrictions | Description                                              |
| -------------- | ------------ | -------- | ------------ | -------------------------------------------------------- |
| » id           | string(uuid) | true     | none         | none                                                     |
| » title        | string       | true     | none         | none                                                     |
| » description  | string       | true     | none         | none                                                     |
| » rating       | number       | true     | none         | A rating from 0 to 5                                     |
| » runtime      | string       | true     | none         | Returned as runtime in minutes.                          |
| » cast         | string       | true     | none         | Comma seperated string of lead cast members              |
| » release_date | string(date) | true     | none         | none                                                     |
| » poster_url   | string(uri)  | true     | none         | The URL for the image of the poster                      |
| » reviews      | [object]     | false    | none         | none                                                     |
| »» published   | string(date) | true     | none         | none                                                     |
| »» rating      | number       | true     | none         | none                                                     |
| »» content     | string       | true     | none         | none                                                     |
| » did_review   | boolean      | true     | none         | Value is true if the user has already submited a review. |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Fetch Showing Information

<a id="opIdget-movie-showings"></a>

`GET /movie/{id}/showings`

Fetches all the available booking times and dates for a given movie.

<h3 id="fetch-showing-information-parameters">Parameters</h3>

| Name | In   | Type   | Required | Description         |
| ---- | ---- | ------ | -------- | ------------------- |
| id   | path | string | true     | The ID of the movie |

> Example responses

> 200 Response

```json
{
  "times": ["string"],
  "showings_end": "2019-08-24",
  "price": 0
}
```

<h3 id="fetch-showing-information-responses">Responses</h3>

| Status | Meaning                                                          | Description                                                              | Schema |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | OK                                                                       | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Bad Request: Will also be throw if the movie does not have any showings. | None   |

<h3 id="fetch-showing-information-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type         | Required | Restrictions | Description                                                           |
| -------------- | ------------ | -------- | ------------ | --------------------------------------------------------------------- |
| » times        | [string]     | true     | none         | Array of times that the movie is showing                              |
| » showings_end | string(date) | true     | none         | Used to determine how far the user should be allowed to book a movie. |
| » price        | number       | true     | none         | Price of a single ticket                                              |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Fetch All Movies

<a id="opIdget-movies"></a>

`GET /movies`

Returns an array of all the upcoming movies that have a showing in the database, used for the home screen.

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "title": "string",
    "poster_url": "string",
    "showings_start": "2019-08-24"
  }
]
```

<h3 id="fetch-all-movies-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | OK          | Inline |

<h3 id="fetch-all-movies-responseschema">Response Schema</h3>

Status Code **200**

| Name             | Type         | Required | Restrictions | Description                                                                           |
| ---------------- | ------------ | -------- | ------------ | ------------------------------------------------------------------------------------- |
| » id             | string       | true     | none         | none                                                                                  |
| » title          | string       | true     | none         | none                                                                                  |
| » poster_url     | string       | true     | none         | none                                                                                  |
| » showings_start | string(date) | true     | none         | This is used by the frontend to determine if the movie is considered upcoming or not. |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Create A Showing (Admin)

<a id="opIdcreate-showing"></a>

`POST /admin/showing`

Creates a new movie and showing.

> Body parameter

```json
{
  "title": "string",
  "description": "string",
  "showing_start": "2019-08-24",
  "showing_end": "2019-08-24",
  "price": 0,
  "poster_url": "string",
  "times": ["string"]
}
```

<h3 id="create-a-showing-(admin)-parameters">Parameters</h3>

| Name            | In   | Type         | Required | Description |
| --------------- | ---- | ------------ | -------- | ----------- |
| body            | body | object       | false    | none        |
| » title         | body | string       | true     | none        |
| » description   | body | string       | true     | none        |
| » showing_start | body | string(date) | true     | none        |
| » showing_end   | body | string(date) | true     | none        |
| » price         | body | number       | true     | none        |
| » poster_url    | body | string       | true     | none        |
| » times         | body | [string]     | true     | none        |

<h3 id="create-a-showing-(admin)-responses">Responses</h3>

| Status | Meaning                                                        | Description | Schema |
| ------ | -------------------------------------------------------------- | ----------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)   | Created     | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3) | Forbidden   | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Modify a Showing (Admin)

<a id="opIdpatch-showing"></a>

`PATCH /admin/showing`

Modifies a showing/movie.

> Body parameter

```json
{
  "title": "string",
  "description": "string",
  "showing_start": "string",
  "showing_end": "string",
  "price": 0,
  "poster_url": "string",
  "times": ["string"]
}
```

<h3 id="modify-a-showing-(admin)-parameters">Parameters</h3>

| Name            | In    | Type     | Required | Description                                                          |
| --------------- | ----- | -------- | -------- | -------------------------------------------------------------------- |
| id              | query | string   | false    | The ID of the showing to modify                                      |
| body            | body  | object   | false    | If a property in the body is left blank, the API will not modify it. |
| » title         | body  | string   | false    | none                                                                 |
| » description   | body  | string   | false    | none                                                                 |
| » showing_start | body  | string   | false    | none                                                                 |
| » showing_end   | body  | string   | false    | none                                                                 |
| » price         | body  | number   | false    | none                                                                 |
| » poster_url    | body  | string   | false    | none                                                                 |
| » times         | body  | [string] | false    | none                                                                 |

<h3 id="modify-a-showing-(admin)-responses">Responses</h3>

| Status | Meaning                                                          | Description | Schema |
| ------ | ---------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | OK          | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Bad Request | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Forbidden   | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Delete a Showing (Admin)

<a id="opIddelete-showing"></a>

`DELETE /admin/showing`

Removes a showing/movie

<h3 id="delete-a-showing-(admin)-parameters">Parameters</h3>

| Name | In    | Type   | Required | Description                   |
| ---- | ----- | ------ | -------- | ----------------------------- |
| id   | query | string | false    | The ID of the movie to delete |

<h3 id="delete-a-showing-(admin)-responses">Responses</h3>

| Status | Meaning                                                          | Description | Schema |
| ------ | ---------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | OK          | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Bad Request | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Forbidden   | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>

## Fetch All Showings (Admin)

<a id="opIdget-admin-showings"></a>

`GET /admin/showings`

Gets all the showings for an admin

> Example responses

> 200 Response

```json
[
  {
    "movie": {
      "title": "string",
      "poster_url": "string"
    },
    "id": "string",
    "release_date": "string",
    "price": 0
  }
]
```

<h3 id="fetch-all-showings-(admin)-responses">Responses</h3>

| Status | Meaning                                                        | Description | Schema |
| ------ | -------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | OK          | Inline |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3) | Forbidden   | None   |

<h3 id="fetch-all-showings-(admin)-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type   | Required | Restrictions | Description |
| -------------- | ------ | -------- | ------------ | ----------- |
| » movie        | object | true     | none         | none        |
| »» title       | string | true     | none         | none        |
| »» poster_url  | string | true     | none         | none        |
| » id           | string | true     | none         | none        |
| » release_date | string | true     | none         | none        |
| » price        | number | true     | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BEARER
</aside>
