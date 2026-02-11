package com.detagenix.bank_management_system.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    private Long userId;

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private String panNumber;
    private String gender;
    private String dateOfBirth;
    private Integer age;
    private Boolean isMinor;
    private Long guardianId;
    private String guardianName;
    private Boolean isActiveUser;
    private Integer failedLoginAttempts;
    private String role;




}
