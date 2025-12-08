/**
 * PodFormation.ts
 *
 * Handles the formation of pods (groups) of students using Prim's algorithm
 * to create minimum spanning trees based on connection strengths.
 * Pods are formed to maximize the strength of connections within each group.
 *
 * Algorithm: Modified Prim's Minimum Spanning Tree
 * - Groups students into pods of specified size
 * - Minimizes total edge weight (maximizes connection strength)
 * - Handles disconnected components gracefully
 *
 * Use Case:
 * Form study groups, project teams, or social pods where students
 * have strong connections to each other for better collaboration.
 *
 * Time Complexity: O(n * podSize * log(podSize)) for all pods
 * Space Complexity: O(n) for tracking unassigned students
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

import { UniversityStudent } from '../models/UniversityStudent';
import { StudentGraph } from '../models/StudentGraph';

/**
 * Helper class for edge candidates in Prim's algorithm.
 * Represents a potential edge to add to the growing spanning tree.
 */
class EdgeCandidate {
  /** The student this edge points to */
  to: UniversityStudent;

  /** The weight of this edge (lower = stronger connection for MST) */
  weight: number;

  /**
   * Creates a new edge candidate.
   *
   * @param to - The destination student
   * @param weight - The edge weight
   */
  constructor(to: UniversityStudent, weight: number) {
    this.to = to;
    this.weight = weight;
  }
}

/**
 * Simple priority queue for edge candidates.
 * Maintains edges in sorted order by weight (ascending).
 */
class EdgePriorityQueue {
  private items: EdgeCandidate[] = [];

  /**
   * Adds an edge candidate to the queue.
   *
   * Time Complexity: O(n) for insertion sort
   *
   * @param candidate - The edge candidate to add
   */
  offer(candidate: EdgeCandidate): void {
    let inserted = false;
    for (let i = 0; i < this.items.length; i++) {
      if (candidate.weight < this.items[i].weight) {
        this.items.splice(i, 0, candidate);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.items.push(candidate);
    }
  }

  /**
   * Removes and returns the edge with minimum weight.
   *
   * Time Complexity: O(1)
   *
   * @returns The edge candidate with minimum weight, or undefined if empty
   */
  poll(): EdgeCandidate | undefined {
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
 * PodFormation class implements Prim's algorithm to form
 * optimal student groups (pods) based on connection strengths.
 *
 * Key Features:
 * - Forms pods of specified size using minimum spanning tree
 * - Handles disconnected graphs (creates multiple components)
 * - Maximizes intra-pod connection strength
 * - Gracefully handles uneven divisions (last pod may be smaller)
 */
export class PodFormation {
  /** The student graph to form pods from */
  private graph: StudentGraph;

  /** List of formed pods (each pod is an array of students) */
  private pods: UniversityStudent[][] = [];

  /**
   * Constructs a PodFormation instance with the given student graph.
   *
   * @param graph - The StudentGraph representing relationships between students
   */
  constructor(graph: StudentGraph) {
    this.graph = graph;
  }

  /**
   * Forms pods of the specified size using Prim's algorithm to create
   * minimum spanning trees. The algorithm minimizes the total weight
   * (maximizes connection strength) within each pod.
   *
   * Algorithm Steps:
   * 1. Clear previous pod assignments
   * 2. Create set of unassigned students
   * 3. While there are unassigned students:
   *    a. Start a new pod with an unassigned student
   *    b. Use Prim's algorithm to grow the pod:
   *       - Maintain a priority queue of edge candidates
   *       - Always add the edge with minimum weight (strongest connection)
   *       - Continue until pod reaches desired size or no more candidates
   *    c. Add completed pod to the list
   * 4. Return the list of pods
   *
   * Prim's Algorithm Details:
   * - Start with one student in the pod
   * - Maintain a priority queue of edges from pod to non-pod students
   * - Repeatedly add the minimum weight edge (strongest connection)
   * - Stop when pod reaches desired size or queue is empty
   *
   * Edge Cases:
   * - Last pod may be smaller than podSize if students don't divide evenly
   * - Disconnected graph: Forms multiple independent pods
   * - podSize = 1: Each student forms their own pod
   * - podSize >= total students: All students in one pod
   *
   * Example:
   * ```typescript
   * const podFormation = new PodFormation(graph);
   * podFormation.formPods(3); // Form pods of size 3
   * const pods = podFormation.getPods();
   * // pods = [[alice, bob, charlie], [dave, eve, frank], [grace]]
   * ```
   *
   * @param podSize - The desired size of each pod (must be >= 1)
   * @returns The array of formed pods
   */
  public formPods(podSize: number): UniversityStudent[][] {
    // Validate input
    if (podSize < 1) {
      throw new Error('Pod size must be at least 1');
    }

    // Clear previous pods
    this.pods = [];

    // Set of unassigned students
    const unassigned = new Set<UniversityStudent>(this.graph.getAllNodes());

    // Keep forming pods until all students are assigned
    while (unassigned.size > 0) {
      const pod: UniversityStudent[] = [];

      // Start with an unassigned student (arbitrary choice)
      const start = unassigned.values().next().value;
      pod.push(start);
      unassigned.delete(start);

      // Use Prim's algorithm to grow the pod
      const inPod = new Set<UniversityStudent>([start]);
      const candidates = new EdgePriorityQueue();

      // Add edges from start to candidates
      for (const edge of this.graph.getNeighbors(start)) {
        if (unassigned.has(edge.neighbor)) {
          candidates.offer(new EdgeCandidate(edge.neighbor, edge.weight));
        }
      }

      // Grow pod using Prim's algorithm until podSize is reached or no more candidates
      while (pod.length < podSize && !candidates.isEmpty()) {
        const best = candidates.poll()!;

        // Skip if the neighbor is already in pod or no longer unassigned
        if (!unassigned.has(best.to) || inPod.has(best.to)) {
          continue;
        }

        // Add to pod
        pod.push(best.to);
        inPod.add(best.to);
        unassigned.delete(best.to);

        // Add new candidates from the newly added student
        for (const edge of this.graph.getNeighbors(best.to)) {
          if (unassigned.has(edge.neighbor) && !inPod.has(edge.neighbor)) {
            candidates.offer(new EdgeCandidate(edge.neighbor, edge.weight));
          }
        }
      }

      // Add completed pod to the list
      this.pods.push(pod);
    }

    return this.pods;
  }

  /**
   * Gets the list of formed pods.
   *
   * Returns a copy to prevent external modification of the internal state.
   *
   * @returns The array of pods, where each pod is an array of students
   */
  public getPods(): UniversityStudent[][] {
    // Return a deep copy
    return this.pods.map((pod) => [...pod]);
  }

  /**
   * Calculates the total connection strength within a pod.
   *
   * This sums all edge weights between students in the pod.
   * Useful for evaluating pod quality.
   *
   * Example:
   * ```typescript
   * const pod = [alice, bob, charlie];
   * const strength = podFormation.calculatePodStrength(pod);
   * // Returns sum of: alice-bob, bob-charlie, alice-charlie connections
   * ```
   *
   * @param pod - The pod to calculate strength for
   * @returns The sum of all connection weights within the pod
   */
  public calculatePodStrength(pod: UniversityStudent[]): number {
    let totalStrength = 0;

    // Sum all edge weights within the pod
    for (let i = 0; i < pod.length; i++) {
      for (let j = i + 1; j < pod.length; j++) {
        const weight = this.graph.getConnectionWeight(pod[i], pod[j]);
        totalStrength += weight;
      }
    }

    return totalStrength;
  }

  /**
   * Gets statistics about the formed pods.
   *
   * Useful for displaying summary information in the UI.
   *
   * @returns An object containing pod statistics
   */
  public getPodStatistics(): {
    totalPods: number;
    averageSize: number;
    minSize: number;
    maxSize: number;
    totalStrength: number;
    averageStrength: number;
  } {
    if (this.pods.length === 0) {
      return {
        totalPods: 0,
        averageSize: 0,
        minSize: 0,
        maxSize: 0,
        totalStrength: 0,
        averageStrength: 0,
      };
    }

    const sizes = this.pods.map((pod) => pod.length);
    const strengths = this.pods.map((pod) => this.calculatePodStrength(pod));

    return {
      totalPods: this.pods.length,
      averageSize: sizes.reduce((a, b) => a + b, 0) / sizes.length,
      minSize: Math.min(...sizes),
      maxSize: Math.max(...sizes),
      totalStrength: strengths.reduce((a, b) => a + b, 0),
      averageStrength: strengths.reduce((a, b) => a + b, 0) / strengths.length,
    };
  }

  /**
   * Gets a formatted string representation of the pods.
   *
   * Example output:
   * ```
   * Pod 1: [Alice, Bob, Charlie]
   * Pod 2: [Dave, Eve, Frank]
   * ```
   *
   * @returns A human-readable string showing all pods
   */
  public formatPods(): string {
    if (this.pods.length === 0) {
      return 'No pods formed';
    }

    const lines: string[] = [];
    for (let i = 0; i < this.pods.length; i++) {
      const names = this.pods[i].map((s) => s.getName());
      lines.push(`Pod ${i + 1}: [${names.join(', ')}]`);
    }

    return lines.join('\n');
  }

  /**
   * Validates that all students are assigned to exactly one pod.
   *
   * This is a sanity check to ensure the algorithm worked correctly.
   *
   * @param allStudents - The complete list of students
   * @returns true if all students are assigned to exactly one pod
   */
  public validatePods(allStudents: UniversityStudent[]): boolean {
    const assignedStudents = new Set<UniversityStudent>();

    // Check each pod
    for (const pod of this.pods) {
      for (const student of pod) {
        // Check for duplicates
        if (assignedStudents.has(student)) {
          console.error(`Student ${student.getName()} appears in multiple pods`);
          return false;
        }
        assignedStudents.add(student);
      }
    }

    // Check that all students are assigned
    for (const student of allStudents) {
      if (!assignedStudents.has(student)) {
        console.error(`Student ${student.getName()} is not assigned to any pod`);
        return false;
      }
    }

    return true;
  }
}
