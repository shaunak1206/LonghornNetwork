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
    /** Adjacency list mapping each student to their list of edges */
    private Map<UniversityStudent, List<Edge>> adjacencyList;
    
    /** Set of all nodes (students) in the graph */
    private Set<UniversityStudent> nodes;
    
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
        this.adjacencyList = new HashMap<>();
        this.nodes = new HashSet<>();
        
        // Add all students as nodes
        for (UniversityStudent student : students) {
            nodes.add(student);
            adjacencyList.put(student, new ArrayList<>());
        }
        
        // Build edges between all pairs of students
        for (int i = 0; i < students.size(); i++) {
            UniversityStudent student1 = students.get(i);
            for (int j = i + 1; j < students.size(); j++) {
                UniversityStudent student2 = students.get(j);
                
                // Calculate connection strength
                int strength = student1.calculateConnectionStrength(student2);
                
                // Only add edge if connection strength > 0
                if (strength > 0) {
                    addEdge(student1, student2, strength);
                }
            }
        }
    }
    
    /**
     * Adds an undirected edge between two students with the given weight.
     * 
     * @param student1 The first student
     * @param student2 The second student
     * @param weight The connection strength weight
     */
    private void addEdge(UniversityStudent student1, UniversityStudent student2, int weight) {
        // Add edge from student1 to student2
        adjacencyList.get(student1).add(new Edge(student2, weight));
        // Add edge from student2 to student1 (undirected graph)
        adjacencyList.get(student2).add(new Edge(student1, weight));
    }

    /**
     * Gets all nodes (students) in the graph.
     * 
     * @return A collection of all UniversityStudent nodes in the graph
     */
    public Collection<UniversityStudent> getAllNodes() {
        return new ArrayList<>(nodes);
    }

    /**
     * Gets all neighbors (connected students) of a given student.
     * 
     * @param student The student to get neighbors for
     * @return A list of Edge objects representing connections to neighboring students
     */
    public List<Edge> getNeighbors(UniversityStudent student) {
        List<Edge> neighbors = adjacencyList.get(student);
        return neighbors != null ? new ArrayList<>(neighbors) : new ArrayList<>();
    }

    /**
     * Displays the graph structure, showing all students and their connections.
     * Useful for debugging and verification of the graph structure.
     */
    public void displayGraph() {
        System.out.println("\n=== Student Graph ===");
        for (UniversityStudent student : nodes) {
            System.out.print(student.name + " -> [");
            List<Edge> edges = adjacencyList.get(student);
            for (int i = 0; i < edges.size(); i++) {
                Edge edge = edges.get(i);
                System.out.print("(" + edge.neighbor.name + ", " + edge.weight + ")");
                if (i < edges.size() - 1) {
                    System.out.print(", ");
                }
            }
            System.out.println("]");
        }
        System.out.println("====================\n");
    }
}

