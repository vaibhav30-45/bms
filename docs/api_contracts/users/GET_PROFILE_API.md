# 📄 API Contract: Get User Profile

## Version: 1.0

## Owner: Backend Team (Anish - Lead)

---

## Endpoint Details

**Method:** GET
**URL:** `/api/users/profile`
**Content-Type:** `application/json`
**Authentication:** Required (JWT Bearer Token)

---

## 🔐 Request

### Headers

```
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

None

---

## ✅ Success Response (HTTP 200 OK)

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "userId": 1,
    "firstName": "Hardik",
    "lastName": "Patel",
    "email": "hardik.patel@example.com",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1998-05-12",
    "age": 27,
    "role": "CUSTOMER",
    "userStatus": "ACTIVE",
    "isActiveUser": true,
    "createdAt": "2026-02-15T10:15:30",
    "updatedAt": "2026-02-20T08:10:00",
    "lastLoginAt": "2026-02-23T09:40:10"
  },
  "timestamp": "2026-02-23T11:00:00"
}
```

---

## ❌ Error Responses

### 401 Unauthorized – Invalid or Missing Token

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "timestamp": "ISO datetime"
}
```

---

### 404 Not Found – User Not Found

```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "timestamp": "ISO datetime"
}
```

---

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An error occurred while fetching profile",
  "data": null,
  "timestamp": "ISO datetime"
}
```

---

## 📌 Business Rules

1. JWT token must be valid.
2. `userId` must be extracted from JWT claims.
3. Fetch user from database using `userId`.
4. If user not found → throw `ResourceNotFoundException`.
5. Password must NEVER be returned.
6. Only safe profile fields are exposed.

---

## 📊 HTTP Status Codes

| Status Code | Meaning      | When Used                    |
| ----------- | ------------ | ---------------------------- |
| 200         | OK           | Profile fetched successfully |
| 401         | Unauthorized | Invalid or missing JWT       |
| 404         | Not Found    | User not found               |
| 500         | Server Error | Unexpected failure           |

---

## 🗄 Database Impact

No modification.
Read-only operation.

---

## 🧪 Postman Testing Checklist

* [ ] Valid JWT returns 200
* [ ] Expired JWT returns 401
* [ ] Invalid JWT returns 401
* [ ] Deleted/non-existent user returns 404
* [ ] Password is NOT present in response
* [ ] Timestamp format is ISO
