package com.academic.cpv.config;

import com.academic.cpv.model.*;
import com.academic.cpv.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {

        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@cpv.com")
                    .password(encoder.encode("admin123"))
                    .role(ERole.ROLE_ADMIN)
                    .isApproved(true)
                    .trialExpired(false)
                    .build();
            userRepository.save(admin);
        }
    }
}
