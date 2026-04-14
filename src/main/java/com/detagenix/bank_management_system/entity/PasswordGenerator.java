package com.detagenix.bank_management_system.entity;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashed = encoder.encode("admin123");
        System.out.println(hashed);
    }
}