## Endpoint: POST api/v1/users/register

### Description
This endpoint allows a new user to register. It requires the user's details and validates the input data. If the registration is successful, a new user is created, and a JWT token is returned along with the user details.

### Request Body (JSON)
The body of the request should contain the following fields:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.1222@example.com",
    "dob": "1990-01-01",
    "userType": "Customer",
    "contactNumber": 9555450842,
    "password": "hashedPassword123"
}
```

### Validation Rules
- `firstName`: Required and should not be empty.
- `lastName`: Required and should not be empty.
- `email`: Required and must be a valid email format.
- `password`: Required and must be at least 6 characters long.
- `dob`: Required and should be a valid date in YYYY-MM-DD format.
- `userType`: Required (e.g., "Customer", "Admin").
- `contactNumber`: Required and must be a valid phone number.

### Responses

#### Success (201 - Created)
If the user is successfully registered, the response will contain the token (JWT token) for authentication and the user object with the newly registered user’s information.
```json
{
    "token": "jwt.token.here",
    "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.1222@example.com",
        "dob": "1990-01-01",
        "userType": "Customer",
        "contactNumber": 9555450842
    }
}
```

#### Bad Request (400 - Validation Error)
If any of the input fields fail validation, the response will be a 400 error with an array of error messages indicating what went wrong.
```json
{
    "errors": [
        { "msg": "First name is required" },
        { "msg": "Email is invalid" }
    ]
}
```

#### Bad Request (400 - User Already Exists)
If a user with the same email address already exists in the system, the response will be a 400 error indicating that the user already exists.
```json
{
    "message": "User with this email already exists"
}
```

#### Server Error (500 - Internal Error)
If an internal error occurs during the registration process (e.g., database issues), the response will be a 500 error with a general error message.
```json
{
    "message": "Detailed error message (for internal debugging)"
}
```

### Example Request
```http
POST /users/register
```
Request Body:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.1222@example.com",
    "dob": "1990-01-01",
    "userType": "Customer",
    "contactNumber": 9555450842,
    "password": "hashedPassword123"
}
```

### Validation Logic (for internal reference)
- `firstName` should not be empty.
- `lastName` should not be empty.
- `email` must be a valid email.
- `password` must be at least 6 characters long.
- `dob` should not be empty and should be in the format YYYY-MM-DD.
- `userType` should not be empty.
- `contactNumber` must be a valid mobile phone number.

### Error Handling
- If there are any validation errors (like missing or invalid fields), the system will respond with a 400 status and a list of the error messages.
- If another user uses the email, the system will respond with a 400 status and the message "User with this email already exists."
- For unexpected errors (e.g., database errors), the system will respond with a 500 status and a generic error message.

## Endpoint: POST api/v1/users/login

### Description
This endpoint allows a registered user to log in to the application using their email and password. The server will validate the user's credentials, and if successful, a JWT token will be generated and returned for authentication, along with the user details.

### Request Body (JSON)
The body of the request should contain the following fields:
```json
{
    "email": "john.1222@example.com",
    "password": "hashedPassword123"
}
```

### Validation Rules
- `email`: Required and must be a valid email format.
- `password`: Required and must be at least 6 characters long.

### Response Codes and Examples

#### Success (200 - OK)
If the login is successful, the response will include a JWT token for authentication along with the user's details.
```json
{
    "token": "jwt.token.here",
    "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.1222@example.com",
        "dob": "1990-01-01",
        "userType": "Customer",
        "contactNumber": 9555450842
    }
}
```

#### Bad Request (400 - Validation Error)
If the email or password fails validation (e.g., invalid format or too short), the response will contain an array of error messages.
```json
{
    "errors": [
        { "msg": "Invalid Email" },
        { "msg": "Password must be at least 6 characters long" }
    ]
}
```

#### Unauthorized (401 - Invalid Credentials)
If the email does not match any user or the password is incorrect, the response will indicate an authentication failure.
```json
{
    "message": "Invalid email or password"
}
```

#### Server Error (500 - Internal Error)
If any internal error occurs during the login process (e.g., database query fails), the response will return a generic error message.
```json
{
    "message": "An error occurred while processing your request."
}
```

### Example Request
```http
POST /users/login
```
Request Body:
```json
{
    "email": "john.1222@example.com",
    "password": "hashedPassword123"
}
```

### Validation Logic (for internal reference)
- `email`: Must be a valid email address (e.g., user@example.com).
    - Validation: `body('email').isEmail().withMessage('Invalid Email')`
- `password`: Must be at least 6 characters long.
    - Validation: `body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')`

## Endpoint: POST api/v1/users/logout

### Description
This endpoint allows a user to log out by invalidating their JWT token. When the user logs out, their token is added to a blocked tokens list, preventing it from being used for future requests.

### Request Headers
- `Authorization` (required): The JWT token is passed in the Authorization header in the format: `Bearer <token>`

### Response Codes and Examples

#### Success (200 - OK)
If the logout is successful, the response will confirm the user has logged out.
```json
{
    "message": "Logged out Success"
}
```

#### Server Error (500 - Internal Error)
If any internal error occurs during the logout process, such as issues saving the blocked token, the response will return a generic error message.
```json
{
    "message": "Detailed error message (for internal debugging)"
}
```

#### Note
If the token is already blocked then while authorization it returns:
```json
{
    "message": "Unauthorized"
}
```
## Endpoint: GET api/v1/maps/get-coordinates

### Description
Retrieves latitude and longitude for a given address.

### Request Parameters
- `address` (query, **required**): The location to fetch coordinates for.

### Responses

#### Success (200 - OK)
Returns coordinates for the provided address.
```json
{
    "ltd": 28.69508,
    "lng": 77.45323
}
```

#### Bad Request (400 - Validation Error)
If the address query is missing or empty.
```json
{
    "errors": [
        {
            "type": "field",
            "value": "",
            "msg": "Invalid value",
            "path": "address",
            "location": "query"
        }
    ]
}
```

### Example Request
```http
GET /api/v1/maps/get-coordinates?address=ayz
```

## Endpoint: GET api/v1/maps/get-distance-time

### Description
Calculates the distance and estimated travel time between an origin and a destination.

### Request Parameters
- `origin` (query, **required**): The starting location in `latitude, longitude` format.
- `destination` (query, **required**): The target location in `latitude ,longitude` format.

### Responses

#### Success (200 - OK)
Returns the distance and estimated travel time.
```json
{
    "distance": "100 km",
    "time": "1h 30m"
}
```

#### Bad Request (400 - Missing Parameters)
If origin or destination is missing.

#### Server Error (500 - Internal Error)
If an internal server error occurs.
```json
{
    "message": "Internal server error"
}
```

### Example Request
```http
GET /api/v1/maps/get-distance-time?origin=28.69508,77.45323&destination=28.69508,78.45323
```

## Endpoint: GET api/v1/maps/get-suggestions

### Description
Provides location suggestions based on partial user input.

### Request Parameters
- `input` (query, **required**): The search term for location suggestions.

### Responses

#### Success (200 - OK)
Returns an array of suggested locations.
```json
[
    "Lucknow, India",
    "Lucknow, Uttar Pradesh",
    "Lucknow Cantonment, India"
]
```

#### Server Error (500 - Internal Error)
If an internal server error occurs.
```json
{
    "message": "Internal server error",
    "err": {}
}
```

### Example Request
```http
GET /api/v1/maps/get-suggestions?input=lucknow
```

## Endpoint: GET api/v1/maps/get-active-users-within-radius

### Description
Fetches a list of active users within a specified radius from a given latitude and longitude.

### Request Parameters
- `latitude` (query, **required**): The latitude of the center point.
- `longitude` (query, **required**): The longitude of the center point.
- `radius` (query, **required**): The search radius (in meters or kilometers, depending on implementation).

### Responses

#### Success (200 - OK)
Returns an array of active users within the given radius.
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "latitude": 28.7041,
        "longitude": 77.1025
    },
    {
        "id": 2,
        "name": "Jane Smith",
        "latitude": 28.7055,
        "longitude": 77.1030
    }
]
```

#### Server Error (500 - Internal Error)
If an internal server error occurs.

