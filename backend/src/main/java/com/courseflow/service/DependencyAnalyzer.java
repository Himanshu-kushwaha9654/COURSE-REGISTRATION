package com.courseflow.service;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DependencyAnalyzer {

    /**
     * Uses BFS to count the total number of downstream descendants a course blocks.
     * This identifies "Bottleneck" courses in the curriculum.
     */
    public int calculateBottleneckImpact(Long courseId, Map<Long, List<Long>> adjList) {
        Set<Long> visited = new HashSet<>();
        Queue<Long> queue = new LinkedList<>();
        
        queue.offer(courseId);
        visited.add(courseId);

        int descendantCount = 0;

        while (!queue.isEmpty()) {
            Long current = queue.poll();
            
            List<Long> descendants = adjList.get(current);
            if (descendants != null) {
                for (Long child : descendants) {
                    if (!visited.contains(child)) {
                        visited.add(child);
                        queue.offer(child);
                        descendantCount++;
                    }
                }
            }
        }

        return descendantCount;
    }
}
