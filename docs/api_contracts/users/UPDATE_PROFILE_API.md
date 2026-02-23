# 📄 API Contract: Update User Profile (As per Issue #27)

## Version: 1.0

## Owner: Backend Team (Anish – Lead)

---

## 🛠 Endpoint Details

**Method:** PUT
**URL:** `/api/users/profile`
**Content-Type:** `application/json`
**Authentication:** Required (JWT Bearer Token)

---

## 🔐 Request

### Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body (all fields optional)

```json
{
  "firstName": "Hardik",
  "lastName": "Patel",
  "address": "456 New Address Street",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pinCode": "560034"
}
```

---

## ✅ Success Response (HTTP 200 OK)

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "userId": 1,
    "firstName": "Hardik",
    "lastName": "Patel",
    "email": "hardik.patel@example.com",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1998-05-15",
    "age": 27,
    "address": "456 New Address Street",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pinCode": "560034",
    "userStatus": "REGISTERED",
    "isActiveUser": true,
    "registeredAt": "2026-02-15T10:30:00"
  },
  "timestamp": "ISO datetime"
}
```
---

## ❌ Error Responses

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

## 📌 Validation Rules (if provided)

| Field     | Type   | Rules                         |
| --------- | ------ | ----------------------------- |
| firstName | String | 2-50 characters, letters only |
| lastName  | String | 2-50 characters, letters only |
| address   | String | 10-200 characters             |
| city      | String | 2-50 characters               |
| state     | String | 2-50 characters               |
| pinCode   | String | 6 digits, cannot start with 0 |

---

## 🧠 Business Rules

1. Extract `userId` from JWT token.([GitHub][1])
2. Fetch user; if not found → 404.([GitHub][1])
3. Only update fields present in request.([GitHub][1])
4. Fields **NOT allowed to update**:

   * `email`
   * `phoneNumber`
   * `password`
   * `userStatus`
   * `role`
   * `isActiveUser`
   * `userId`([GitHub][1])
5. For address fields:

   * Update existing address record if exists.
   * If no address exists, create a new address.([GitHub][1])

---

## 📊 HTTP Status Codes

| Status Code | Meaning                      |
| ----------- | ---------------------------- |
| 200         | Profile updated              |
| 404         | User not found               |
| 400         | Validation errors (optional) |
| 401         | Unauthorized (invalid token) |
| 500         | Unexpected server error      |

---

## 🧪 Postman Testing Checklist

* [ ] Update only firstName (works)
* [ ] Update only lastName (works)
* [ ] Update only address fields (works)
* [ ] Partial updates retain unchanged fields
* [ ] All fields updated together
* [ ] Empty request returns unchanged profile
* [ ] Invalid userId returns 404
* [ ] Email & phone remain unchanged
* [ ] Validation failures return appropriate error
