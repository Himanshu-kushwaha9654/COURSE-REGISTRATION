package com.courseflow.controller;

import com.courseflow.entity.Program;
import com.courseflow.entity.University;
import com.courseflow.repository.ProgramRepository;
import com.courseflow.repository.UniversityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final UniversityRepository universityRepository;
    private final ProgramRepository programRepository;

    public PublicController(UniversityRepository universityRepository, ProgramRepository programRepository) {
        this.universityRepository = universityRepository;
        this.programRepository = programRepository;
    }

    @GetMapping("/universities")
    public ResponseEntity<List<University>> getAllUniversities() {
        return ResponseEntity.ok(universityRepository.findAll());
    }

    @GetMapping("/programs")
    public ResponseEntity<List<Program>> getProgramsByUniversity(@RequestParam Long universityId) {
        return ResponseEntity.ok(programRepository.findByUniversityId(universityId));
    }
}
