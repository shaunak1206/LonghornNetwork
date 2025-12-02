/**
 * ReferralPathFinder.ts
 *
 * Finds referral paths to students who have interned at a specific company
 * using Dijkstra's algorithm. The path finding prioritizes stronger connections
 * by inverting edge weights (treating stronger connections as shorter paths).
 *
 * Algorithm: Dijkstra's Shortest Path
 * - Modified to invert weights: stronger connections = shorter paths
 * - Uses a priority queue for efficient node selection
 * - Terminates early when target is found
 *
 * Use Case:
 * When a student wants a referral to company X, this algorithm finds
 * the path through the strongest connections to someone who interned at X.
 *
 * Time Complexity: O((V + E) log V) where V = students, E = connections
 * Space Complexity: O(V) for distance and previous maps
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

import { UniversityStudent } from '../models/UniversityStudent';
import { StudentGraph } from '../models/StudentGraph';

/**
 * Helper class for priority queue entries in Dijkstra's algorithm.
 * Represents a student with their current distance from the source.
 */
class PriorityQueueNode {
  /** The current shortest distance from source to this student */
  distance: number;

  /** The student node */
  student: UniversityStudent;

  /**
   * Creates a new priority queue node.
   *
   * @param distance - The distance from source
   * @param student - The student
   */
  constructor(distance: number, student: UniversityStudent) {
    this.distance = distance;
    this.student = student;
  }
}

/**
 * Simple priority queue implementation using an array with insertion sort.
 * For production, consider using a more efficient heap-based implementation.
 *
 * This implementation is chosen for clarity and ease of understanding.
 */
class MinPriorityQueue {
  private items: PriorityQueueNode[] = [];

  /**
   * Adds an item to the queue and maintains sorted order.
   *
   * Time Complexity: O(n) for insertion
   *
   * @param node - The node to add
   */
  offer(node: PriorityQueueNode): void {
    // Insert in sorted order (binary search could optimize this)
    let inserted = false;
    for (let i = 0; i < this.items.length; i++) {
      if (node.distance < this.items[i].distance) {
        this.items.splice(i, 0, node);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.items.push(node);
    }
  }

  /**
   * Removes and returns the item with minimum distance.
   *
   * Time Complexity: O(1)
   *
   * @returns The node with minimum distance, or undefined if empty
   */
  poll(): PriorityQueueNode | undefined {
    return this.items.shift();
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns true if empty, false otherwise
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

/**
 * ReferralPathFinder class implements Dijkstra's algorithm to find
 * the strongest connection path to students with specific internships.
 *
 * Key Features:
 * - Finds shortest path using inverted weights (stronger = shorter)
 * - Early termination when target company is found
 * - Reconstructs complete path from source to target
 * - Handles disconnected graphs gracefully
 */
export class ReferralPathFinder {
  /** The student graph to search */
  private graph: StudentGraph;

  /**
   * Constructs a ReferralPathFinder with the given student graph.
   *
   * @param graph - The StudentGraph representing relationships between students
   */
  constructor(graph: StudentGraph) {
    this.graph = graph;
  }

  /**
   * Finds the shortest referral path from a starting student to a student
   * who has interned at the target company using Dijkstra's algorithm.
   *
   * Algorithm Steps:
   * 1. Check if start student has the target internship (base case)
   * 2. Initialize data structures:
   *    - Priority queue: nodes to visit, ordered by distance
   *    - Distance map: shortest known distance to each student
   *    - Previous map: previous student in shortest path
   *    - Visited set: students already processed
   * 3. Add start node to queue with distance 0
   * 4. While queue is not empty:
   *    a. Pop student with minimum distance
   *    b. If already visited, skip
   *    c. Mark as visited
   *    d. If has target internship, reconstruct and return path
   *    e. For each neighbor:
   *       - Calculate new distance with inverted weight
   *       - If shorter than known distance, update and add to queue
   * 5. If queue empties without finding target, return empty array
   *
   * Weight Inversion:
   * - Original weight W represents connection strength (higher = stronger)
   * - Inverted weight = max(1, 10 - W)
   * - This makes stronger connections "shorter" in Dijkstra's algorithm
   * - Example: Weight 9 (strong) -> inverted 1 (short path)
   *           Weight 1 (weak) -> inverted 9 (long path)
   *
   * Edge Cases:
   * - Start student has target internship: Returns single-element path
   * - No student with target internship: Returns empty array
   * - Disconnected graph: Returns empty array if target unreachable
   * - Multiple students with target: Returns path to closest one
   *
   * Example:
   * ```typescript
   * const pathFinder = new ReferralPathFinder(graph);
   * const path = pathFinder.findReferralPath(alice, "Google");
   * // path = [alice, bob, charlie] where charlie interned at Google
   * // and alice->bob->charlie is the strongest connection path
   * ```
   *
   * @param start - The starting student to begin the path search from
   * @param targetCompany - The name of the company to find a referral path to
   * @returns An array of UniversityStudent objects representing the path from start
   *          to a student with the target internship, or an empty array if no path exists
   */
  public findReferralPath(start: UniversityStudent, targetCompany: string): UniversityStudent[] {
    // Base case: Check if start student has the target internship
    if (start.getPreviousInternships().includes(targetCompany)) {
      return [start];
    }

    // Priority queue for Dijkstra's algorithm: (distance, student)
    const pq = new MinPriorityQueue();

    // Distance map: student -> shortest distance from start
    const distances = new Map<UniversityStudent, number>();

    // Previous map: student -> previous student in shortest path
    const previous = new Map<UniversityStudent, UniversityStudent>();

    // Visited set to avoid reprocessing nodes
    const visited = new Set<UniversityStudent>();

    // Initialize distances to infinity
    for (const student of this.graph.getAllNodes()) {
      distances.set(student, Infinity);
    }

    // Start node has distance 0
    distances.set(start, 0);
    pq.offer(new PriorityQueueNode(0, start));

    let targetStudent: UniversityStudent | null = null;

    // Dijkstra's algorithm main loop
    while (!pq.isEmpty()) {
      const current = pq.poll()!;
      const currentStudent = current.student;

      // Skip if already visited (can happen with duplicate entries in PQ)
      if (visited.has(currentStudent)) {
        continue;
      }

      // Mark as visited
      visited.add(currentStudent);

      // Check if this student has the target internship
      if (currentStudent.getPreviousInternships().includes(targetCompany)) {
        targetStudent = currentStudent;
        break; // Found target, early termination
      }

      // Explore neighbors
      const neighbors = this.graph.getNeighbors(currentStudent);
      for (const edge of neighbors) {
        const neighbor = edge.neighbor;

        // Skip if already visited
        if (visited.has(neighbor)) {
          continue;
        }

        // Invert weight: stronger connections = shorter paths
        // Use max(1, 10 - weight) to ensure positive weights
        // This handles edge case where weight might be >= 10
        const invertedWeight = Math.max(1, 10 - edge.weight);
        const newDistance = distances.get(currentStudent)! + invertedWeight;

        // If we found a shorter path to neighbor, update it
        if (newDistance < distances.get(neighbor)!) {
          distances.set(neighbor, newDistance);
          previous.set(neighbor, currentStudent);
          pq.offer(new PriorityQueueNode(newDistance, neighbor));
        }
      }
    }

    // Reconstruct path if target was found
    if (targetStudent === null) {
      return []; // No path found
    }

    // Reconstruct path from start to target using previous map
    const path: UniversityStudent[] = [];
    let current: UniversityStudent | undefined = targetStudent;

    while (current !== undefined) {
      path.unshift(current); // Add to front of array
      current = previous.get(current);
    }

    return path;
  }

  /**
   * Finds all students who have interned at a specific company.
   *
   * This is a helper method useful for:
   * - Validating that target companies exist in the network
   * - Displaying all possible referral sources for a company
   * - Testing the findReferralPath method
   *
   * Time Complexity: O(n) where n is the number of students
   *
   * Example:
   * ```typescript
   * const googleInterns = pathFinder.findStudentsWithInternship("Google");
   * // Returns all students who interned at Google
   * ```
   *
   * @param company - The company name to search for
   * @returns An array of students who have interned at the company
   */
  public findStudentsWithInternship(company: string): UniversityStudent[] {
    const result: UniversityStudent[] = [];

    for (const student of this.graph.getAllNodes()) {
      if (student.getPreviousInternships().includes(company)) {
        result.push(student);
      }
    }

    return result;
  }

  /**
   * Calculates the total connection strength along a path.
   *
   * Useful for:
   * - Comparing different paths
   * - Displaying path quality in the UI
   * - Validating that the algorithm found the strongest path
   *
   * @param path - The path to calculate strength for
   * @returns The sum of connection weights along the path
   */
  public calculatePathStrength(path: UniversityStudent[]): number {
    if (path.length < 2) {
      return 0;
    }

    let totalStrength = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const weight = this.graph.getConnectionWeight(path[i], path[i + 1]);
      totalStrength += weight;
    }

    return totalStrength;
  }

  /**
   * Gets a formatted string representation of a referral path.
   *
   * @param path - The path to format
   * @returns A human-readable string showing the path
   */
  public formatPath(path: UniversityStudent[]): string {
    if (path.length === 0) {
      return 'No path found';
    }

    const names = path.map((s) => s.getName());
    return names.join(' -> ');
  }
}
