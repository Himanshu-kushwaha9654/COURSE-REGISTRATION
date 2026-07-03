package com.courseflow.controller;

import com.courseflow.dto.JwtResponse;
import com.courseflow.dto.LoginRequest;
import com.courseflow.dto.RegisterRequest;
import com.courseflow.entity.User;
import com.courseflow.repository.UserRepository;
import com.courseflow.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (user.getRole() == User.Role.ADMIN) {
            String passkey = loginRequest.getAdminPasskey();
            if (passkey == null || !passkey.equals("ADMIN123")) {
                return ResponseEntity.status(403).body("Error: Invalid or missing Admin Passkey for login.");
            }
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.isProfileComplete()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        String roleStr = signUpRequest.getRole();
        if (roleStr != null && roleStr.equalsIgnoreCase("ADMIN")) {
            // Verify admin passkey
            String passkey = signUpRequest.getAdminPasskey();
            if (passkey == null || !passkey.equals("ADMIN123")) {
                return ResponseEntity.status(403).body("Error: Invalid or missing Admin Passkey.");
            }
            user.setRole(User.Role.ADMIN);
        } else {
            user.setRole(User.Role.STUDENT);
        }

        userRepository.save(user);

        // Auto login
        String jwt = jwtUtils.generateJwtToken(user.getEmail());

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.isProfileComplete()));
    }
}
