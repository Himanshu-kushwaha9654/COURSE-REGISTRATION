package com.courseflow.controller;

import com.courseflow.dto.OnboardingRequest;
import com.courseflow.entity.Program;
import com.courseflow.entity.User;
import com.courseflow.repository.ProgramRepository;
import com.courseflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;

    public UserController(UserRepository userRepository, ProgramRepository programRepository) {
        this.userRepository = userRepository;
        this.programRepository = programRepository;
    }

    @PostMapping("/onboarding")
    public ResponseEntity<?> completeOnboarding(@RequestBody OnboardingRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        user.setProgram(program);
        user.setCurrentSemester(request.getCurrentSemester());
        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody java.util.Map<String, Object> updates, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("fullName")) {
            user.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("currentSemester")) {
            user.setCurrentSemester((Integer) updates.get("currentSemester"));
        }
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
