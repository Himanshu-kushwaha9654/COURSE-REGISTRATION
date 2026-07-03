package com.courseflow.service;

import com.courseflow.entity.Course;
import com.courseflow.entity.Prerequisite;
import com.courseflow.repository.CourseRepository;
import com.courseflow.repository.PrerequisiteRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GraphEngineService {

    private final CourseRepository courseRepository;
    private final PrerequisiteRepository prerequisiteRepository;

    public GraphEngineService(CourseRepository courseRepository, PrerequisiteRepository prerequisiteRepository) {
        this.courseRepository = courseRepository;
        this.prerequisiteRepository = prerequisiteRepository;
    }

    /**
     * Builds an adjacency list representation of the course graph.
     * Course A -> [Course B, Course C] means A is a prerequisite for B and C.
     */
    public Map<Long, List<Long>> buildAdjacencyList() {
        Map<Long, List<Long>> adjList = new HashMap<>();
        List<Course> allCourses = courseRepository.findAll();
        
        for (Course c : allCourses) {
            adjList.put(c.getId(), new ArrayList<>());
        }

        List<Prerequisite> allPrerequisites = prerequisiteRepository.findAll();
        for (Prerequisite p : allPrerequisites) {
            Long fromCourseId = p.getRequiredCourse().getId(); // The prerequisite
            Long toCourseId = p.getCourse().getId();           // The target course
            
            adjList.get(fromCourseId).add(toCourseId);
        }

        return adjList;
    }

    /**
     * Builds the reverse adjacency list (dependencies).
     * Course B -> [Course A] means B depends on A.
     */
    public Map<Long, List<Long>> buildDependencyList() {
        Map<Long, List<Long>> depList = new HashMap<>();
        List<Course> allCourses = courseRepository.findAll();
        
        for (Course c : allCourses) {
            depList.put(c.getId(), new ArrayList<>());
        }

        List<Prerequisite> allPrerequisites = prerequisiteRepository.findAll();
        for (Prerequisite p : allPrerequisites) {
            Long targetCourseId = p.getCourse().getId();
            Long requiredCourseId = p.getRequiredCourse().getId();
            
            depList.get(targetCourseId).add(requiredCourseId);
        }

        return depList;
    }
}
