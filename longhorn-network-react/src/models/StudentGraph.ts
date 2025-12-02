/**
 * StudentGraph.ts
 *
 * Represents a weighted undirected graph of students and their relationships.
 * This graph is used for multiple algorithms:
 * - Pod formation (using Prim's algorithm)
 * - Referral path finding (using Dijkstra's algorithm)
 *
 * Data Structure: Adjacency List
 * - Each student (node) maps to a list of edges
 * - Each edge connects to another student with a weight (connection strength)
 *
 * Graph Properties:
 * - Undirected: If A connects to B, then B connects to A
 * - Weighted: Each edge has a weight representing connection strength
 * - Sparse: Only students with non-zero connection strength have edges
 *
 * Time Complexity:
 * - Construction: O(n²) where n is the number of students
 * - Get neighbors: O(1) average case
 * - Get all nodes: O(n)
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

import { UniversityStudent } from './UniversityStudent';

/**
 * Represents an edge in the student graph connecting two students
 * with a weight representing their connection strength.
 *
 * This is a simple data class used to store edge information.
 */
export class Edge {
  /** The neighboring student connected by this edge */
  public neighbor: UniversityStudent;

  /** The weight of the edge representing connection strength (higher = stronger) */
  public weight: number;

  /**
   * Constructs a new Edge with the specified neighbor and weight.
   *
   * @param neighbor - The neighboring student
   * @param weight - The connection strength weight (typically 1-13)
   */
  constructor(neighbor: UniversityStudent, weight: number) {
    this.neighbor = neighbor;
    this.weight = weight;
  }
}

/**
 * StudentGraph class represents the social network of students
 * as a weighted undirected graph.
 *
 * This graph is the core data structure for:
 * 1. Visualizing the network
 * 2. Finding referral paths (Dijkstra's algorithm)
 * 3. Forming pods/groups (Prim's algorithm)
 *
 * Implementation Details:
 * - Uses a Map for O(1) average case neighbor lookup
 * - Stores all nodes in a Set for O(1) membership testing
 * - Only creates edges for students with non-zero connection strength
 */
export class StudentGraph {
  /**
   * Adjacency list mapping each student to their list of edges.
   * This is the primary data structure for the graph.
   */
  private adjacencyList: Map<UniversityStudent, Edge[]>;

  /**
   * Set of all nodes (students) in the graph.
   * Provides O(1) membership testing and easy iteration.
   */
  private nodes: Set<UniversityStudent>;

  /**
   * Constructs a new StudentGraph from a list of students.
   * Initializes the graph structure and builds edges between all pairs
   * of students based on their connection strengths.
   *
   * Algorithm:
   * 1. Initialize adjacency list and node set
   * 2. Add all students as nodes
   * 3. For each pair of students (i, j) where i < j:
   *    a. Calculate connection strength
   *    b. If strength > 0, add bidirectional edge
   *
   * Time Complexity: O(n²) where n is the number of students
   * Space Complexity: O(n + e) where e is the number of edges
   *
   * Edge Cases:
   * - Empty student list: Creates an empty graph
   * - Single student: Creates a graph with one node and no edges
   * - No connections: Creates nodes but no edges (disconnected graph)
   *
   * Example:
   * ```typescript
   * const students = [alice, bob, charlie];
   * const graph = new StudentGraph(students);
   * // Graph now contains all students with edges based on connection strengths
   * ```
   *
   * @param students - The list of UniversityStudent objects to add to the graph
   */
  constructor(students: UniversityStudent[]) {
    this.adjacencyList = new Map();
    this.nodes = new Set();

    // Add all students as nodes
    for (const student of students) {
      this.nodes.add(student);
      this.adjacencyList.set(student, []);
    }

    // Build edges between all pairs of students
    // Use nested loop with i < j to avoid duplicate edges and self-loops
    for (let i = 0; i < students.length; i++) {
      const student1 = students[i];
      for (let j = i + 1; j < students.length; j++) {
        const student2 = students[j];

        // Calculate connection strength
        const strength = student1.calculateConnectionStrength(student2);

        // Only add edge if connection strength > 0
        // This creates a sparse graph with only meaningful connections
        if (strength > 0) {
          this.addEdge(student1, student2, strength);
        }
      }
    }
  }

  /**
   * Adds an undirected edge between two students with the given weight.
   *
   * This is a private helper method used during graph construction.
   * It adds the edge in both directions to maintain the undirected property.
   *
   * Invariant: After calling addEdge(A, B, w), both:
   * - A's adjacency list contains an edge to B with weight w
   * - B's adjacency list contains an edge to A with weight w
   *
   * @param student1 - The first student
   * @param student2 - The second student
   * @param weight - The connection strength weight
   */
  private addEdge(student1: UniversityStudent, student2: UniversityStudent, weight: number): void {
    // Add edge from student1 to student2
    this.adjacencyList.get(student1)!.push(new Edge(student2, weight));

    // Add edge from student2 to student1 (undirected graph)
    this.adjacencyList.get(student2)!.push(new Edge(student1, weight));
  }

  /**
   * Gets all nodes (students) in the graph.
   *
   * Returns an array copy to prevent external modification of the node set.
   *
   * Use Cases:
   * - Iterating over all students in the network
   * - Initializing algorithm data structures (Dijkstra, Prim)
   * - Displaying all students in the UI
   *
   * Time Complexity: O(n) where n is the number of nodes
   *
   * @returns An array of all UniversityStudent nodes in the graph
   */
  public getAllNodes(): UniversityStudent[] {
    return Array.from(this.nodes);
  }

  /**
   * Gets all neighbors (connected students) of a given student.
   *
   * Returns the list of edges connected to the specified student.
   * Each edge contains a neighbor student and the connection weight.
   *
   * Use Cases:
   * - Dijkstra's algorithm: Exploring adjacent nodes
   * - Prim's algorithm: Finding minimum weight edges
   * - UI visualization: Displaying connections for a selected student
   *
   * Time Complexity: O(1) average case (map lookup)
   * Space Complexity: O(k) where k is the number of neighbors
   *
   * Edge Cases:
   * - Student not in graph: Returns empty array
   * - Student with no connections: Returns empty array
   *
   * Example:
   * ```typescript
   * const neighbors = graph.getNeighbors(alice);
   * for (const edge of neighbors) {
   *   console.log(`${alice.getName()} -> ${edge.neighbor.getName()} (weight: ${edge.weight})`);
   * }
   * ```
   *
   * @param student - The student to get neighbors for
   * @returns An array of Edge objects representing connections to neighboring students
   */
  public getNeighbors(student: UniversityStudent): Edge[] {
    const neighbors = this.adjacencyList.get(student);
    return neighbors ? [...neighbors] : [];
  }

  /**
   * Displays the graph structure in a human-readable format.
   * Outputs the adjacency list representation to the console.
   *
   * Format:
   * Alice -> [(Bob, 7), (Charlie, 5)]
   * Bob -> [(Alice, 7), (Charlie, 2)]
   * Charlie -> [(Alice, 5), (Bob, 2)]
   *
   * Use Cases:
   * - Debugging graph construction
   * - Verifying edge weights
   * - Testing and validation
   *
   * @returns A string representation of the graph
   */
  public displayGraph(): string {
    let output = '\n=== Student Graph ===\n';

    for (const student of this.nodes) {
      output += `${student.getName()} -> [`;
      const edges = this.adjacencyList.get(student)!;

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        output += `(${edge.neighbor.getName()}, ${edge.weight})`;
        if (i < edges.length - 1) {
          output += ', ';
        }
      }

      output += ']\n';
    }

    output += '====================\n';
    return output;
  }

  /**
   * Gets the number of nodes in the graph.
   *
   * @returns The total number of students in the graph
   */
  public getNodeCount(): number {
    return this.nodes.size;
  }

  /**
   * Gets the total number of edges in the graph.
   *
   * Note: Since the graph is undirected, each connection is counted once,
   * even though it appears in two adjacency lists.
   *
   * @returns The total number of unique edges in the graph
   */
  public getEdgeCount(): number {
    let count = 0;
    for (const edges of this.adjacencyList.values()) {
      count += edges.length;
    }
    // Divide by 2 because each edge is counted twice (undirected graph)
    return count / 2;
  }

  /**
   * Checks if two students are connected in the graph.
   *
   * @param student1 - The first student
   * @param student2 - The second student
   * @returns true if there is an edge between the students, false otherwise
   */
  public areConnected(student1: UniversityStudent, student2: UniversityStudent): boolean {
    const neighbors = this.adjacencyList.get(student1);
    if (!neighbors) return false;

    return neighbors.some((edge) => edge.neighbor === student2);
  }

  /**
   * Gets the connection weight between two students.
   *
   * @param student1 - The first student
   * @param student2 - The second student
   * @returns The connection weight, or 0 if not connected
   */
  public getConnectionWeight(student1: UniversityStudent, student2: UniversityStudent): number {
    const neighbors = this.adjacencyList.get(student1);
    if (!neighbors) return 0;

    const edge = neighbors.find((e) => e.neighbor === student2);
    return edge ? edge.weight : 0;
  }
}
