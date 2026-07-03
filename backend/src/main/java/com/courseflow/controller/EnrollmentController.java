package com.courseflow.controller;

import com.courseflow.entity.Enrollment;
import com.courseflow.entity.User;
import com.courseflow.repository.EnrollmentRepository;
import com.courseflow.repository.UserRepository;
import com.courseflow.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentRepository enrollmentRepository, UserRepository userRepository, EnrollmentService enrollmentService) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyEnrollments(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User student = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Enrollment> myEnrollments = enrollmentRepository.findByStudent(student);
        return ResponseEntity.ok(myEnrollments);
    }

    @PostMapping
    public ResponseEntity<?> createEnrollment(@RequestParam Long courseId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User student = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            Enrollment enrollment = enrollmentService.processEnrollmentRequest(student, courseId);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveEnrollment(@PathVariable Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id).orElseThrow();
        enrollment.setStatus("APPROVED");
        enrollment.setRejectionReason(null);
        enrollment = enrollmentRepository.save(enrollment);
        enrollmentService.notifyStudent(enrollment.getStudent(), "Enrollment Approved", "Your enrollment in " + enrollment.getCourse().getCourseName() + " was approved by an admin.");
        return ResponseEntity.ok(enrollment);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectEnrollment(@PathVariable Long id, @RequestBody String reason) {
        Enrollment enrollment = enrollmentRepository.findById(id).orElseThrow();
        enrollment.setStatus("REJECTED");
        enrollment.setRejectionReason(reason);
        enrollment = enrollmentRepository.save(enrollment);
        enrollmentService.notifyStudent(enrollment.getStudent(), "Enrollment Rejected", "Your enrollment in " + enrollment.getCourse().getCourseName() + " was rejected: " + reason);
        return ResponseEntity.ok(enrollment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.dropEnrollment(id);
        return ResponseEntity.ok().build();
    }
}
