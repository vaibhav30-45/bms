# Bank Management System - Backend Development Context

You are helping me develop a Bank Management System using Java Spring Boot. Here is the complete context:

## Project Setup
- Java 17+
- Spring Boot 3.x
- PostgreSQL database
- Maven build tool
- MVC architecture pattern
- Package: com.detagenix.bank_management_system

## Project Structure
```
src/main/java/com/detagenix/bank_management_system/
├── config/          (Configuration classes like SecurityConfig)
├── controller/      (REST Controllers - @RestController)
├── dto/
│   ├── request/     (Request DTOs for API input)
│   └── response/    (Response DTOs for API output)
├── entity/          (JPA Entities - database tables)
├── enums/           (Enums like UserStatus, AccountStatus)
├── exception/       (Custom exceptions)
├── repository/      (JPA Repositories - extends JpaRepository)
├── service/         (Service interfaces)
│   └── impl/        (Service implementations)
└── util/            (Utility classes like Constants)
```

## Coding Standards We Follow

### 1. Naming Conventions
- DTOs: `UserRegistrationRequest`, `UserRegistrationResponse`
- Entities: `UserEntity`, `Account`, `Address`
- Services: `UserService` (interface), `UserServiceImpl` (implementation)
- Controllers: `UserController`
- Repositories: `UserRepository`
- Exceptions: `DuplicateResourceException`, `ValidationException`

### 2. Required Annotations
```java
// Service Implementation
@Service
@RequiredArgsConstructor  // For constructor injection
@Slf4j                    // For logging
@Transactional            // On methods that modify database

// Controller
@RestController
@RequestMapping("/api/...")
@RequiredArgsConstructor
@Slf4j

// DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

// Entity
@Entity
@Table(name = "table_name")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// extends BaseEntity (for audit fields)
```

### 3. Standard Response Format
All APIs return this structure:
```java
{
  "success": boolean,
  "message": "string",
  "data": object or null,
  "timestamp": "ISO datetime"
}
```

### 4. Exception Handling
We have these custom exceptions:
- `ResourceNotFoundException` → 404 NOT FOUND
- `DuplicateResourceException` → 409 CONFLICT
- `BadRequestException` → 400 BAD REQUEST
- `ValidationException` → 400 BAD REQUEST

All exceptions are handled by `GlobalExceptionHandler` with `@RestControllerAdvice`

### 5. Validation
- Use Constants class for all validation patterns and messages
- Use `@Valid` in controller methods
- Use `@NotBlank`, `@Email`, `@Pattern`, `@Size` annotations in DTOs
- All validation messages come from Constants class

### 6. Database
- All entities extend `BaseEntity` which has:
  - createdAt (LocalDateTime)
  - updatedAt (LocalDateTime)
  - createdBy (String)
  - updatedBy (String)
- Use `@GeneratedValue(strategy = GenerationType.IDENTITY)` for IDs
- Use BigDecimal for money amounts (NEVER Double)
- Use LocalDate, LocalDateTime for dates (NEVER java.util.Date)

### 7. Service Layer Pattern
```java
@Override
@Transactional
public SomeResponse someMethod(SomeRequest request) {
    log.info("Starting operation for: {}", request.getSomeField());
    
    // 1. Validate input
    validateSomething(request);
    
    // 2. Check business rules
    checkBusinessRules(request);
    
    // 3. Create entity
    Entity entity = createEntity(request);
    
    // 4. Save to database
    Entity saved = repository.save(entity);
    
    // 5. Build response
    return buildResponse(saved);
}
```

### 8. Logging Pattern
```java
log.info("Success message with data: {}", someValue);
log.warn("Warning message: {}", issue);
log.error("Error occurred: {}", e.getMessage(), e);
```

## Existing Code Reference

### BaseEntity (All entities extend this)
```java
@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity {
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Column(updatable = false)
    private String createdBy;
    
    private String updatedBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        createdBy = "SYSTEM";
        updatedBy = "SYSTEM";
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updatedBy = "SYSTEM";
    }
}
```

### ApiResponse Structure
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private Boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
```

### Constants Class Pattern
```java
public class Constants {
    // Patterns
    public static final String PATTERN_EMAIL = "regex here";
    public static final String PATTERN_PHONE = "^[6-9]\\d{9}$";
    
    // Messages
    public static final String MSG_EMAIL_REQUIRED = "Email is required";
    public static final String ERROR_EMAIL_ALREADY_EXISTS = "Email already registered";
    public static final String SUCCESS_USER_REGISTERED = "User registered successfully";
    
    // Constraints
    public static final int NAME_MIN_LENGTH = 2;
    public static final int NAME_MAX_LENGTH = 50;
    
    private Constants() {
        throw new UnsupportedOperationException("Utility class");
    }
}
```

## Current Database Schema

Tables we have:
- users (userId, firstName, lastName, email, phoneNumber, password, dateOfBirth, age, isActiveUser, userStatus, role, etc.)
- addresses (addressId, user_id FK, addressLine1, city, state, pincode, addressType)
- branches (branchId, branchCode, branchName, ifscCode, address, phoneNumber)
- accounts (accountId, accountNumber, user_id FK, branch_id FK, accountBalance, accountStatus)
- savings_accounts (extends accounts)
- current_accounts (extends accounts)
- kyc_documents (documentId, user_id FK, documentType, documentPath, documentStatus)
- beneficiaries (beneficiaryId, user_id FK, name, accountNumber, ifscCode, bankName)
- activity_logs (logId, user_id FK, activityType, timestamp, successful)

## Important Rules

1. ALWAYS use BigDecimal for money, NEVER Double
2. ALWAYS use LocalDate/LocalDateTime, NEVER java.util.Date
3. ALWAYS log at start and end of service methods
4. ALWAYS use @Transactional for methods that modify database
5. ALWAYS use Constants class for validation messages
6. ALWAYS extend BaseEntity for entities
7. ALWAYS use @RequiredArgsConstructor for dependency injection
8. ALWAYS throw custom exceptions, not generic ones
9. ALWAYS validate input in service layer before repository operations
10. ALWAYS return ApiResponse wrapper from controllers

## When I Ask You to Create a New Feature

Follow this exact sequence:
1. Create Request DTO with validations
2. Create Response DTO
3. Update/Create Entity if needed
4. Create/Update Repository with needed methods
5. Create Service interface
6. Create Service implementation with:
   - Validation methods
   - Business logic methods
   - Entity creation methods
   - Response building methods
7. Create Controller with proper annotations
8. Suggest Postman test cases

## Example Complete Feature (User Registration)

[Paste the UserRegistrationRequest, UserRegistrationResponse, UserServiceImpl, and UserController code here as examples]

---

Now I need help with: [DESCRIBE YOUR TASK]
```

---

## 📝 **How to Use These Documents**

### **For API Contract:**
1. Save it in your project repo under `/docs/api-contracts/`
2. Share with frontend team
3. Update version number when you make changes
4. Use it as reference during code reviews

### **For Miro Prompt:**
1. Open Miro
2. Create new board
3. Click on Miro AI assistant
4. Paste the entire prompt
5. Let it generate the flow diagram
6. Share with entire team

### **For AI Context Prompt:**
1. Save as markdown file
2. Share with Vansh and Khushboo
3. Tell them: "Paste this at the start of EVERY new AI chat"
4. This ensures consistency across different AI tools (ChatGPT, Claude, Gemini, etc.)
5. Update this document when you add new patterns/standards

---

## 💡 **Bonus: Quick Reference Card for Team**

Create a simple cheat sheet:
```
QUICK REFERENCE - ALWAYS USE:

✅ BigDecimal for money (NOT Double)
✅ LocalDate/LocalDateTime for dates (NOT java.util.Date)
✅ @Transactional on service methods that modify DB
✅ Constants class for ALL messages and patterns
✅ @RequiredArgsConstructor for dependency injection
✅ @Slf4j for logging
✅ Custom exceptions (NOT generic Exception)
✅ ApiResponse wrapper for ALL controller responses
✅ @Valid in controller for DTO validation
✅ extends BaseEntity for all entities

❌ NEVER use Double for money
❌ NEVER use java.util.Date
❌ NEVER hardcode validation messages
❌ NEVER use @Autowired (use constructor injection)
❌ NEVER skip logging in service methods
❌ NEVER return raw objects from controller
❌ NEVER catch and ignore exceptions