package com.courseflow.controller;

import com.courseflow.entity.Enrollment;
import com.courseflow.entity.User;
import com.courseflow.repository.CourseRepository;
import com.courseflow.repository.EnrollmentRepository;
import com.courseflow.repository.SemesterCapacityRepository;
import com.courseflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AdminController(UserRepository userRepository, CourseRepository courseRepository,
                           EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userRepository.findAll().stream()
                .filter(u -> User.Role.STUDENT.equals(u.getRole()))
                .toList();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        long totalStudents = userRepository.findAll().stream()
                .filter(u -> User.Role.STUDENT.equals(u.getRole()))
                .count();
        long totalCourses = courseRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long pendingEnrollments = enrollmentRepository.findAll().stream()
                .filter(e -> "PENDING".equals(e.getStatus()))
                .count();
        long waitlistedEnrollments = enrollmentRepository.findAll().stream()
                .filter(e -> "WAITLISTED".equals(e.getStatus()))
                .count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalCourses", totalCourses);
        stats.put("totalEnrollments", totalEnrollments);
        stats.put("pendingEnrollments", pendingEnrollments);
        stats.put("waitlistedEnrollments", waitlistedEnrollments);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/enrollment-trends")
    public ResponseEntity<?> getEnrollmentTrends() {
        List<Enrollment> allEnrollments = enrollmentRepository.findAll();
        
        // Group enrollments by month
        Map<String, Long> monthlyEnrollments = allEnrollments.stream()
                .filter(e -> e.getEnrolledAt() != null)
                .collect(Collectors.groupingBy(
                    e -> e.getEnrolledAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    LinkedHashMap::new,
                    Collectors.counting()
                ));

        List<Map<String, Object>> trends = new ArrayList<>();
        monthlyEnrollments.forEach((month, count) -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("name", month);
            entry.put("enrollments", count);
            trends.add(entry);
        });

        return ResponseEntity.ok(trends);
    }
}
