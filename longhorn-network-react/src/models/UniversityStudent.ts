/**
 * UniversityStudent.ts
 *
 * Concrete implementation of a Student representing a university student
 * in the Longhorn Network. This class extends the abstract Student class
 * and implements the connection strength calculation algorithm.
 *
 * Key Responsibilities:
 * - Store and manage student information
 * - Calculate connection strengths with other students
 * - Manage roommate assignments
 * - Track friends and chat history
 *
 * Connection Strength Formula:
 * - Roommate: +4 points
 * - Each Shared Internship: +3 points
 * - Same Major: +2 points
 * - Same Age: +1 point
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

import { Student } from './Student';

/**
 * UniversityStudent class represents a student at the university
 * with full social networking capabilities including roommate matching,
 * friendship management, and chat functionality.
 */
export class UniversityStudent extends Student {
  /** The current roommate of this student (null if no roommate assigned) */
  private roommate: UniversityStudent | null = null;

  /** List of friends (other students) */
  private friends: UniversityStudent[] = [];

  /**
   * Chat history with other students.
   * Map structure: { student: [messages] }
   * Each entry maps a student to an array of messages exchanged with them.
   */
  private chatHistory: Map<UniversityStudent, string[]> = new Map();

  /**
   * Constructs a new UniversityStudent with the specified attributes.
   *
   * Usage Example:
   * ```typescript
   * const student = new UniversityStudent(
   *   "Alice",
   *   20,
   *   "Female",
   *   2,
   *   "Computer Science",
   *   3.8,
   *   ["Bob", "Charlie"],
   *   ["Google", "Microsoft"]
   * );
   * ```
   *
   * @param name - The name of the student (must be unique across all students)
   * @param age - The age of the student (typically 18-25)
   * @param gender - The gender of the student
   * @param year - The academic year (1=Freshman, 2=Sophomore, 3=Junior, 4=Senior)
   * @param major - The major field of study (e.g., "Computer Science", "Biology")
   * @param gpa - The grade point average on a 4.0 scale
   * @param roommatePreferences - Array of preferred roommate names in priority order
   * @param previousInternships - Array of company names where the student interned
   */
  constructor(
    name: string,
    age: number,
    gender: string,
    year: number,
    major: string,
    gpa: number,
    roommatePreferences: string[],
    previousInternships: string[]
  ) {
    super(name, age, gender, year, major, gpa, roommatePreferences, previousInternships);
  }

  /**
   * Calculates the connection strength between this student and another student.
   *
   * The connection strength is calculated using the following formula:
   * - Roommate: Add 4 if they are currently roommates
   * - Shared Internships: Add 3 for each internship they both completed
   * - Same Major: Add 2 if they share the same major
   * - Same Age: Add 1 if they are the same age
   *
   * Algorithm Complexity: O(n*m) where n and m are the number of internships
   *
   * Edge Cases:
   * - Returns 0 if no connections exist
   * - Ignores "None" or empty internship entries
   * - Returns 0 if the other parameter is not a UniversityStudent
   *
   * Example:
   * ```typescript
   * const alice = new UniversityStudent(...);
   * const bob = new UniversityStudent(...);
   * alice.setRoommate(bob); // They are roommates
   * // If they also share the same major and age:
   * const strength = alice.calculateConnectionStrength(bob); // Returns 7 (4+2+1)
   * ```
   *
   * @param other - The other student to calculate connection strength with
   * @returns An integer representing the connection strength (0 or higher)
   */
  public calculateConnectionStrength(other: Student): number {
    if (!(other instanceof UniversityStudent)) {
      return 0;
    }

    let strength = 0;

    // Roommate: Add 4 if they are roommates
    if (this.roommate !== null && this.roommate === other) {
      strength += 4;
    }

    // Shared Internships: Add 3 for each shared internship
    // Filter out "None" and empty values before comparison
    const validInternships = this.previousInternships.filter(
      (internship) => internship && internship !== 'None' && internship.trim() !== ''
    );

    for (const internship of validInternships) {
      if (other.previousInternships.includes(internship)) {
        strength += 3;
      }
    }

    // Same Major: Add 2 if they share the same major
    if (this.major && this.major === other.major) {
      strength += 2;
    }

    // Same Age: Add 1 if they are the same age
    if (this.age === other.age) {
      strength += 1;
    }

    return strength;
  }

  /**
   * Gets the current roommate of this student.
   *
   * @returns The UniversityStudent who is the roommate, or null if no roommate is assigned
   */
  public getRoommate(): UniversityStudent | null {
    return this.roommate;
  }

  /**
   * Sets the roommate for this student.
   *
   * Note: This method only updates this student's roommate reference.
   * To create a bidirectional roommate relationship, call setRoommate on both students.
   *
   * Example:
   * ```typescript
   * alice.setRoommate(bob);
   * bob.setRoommate(alice);
   * ```
   *
   * @param roommate - The student to set as roommate, or null to clear roommate
   */
  public setRoommate(roommate: UniversityStudent | null): void {
    this.roommate = roommate;
  }

  /**
   * Gets the list of friends.
   *
   * @returns A copy of the friends array to prevent external modification
   */
  public getFriends(): UniversityStudent[] {
    return [...this.friends];
  }

  /**
   * Adds a friend to this student's friend list.
   *
   * Thread-Safety Note: In a multi-threaded environment (simulated with async operations),
   * this method should be called within synchronized blocks.
   *
   * @param friend - The student to add as a friend
   */
  public addFriend(friend: UniversityStudent): void {
    if (!this.friends.includes(friend)) {
      this.friends.push(friend);
    }
  }

  /**
   * Gets the chat history with a specific student.
   *
   * @param student - The student to get chat history with
   * @returns The array of messages exchanged with the student, or undefined if no history exists
   */
  public getChatHistory(student: UniversityStudent): string[] | undefined {
    return this.chatHistory.get(student);
  }

  /**
   * Gets all chat histories for this student.
   *
   * @returns A Map of students to their chat message arrays
   */
  public getAllChatHistories(): Map<UniversityStudent, string[]> {
    return new Map(this.chatHistory);
  }

  /**
   * Adds a message to the chat history with a specific student.
   *
   * Thread-Safety Note: In a multi-threaded environment (simulated with async operations),
   * this method should be called within synchronized blocks.
   *
   * @param student - The student to add message to chat history with
   * @param message - The message content to add
   */
  public addChatMessage(student: UniversityStudent, message: string): void {
    if (!this.chatHistory.has(student)) {
      this.chatHistory.set(student, []);
    }
    this.chatHistory.get(student)!.push(message);
  }

  /**
   * Gets the name of this student.
   *
   * @returns The student's name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Gets the age of this student.
   *
   * @returns The student's age
   */
  public getAge(): number {
    return this.age;
  }

  /**
   * Gets the gender of this student.
   *
   * @returns The student's gender
   */
  public getGender(): string {
    return this.gender;
  }

  /**
   * Gets the academic year of this student.
   *
   * @returns The student's year (1-4)
   */
  public getYear(): number {
    return this.year;
  }

  /**
   * Gets the major of this student.
   *
   * @returns The student's major
   */
  public getMajor(): string {
    return this.major;
  }

  /**
   * Gets the GPA of this student.
   *
   * @returns The student's GPA
   */
  public getGPA(): number {
    return this.gpa;
  }

  /**
   * Gets the roommate preferences of this student.
   *
   * @returns A copy of the roommate preferences array
   */
  public getRoommatePreferences(): string[] {
    return [...this.roommatePreferences];
  }

  /**
   * Gets the previous internships of this student.
   *
   * @returns A copy of the previous internships array
   */
  public getPreviousInternships(): string[] {
    return [...this.previousInternships];
  }

  /**
   * Returns a string representation of this UniversityStudent.
   * Useful for debugging and logging.
   *
   * @returns A formatted string containing the student's information
   */
  public toString(): string {
    const lines = [
      `Name: ${this.name}`,
      `Age: ${this.age}`,
      `Gender: ${this.gender}`,
      `Year: ${this.year}`,
      `Major: ${this.major}`,
      `GPA: ${this.gpa}`,
      `RoommatePreferences: ${this.roommatePreferences.length > 0 ? this.roommatePreferences.join(', ') : 'None'}`,
      `PreviousInternships: ${this.previousInternships.length > 0 ? this.previousInternships.join(', ') : 'None'}`
    ];
    return lines.join('\n');
  }

  /**
   * Checks equality based on student name.
   * Two students are considered equal if they have the same name.
   *
   * @param other - The other student to compare with
   * @returns true if the students have the same name, false otherwise
   */
  public equals(other: UniversityStudent): boolean {
    return this.name === other.name;
  }
}
