import java.util.*;

/**
 * Represents a weighted undirected graph of students and their relationships.
 * This graph is used for both pod formation (using Prim's algorithm) and
 * referral path finding (using Dijkstra's algorithm).
 * 
 * The graph uses an adjacency list representation where each student (node)
 * maps to a list of edges, where each edge connects to another student
 * and has a weight representing the connection strength.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class StudentGraph {
    /**
     * Represents an edge in the student graph, connecting two students
     * with a weight representing their connection strength.
     */
    public static class Edge {
        /** The neighboring student connected by this edge */
        public UniversityStudent neighbor;
        
        /** The weight of the edge representing connection strength */
        public int weight;

        /**
         * Constructs a new Edge with the specified neighbor and weight.
         * 
         * @param neighbor The neighboring student
         * @param weight The connection strength weight
         */
        public Edge(UniversityStudent neighbor, int weight) {
            this.neighbor = neighbor;
            this.weight = weight;
        }
    }

    /**
     * Constructs a new StudentGraph from a list of students.
     * Initializes the graph structure and builds edges between all pairs
     * of students based on their connection strengths.
     * 
     * @param students The list of UniversityStudent objects to add to the graph
     */
    public StudentGraph(List<UniversityStudent> students) {
        // TODO: Implementation
    }

    /**
     * Gets all nodes (students) in the graph.
     * 
     * @return A collection of all UniversityStudent nodes in the graph
     */
    public Collection<UniversityStudent> getAllNodes() {
        // TODO: Implementation
        return new ArrayList<>();
    }

    /**
     * Gets all neighbors (connected students) of a given student.
     * 
     * @param student The student to get neighbors for
     * @return A list of Edge objects representing connections to neighboring students
     */
    public List<Edge> getNeighbors(UniversityStudent student) {
        // TODO: Implementation
        return new ArrayList<>();
    }

    /**
     * Displays the graph structure, showing all students and their connections.
     * Useful for debugging and verification of the graph structure.
     */
    public void displayGraph() {
        // TODO: Implementation
    }
}

