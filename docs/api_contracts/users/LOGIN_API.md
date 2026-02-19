# API Contract: User Login (JWT)

## Version: 1.0

## Last Updated: 2026-02-19

## Owner: Backend Team (Anish - Lead)

---

## Endpoint Details

**Method:** POST
**URL:** `/api/auth/login`
**Content-Type:** `application/json`
**Authentication:** Public (login)

---

## Request

### Headers

```
Content-Type: application/json
```

### Request Body Schema

```json
{
  "email": "string",      // Required, valid email, max 100 chars
  "password": "string"    // Required, min 8 chars
}
```

### Example Request

```json
{
  "email": "hardik.patel@example.com",
  "password": "SecurePass@123"
}
```

---

## Response

### Success Response (HTTP 200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string",        // JWT token
    "tokenType": "Bearer",
    "userId": 1,
    "firstName": "Hardik",
    "lastName": "Patel",
    "email": "hardik.patel@example.com",
    "role": "CUSTOMER",
    "expiresIn": 86400        // Token expiry in seconds
  },
  "timestamp": "ISO datetime"
}
```

---

## Error Responses

#### 401 Unauthorized – Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "timestamp": "ISO datetime"
}
```

#### 403 Forbidden – Account Locked After Failed Attempts

```json
{
  "success": false,
  "message": "Account is locked due to multiple failed login attempts",
  "data": null,
  "timestamp": "ISO datetime"
}
```

#### 400 Bad Request – Inactive Account

```json
{
  "success": false,
  "message": "Account is inactive. Please contact support",
  "data": null,
  "timestamp": "ISO datetime"
}
```

#### 400 Bad Request – Validation Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Invalid email format",
    "password": "Password must be between 8 and 100 characters"
  },
  "timestamp": "ISO datetime"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An error occurred: Database connection failed",
  "data": null,
  "timestamp": "ISO datetime"
}
```

---

## Validation Rules

| Field    | Type   | Required | Rules                      | Error Message                                   |
| -------- | ------ | -------- | -------------------------- | ----------------------------------------------- |
| email    | String | Yes      | Valid email, max 100 chars | "Invalid email format"                          |
| password | String | Yes      | Length 8-100               | "Password must be between 8 and 100 characters" |

---

## Business Rules

1. **User Authentication**

   * Email and password are mandatory.
   * Password is verified using BCrypt hashing. ([GitHub][1])

2. **Account Status Checks**

   * User must be active (`isActiveUser = true`).
   * Account is locked **after 5 failed login attempts**. ([GitHub][1])

3. **Failed Login Tracking**

   * On failed login, increment `failedLoginAttempts`.
   * Lock account if attempts >= 5.

4. **Successful Login Behavior**

   * Reset `failedLoginAttempts` to 0.
   * Update `lastLoginAt` timestamp.
   * Generate JWT token with:

     * Algorithm: HS256
     * Expiry: 24 hours (86400 seconds) ([GitHub][1])

5. **JWT Claims**

   * `userId`
   * `email`
   * `role`

6. **Security**

   * Password is compared via BCrypt.
   * Token is returned only on successful authentication.

---

## HTTP Status Codes

| Status Code | Meaning               | When Used                             |
| ----------- | --------------------- | ------------------------------------- |
| 200         | OK                    | Successful login                      |
| 400         | Bad Request           | Validation or inactive account errors |
| 401         | Unauthorized          | Invalid credentials                   |
| 403         | Forbidden             | Account locked due to failed attempts |
| 500         | Internal Server Error | Unexpected server errors              |

---

## Database Side Effects

* `users.lastLoginAt` is updated on successful login.
* `users.failedLoginAttempts` increments on failure.
* Account locks when `failedLoginAttempts` reaches 5.

---

## Security Considerations

* JWT Secret and expiration defined in **Constants**.
* Token expiry must be enforced by validation layer.
* Never send password back in response.
* Store `failedLoginAttempts` and lock fields securely.

---

## Postman Testing Checklist

* [ ] Valid credentials return 200 with JWT token
* [ ] Invalid email returns 401
* [ ] Invalid password returns 401
* [ ] After 5 wrong passwords, return 403 (account locked)
* [ ] Locked account returns 403
* [ ] Inactive user returns 400 with correct message
* [ ] JWT token expires after 24 hours
* [ ] `lastLoginAt` updates correctly on login
* [ ] `failedLoginAttempts` resets on successful login

---

## Notes for Frontend Team

1. **Send email and password only** in request.
2. **Token type:** Always prefix token with `Bearer ` in Authorization header for subsequent requests.
3. Handle error codes:

   * 401 → show “Incorrect credentials”
   * 403 → show “Account locked”
   * 400 → show inactive message
4. Store token in secure storage (HttpOnly cookies or secure storage).
