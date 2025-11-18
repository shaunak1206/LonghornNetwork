import java.util.*;

/**
 * Handles the formation of pods (groups) of students using Prim's algorithm
 * to create minimum spanning trees based on connection strengths.
 * Pods are formed to maximize the strength of connections within each group.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class PodFormation {
    /** The student graph to form pods from */
    private StudentGraph graph;
    
    /** List of formed pods */
    private List<List<UniversityStudent>> pods;
    
    /**
     * Constructs a PodFormation instance with the given student graph.
     * 
     * @param graph The StudentGraph representing relationships between students
     */
    public PodFormation(StudentGraph graph) {
        this.graph = graph;
        this.pods = new ArrayList<>();
    }

    /**
     * Forms pods of the specified size using Prim's algorithm to create
     * minimum spanning trees. The algorithm minimizes the total weight
     * (maximizes connection strength) within each pod.
     * 
     * @param podSize The desired size of each pod
     */
    public void formPods(int podSize) {
        pods.clear();
        Set<UniversityStudent> unassigned = new HashSet<>(graph.getAllNodes());
        
        while (!unassigned.isEmpty()) {
            List<UniversityStudent> pod = new ArrayList<>();
            
            // Start with an unassigned student
            UniversityStudent start = unassigned.iterator().next();
            pod.add(start);
            unassigned.remove(start);
            
            // Use Prim's algorithm to grow the pod
            Set<UniversityStudent> inPod = new HashSet<>(pod);
            PriorityQueue<EdgeCandidate> candidates = new PriorityQueue<>(
                Comparator.comparingInt(e -> e.weight)
            );
            
            // Add edges from start to candidates
            for (StudentGraph.Edge edge : graph.getNeighbors(start)) {
                if (unassigned.contains(edge.neighbor)) {
                    candidates.offer(new EdgeCandidate(start, edge.neighbor, edge.weight));
                }
            }
            
            // Grow pod using Prim's algorithm until podSize is reached or no more candidates
            while (pod.size() < podSize && !candidates.isEmpty()) {
                EdgeCandidate best = candidates.poll();
                
                // Skip if the neighbor is already in pod or no longer unassigned
                if (!unassigned.contains(best.to) || inPod.contains(best.to)) {
                    continue;
                }
                
                // Add to pod
                pod.add(best.to);
                inPod.add(best.to);
                unassigned.remove(best.to);
                
                // Add new candidates from the newly added student
                for (StudentGraph.Edge edge : graph.getNeighbors(best.to)) {
                    if (unassigned.contains(edge.neighbor) && !inPod.contains(edge.neighbor)) {
                        candidates.offer(new EdgeCandidate(best.to, edge.neighbor, edge.weight));
                    }
                }
            }
            
            pods.add(pod);
        }
        
        // Print pod formation results
        System.out.println("\n=== Pod Formation (size: " + podSize + ") ===");
        for (int i = 0; i < pods.size(); i++) {
            System.out.print("Pod " + (i + 1) + ": [");
            List<UniversityStudent> pod = pods.get(i);
            for (int j = 0; j < pod.size(); j++) {
                System.out.print(pod.get(j).name);
                if (j < pod.size() - 1) {
                    System.out.print(", ");
                }
            }
            System.out.println("]");
        }
        System.out.println("==========================\n");
    }
    
    /**
     * Gets the list of formed pods.
     * 
     * @return The list of pods, where each pod is a list of students
     */
    public List<List<UniversityStudent>> getPods() {
        return new ArrayList<>(pods);
    }
    
    /**
     * Helper class for edge candidates in Prim's algorithm.
     */
    private static class EdgeCandidate {
        UniversityStudent to;
        int weight;
        
        EdgeCandidate(UniversityStudent from, UniversityStudent to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }
}
