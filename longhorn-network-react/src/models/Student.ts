/**
 * Student.ts
 *
 * Abstract base class representing a student in the Longhorn Network.
 * This class provides the foundation for student-related functionality,
 * including connection strength calculation and student attributes.
 *
 * Design Pattern: Template Method Pattern
 * - Defines the structure for student objects
 * - Requires subclasses to implement calculateConnectionStrength
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

/**
 * Abstract Student class that defines the core structure and behavior
 * for all students in the Longhorn Network system.
 */
export abstract class Student {
  /** The unique name of the student */
  protected name: string;

  /** The age of the student */
  protected age: number;

  /** The gender of the student */
  protected gender: string;

  /** The academic year of the student (1-4 representing Freshman-Senior) */
  protected year: number;

  /** The major field of study */
  protected major: string;

  /** The grade point average (GPA) on a 4.0 scale */
  protected gpa: number;

  /**
   * List of preferred roommate names in order of preference.
   * The first name in the list is the most preferred roommate.
   */
  protected roommatePreferences: string[];

  /**
   * List of previous internship company names.
   * Used for calculating connection strengths and referral paths.
   */
  protected previousInternships: string[];

  /**
   * Constructor for the Student base class.
   * Initializes all student attributes with the provided values.
   *
   * @param name - The name of the student (must be unique)
   * @param age - The age of the student
   * @param gender - The gender of the student
   * @param year - The academic year (1=Freshman, 2=Sophomore, 3=Junior, 4=Senior)
   * @param major - The major field of study
   * @param gpa - The grade point average (0.0 - 4.0)
   * @param roommatePreferences - Array of preferred roommate names
   * @param previousInternships - Array of previous internship company names
   */
  protected constructor(
    name: string,
    age: number,
    gender: string,
    year: number,
    major: string,
    gpa: number,
    roommatePreferences: string[],
    previousInternships: string[]
  ) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.year = year;
    this.major = major;
    this.gpa = gpa;
    this.roommatePreferences = roommatePreferences;
    this.previousInternships = previousInternships;
  }

  /**
   * Gets the age of the student.
   * @returns The age of the student
   */
  public getAge(): number {
    return this.age;
  }

  /**
   * Gets the gender of the student.
   * @returns The gender of the student
   */
  public getGender(): string {
    return this.gender;
  }

  /**
   * Gets the academic year of the student.
   * @returns The year (1-4)
   */
  public getYear(): number {
    return this.year;
  }

  /**
   * Gets the major field of study.
   * @returns The major
   */
  public getMajor(): string {
    return this.major;
  }

  /**
   * Gets the grade point average.
   * @returns The GPA (0.0-4.0)
   */
  public getGpa(): number {
    return this.gpa;
  }

  /**
   * Gets the roommate preferences array.
   * @returns Array of preferred roommate names
   */
  public getRoommatePreferences(): string[] {
    return this.roommatePreferences;
  }

  /**
   * Gets the previous internships array.
   * @returns Array of previous internship company names
   */
  public getPreviousInternships(): string[] {
    return this.previousInternships;
  }

  /**
   * Abstract method that calculates the connection strength between this student
   * and another student. Must be implemented by concrete subclasses.
   *
   * Connection strength is typically based on:
   * - Roommate status
   * - Shared internships
   * - Same major
   * - Same age
   *
   * @param other - The other student to calculate connection strength with
   * @returns A numeric value representing the strength of the connection
   *          (higher values indicate stronger connections, 0 indicates no connection)
   */
  public abstract calculateConnectionStrength(other: Student): number;
}
