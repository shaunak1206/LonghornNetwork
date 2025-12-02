/**
 * GaleShapley.ts
 *
 * Implements the Gale-Shapley stable matching algorithm for roommate assignment.
 * This algorithm ensures that students are matched with roommates based on their
 * preferences in a stable manner, where no two students would prefer each other
 * over their current assignments.
 *
 * Algorithm Overview:
 * 1. Initialize all students as unpaired
 * 2. While there are unpaired students with remaining preferences:
 *    a. Student proposes to their next preferred roommate
 *    b. Receiver accepts if unpaired OR prefers proposer over current roommate
 *    c. If accepted, form new pairing (breaking old pairing if necessary)
 *    d. If rejected, proposer tries next preference
 *
 * Stability Property:
 * After completion, no two unpaired students both prefer each other over
 * their current roommates (or lack thereof).
 *
 * Time Complexity: O(n²) where n is the number of students
 * Space Complexity: O(n) for tracking proposal indices and queue
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

import { UniversityStudent } from '../models/UniversityStudent';

/**
 * GaleShapley class provides static methods for stable roommate matching.
 *
 * This implementation handles several edge cases:
 * - Students without preferences remain unpaired
 * - Incomplete preference lists
 * - Cyclic preferences
 * - Uneven number of students
 * - Non-existent students in preference lists
 */
export class GaleShapley {
  /**
   * Assigns roommates to students using the Gale-Shapley stable matching algorithm.
   *
   * Algorithm Details:
   * 1. Create a map from student names to student objects for O(1) lookup
   * 2. Initialize all students as unpaired
   * 3. Create a queue of unpaired students who have preferences
   * 4. Track proposal indices to remember which preferences have been tried
   * 5. Process proposals until the queue is empty:
   *    - Proposer proposes to their next preferred roommate
   *    - Receiver accepts if:
   *      a. They are unpaired AND have proposer in their preferences, OR
   *      b. They are paired but prefer proposer over current roommate
   *    - Update pairings and queue accordingly
   *
   * Edge Cases Handled:
   * - Students with empty preference lists: Remain unpaired
   * - Preference for non-existent student: Skipped
   * - Odd number of students: One student remains unpaired
   * - Mutual preferences: Matched quickly
   * - One-sided preferences: Proposer may remain unpaired
   *
   * Stability Guarantee:
   * After completion, there are no two students who:
   * 1. Both have each other in their preference lists
   * 2. Both prefer each other over their current roommate (or being unpaired)
   *
   * Example:
   * ```typescript
   * const students = [alice, bob, charlie];
   * GaleShapley.assignRoommates(students);
   * // Now alice.getRoommate() and bob.getRoommate() will be set if matched
   * ```
   *
   * @param students - The array of UniversityStudent objects to match as roommates
   * @returns void (students are modified in-place with roommate assignments)
   */
  public static assignRoommates(students: UniversityStudent[]): void {
    // Create a map from student names to student objects for quick lookup
    // This enables O(1) lookup when processing preference lists
    const studentMap = new Map<string, UniversityStudent>();
    for (const student of students) {
      studentMap.set(student.getName(), student);
    }

    // Initialize: all students start unpaired
    for (const student of students) {
      student.setRoommate(null);
    }

    // Queue of unpaired students who still have preferences
    // Only students with preferences can participate in matching
    const unpairedQueue: UniversityStudent[] = [];
    for (const student of students) {
      if (student.getRoommatePreferences().length > 0 && student.getRoommate() === null) {
        unpairedQueue.push(student);
      }
    }

    // Track how many preferences each student has proposed to
    // This prevents infinite loops and ensures each preference is tried once
    const proposalIndex = new Map<UniversityStudent, number>();
    for (const student of students) {
      proposalIndex.set(student, 0);
    }

    // Process proposals until queue is empty
    while (unpairedQueue.length > 0) {
      const proposer = unpairedQueue.shift()!;

      // Skip if proposer has no more preferences
      const currentIndex = proposalIndex.get(proposer)!;
      const preferences = proposer.getRoommatePreferences();
      if (currentIndex >= preferences.length) {
        continue; // No more preferences, remains unpaired
      }

      // Get the next preferred roommate
      const preferredName = preferences[currentIndex];
      const receiver = studentMap.get(preferredName);

      // Increment proposal index for next time
      proposalIndex.set(proposer, currentIndex + 1);

      if (!receiver) {
        // Preferred roommate doesn't exist in the student list
        // Continue to next preference
        unpairedQueue.push(proposer);
        continue;
      }

      // Check if receiver is unpaired
      if (receiver.getRoommate() === null) {
        // Receiver accepts the proposal only if they have proposer in preferences
        // This ensures mutual compatibility
        const receiverPrefs = receiver.getRoommatePreferences();
        if (receiverPrefs.length === 0 || receiverPrefs.includes(proposer.getName())) {
          // Clear proposer's old pairing if they have one
          if (proposer.getRoommate() !== null) {
            const oldRoommate = proposer.getRoommate()!;
            proposer.setRoommate(null);
            oldRoommate.setRoommate(null);

            // Add old roommate back to queue if they have more preferences
            const oldRoommateIndex = proposalIndex.get(oldRoommate)!;
            if (oldRoommate.getRoommate() === null && oldRoommateIndex < oldRoommate.getRoommatePreferences().length) {
              unpairedQueue.push(oldRoommate);
            }
          }

          // Create new pairing
          proposer.setRoommate(receiver);
          receiver.setRoommate(proposer);
        } else {
          // Receiver doesn't have proposer in preferences, reject
          // Add proposer back to queue only if unpaired and has more preferences
          const proposerIndex = proposalIndex.get(proposer)!;
          if (proposer.getRoommate() === null && proposerIndex < proposer.getRoommatePreferences().length) {
            unpairedQueue.push(proposer);
          }
        }
      } else {
        // Receiver is already paired, check if they prefer proposer
        const currentRoommate = receiver.getRoommate()!;

        // Check if receiver has proposer and current roommate in preferences
        const receiverPrefs = receiver.getRoommatePreferences();
        const hasProposer = receiverPrefs.includes(proposer.getName());
        const hasCurrent = receiverPrefs.includes(currentRoommate.getName());

        // If receiver doesn't have proposer in preferences, reject
        if (!hasProposer) {
          const proposerIndex = proposalIndex.get(proposer)!;
          if (proposer.getRoommate() === null && proposerIndex < proposer.getRoommatePreferences().length) {
            unpairedQueue.push(proposer);
          }
          continue;
        }

        // If receiver doesn't have current roommate in preferences, accept proposer
        // OR if receiver prefers proposer over current roommate
        if (!hasCurrent || GaleShapley.prefersOver(receiver, proposer, currentRoommate)) {
          // Clear proposer's old pairing if they have one
          if (proposer.getRoommate() !== null) {
            const oldProposerRoommate = proposer.getRoommate()!;
            proposer.setRoommate(null);
            oldProposerRoommate.setRoommate(null);

            // Add old roommate back to queue
            const oldIndex = proposalIndex.get(oldProposerRoommate)!;
            if (oldProposerRoommate.getRoommate() === null && oldIndex < oldProposerRoommate.getRoommatePreferences().length) {
              unpairedQueue.push(oldProposerRoommate);
            }
          }

          // Break receiver's current pairing
          currentRoommate.setRoommate(null);

          // Add old roommate back to queue
          const currentIndex = proposalIndex.get(currentRoommate)!;
          if (currentRoommate.getRoommate() === null && currentIndex < currentRoommate.getRoommatePreferences().length) {
            unpairedQueue.push(currentRoommate);
          }

          // Create new pairing
          proposer.setRoommate(receiver);
          receiver.setRoommate(proposer);
        } else {
          // Receiver prefers current roommate, proposer remains unpaired
          const proposerIndex = proposalIndex.get(proposer)!;
          if (proposer.getRoommate() === null && proposerIndex < proposer.getRoommatePreferences().length) {
            unpairedQueue.push(proposer);
          }
        }
      }
    }
  }

  /**
   * Checks if a student prefers student1 over student2 based on their preference list.
   *
   * The preference list is ordered by priority:
   * - Index 0 is the most preferred
   * - Lower index = higher preference
   *
   * Logic:
   * - If student1 is not in preferences, return false
   * - If student2 is not in preferences, return true
   * - Otherwise, compare indices (lower is better)
   *
   * Time Complexity: O(n) where n is the length of the preference list
   *
   * Example:
   * ```typescript
   * // Alice's preferences: ["Bob", "Charlie", "Dave"]
   * prefersOver(alice, bob, charlie) // true (Bob at index 0, Charlie at index 1)
   * prefersOver(alice, charlie, bob) // false (Charlie at index 1, Bob at index 0)
   * prefersOver(alice, bob, eve)     // true (Bob in list, Eve not in list)
   * ```
   *
   * @param student - The student whose preferences we're checking
   * @param student1 - The first student to compare
   * @param student2 - The second student to compare
   * @returns true if student prefers student1 over student2, false otherwise
   */
  private static prefersOver(student: UniversityStudent, student1: UniversityStudent, student2: UniversityStudent): boolean {
    const preferences = student.getRoommatePreferences();
    const index1 = preferences.indexOf(student1.getName());
    const index2 = preferences.indexOf(student2.getName());

    // If student1 is not in preferences, return false
    if (index1 === -1) {
      return false;
    }

    // If student2 is not in preferences, return true
    if (index2 === -1) {
      return true;
    }

    // Lower index means higher preference
    return index1 < index2;
  }

  /**
   * Gets a summary of roommate assignments.
   *
   * Returns an array of roommate pairs and a list of unpaired students.
   * Useful for displaying results in the UI.
   *
   * @param students - The array of students to summarize
   * @returns An object containing pairs and unpaired students
   */
  public static getRoommateSummary(students: UniversityStudent[]): {
    pairs: [UniversityStudent, UniversityStudent][];
    unpaired: UniversityStudent[];
  } {
    const pairs: [UniversityStudent, UniversityStudent][] = [];
    const unpaired: UniversityStudent[] = [];
    const processed = new Set<UniversityStudent>();

    for (const student of students) {
      if (processed.has(student)) {
        continue;
      }

      const roommate = student.getRoommate();
      if (roommate === null) {
        unpaired.push(student);
      } else {
        pairs.push([student, roommate]);
        processed.add(student);
        processed.add(roommate);
      }
    }

    return { pairs, unpaired };
  }
}
