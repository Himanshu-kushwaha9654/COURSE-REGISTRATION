package com.courseflow.service;

import com.courseflow.entity.*;
import com.courseflow.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final PrerequisiteRepository prerequisiteRepository;
    private final SemesterCapacityRepository capacityRepository;
    private final NotificationRepository notificationRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository,
                             PrerequisiteRepository prerequisiteRepository,
                             SemesterCapacityRepository capacityRepository,
                             NotificationRepository notificationRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.prerequisiteRepository = prerequisiteRepository;
        this.capacityRepository = capacityRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Enrollment processEnrollmentRequest(User student, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 1. Check if already enrolled or pending
        boolean exists = enrollmentRepository.findByStudentId(student.getId()).stream()
                .anyMatch(e -> e.getCourse().getId().equals(courseId)
                        && (e.getStatus().equals("ENROLLED") || e.getStatus().equals("APPROVED") || e.getStatus().equals("PENDING") || e.getStatus().equals("WAITLISTED")));
        if (exists) {
            throw new RuntimeException("Already enrolled, pending, or waitlisted for this course");
        }

        // 2. Check if already completed
        boolean completed = enrollmentRepository.findByStudentId(student.getId()).stream()
                .anyMatch(e -> e.getCourse().getId().equals(courseId) && e.getStatus().equals("COMPLETED"));
        if (completed) {
            throw new RuntimeException("Course already completed");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        // 3. Check Semester Credit Capacity Limit
        SemesterCapacity capacity = capacityRepository.findBySemester(course.getSemester()).orElse(null);
        if (capacity != null) {
            int currentCredits = enrollmentRepository.findByStudentId(student.getId()).stream()
                    .filter(e -> e.getCourse().getSemester().equals(course.getSemester()))
                    .filter(e -> e.getStatus().equals("APPROVED") || e.getStatus().equals("PENDING") || e.getStatus().equals("ENROLLED"))
                    .mapToInt(e -> e.getCourse().getCredits() != null ? e.getCourse().getCredits() : 0)
                    .sum();
            int courseCredits = course.getCredits() != null ? course.getCredits() : 0;
            if (currentCredits + courseCredits > capacity.getMaxCapacity()) {
                enrollment.setStatus("PENDING");
                enrollment.setRejectionReason("Exceeds semester credit limit. Max allowed: " + capacity.getMaxCapacity());
                enrollment = enrollmentRepository.save(enrollment);
                notifyStudent(student, "Enrollment Pending", "Your request for " + course.getCourseName() + " exceeds the credit limit and requires admin approval.");
                return enrollment;
            }
        }

        // 4. Check prerequisites
        List<Prerequisite> prerequisites = prerequisiteRepository.findByCourseId(courseId);
        List<Long> completedCourseIds = enrollmentRepository.findByStudentId(student.getId()).stream()
                .filter(e -> e.getStatus().equals("COMPLETED"))
                .map(e -> e.getCourse().getId())
                .collect(Collectors.toList());

        List<String> missingPrereqs = prerequisites.stream()
                .filter(p -> !completedCourseIds.contains(p.getRequiredCourse().getId()))
                .map(p -> p.getRequiredCourse().getCourseName())
                .collect(Collectors.toList());

        if (!missingPrereqs.isEmpty()) {
            enrollment.setStatus("PENDING");
            enrollment.setRejectionReason("Missing prerequisites: " + String.join(", ", missingPrereqs));
            enrollment = enrollmentRepository.save(enrollment);
            notifyStudent(student, "Enrollment Pending", "Your enrollment request for " + course.getCourseName() + " requires admin approval due to missing prerequisites.");
            return enrollment;
        }

        // 5. Course Seats Capacity check
        int maxSeats = course.getMaxSeats() != null ? course.getMaxSeats() : 60;
        int currentEnrollments = enrollmentRepository.countByCourseIdAndStatus(courseId, "APPROVED");
        
        if (currentEnrollments >= maxSeats) {
            // Waitlist
            enrollment.setStatus("WAITLISTED");
            int waitlistCount = (int) enrollmentRepository.findByCourseId(courseId).stream()
                    .filter(e -> e.getStatus().equals("WAITLISTED"))
                    .count();
            enrollment.setWaitlistPosition(waitlistCount + 1);
            enrollment = enrollmentRepository.save(enrollment);
            notifyStudent(student, "Waitlisted", "The course " + course.getCourseName() + " is full. You have been placed on the waitlist at position " + enrollment.getWaitlistPosition() + ".");
            return enrollment;
        }

        // 6. Requires Admin Approval
        enrollment.setStatus("PENDING");
        enrollment = enrollmentRepository.save(enrollment);
        notifyStudent(student, "Enrollment Pending", "Your enrollment request for " + course.getCourseName() + " has been received and is awaiting admin approval.");
        return enrollment;
    }

    public void notifyStudent(User student, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(student);
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    @Transactional
    public void dropEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        enrollment.setStatus("DROPPED");
        enrollmentRepository.save(enrollment);
        
        notifyStudent(enrollment.getStudent(), "Course Dropped", "You have dropped " + enrollment.getCourse().getCourseName() + ".");

        promoteWaitlist(enrollment.getCourse());
    }

    @Transactional
    public void promoteWaitlist(Course course) {
        int maxSeats = course.getMaxSeats() != null ? course.getMaxSeats() : 60;
        int currentEnrollments = enrollmentRepository.countByCourseIdAndStatus(course.getId(), "APPROVED");
        
        if (currentEnrollments < maxSeats) {
            // Find student at waitlist position 1
            Optional<Enrollment> nextInLine = enrollmentRepository.findByCourseId(course.getId()).stream()
                    .filter(e -> "WAITLISTED".equals(e.getStatus()) && e.getWaitlistPosition() != null && e.getWaitlistPosition() == 1)
                    .findFirst();

            if (nextInLine.isPresent()) {
                Enrollment promoted = nextInLine.get();
                promoted.setStatus("APPROVED");
                promoted.setWaitlistPosition(null);
                enrollmentRepository.save(promoted);
                
                notifyStudent(promoted.getStudent(), "Waitlist Promoted", "A seat opened up! You have been enrolled in " + course.getCourseName() + ".");

                // Shift everyone else down
                List<Enrollment> others = enrollmentRepository.findByCourseId(course.getId()).stream()
                        .filter(e -> "WAITLISTED".equals(e.getStatus()) && e.getWaitlistPosition() != null && e.getWaitlistPosition() > 1)
                        .collect(Collectors.toList());
                
                for (Enrollment e : others) {
                    e.setWaitlistPosition(e.getWaitlistPosition() - 1);
                    enrollmentRepository.save(e);
                }
            }
        }
    }
}
