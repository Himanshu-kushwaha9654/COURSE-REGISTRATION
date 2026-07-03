package com.courseflow.repository;

import com.courseflow.entity.SemesterCapacity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SemesterCapacityRepository extends JpaRepository<SemesterCapacity, Long> {
    Optional<SemesterCapacity> findBySemester(Integer semester);
}
