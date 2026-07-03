package com.courseflow.repository;

import com.courseflow.entity.Prerequisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Long> {
    List<Prerequisite> findByCourseId(Long courseId);
    List<Prerequisite> findByRequiredCourseId(Long requiredCourseId);
}
