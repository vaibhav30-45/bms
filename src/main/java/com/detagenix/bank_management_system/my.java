package com.detagenix.bank_management_system;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class my {

    public static void main(String[] args) {

        String rawPassword = "admin123";

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String hashedPassword = encoder.encode(rawPassword);

        System.out.println("Raw Password : " + rawPassword);
        System.out.println("BCrypt Hash  : " + hashedPassword);
    }
}