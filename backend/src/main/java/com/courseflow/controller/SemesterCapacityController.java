package com.courseflow.controller;

import com.courseflow.entity.SemesterCapacity;
import com.courseflow.repository.SemesterCapacityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capacities")
public class SemesterCapacityController {

    private final SemesterCapacityRepository capacityRepository;

    public SemesterCapacityController(SemesterCapacityRepository capacityRepository) {
        this.capacityRepository = capacityRepository;
    }

    @GetMapping
    public List<SemesterCapacity> getAllCapacities() {
        return capacityRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> setCapacity(@RequestBody SemesterCapacity capacity) {
        var existing = capacityRepository.findBySemester(capacity.getSemester());
        if (existing.isPresent()) {
            SemesterCapacity cap = existing.get();
            cap.setMaxCapacity(capacity.getMaxCapacity());
            return ResponseEntity.ok(capacityRepository.save(cap));
        }
        return ResponseEntity.ok(capacityRepository.save(capacity));
    }
}
