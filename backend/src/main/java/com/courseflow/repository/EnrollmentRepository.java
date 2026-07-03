package com.courseflow.repository;

import com.courseflow.entity.Enrollment;
import com.courseflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByCourseId(Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
    int countByCourseSemesterAndStatus(Integer semester, String status);
    int countByCourseIdAndStatus(Long courseId, String status);
}
