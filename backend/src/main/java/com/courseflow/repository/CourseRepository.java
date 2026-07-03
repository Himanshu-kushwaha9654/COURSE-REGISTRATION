package com.courseflow.repository;

import com.courseflow.entity.Course;
import com.courseflow.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    boolean existsByCourseCode(String courseCode);
    Optional<Course> findByCourseCodeAndProgram(String courseCode, Program program);

    @org.springframework.data.jpa.repository.Query("SELECT c.courseCode FROM Course c")
    java.util.List<String> findAllCourseCodes();

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Course c LEFT JOIN FETCH c.program p LEFT JOIN FETCH p.university u")
    java.util.List<Course> findAll();
}
