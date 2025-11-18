import java.util.*;

/**
 * Finds referral paths to students who have interned at a specific company
 * using Dijkstra's algorithm. The path finding prioritizes stronger connections
 * by inverting edge weights (treating stronger connections as shorter paths).
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class ReferralPathFinder {
    /** The student graph to search */
    private StudentGraph graph;
    
    /**
     * Constructs a ReferralPathFinder with the given student graph.
     * 
     * @param graph The StudentGraph representing relationships between students
     */
    public ReferralPathFinder(StudentGraph graph) {
        this.graph = graph;
    }

    /**
     * Finds the shortest referral path from a starting student to a student
     * who has interned at the target company using Dijkstra's algorithm.
     * 
     * The algorithm inverts connection weights (uses 10 - weight) so that
     * stronger connections are treated as shorter paths, ensuring the path
     * with the strongest overall connections is found.
     * 
     * @param start The starting student to begin the path search from
     * @param targetCompany The name of the company to find a referral path to
     * @return A list of UniversityStudent objects representing the path from start
     *         to a student with the target internship, or an empty list if no path exists
     */
    public List<UniversityStudent> findReferralPath(UniversityStudent start, String targetCompany) {
        // Check if start student has the target internship
        if (start.previousInternships.contains(targetCompany)) {
            return Arrays.asList(start);
        }
        
        // Priority queue for Dijkstra's algorithm: (distance, student)
        PriorityQueue<Pair> pq = new PriorityQueue<>(Comparator.comparingInt(p -> p.distance));
        
        // Distance map: student -> shortest distance from start
        Map<UniversityStudent, Integer> distances = new HashMap<>();
        
        // Previous map: student -> previous student in shortest path
        Map<UniversityStudent, UniversityStudent> previous = new HashMap<>();
        
        // Visited set
        Set<UniversityStudent> visited = new HashSet<>();
        
        // Initialize distances
        for (UniversityStudent student : graph.getAllNodes()) {
            distances.put(student, Integer.MAX_VALUE);
        }
        distances.put(start, 0);
        pq.offer(new Pair(0, start));
        
        UniversityStudent targetStudent = null;
        
        // Dijkstra's algorithm
        while (!pq.isEmpty()) {
            Pair current = pq.poll();
            UniversityStudent currentStudent = current.student;
            
            if (visited.contains(currentStudent)) {
                continue;
            }
            
            visited.add(currentStudent);
            
            // Check if this student has the target internship
            if (currentStudent.previousInternships.contains(targetCompany)) {
                targetStudent = currentStudent;
                break; // Found target, reconstruct path
            }
            
            // Explore neighbors
            List<StudentGraph.Edge> neighbors = graph.getNeighbors(currentStudent);
            for (StudentGraph.Edge edge : neighbors) {
                UniversityStudent neighbor = edge.neighbor;
                
                if (visited.contains(neighbor)) {
                    continue;
                }
                
                // Invert weight: stronger connections = shorter paths
                // Use 10 - weight, but handle edge case where weight might be >= 10
                int invertedWeight = Math.max(1, 10 - edge.weight);
                int newDistance = distances.get(currentStudent) + invertedWeight;
                
                if (newDistance < distances.get(neighbor)) {
                    distances.put(neighbor, newDistance);
                    previous.put(neighbor, currentStudent);
                    pq.offer(new Pair(newDistance, neighbor));
                }
            }
        }
        
        // Reconstruct path if target was found
        if (targetStudent == null) {
            return new ArrayList<>(); // No path found
        }
        
        // Reconstruct path from start to target
        List<UniversityStudent> path = new ArrayList<>();
        UniversityStudent current = targetStudent;
        while (current != null) {
            path.add(0, current); // Add to front
            current = previous.get(current);
        }
        
        return path;
    }
    
    /**
     * Helper class for priority queue entries in Dijkstra's algorithm.
     */
    private static class Pair {
        int distance;
        UniversityStudent student;
        
        Pair(int distance, UniversityStudent student) {
            this.distance = distance;
            this.student = student;
        }
    }
}
