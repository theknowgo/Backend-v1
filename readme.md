# 🚀 API Documentation

Welcome to the **KnowGo Backend API** documentation! Here, you'll find all the details you need to interact with our API endpoints effectively. Let's get started! 🎉

---

## 🧑‍💻 User Routes

### 🔐 Register User
**POST** `/register`  
Create a new account and join the platform.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "is18plus": "boolean",
  "userType": "string",
  "contactNumber": "string",
  "hashedOTP": "string",
  "inputOTP": "string"
}
```

**Responses:**
- `201 Created`: 🎉 User registered successfully.
- `400 Bad Request`: ⚠️ Validation errors or user already exists.
- `401 Unauthorized`: ❌ Invalid OTP.

---

### 🔑 Login User
**POST** `/login`  
Access your account with valid credentials.

**Request Body:**
```json
{
  "contactNumber": "string",
  "hashedOTP": "string",
  "inputOTP": "string"
}
```

**Responses:**
- `200 OK`: ✅ Logged in successfully.
- `401 Unauthorized`: ❌ Invalid OTP or user does not exist.
- `403 Forbidden`: 🚫 User is banned.

---

### 🚪 Logout User
**GET** `/logout`  
Securely log out of your account.

**Headers:**
- `Authorization`: Bearer token.

**Responses:**
- `200 OK`: 👋 Logged out successfully.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### ⭐ Submit Rating
**POST** `/rating`  
Rate your experience with a partner.

**Request Body:**
```json
{
  "partnerId": "string",
  "rating": "number"
}
```

**Responses:**
- `200 OK`: 🌟 Rating submitted successfully.
- `404 Not Found`: ❌ Partner not found.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 📍 Set Default Address
**PATCH** `/address/:userId/default`  
Choose your default address for convenience.

**Headers:**
- `Authorization`: Bearer token.

**Request Body:**
```json
{
  "addressId": "string"
}
```

**Responses:**
- `200 OK`: 🏠 Default address set successfully.
- `404 Not Found`: ❌ User not found.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 🖼️ Set Profile Picture
**PATCH** `/set-profile-picture`  
Upload a profile picture to personalize your account.

**Headers:**
- `Authorization`: Bearer token.  
- `Content-Type`: `multipart/form-data`.

**Request Body:**
- `image` (file): Profile picture file.

**Responses:**
- `200 OK`: 🖼️ Profile picture updated successfully.
- `400 Bad Request`: ⚠️ No image uploaded.
- `404 Not Found`: ❌ User not found.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 🔍 Find Localmate Number
**GET** `/find-localmate-number`  
Discover the nearest localmate number.

**Headers:**
- `Authorization`: Bearer token.

**Responses:**
- `200 OK`: 📞 Localmate number retrieved successfully.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 📲 Send OTP
**POST** `/sendotp`  
Receive a one-time password (OTP) on your contact number.

**Responses:**
- `200 OK`: 📩 OTP sent successfully.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### ✅ Verify OTP
**POST** `/verifyotp`  
Confirm your OTP to proceed.

**Request Body:**
```json
{
  "contactNumber": "string",
  "inputOTP": "string"
}
```

**Responses:**
- `200 OK`: ✅ OTP verified successfully.
- `401 Unauthorized`: ❌ Invalid OTP.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

## 🆘 Help and Support Routes

### 🆘 Create Help Request
**POST** `/help`  
Submit a help request for assistance.

**Request Body:**
```json
{
  "userID": "string",
  "title": "string",
  "description": "string"
}
```

**Responses:**
- `201 Created`: 🆘 Help request created successfully.
- `400 Bad Request`: ⚠️ Validation errors.

---

### 📋 Get All Help Requests
**GET** `/help`  
View all submitted help requests.

**Responses:**
- `200 OK`: 📋 Help requests retrieved successfully.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 🔍 Get Help Request by ID
**GET** `/help/:id`  
Retrieve details of a specific help request.

**Responses:**
- `200 OK`: 🔍 Help request retrieved successfully.
- `404 Not Found`: ❌ Help request not found.

---

### ✏️ Update Help Request
**PUT** `/help/:id`  
Modify an existing help request.

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Responses:**
- `200 OK`: ✏️ Help request updated successfully.
- `404 Not Found`: ❌ Help request not found.
- `400 Bad Request`: ⚠️ Validation errors.

---

### 🛑 Close Help Request
**PATCH** `/help/:id`  
Mark a help request as resolved.

**Responses:**
- `200 OK`: 🛑 Help request closed successfully.
- `404 Not Found`: ❌ Help request not found.

---

### 👤 Get Help Requests by User
**GET** `/help/users/:userid`  
View all help requests submitted by a specific user.

**Responses:**
- `200 OK`: 👤 Help requests retrieved successfully.
- `404 Not Found`: ❌ User not found.

---

## 💰 Price Routes

### 💵 Service and Product Price
**GET** `/service-and-product-price`  
Calculate the total cost of services and products.

**Query Parameters:**
- `distance` (number): Distance in kilometers.  
- `timeTaken` (number): Time taken in minutes.  
- `videoCallSeconds` (number): Duration of the video call in seconds.

**Responses:**
- `200 OK`: 💵 Total cost calculated successfully.
- `400 Bad Request`: ⚠️ Missing or invalid query parameters.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### ⏳ Capped Time for Information
**GET** `/capped-time-for-info`  
Calculate the cost for capped time-based services.

**Query Parameters:**
- `timeInSeconds` (number): Time in seconds.

**Responses:**
- `200 OK`: ⏳ Total cost calculated successfully.
- `400 Bad Request`: ⚠️ Missing or invalid query parameters.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### ⏱️ Incremental Time for Information
**GET** `/capped-time-for-info-incremental`  
Calculate the cost for incremental time-based services.

**Query Parameters:**
- `timeInSeconds` (number): Time in seconds.

**Responses:**
- `200 OK`: ⏱️ Total cost calculated successfully.
- `400 Bad Request`: ⚠️ Missing or invalid query parameters.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 🔍 Quick Lookup Cost
**GET** `/quick-lockup-cost`  
Calculate the cost for quick lookup services.

**Query Parameters:**
- `distance` (number): Distance in kilometers.  
- `videoCallSeconds` (number): Duration of the video call in seconds.

**Responses:**
- `200 OK`: 🔍 Total cost calculated successfully.
- `400 Bad Request`: ⚠️ Missing or invalid query parameters.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

## 🗺️ Map Routes

### 📍 Get Coordinates
**GET** `/get-coordinates`  
Retrieve the coordinates for a given address.

**Headers:**
- `Authorization`: Bearer token.

**Query Parameters:**
- `address` (string): The address to retrieve coordinates for.

**Responses:**
- `200 OK`: 📍 Coordinates found successfully.
- `400 Bad Request`: ⚠️ Validation error or missing query parameter.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 🚗 Get Distance and Time
**GET** `/get-distance-time`  
Calculate the distance and time between two locations.

**Headers:**
- `Authorization`: Bearer token.

**Query Parameters:**
- `origin` (string): The starting location.
- `destination` (string): The destination location.

**Responses:**
- `200 OK`: 🚗 Distance and time calculated successfully.
- `400 Bad Request`: ⚠️ Validation error or missing query parameters.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 🔎 Get AutoComplete Suggestions
**GET** `/get-suggestions`  
Get autocomplete suggestions for a given input.

**Headers:**
- `Authorization`: Bearer token.

**Query Parameters:**
- `input` (string): The input string to get suggestions for.

**Responses:**
- `200 OK`: 🔎 Suggestions retrieved successfully.
- `400 Bad Request`: ⚠️ Validation error or missing query parameter.
- `500 Internal Server Error`: ⚠️ Something went wrong.

---

### 🌍 Get Active Users Within Radius
**GET** `/get-active-users-within-radius`  
Find active users near a specific location.

**Headers:**
- `Authorization`: Bearer token.

**Query Parameters:**
- `latitude` (number): Latitude of the location.
- `longitude` (number): Longitude of the location.
- `radius` (number): Radius in kilometers.

**Responses:**
- `200 OK`: 🌍 Active users found successfully.
- `400 Bad Request`: ⚠️ Validation error or missing query parameters.
- `500 Internal Server Error`: ⚠️ Something went wrong.