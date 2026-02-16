package com.detagenix.bank_management_system.entity;

import com.detagenix.bank_management_system.enums.Gender;
import com.detagenix.bank_management_system.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false, length = 15)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, length = 10)
    private String panNumber;

    @Column(unique = true, length = 12)
    private String aadhaarNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    private Integer age;

    private Boolean isMinor;

    private Long guardianId;

    private String guardianName;

    @Column(nullable = false)
    private Boolean isActiveUser = true;

    @Column(nullable = false)
    private Integer failedLoginAttempts = 0;

    @Column(length = 50)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private UserStatus userStatus = UserStatus.REGISTERED;
}