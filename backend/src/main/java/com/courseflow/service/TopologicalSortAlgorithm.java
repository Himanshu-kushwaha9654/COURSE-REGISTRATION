package com.courseflow.service;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TopologicalSortAlgorithm {

    /**
     * Performs Kahn's Algorithm for Topological Sorting.
     * Useful for building valid academic roadmaps.
     */
    public List<Long> getTopologicalOrder(Map<Long, List<Long>> adjList) {
        Map<Long, Integer> inDegree = new HashMap<>();
        
        for (Long node : adjList.keySet()) {
            inDegree.put(node, 0);
        }

        for (Map.Entry<Long, List<Long>> entry : adjList.entrySet()) {
            for (Long neighbor : entry.getValue()) {
                inDegree.put(neighbor, inDegree.getOrDefault(neighbor, 0) + 1);
            }
        }

        Queue<Long> queue = new LinkedList<>();
        for (Map.Entry<Long, Integer> entry : inDegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.offer(entry.getKey());
            }
        }

        List<Long> topoOrder = new ArrayList<>();
        
        while (!queue.isEmpty()) {
            Long current = queue.poll();
            topoOrder.add(current);

            List<Long> neighbors = adjList.get(current);
            if (neighbors != null) {
                for (Long neighbor : neighbors) {
                    inDegree.put(neighbor, inDegree.get(neighbor) - 1);
                    if (inDegree.get(neighbor) == 0) {
                        queue.offer(neighbor);
                    }
                }
            }
        }

        if (topoOrder.size() != adjList.size()) {
            throw new RuntimeException("Cycle detected. Topological sort is impossible.");
        }

        return topoOrder;
    }
}
