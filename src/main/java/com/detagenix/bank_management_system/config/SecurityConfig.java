package com.detagenix.bank_management_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security configuration
 * Currently allows all requests (will add JWT authentication later)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configure HTTP security
     * For now, allow all requests without authentication
     * TODO: Add JWT authentication in Phase 2
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Disable CSRF for stateless JWT
                .cors(cors -> cors.disable())  // Will configure CORS properly later
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()  // Allow all requests for now
                );

        return http.build();
    }

    /**
     * Password encoder bean
     * Uses BCrypt for secure password hashing
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}