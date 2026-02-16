# API Contract: User Registration

## Version: 1.0
## Last Updated: 2026-02-16
## Owner: Backend Team (Hardik - Lead)

---

## Endpoint Details

**Method:** POST  
**URL:** `/api/users/register`  
**Content-Type:** `application/json`  
**Authentication:** Not required (Public endpoint)

---

## Request

### Headers
```
Content-Type: application/json
```

### Request Body Schema
```json
{
  "firstName": "string",      // Required, 2-50 chars, letters only
  "lastName": "string",       // Required, 2-50 chars, letters only
  "email": "string",          // Required, valid email, max 100 chars
  "phoneNumber": "string",    // Required, 10 digits, starts with 6-9
  "dateOfBirth": "YYYY-MM-DD", // Required, ISO date format, age >= 18
  "password": "string",       // Required, min 8 chars, must contain uppercase, lowercase, digit, special char
  "address": "string",        // Required, 10-200 chars
  "city": "string",           // Required, 2-50 chars
  "state": "string",          // Required, 2-50 chars
  "pinCode": "string"         // Required, 6 digits, cannot start with 0
}
```

### Example Request
```json
{
  "firstName": "Hardik",
  "lastName": "Patel",
  "email": "hardik.patel@example.com",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1998-05-15",
  "password": "SecurePass@123",
  "address": "123 MG Road, Koramangala",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pinCode": "560034"
}
```

---

## Response

### Success Response (HTTP 201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "firstName": "Hardik",
    "lastName": "Patel",
    "email": "hardik.patel@example.com",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1998-05-15",
    "address": "123 MG Road, Koramangala",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pinCode": "560034",
    "userStatus": "REGISTERED",
    "isActiveUser": true,
    "registeredAt": "2026-02-16T16:30:45.123456",
    "message": "User registered successfully"
  },
  "timestamp": "2026-02-16T16:30:45.123456"
}
```

### Error Responses

#### 400 Bad Request - Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "firstName": "First name is required",
    "email": "Invalid email format",
    "phoneNumber": "Invalid Indian phone number. Must be 10 digits starting with 6-9",
    "password": "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
  },
  "timestamp": "2026-02-16T16:30:45.123456"
}
```

#### 409 Conflict - Duplicate Email
```json
{
  "success": false,
  "message": "Email already registered",
  "data": null,
  "timestamp": "2026-02-16T16:30:45.123456"
}
```

#### 409 Conflict - Duplicate Phone
```json
{
  "success": false,
  "message": "Phone number already registered",
  "data": null,
  "timestamp": "2026-02-16T16:30:45.123456"
}
```

#### 400 Bad Request - Age Validation
```json
{
  "success": false,
  "message": "Must be at least 18 years old",
  "data": null,
  "timestamp": "2026-02-16T16:30:45.123456"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred: Database connection failed",
  "data": null,
  "timestamp": "2026-02-16T16:30:45.123456"
}
```

---

## Validation Rules

| Field | Type | Required | Min Length | Max Length | Pattern/Rule | Error Message |
|-------|------|----------|------------|------------|--------------|---------------|
| firstName | String | Yes | 2 | 50 | Letters only | "First name should contain only letters" |
| lastName | String | Yes | 2 | 50 | Letters only | "Last name should contain only letters" |
| email | String | Yes | - | 100 | Valid email | "Invalid email format" |
| phoneNumber | String | Yes | 10 | 10 | Starts with 6-9 | "Invalid Indian phone number. Must be 10 digits starting with 6-9" |
| dateOfBirth | Date | Yes | - | - | Age >= 18 | "Must be at least 18 years old" |
| password | String | Yes | 8 | 100 | 1 upper, 1 lower, 1 digit, 1 special | "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character" |
| address | String | Yes | 10 | 200 | - | "Address must be between 10 and 200 characters" |
| city | String | Yes | 2 | 50 | - | "City must be between 2 and 50 characters" |
| state | String | Yes | 2 | 50 | - | "State must be between 2 and 50 characters" |
| pinCode | String | Yes | 6 | 6 | Cannot start with 0 | "Invalid PIN code. Must be 6 digits and cannot start with 0" |

---

## Business Rules

1. **Email Uniqueness:** Email must be unique across all users
2. **Phone Uniqueness:** Phone number must be unique across all users
3. **Age Requirement:** User must be at least 18 years old
4. **Password Security:** Password is hashed using BCrypt before storage
5. **Default Values:**
   - `userStatus`: REGISTERED
   - `isActiveUser`: true
   - `role`: CUSTOMER
   - `failedLoginAttempts`: 0
6. **Address Creation:** A permanent address is automatically created and linked to the user

---

## HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 201 | Created | User successfully registered |
| 400 | Bad Request | Validation errors or age below 18 |
| 409 | Conflict | Duplicate email or phone number |
| 500 | Internal Server Error | Unexpected server error |

---

## Database Changes

### Tables Affected
- `users` - New record inserted
- `addresses` - New permanent address record inserted

### Transaction Behavior
- Both user and address are created in a single transaction
- If address creation fails, user creation is rolled back
- If user creation fails, nothing is saved

---

## Testing Checklist

- [ ] Valid registration succeeds with 201
- [ ] Missing required fields returns 400 with field errors
- [ ] Invalid email format returns 400
- [ ] Invalid phone format returns 400
- [ ] Weak password returns 400
- [ ] Age below 18 returns 400
- [ ] Duplicate email returns 409
- [ ] Duplicate phone returns 409
- [ ] Password is hashed in database (not plain text)
- [ ] Address is created and linked to user
- [ ] Transaction rollback works on failure

---

## Notes for Frontend Team

1. **Password Confirmation:** Frontend should validate that password and confirmPassword match before calling API
2. **Date Format:** Send dateOfBirth in `YYYY-MM-DD` format
3. **Case Sensitivity:** Email is case-insensitive for duplicate checking
4. **Phone Number:** Send only digits, no spaces or special characters
5. **Error Display:** Show field-level errors under respective input fields
6. **Success Action:** After 201 response, redirect user to login page
7. **Loading State:** Show loading indicator during API call

---

## Postman Collection

Available at: `https://anish-jaiswal-4444-5831887.postman.co/workspace/anish-jaiswal's-Workspace~772abdd9-cf66-4926-8c0c-5d240041c171/collection/47443963-fffdffd3-d74e-4c5b-b6f5-3ed6e01be0e0?action=share&creator=47443963`

---