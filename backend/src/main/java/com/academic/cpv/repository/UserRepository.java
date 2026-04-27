package com.academic.cpv.repository;

import com.academic.cpv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByResetPasswordToken(String token);
    @Query("SELECT u FROM User u WHERE u.isApproved = false AND u.trialExpired = false AND u.trialStartDate < :dateTime")
    List<User> findExpiredTrials(LocalDateTime dateTime);
}
