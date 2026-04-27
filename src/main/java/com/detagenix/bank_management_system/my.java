package com.detagenix.bank_management_system;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class my {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin";
        String encodedPassword = encoder.encode(rawPassword);

        System.out.println(encodedPassword);
    }
}