package com.courseflow.repository;

import com.courseflow.entity.Program;
import com.courseflow.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    Optional<Program> findByNameAndUniversity(String name, University university);
    java.util.List<Program> findByUniversityId(Long universityId);
}
