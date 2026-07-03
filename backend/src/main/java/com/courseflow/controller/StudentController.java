package com.courseflow.controller;

import com.courseflow.entity.User;
import com.courseflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<User> getAllStudents() {
        return userRepository.findByRole(User.Role.STUDENT);
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody User student) {
        if (userRepository.existsByEmail(student.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        student.setRole(User.Role.STUDENT);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return ResponseEntity.ok(userRepository.save(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody User updated) {
        return userRepository.findById(id).map(student -> {
            student.setFullName(updated.getFullName());
            if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
                student.setPassword(passwordEncoder.encode(updated.getPassword()));
            }
            return ResponseEntity.ok(userRepository.save(student));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        return userRepository.findById(id).map(student -> {
            userRepository.delete(student);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
