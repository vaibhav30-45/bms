package com.detagenix.bank_management_system.security;

import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        log.info("Loading user for authentication: {}", email);

        UserEntity user = userRepository
                .findByEmail(email)
                .orElseThrow(()->{
                    log.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("Invalid credentials");
                });

        return new CustomUserDetails(user);
    }
}
