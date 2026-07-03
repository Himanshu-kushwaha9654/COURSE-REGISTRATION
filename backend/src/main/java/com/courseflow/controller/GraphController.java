package com.courseflow.controller;

import com.courseflow.entity.Prerequisite;
import com.courseflow.repository.PrerequisiteRepository;
import com.courseflow.repository.CourseRepository;
import com.courseflow.service.CycleDetectionAlgorithm;
import com.courseflow.service.DependencyAnalyzer;
import com.courseflow.service.GraphEngineService;
import com.courseflow.service.TopologicalSortAlgorithm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final GraphEngineService graphEngineService;
    private final CycleDetectionAlgorithm cycleDetectionAlgorithm;
    private final TopologicalSortAlgorithm topologicalSortAlgorithm;
    private final DependencyAnalyzer dependencyAnalyzer;
    private final PrerequisiteRepository prerequisiteRepository;
    private final CourseRepository courseRepository;

    public GraphController(GraphEngineService graphEngineService, CycleDetectionAlgorithm cycleDetectionAlgorithm,
                           TopologicalSortAlgorithm topologicalSortAlgorithm, DependencyAnalyzer dependencyAnalyzer,
                           PrerequisiteRepository prerequisiteRepository, CourseRepository courseRepository) {
        this.graphEngineService = graphEngineService;
        this.cycleDetectionAlgorithm = cycleDetectionAlgorithm;
        this.topologicalSortAlgorithm = topologicalSortAlgorithm;
        this.dependencyAnalyzer = dependencyAnalyzer;
        this.prerequisiteRepository = prerequisiteRepository;
        this.courseRepository = courseRepository;
    }

    @GetMapping("/roadmap")
    public ResponseEntity<?> getTopologicalRoadmap() {
        try {
            Map<Long, List<Long>> adjList = graphEngineService.buildAdjacencyList();
            List<Long> roadmap = topologicalSortAlgorithm.getTopologicalOrder(adjList);
            return ResponseEntity.ok(roadmap);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/bottlenecks/{courseId}")
    public ResponseEntity<?> analyzeBottleneck(@PathVariable Long courseId) {
        Map<Long, List<Long>> adjList = graphEngineService.buildAdjacencyList();
        int descendants = dependencyAnalyzer.calculateBottleneckImpact(courseId, adjList);
        return ResponseEntity.ok(Map.of("courseId", courseId, "bottleneckImpactScore", descendants));
    }

    @PostMapping("/edge")
    public ResponseEntity<?> addPrerequisiteEdge(@RequestParam Long targetCourseId, @RequestParam Long reqCourseId) {
        // Attempt to create edge
        Prerequisite p = new Prerequisite();
        p.setCourse(courseRepository.findById(targetCourseId).orElseThrow());
        p.setRequiredCourse(courseRepository.findById(reqCourseId).orElseThrow());
        
        prerequisiteRepository.save(p);

        // Run cycle detection immediately
        Map<Long, List<Long>> adjList = graphEngineService.buildAdjacencyList();
        if (cycleDetectionAlgorithm.hasCycle(adjList)) {
            prerequisiteRepository.delete(p); // Rollback
            return ResponseEntity.badRequest().body("Error: This edge creates a Circular Dependency Cycle!");
        }

        return ResponseEntity.ok("Edge added successfully without cycles.");
    }

    @GetMapping("/data")
    public ResponseEntity<?> getGraphData() {
        List<com.courseflow.entity.Course> courses = courseRepository.findAll();
        List<com.courseflow.entity.Prerequisite> prerequisites = prerequisiteRepository.findAll();
        
        Map<Integer, List<com.courseflow.entity.Course>> coursesBySemester = courses.stream()
                .collect(java.util.stream.Collectors.groupingBy(c -> c.getSemester() != null ? c.getSemester() : 0));

        List<Map<String, Object>> nodes = new java.util.ArrayList<>();
        
        for (Map.Entry<Integer, List<com.courseflow.entity.Course>> entry : coursesBySemester.entrySet()) {
            int semester = entry.getKey();
            List<com.courseflow.entity.Course> semesterCourses = entry.getValue();
            
            for (int i = 0; i < semesterCourses.size(); i++) {
                com.courseflow.entity.Course c = semesterCourses.get(i);
                nodes.add(Map.of(
                    "id", c.getId().toString(),
                    "data", Map.of("label", c.getCourseCode() + " - " + c.getCourseName(), "semester", semester),
                    "position", Map.of("x", semester * 350, "y", i * 100)
                ));
            }
        }

        List<Map<String, Object>> edges = prerequisites.stream().map(p -> Map.<String, Object>of(
            "id", "e" + p.getRequiredCourse().getId() + "-" + p.getCourse().getId(),
            "source", p.getRequiredCourse().getId().toString(),
            "target", p.getCourse().getId().toString(),
            "animated", true
        )).toList();

        return ResponseEntity.ok(Map.of("nodes", nodes, "edges", edges));
    }
}
