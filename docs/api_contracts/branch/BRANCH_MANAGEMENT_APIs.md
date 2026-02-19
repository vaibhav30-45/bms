# API Contract: Branch Management APIs

## Version: 1.0
## Last Updated: 2026-02-19
## Owner: Backend Team

---

## Overview

These APIs allow users to view and search bank branches. Users must select a branch when applying for an account. All endpoints require JWT authentication.

---

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer {jwt-token}
```

To obtain a token, use the `/api/auth/login` endpoint.

---

## API 1: Get All Branches

### Endpoint Details

**Method:** GET  
**URL:** `/api/branches`  
**Authentication:** Required (JWT Token)

---

### Request

#### Headers
```
Authorization: Bearer {jwt-token}
```

#### No Request Body Required

---

### Response

#### Success Response (HTTP 200 OK)

```json
{
  "success": true,
  "message": "Branches retrieved successfully",
  "data": [
    {
      "branchId": 1,
      "branchCode": "BLR001",
      "branchName": "Koramangala Branch",
      "ifscCode": "BANK0001001",
      "address": "123 MG Road, Koramangala",
      "city": "Bengaluru",
      "state": "Karnataka",
      "phoneNumber": "080-11111111"
    },
    {
      "branchId": 2,
      "branchCode": "BLR002",
      "branchName": "Indiranagar Branch",
      "ifscCode": "BANK0001002",
      "address": "456 100 Feet Road, Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "phoneNumber": "080-22222222"
    }
  ],
  "timestamp": "2026-02-19T10:30:00"
}
```

#### Error Response (HTTP 401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2026-02-19T10:30:00"
}
```

---

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| branchId | Long | Unique identifier for the branch |
| branchCode | String | Branch code (e.g., BLR001) |
| branchName | String | Name of the branch |
| ifscCode | String | IFSC code for the branch |
| address | String | Complete address of the branch |
| city | String | City where branch is located |
| state | String | State where branch is located |
| phoneNumber | String | Contact number for the branch |

---

### Business Rules

1. Returns all active branches in the system
2. Branches are ordered by branchId (ascending)
3. Empty array returned if no branches exist
4. Requires valid JWT token

---

### HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Branches retrieved successfully |
| 401 | Unauthorized | Missing or invalid JWT token |
| 500 | Internal Server Error | Unexpected server error |

---

### Testing Checklist

- [ ] Returns all branches when authenticated
- [ ] Returns 401 when token missing
- [ ] Returns 401 when token invalid
- [ ] Returns 401 when token expired
- [ ] Response includes all branch fields
- [ ] Array is empty when no branches exist

---

## API 2: Get Branch by ID

### Endpoint Details

**Method:** GET  
**URL:** `/api/branches/{id}`  
**Authentication:** Required (JWT Token)

---

### Request

#### Headers
```
Authorization: Bearer {jwt-token}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Branch ID to retrieve |

#### Example Request
```
GET /api/branches/1
```

---

### Response

#### Success Response (HTTP 200 OK)

```json
{
  "success": true,
  "message": "Branch found",
  "data": {
    "branchId": 1,
    "branchCode": "BLR001",
    "branchName": "Koramangala Branch",
    "ifscCode": "BANK0001001",
    "address": "123 MG Road, Koramangala",
    "city": "Bengaluru",
    "state": "Karnataka",
    "phoneNumber": "080-11111111"
  },
  "timestamp": "2026-02-19T10:30:00"
}
```

#### Error Response (HTTP 404 Not Found)

```json
{
  "success": false,
  "message": "Branch not found",
  "data": null,
  "timestamp": "2026-02-19T10:30:00"
}
```

#### Error Response (HTTP 401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2026-02-19T10:30:00"
}
```

---

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| branchId | Long | Unique identifier for the branch |
| branchCode | String | Branch code (e.g., BLR001) |
| branchName | String | Name of the branch |
| ifscCode | String | IFSC code for the branch |
| address | String | Complete address of the branch |
| city | String | City where branch is located |
| state | String | State where branch is located |
| phoneNumber | String | Contact number for the branch |

---

### Business Rules

1. Returns single branch details for given ID
2. Throws 404 if branch ID does not exist
3. Requires valid JWT token

---

### HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Branch found and returned |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Branch ID does not exist |
| 500 | Internal Server Error | Unexpected server error |

---

### Testing Checklist

- [ ] Returns branch when valid ID provided
- [ ] Returns 404 when branch ID not found
- [ ] Returns 401 when token missing
- [ ] Returns 401 when token invalid
- [ ] Response includes all branch fields

---

## API 3: Search Branches

### Endpoint Details

**Method:** GET  
**URL:** `/api/branches/search`  
**Authentication:** Required (JWT Token)

---

### Request

#### Headers
```
Authorization: Bearer {jwt-token}
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | String | No | Filter branches by city name |
| state | String | No | Filter branches by state name |

**Note:** Both parameters are optional. If neither is provided, returns all branches.

#### Example Requests

**Search by city:**
```
GET /api/branches/search?city=Bengaluru
```

**Search by state:**
```
GET /api/branches/search?state=Karnataka
```

**Search by city and state:**
```
GET /api/branches/search?city=Mumbai&state=Maharashtra
```

**No parameters (all branches):**
```
GET /api/branches/search
```

---

### Response

#### Success Response (HTTP 200 OK)

**Example: Search by city**
```json
{
  "success": true,
  "message": "Branches found",
  "data": [
    {
      "branchId": 1,
      "branchCode": "BLR001",
      "branchName": "Koramangala Branch",
      "ifscCode": "BANK0001001",
      "address": "123 MG Road, Koramangala",
      "city": "Bengaluru",
      "state": "Karnataka",
      "phoneNumber": "080-11111111"
    },
    {
      "branchId": 2,
      "branchCode": "BLR002",
      "branchName": "Indiranagar Branch",
      "ifscCode": "BANK0001002",
      "address": "456 100 Feet Road, Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "phoneNumber": "080-22222222"
    },
    {
      "branchId": 3,
      "branchCode": "BLR003",
      "branchName": "Whitefield Branch",
      "ifscCode": "BANK0001003",
      "address": "789 Whitefield Main Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "phoneNumber": "080-33333333"
    }
  ],
  "timestamp": "2026-02-19T10:30:00"
}
```

**Example: No matching results**
```json
{
  "success": true,
  "message": "Branches found",
  "data": [],
  "timestamp": "2026-02-19T10:30:00"
}
```

#### Error Response (HTTP 401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2026-02-19T10:30:00"
}
```

---

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| branchId | Long | Unique identifier for the branch |
| branchCode | String | Branch code (e.g., BLR001) |
| branchName | String | Name of the branch |
| ifscCode | String | IFSC code for the branch |
| address | String | Complete address of the branch |
| city | String | City where branch is located |
| state | String | State where branch is located |
| phoneNumber | String | Contact number for the branch |

---

### Business Rules

1. **No parameters:** Returns all branches
2. **City only:** Returns all branches in that city
3. **State only:** Returns all branches in that state
4. **Both city and state:** Returns branches matching both criteria
5. **Case sensitive:** Search is case-sensitive
6. **Empty results:** Returns empty array if no matches found
7. Requires valid JWT token

---

### Search Logic

| city | state | Result |
|------|-------|--------|
| null | null | All branches |
| "Bengaluru" | null | All branches in Bengaluru |
| null | "Karnataka" | All branches in Karnataka |
| "Bengaluru" | "Karnataka" | All branches in Bengaluru, Karnataka |
| "Invalid" | null | Empty array (no matches) |

---

### HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Search completed successfully |
| 401 | Unauthorized | Missing or invalid JWT token |
| 500 | Internal Server Error | Unexpected server error |

---

### Testing Checklist

- [ ] Search by city returns correct branches
- [ ] Search by state returns correct branches
- [ ] Search by city+state returns correct branches
- [ ] No parameters returns all branches
- [ ] Invalid city returns empty array
- [ ] Invalid state returns empty array
- [ ] Returns 401 when token missing
- [ ] Returns 401 when token invalid
- [ ] Case sensitivity works correctly

---

## Common Error Responses

### 401 Unauthorized - Missing Token

**When:** No Authorization header provided

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2026-02-19T10:30:00"
}
```

---

### 401 Unauthorized - Invalid Token

**When:** Token is malformed, expired, or invalid

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2026-02-19T10:30:00"
}
```

---

### 500 Internal Server Error

**When:** Unexpected server error occurs

```json
{
  "success": false,
  "message": "An error occurred: Database connection failed",
  "data": null,
  "timestamp": "2026-02-19T10:30:00"
}
```

---

## Database Schema

### branches Table

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| branch_id | BIGINT | NOT NULL | Primary key |
| branch_code | VARCHAR(20) | NOT NULL | Unique branch code |
| branch_name | VARCHAR(200) | NOT NULL | Branch name |
| ifsc_code | VARCHAR(11) | NOT NULL | Unique IFSC code |
| address | VARCHAR(500) | NOT NULL | Branch address |
| city | VARCHAR(100) | NOT NULL | City name |
| state | VARCHAR(100) | NOT NULL | State name |
| phone_number | VARCHAR(15) | NOT NULL | Contact number |
| created_on | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_on | TIMESTAMP | NOT NULL | Last update timestamp |
| created_by | VARCHAR(255) | NOT NULL | Creator |
| updated_by | VARCHAR(255) | NOT NULL | Last updater |

---

## Notes for Frontend Team

1. **Authentication Required:** All three endpoints require JWT token in Authorization header
2. **Token Format:** Use "Bearer {token}" format in Authorization header
3. **Search is Case-Sensitive:** Make sure to pass exact city/state names
4. **Empty Results:** Empty array means no branches found (not an error)
5. **Dropdown/Autocomplete:** Use search endpoint for city/state dropdowns
6. **Account Creation Flow:** Users must select a branch when creating an account

---

## Postman Collection

**Available at:** [Link to Postman Collection]

**Test Sequence:**
1. Login to get JWT token (`POST /api/auth/login`)
2. Set token in Authorization header
3. Test Get All Branches
4. Test Get Branch by ID
5. Test Search Branches with different parameters

---

## Contact

For questions or issues, contact:
- **Project Lead:** Anish
- **PM:** Vaibhav
- **Backend Team:** Khushboo