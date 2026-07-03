package com.courseflow.service;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CycleDetectionAlgorithm {

    private enum Color {
        WHITE, // Unvisited
        GRAY,  // Visiting (in current recursion stack)
        BLACK  // Fully processed
    }

    /**
     * Runs DFS to detect cycles in the prerequisite graph.
     * Returns true if a cycle exists.
     */
    public boolean hasCycle(Map<Long, List<Long>> adjList) {
        Map<Long, Color> colors = new HashMap<>();
        
        for (Long nodeId : adjList.keySet()) {
            colors.put(nodeId, Color.WHITE);
        }

        for (Long nodeId : adjList.keySet()) {
            if (colors.get(nodeId) == Color.WHITE) {
                if (dfs(nodeId, adjList, colors)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(Long u, Map<Long, List<Long>> adjList, Map<Long, Color> colors) {
        colors.put(u, Color.GRAY);

        List<Long> neighbors = adjList.get(u);
        if (neighbors != null) {
            for (Long v : neighbors) {
                if (colors.get(v) == Color.GRAY) {
                    return true; // Cycle detected!
                }
                if (colors.get(v) == Color.WHITE && dfs(v, adjList, colors)) {
                    return true;
                }
            }
        }

        colors.put(u, Color.BLACK);
        return false;
    }
}
