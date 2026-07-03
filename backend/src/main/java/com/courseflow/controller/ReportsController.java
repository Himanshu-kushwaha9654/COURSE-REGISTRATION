package com.courseflow.controller;

import com.courseflow.entity.Course;
import com.courseflow.entity.User;
import com.courseflow.repository.CourseRepository;
import com.courseflow.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public ReportsController(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/courses/csv")
    public ResponseEntity<byte[]> getCoursesCsv() {
        StringBuilder csv = new StringBuilder("ID,Code,Name,Credits,Semester\n");
        for (Course c : courseRepository.findAll()) {
            csv.append(c.getId()).append(",")
               .append(c.getCourseCode()).append(",")
               .append(c.getCourseName()).append(",")
               .append(c.getCredits()).append(",")
               .append(c.getSemester()).append("\n");
        }
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"courses_report.csv\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString().getBytes());
    }

    @GetMapping("/students/csv")
    public ResponseEntity<byte[]> getStudentsCsv() {
        StringBuilder csv = new StringBuilder("ID,Name,Email,Role\n");
        for (User u : userRepository.findAll()) {
            csv.append(u.getId()).append(",")
               .append(u.getFullName()).append(",")
               .append(u.getEmail()).append(",")
               .append(u.getRole()).append("\n");
        }
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"students_report.csv\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString().getBytes());
    }
}
